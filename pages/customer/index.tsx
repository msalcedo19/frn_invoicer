import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import AddIcon from "@mui/icons-material/Add";
import PostModal from "@/components/customer/CustomerModal";
import CustomerCard from "@/components/customer/CustomerCard";
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

const styles = {
  container: {
    marginTop: '100px',
    width: '100%',
    textAlign: 'center',
  },
  optionsButton: {
    marginBottom: '50px',
  },
  button: {
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
      color: 'black',
      backgroundColor: 'white',
    },
  },
};

function CustomerContent() {
  const [consumerList, setConsumerList] = useState<TCustomer[]>([]);
  const [checkedList, setCheckedList] = useState<Map<number, boolean>>(
    new Map()
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteOp, setDeleteOp] = useState<boolean>(false);

  function delete_customer() {
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
            setCheckedList(new Map())
          });
      }
    );
  }

  function reload() {
    window
      .fetch("/api/customer")
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setConsumerList(data);
      });
  }

  useEffect(() => {
    window
      .fetch("/api/customer")
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setConsumerList(data);
      });
  }, []);

  return (
    <Fragment>
      <PostModal
        reload={reload}
        open={open}
        handleClose={handleClose}
      />
      <Container maxWidth="md" component="main" sx={{marginTop: "5%"}}>
        <Grid container spacing={5} alignItems="flex-end">
          {consumerList.map((consumer) => (
            <CustomerCard
              key={consumer.id}
              consumer={consumer}
              checkedList={checkedList}
              setCheckedList={setCheckedList}
              deleteOp={deleteOp}
            />
          ))}
        </Grid>
        <Container sx={styles.container}>
          {consumerList.length == 0 && <Typography>Aún no has creado ningún contrato</Typography>}
          <OptionsButton
            function_1={delete_customer}
            function_2={() => setDeleteOp(false)}
            check_or_cancel={deleteOp}
            sx={styles.optionsButton}
          >
            <List>
              <ListItem key={"new_customer"} disablePadding>
                <ListItemButton onClick={handleOpen}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Crear nueva empresa/contrato"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={"delete_customer"} disablePadding>
                <ListItemButton onClick={() => setDeleteOp(true)}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      "Eliminar empresa (Esto incluye todas las facturas generadas anteriormente)"
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

export default function Customer() {
  return <CustomerContent />;
}
