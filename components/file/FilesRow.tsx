import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import { Dispatch, SetStateAction, useState, Fragment } from "react";

const iconButtonStyles = {
  width: 128,
  height: 128,
  backgroundColor: "antiquewhite",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

interface FilesRowProps {
  file: TFile;
  checkedList: Map<number, boolean>;
  setCheckedList: Dispatch<SetStateAction<Map<number, boolean>>>;
  deleteOp: boolean;
}

export default function FilesRow(props: FilesRowProps) {
  const date = new Date(props.file.created);
  const timezoneOffset = date.getTimezoneOffset() / 60; // convert to hours
  const formattedDate = new Date(
    date.getTime() - timezoneOffset * 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 10);

  function handleChange(model_id: any, e: any) {
    let isChecked = e.target.checked;
    // do whatever you want with isChecked value
    if (props.checkedList.get(model_id) == undefined)
      props.setCheckedList(new Map(props.checkedList.set(model_id, isChecked)));
    else {
      props.checkedList.delete(model_id);
      props.setCheckedList(new Map(props.checkedList));
    }
  }

  return (
    <Fragment>
      <Container maxWidth="lg" sx={{ marginY: "25px" }}>
        <Grid container spacing={2} sx={{ textAlign: "-webkit-center" }}>
          <Grid item xs={5} sx={{ padding: "0px !important" }}>
            <Link target="_blank" href={props.file.s3_pdf_url}>
              <Grid container>
                <Grid item xs={12}>
                  <ButtonBase sx={iconButtonStyles}>
                    <PictureAsPdfIcon sx={{ fontSize: 64 }} />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle1">Descargar</Typography>
                </Grid>
              </Grid>
            </Link>
          </Grid>
          <Grid
            item
            xs={1}
            sx={{
              alignSelf: "center",
              padding: "0px !important",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 64 }} />
            <Typography variant="subtitle1">
              {formattedDate} {date.getHours()}:{date.getMinutes()}
            </Typography>
            <Button size="small">
              <Link href={`/file/${props.file.id}`} color="inherit">
                Contratos
              </Link>
            </Button>
          </Grid>
          <Grid item xs={5} sx={{ padding: "0px !important" }}>
            <Link target="_blank" href={props.file.s3_xlsx_url}>
              <Grid container>
                <Grid item xs={12}>
                  <ButtonBase sx={iconButtonStyles}>
                    <BackupTableIcon sx={{ fontSize: 64 }} />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle1">Descargar</Typography>
                </Grid>
              </Grid>
            </Link>
          </Grid>
          <Grid item xs={1}>
            {props.deleteOp && (
              <Checkbox
                checked={
                  props.checkedList.get(props.file.id) == true ? true : false
                }
                onChange={(e) => handleChange(props.file.id, e)}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}
