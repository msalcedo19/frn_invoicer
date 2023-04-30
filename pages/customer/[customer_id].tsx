import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { useEffect, Fragment, useState, ChangeEvent } from "react";

import OptionsButton from "@/components/OptionsButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";

import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import {
  breadcrumbAction,
  BACK_EVENT,
  INVOICE,
} from "@/src/actions/breadcrumb";
import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";
import {
  processRequest,
  processRequestNonReponse,
  handleBreadCrumb,
  sendMessageAction,
  getHeaders,
} from "@/pages/index";
import { InvoiceCard } from "@/components/Invoice/InvoiceCard";
import { PostInvoiceModal } from "@/components/Invoice/InvoiceModal";

const styles = {
  container: {
    marginTop: "100px",
    width: "100%",
    textAlign: "center",
  },
  button: {
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      color: "black",
      backgroundColor: "white",
    },
  },
};

const sortByNameAsc = (a: TInvoice, b: TInvoice) =>
  a.number_id.toString().localeCompare(b.number_id.toString());
const sortByNameDesc = (a: TInvoice, b: TInvoice) =>
  b.number_id.toString().localeCompare(a.number_id.toString());

export default function CustomerDetail() {
  const [objList, setObjList] = useState<TInvoice[]>([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
    query: { customer_id },
  } = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  function handleSearch(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = objList.filter((obj) =>
      obj.number_id.toString().toLowerCase().includes(term.toLowerCase())
    );
    setSortedList(filtered);
  }

  const [sortedList, setSortedList] = useState(objList);
  const [sortOrder, setSortOrder] = useState("asc");
  const handleSort = () => {
    if (sortOrder === "asc") {
      setSortedList(sortedList.sort(sortByNameDesc));
      setSortOrder("desc");
    } else {
      setSortedList(sortedList.sort(sortByNameAsc));
      setSortOrder("asc");
    }
  };

  const [checkedList, setCheckedList] = useState<Map<number, boolean>>(
    new Map()
  );
  const [deleteOp, setDeleteOp] = useState<boolean>(false);
  function delete_obj() {
    let urls: Array<Promise<Response>> = [];
    checkedList.forEach(
      (value: boolean, key: number, map: Map<number, boolean>) => {
        urls.push(
          window.fetch(`/api/invoice/${key}`, {
            method: "DELETE",
            headers: getHeaders(),
          })
        );
      }
    );
    Promise.all(urls).then((responses) => {
      let failed = false;
      for (let response of responses) {
        if (
          processRequestNonReponse(
            "warning",
            "Una o varias facturas no pudieron ser eliminadas",
            dispatch,
            response
          )
        ) {
          failed = true;
          break;
        }
      }

      if (!failed)
        sendMessageAction("success", "Se eliminaron correctamente", dispatch);

      reload();
      setDeleteOp(false);
      setCheckedList(new Map());
    });
  }

  function reload() {
    if (customer_id) {
      window
        .fetch(`/api/customer/${customer_id}`, {
          method: "GET",
          headers: getHeaders(),
        })
        .then((response) =>
          processRequest(
            "error",
            "Hubo un error, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
        .then((data) => {
          if (data && data["invoices"]) {
            setObjList(data["invoices"]);
            setSortedList(data["invoices"]);
          }
        });
    }
  }

  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(
      breadcrumbAction(
        BACK_EVENT,
        {
          href: ``,
          value: ``,
          active: true,
        },
        INVOICE
      )
    );
    dispatch(
      dataPageAction(UPDATE_TITLE, {
        title: "Facturas",
      })
    );
    reload();

    if (customer_id) handleBreadCrumb(router, dispatch);
  }, [customer_id]);

  return (
    <Fragment>
      <PostInvoiceModal
        model_id={undefined}
        customer_id={customer_id}
        create_new_invoice={true}
        open={open}
        handleClose={handleClose}
        reload={reload}
      />
      <Grid container spacing={2}>
        <Grid item>
          <TextField
            size="small"
            label="Buscar por nombre"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item>
          <Button onClick={handleSort} variant="outlined">
            Ordenar por nombre (
            {sortOrder === "asc" ? "ascendente" : "descendente"})
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ marginY: 2 }} />
      <Grid container spacing={5} alignItems="flex-end">
        {sortedList.map((obj) => (
          <InvoiceCard
            key={obj.id}
            invoice={obj}
            checkedList={checkedList}
            setCheckedList={setCheckedList}
            deleteOp={deleteOp}
          />
        ))}
      </Grid>
      <Container sx={styles.container}>
        {sortedList.length == 0 && (
          <Typography>
            {searchTerm.length > 0
              ? "Ninguna factura coincide con la busqueda"
              : "Aún no has creado ningún factura"}
          </Typography>
        )}
      </Container>

      <Box sx={{ position: "fixed", bottom: "32px", right: "32px" }}>
        <OptionsButton
          function_1={delete_obj}
          function_2={() => setDeleteOp(false)}
          check_or_cancel={deleteOp}
        >
          <List>
            <ListItem key={"new_key"} disablePadding>
              <ListItemButton onClick={handleOpen}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary={"Crear nueva factura"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"delete_key"} disablePadding>
              <ListItemButton onClick={() => setDeleteOp(true)}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    "Eliminar factura (Esto incluye todas los contratos y archivos relacionados con esta)"
                  }
                />
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
      </Box>
    </Fragment>
  );
}
