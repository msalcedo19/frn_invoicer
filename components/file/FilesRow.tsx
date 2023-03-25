import { Fragment } from "react";
import React from "react";
import ButtonBase from "@mui/material/ButtonBase";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Link from "@mui/material/Link";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import BackupTableIcon from "@mui/icons-material/BackupTable";

const iconButtonStyles = {
  width: 128,
  height: 128,
  backgroundColor: "antiquewhite",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default function FilesRow({ file }: { file: TFile }) {
  const formattedDate = new Date(file.created).toISOString().slice(0, 10);

  return (
    <Fragment>
      <Container maxWidth="sm" sx={{ marginY: "25px" }}>
        <Grid container spacing={2} sx={{ textAlign: "-webkit-center" }}>
          <Grid item xs={5} sx={{ padding: "0px !important" }}>
            <Link target="_blank" href={file.s3_pdf_url}>
              <Grid container xs={6}>
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
            xs={2}
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
            <Typography variant="subtitle1">{formattedDate}</Typography>
          </Grid>
          <Grid item xs={5} sx={{ padding: "0px !important" }}>
            <Link target="_blank" href={file.s3_xlsx_url}>
              <Grid container xs={6}>
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
        </Grid>
      </Container>
    </Fragment>
  );
}
