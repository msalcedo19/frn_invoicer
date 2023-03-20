import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import InvoiceCard from "@/components/Invoice/InvoiceCard";

import Button from "@mui/material/Button";
import { useEffect, Fragment, useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { Blob } from "buffer";

import OptionsButton from "@/components/OptionsButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import PostInvoiceModal from "@/components/Invoice/InvoiceModal";

import {
  breadcrumbAction,
  BACK_EVENT,
  INVOICE,
} from "@/src/actions/breadcrumb";
import { useDispatch } from "react-redux";

export default function CustomerDetail() {
  const [checkedList, setCheckedList] = useState<Map<number, boolean>>(
    new Map()
  );
  const [invoices, setInvoices] = useState<TInvoice[]>([]);
  const {
    query: { contract_id },
  } = useRouter();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteOp, setDeleteOp] = useState<boolean>(false);
  const dispatch = useDispatch();

  function delete_invoice() {
    let urls: Array<Promise<Response>> = [];
    checkedList.forEach(
      (value: boolean, key: number, map: Map<number, boolean>) => {
        urls.push(
          window.fetch(`/api/invoice/${key}`, {
            method: "DELETE",
          })
        );
      }
    );
    Promise.all(urls).then((value) => {
      reload();
      setCheckedList(new Map());
      setDeleteOp(false);
    });
  }

  useEffect(() => {
    dispatch(
      breadcrumbAction(
        BACK_EVENT,
        {
          href: "",
          value: "",
          active: true,
        },
        INVOICE
      )
    );

    window
      .fetch(`/api/contract/${contract_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data["invoices"]) setInvoices(data["invoices"]);
      });
  }, [contract_id]);

  function reload() {
    window
      .fetch(`/api/contract/${contract_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data["invoices"]) setInvoices(data["invoices"]);
      });
  }

  return (
    <Fragment>
      <PostInvoiceModal
        model_id={undefined}
        contract_id={contract_id}
        create_new_invoice={true}
        open={open}
        handleClose={handleClose}
        reload={reload}
      />
      <Container sx={{ marginTop: "5%" }}>
        <Grid container spacing={5} alignItems="flex-end">
          {invoices != undefined &&
            invoices.length > 0 &&
            invoices.map((invoice: TInvoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                deleteOp={deleteOp}
              />
            ))}
        </Grid>
        <Container sx={{ mt: "100px", width: "100%", textAlign: "center" }}>
          {invoices && invoices.length == 0 && (
            <Typography>Aún no has generado ninguna factura</Typography>
          )}
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
                  <ListItemText primary={"Crear nueva factura"} />
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
