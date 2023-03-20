import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import AddIcon from "@mui/icons-material/Add";
import PostModal from "@/components/Customer/CustomerModal";
import { useEffect, Fragment, useState } from "react";

import OptionsButton from "@/components/OptionsButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Typography } from "@mui/material";
import CustomerCard from "@/components/Customer/CustomerCard";

import {
  breadcrumbAction,
  BACK_EVENT,
  CUSTOMER,
} from "@/src/actions/breadcrumb";
import { useDispatch } from "react-redux";
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
  const [objList, setObjList] = useState<TContract[]>([]);
  const [checkedList, setCheckedList] = useState<Map<number, boolean>>(
    new Map()
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteOp, setDeleteOp] = useState<boolean>(false);
  const dispatch = useDispatch();

  function delete_obj() {
    checkedList.forEach(
      (value: boolean, key: number, map: Map<number, boolean>) => {
        window
          .fetch(`/api/customer/${key}`, {
            method: "DELETE",
          })
          .then((response) => {
            console.log(response);
            reload();
            setDeleteOp(false);
            setCheckedList(new Map());
          });
      }
    );
  }

  function reload() {
    window
      .fetch(`/api/customer/`)
      .then((response) => response.json())
      .then((data) => {
        setObjList(data);
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
        CUSTOMER
      )
    );
    reload();
  }, []);

  return (
    <Fragment>
      <PostModal reload={reload} open={open} handleClose={handleClose} />
      <Container sx={{ marginTop: "5%" }}>
        <Grid container spacing={5} alignItems="flex-end">
          {objList.map((obj) => (
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
          {objList.length == 0 && (
            <Typography>Aún no has creado ningún cliente</Typography>
          )}
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
                  <ListItemText primary={"Crear nuevo cliente"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={"delete_key"} disablePadding>
                <ListItemButton onClick={() => setDeleteOp(true)}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      "Eliminar cliente (Esto incluye todos los contratos asociados a este)"
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
        </Container>
      </Container>
    </Fragment>
  );
}
