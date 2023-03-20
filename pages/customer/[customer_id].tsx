import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import AddIcon from "@mui/icons-material/Add";
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
import { Typography } from "@mui/material";

import { useRouter } from "next/router";
import ContractCard from "@/components/Contract/ContractCard";

import {
  breadcrumbAction,
  BACK_EVENT,
  CONTRACT,
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

export default function CustomerDetail() {
  const [objList, setObjList] = useState<TContract[]>([]);
  const [checkedList, setCheckedList] = useState<Map<number, boolean>>(
    new Map()
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteOp, setDeleteOp] = useState<boolean>(false);
  const {
    query: { customer_id },
  } = useRouter();
  const dispatch = useDispatch();

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
          if (data && data["contracts"]) setObjList(data["contracts"]);
        });
    }
  }

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
    reload(customer_id);
  }, []);

  return (
    <Fragment>
      <PostContract
        customer_id={customer_id ? +customer_id : undefined}
        reload={reload}
        open={open}
        handleClose={handleClose}
      />
      <Container sx={{ marginTop: "5%" }}>
        <Grid container spacing={5} alignItems="flex-end">
          {objList.map((obj) => (
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
          {objList.length == 0 && (
            <Typography>Aún no has creado ningún contrato</Typography>
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
        </Container>
      </Container>
    </Fragment>
  );
}
