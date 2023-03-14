import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import InvoiceCard from "@/components/invoice/InvoiceCard";

import Button from "@mui/material/Button";
import { useEffect, Fragment, useState } from "react";
import { useRouter } from "next/router";
import { Blob } from "buffer";

import OptionsButton from "@/components/OptionsButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import PostFileModal from "@/components/file/FileModal";

export default function CustomerDetail() {
  const [checkedList, setCheckedList] = useState<Map<number, boolean>>(
    new Map()
  );
  const [invoices, setInvoices] = useState<TInvoice[]>([]);
  const {
    query: { model_id },
  } = useRouter();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteOp, setDeleteOp] = useState<boolean>(false);

  function delete_invoice() {
    checkedList.forEach(
      (value: boolean, key: number, map: Map<number, boolean>) => {
        window
          .fetch(`/api/invoice/${key}`, {
            method: "DELETE",
          })
          .then((response) => {
            console.log(response);
          });
      }
    );
    reload();
    setCheckedList(new Map());
    setDeleteOp(false);
  }

  useEffect(() => {
    window
      .fetch(`/api/invoice/${model_id}`)
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data);
      });
  }, [model_id]);

  function reload() {
    window
      .fetch(`/api/invoice/${model_id}`)
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data);
      });
  }

  return (
    <Fragment>
      <PostFileModal
        model_id={model_id}
        create_new_invoice={true}
        open={open}
        handleClose={handleClose}
        reload={reload}
      />
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {invoices != undefined && invoices.length > 0 ? (
            invoices.map((invoice: TInvoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                deleteOp={deleteOp}
              />
            ))
          ) : (
            <></>
          )}
        </Grid>
        <Container sx={{ mt: "100px", width: "100%", textAlign: "center" }}>
          <OptionsButton
            function_1={delete_invoice}
            function_2={() => setDeleteOp(false)}
            check_or_cancel={deleteOp}
          >
            <List>
              <ListItem key={"upload_file"} disablePadding>
                <ListItemButton onClick={handleOpen}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Subir archivo"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={"delete_invoice"} disablePadding>
                <ListItemButton onClick={() => setDeleteOp(true)}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Eliminar facturas"} />
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
