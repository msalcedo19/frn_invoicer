import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import InvoiceCard from "@/components/Invoice/InvoiceCard";

import Button from "@mui/material/Button";
import { useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";
import { Blob } from "buffer";
import FilesRow from "@/components/file/FilesRow";

import OptionsButton from "@/components/OptionsButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import PostInvoiceModal from "@/components/Invoice/InvoiceModal";

export default function CustomerDetail() {
  const [checkedList, setCheckedList] = useState<Map<number, boolean>>(
    new Map()
  );
  const [files, setFiles] = useState<TFile[]>([]);
  const {
    query: { model_id },
  } = useRouter();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    window
      .fetch(`/api/invoice/${model_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data["files"]) setFiles(data["files"]);
      });
  }, [model_id]);

  function reload() {
    window
      .fetch(`/api/invoice/${model_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data["files"]) setFiles(data["files"]);
      });
  }

  return (
    <Fragment>
      <PostInvoiceModal
        model_id={model_id}
        contract_id={undefined}
        create_new_invoice={false}
        open={open}
        handleClose={handleClose}
        reload={reload}
      />
      <Container sx={{ marginTop: "5%" }}>
        <Grid container spacing={5} alignItems="flex-end">
          {files != undefined &&
            files.length > 0 &&
            files.map((file: TFile) => <FilesRow key={file.id} file={file} />)}
        </Grid>
        <Container sx={{ mt: "100px", width: "100%", textAlign: "center" }}>
          <OptionsButton>
            <List>
              <ListItem key={"upload_file"} disablePadding>
                <ListItemButton onClick={handleOpen}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Generar nueva factura"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={"delete_file"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Eliminar factura/excel"} />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem key={"exit"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Cerrar"} />
                </ListItemButton>
              </ListItem>
            </List>
          </OptionsButton>
        </Container>
      </Container>
    </Fragment>
  );
}
