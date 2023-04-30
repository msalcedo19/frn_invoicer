import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import PostModal from "@/components/Customer/CustomerModal";
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
import { Typography } from "@mui/material";

import CustomerCard from "@/components/Customer/CustomerCard";
import Box from "@mui/material/Box";

import {
  breadcrumbAction,
  BACK_EVENT,
  CUSTOMER,
} from "@/src/actions/breadcrumb";
import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";
import { useDispatch } from "react-redux";
import {
  sortByNameDesc,
  sortByNameAsc,
  processRequest,
  processRequestNonReponse,
  sendMessageAction,
  getHeaders,
} from "@/pages/index";

const styles = {
  container: {
    marginTop: "100px",
    width: "100%",
    textAlign: "center",
  },
  optionsButton: {
    marginBottom: "50px",
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

export default function Customer() {
  const [objList, setObjList] = useState<TCustomer[]>([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [searchTerm, setSearchTerm] = useState("");
  function handleSearch(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = objList.filter((obj) =>
      obj.name.toLowerCase().includes(term.toLowerCase())
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
          window.fetch(`/api/customer/${key}`, {
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
            "Uno o varios de los clientes no pudo ser eliminado",
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
    window
      .fetch(`/api/customer`, {
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
        if (data) {
          setObjList(data);
          setSortedList(data);
        }
      });
  }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      breadcrumbAction(
        BACK_EVENT,
        {
          href: "",
          value: "",
          active: true,
        },
        CUSTOMER
      )
    );
    dispatch(
      dataPageAction(UPDATE_TITLE, {
        title: "Clientes",
      })
    );
    reload();
  }, []);

  return (
    <Fragment>
      <PostModal reload={reload} open={open} handleClose={handleClose} />
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
          <CustomerCard
            key={obj.id}
            customer={obj}
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
              ? "Ningún cliente coincide con la busqueda"
              : "Aún no has creado ningún cliente"}
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
                <ListItemText primary={"Crear nuevo cliente"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"delete_key"} disablePadding>
              <ListItemButton onClick={() => setDeleteOp(true)}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    "Eliminar cliente (Esto incluye todos las facturas asociadas a este)"
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
