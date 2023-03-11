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
  const [invoices, setInvoices] = useState<TInvoice[]>([]);
  const {
    query: { model_id },
  } = useRouter();
  const [file, setFile] = useState<Blob>();

  const [tax_1, setTax1] = useState<TGlobal>();
  const [tax_2, setTax2] = useState<TGlobal>();

  useEffect(() => {
    window
      .fetch(`/api/invoice/${model_id}`)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        console.log(data);
        setInvoices(data);
      });

    window
      .fetch(`/api/global/tax_1`)
      .then((response) => response.json())
      .then((data) => {
        setTax1(data);
      });

    window
      .fetch(`/api/global/tax_2`)
      .then((response) => response.json())
      .then((data) => {
        setTax2(data);
      });
  }, [model_id]);

  function postFile() {
    if (file) {
      let newInvoice = {
        reason: "Cleaning Services",
        subtotal: 0,
        tax_1: tax_1 ? +tax_1.value : undefined,
        tax_2: tax_2 ? +tax_2.value : undefined,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        customer_id: model_id ? +model_id : undefined
      };
      console.log(newInvoice)
      window
        .fetch(`/api/invoice/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newInvoice),
        })
        .then((response) => response.json())
        .then((data: TInvoice) => {
          console.log(data);
          let info_data = new FormData();
          info_data.append("invoice_id", data.id.toString());
          info_data.append("file", file);
          window
            .fetch(`/api/file_manage/`, {
              method: "POST",
              body: info_data,
            })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
            });
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
          {invoices != undefined && invoices.length > 0 ? (
            invoices.map((invoice: TInvoice) => (
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
          <input hidden type="file" name="myFile" onChange={uploadToClient} />
        </Button>
        <Button variant="contained" component="label" onClick={postFile}>
          Push
        </Button>
      </Container>
    </Fragment>
  );
}
