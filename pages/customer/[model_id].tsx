import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import InvoiceCard from "@/components/invoice/InvoiceCard";

import Button from "@mui/material/Button";
import { useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";
import { Blob } from "buffer";

export default function CustomerDetail() {
  const [checkedList, setCheckedList] = useState<Map<number, boolean>>(
    new Map()
  );
  const [customer, setCustomer] = useState<TConsumer>();
  const {
    query: { model_id },
  } = useRouter();
  const [file, setFile] = useState<Blob>();

  useEffect(() => {
    window
      .fetch(`/api/customer/${model_id}`)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        console.log(data);
        setCustomer(data);
      });
  }, [model_id]);

  function postFile() {
    if (file) {
      const info_data = new FormData();
      info_data.append("file", file);
      window
        .fetch("/api/file", {
          method: "POST",
          body: info_data
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        });
    }
  }

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setFile(i);
    }
  };

  return (
    <Fragment>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {customer != undefined && customer.invoices != undefined ? (
            customer.invoices.map((invoice: TInvoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
              />
            ))
          ) : (
            <></>
          )}
        </Grid>
        <Button variant="contained" component="label">
          Upload
          <input hidden type="file" name="myFile"  onChange={uploadToClient}/>
        </Button>
        <Button variant="contained" component="label" onClick={postFile}>
          Push
        </Button>
      </Container>
    </Fragment>
  );
}
