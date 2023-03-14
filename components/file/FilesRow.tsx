import AddIcon from "@mui/icons-material/Add";
import { Fragment } from "react";
import React from "react";
import ButtonBase from "@mui/material/ButtonBase";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ImageIcon from "@mui/icons-material/Image";
import { Typography } from "@mui/material";
import Link from "@mui/material/Link";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import BackupTableIcon from "@mui/icons-material/BackupTable";

const gridStyles = {
  padding: "0px !important",
};

export default function FilesRow({ file }: { file: TFile }) {
  return (
    <Fragment>
      <Container maxWidth="sm" sx={{ marginY: "25px" }}>
        <Grid container spacing={2} sx={{ textAlign: "-webkit-center" }}>
          <Grid item xs={5} sx={gridStyles}>
            <Link target="_blank" href={file.s3_pdf_url}>
              <Grid container xs={6}>
                <Grid item xs={12}>
                  <ButtonBase
                    sx={{
                      width: 128,
                      height: 128,
                      backgroundColor: "antiquewhite",
                    }}
                  >
                    <PictureAsPdfIcon />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  Descargar
                </Grid>
              </Grid>
            </Link>
          </Grid>
          <Grid
            item
            xs={2}
            sx={{ alignSelf: "center", padding: "0px !important" }}
          >
            <KeyboardDoubleArrowLeftIcon />
            <Typography>
              {new Date(file.created).toISOString().split("T")[0]}
            </Typography>
          </Grid>
          <Grid item xs={5} sx={gridStyles}>
            <Link target="_blank" href={file.s3_xlsx_url}>
              <Grid container xs={6}>
                <Grid item xs={12}>
                  <ButtonBase
                    sx={{
                      width: 128,
                      height: 128,
                      backgroundColor: "antiquewhite",
                    }}
                  >
                    <BackupTableIcon />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  Descargar
                </Grid>
              </Grid>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}
