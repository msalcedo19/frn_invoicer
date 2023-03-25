import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import PostContract from "@/components/Contract/ContractModal";
import { useEffect, Fragment, useState, Dispatch, SetStateAction } from "react";

import OptionsButton from "@/components/OptionsButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import ContractCard from "@/components/Contract/ContractCard";

import {
  breadcrumbAction,
  BACK_EVENT,
  CONTRACT,
} from "@/src/actions/breadcrumb";
import { dataPageAction, UPDATE_TITLE } from "@/src/actions/dataPage";

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

const sortByNameAsc = (a, b) => a.name.localeCompare(b.name);
const sortByNameDesc = (a, b) => b.name.localeCompare(a.name);

export default function CustomerDetail() {
  const [objList, setObjList] = useState<TContract[]>([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
    query: { customer_id },
  } = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  function handleSearch(event) {
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
    checkedList.forEach(
      (value: boolean, key: number, map: Map<number, boolean>) => {
        window
          .fetch(`/api/contract/${key}`, {
            method: "DELETE",
          })
          .then((response) => {
            reload(customer_id);
            setDeleteOp(false);
            setCheckedList(new Map());
          });
      }
    );
  }

  function reload(p_model_id: string | string[] | undefined) {
    if (p_model_id) {
      window
        .fetch(`/api/customer/${p_model_id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data["contracts"]) {
            setObjList(data["contracts"]);
            setSortedList(data["contracts"]);
          }
        });
    }
  }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      breadcrumbAction(
        BACK_EVENT,
        {
          href: ``,
          value: ``,
          active: true,
        },
        CONTRACT
      )
    );
    dispatch(
      dataPageAction(UPDATE_TITLE, {
        title: "Contratos",
      })
    );
    reload(customer_id);
  }, [customer_id]);

  return (
    <Fragment>
      <PostContract
        customer_id={customer_id ? +customer_id : undefined}
        reload={reload}
        open={open}
        handleClose={handleClose}
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

      <Grid container spacing={5} alignItems="flex-end">
        {sortedList.map((obj) => (
          <ContractCard
            key={obj.id}
            contract={obj}
            checkedList={checkedList}
            setCheckedList={setCheckedList}
            deleteOp={deleteOp}
          />
        ))}
      </Grid>
      <Container sx={styles.container}>
        {sortedList.length == 0 && (
          <Typography>Aún no has creado ningún contrato</Typography>
        )}
      </Container>

      <Box sx={{ position: "fixed", bottom: "32px", right: "32px" }}>
        <OptionsButton
          function_1={delete_obj}
          function_2={() => setDeleteOp(false)}
          check_or_cancel={deleteOp}
          sx={styles.optionsButton}
        >
          <List>
            <ListItem key={"new_key"} disablePadding>
              <ListItemButton onClick={handleOpen}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Crear nueva contrato"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"delete_key"} disablePadding>
              <ListItemButton onClick={() => setDeleteOp(true)}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    "Eliminar contrato (Esto incluye todas las facturas asociadas a este contrato)"
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
