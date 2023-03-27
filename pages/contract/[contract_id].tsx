import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import InvoiceCard from "@/components/Invoice/InvoiceCard";

import Button from "@mui/material/Button";
import { useEffect, Fragment, useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";

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
import Box from "@mui/material/Box";

import {
  breadcrumbAction,
  BACK_EVENT,
  INVOICE,
} from "@/src/actions/breadcrumb";
import { useDispatch } from "react-redux";
import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";
import {
  processRequest,
  processRequestNonReponse,
  handleBreadCrumb,
} from "@/pages/index";

const sortByNameAsc = (a, b) => a.number_id.toString().localeCompare(b.name);
const sortByNameDesc = (a, b) => b.number_id.toString().localeCompare(a.name);

export default function CustomerDetail() {
  const [invoices, setInvoices] = useState<TInvoice[]>([]);
  const {
    query: { contract_id },
  } = useRouter();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [searchTerm, setSearchTerm] = useState("");
  function handleSearch(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = invoices.filter((obj) =>
      obj.number_id.toString().toLowerCase().includes(term.toLowerCase())
    );
    setSortedList(filtered);
  }

  const [sortedList, setSortedList] = useState(invoices);
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

    Promise.all(urls).then((responses) => {
      for (let response of responses) {
        if (
          processRequestNonReponse(
            "warning",
            "Una o varias de las facturas no pudo ser eliminada",
            dispatch,
            response
          )
        )
          break;
      }

      reload();
      setCheckedList(new Map());
      setDeleteOp(false);
    });
  }

  function reload() {
    window
      .fetch(`/api/contract/${contract_id}`)
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
          setInvoices(data["invoices"]);
          setSortedList(data["invoices"]);
        }
      });
  }

  const dispatch = useDispatch();
  const router = useRouter();
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
    dispatch(
      dataPageAction(UPDATE_TITLE, {
        title: "Facturas",
      })
    );
    reload();

    if (contract_id) handleBreadCrumb(router, dispatch);
  }, [contract_id]);

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
      <Grid container spacing={2}>
        <Grid item>
          <TextField
            size="small"
            label="Search by name"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item>
          <Button onClick={handleSort} variant="outlined">
            Sort by name ({sortOrder === "asc" ? "ascending" : "descending"})
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ marginY: 2 }} />
      <Grid container spacing={5} alignItems="flex-end">
        {sortedList != undefined &&
          sortedList.length > 0 &&
          sortedList.map((invoice: TInvoice) => (
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
        {sortedList && sortedList.length == 0 && (
          <Typography>Aún no has generado ninguna factura</Typography>
        )}
      </Container>

      <Box sx={{ position: "fixed", bottom: "32px", right: "32px" }}>
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
      </Box>
    </Fragment>
  );
}
