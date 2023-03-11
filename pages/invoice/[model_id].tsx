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
  const [files, setFiles] = useState<TFile[]>([]);
  const {
    query: { model_id },
  } = useRouter();

  useEffect(() => {
    window
      .fetch(`/api/files/${model_id}`)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        console.log(data);
        setFiles(data);
      });
  }, [model_id]);

  return (
    <Fragment>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {files != undefined && files.length > 0 ? (
            files.map((file: TFile) => (
              file.s3_xlsx_url + " " + file.s3_pdf_url
            ))
          ) : (
            <></>
          )}
        </Grid>
      </Container>
    </Fragment>
  );
}
