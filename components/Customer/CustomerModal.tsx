import { SetStateAction, useState, Dispatch } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useDispatch } from "react-redux";
import {
  processRequestToObj,
  sendMessageAction,
  style,
  getHeaders,
} from "@/pages/index";

interface ModalProps {
  reload: () => void;
  open: boolean;
  handleClose: () => void;
}

export default function PostModal(props: ModalProps) {
  const { open, handleClose } = props;
  const [name, setName] = useState("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleCreateClick = () => {
    postObj();
    handleClose();
  };

  const dispatch = useDispatch();
  function postObj() {
    if (name) {
      let newCustomer = {
        name: name,
      };
      window
        .fetch("/api/customer", {
          method: "POST",
          headers: getHeaders(true),
          body: JSON.stringify(newCustomer),
        })
        .then((response) =>
          processRequestToObj(
            "error",
            "Hubo un error creando el cliente, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
        .then((data) => {
          if (data) {
            props.reload();
            handleClose();
            setName("");
            sendMessageAction(
              "success",
              "Se creó el cliente correctamente",
              dispatch
            );
          }
        });
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom className="post-title">
          Crear nuevo cliente
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              fullWidth
              value={name}
              onChange={handleNameChange}
              helperText="Nombre del nuevo cliente"
            />
          </Grid>
        </Grid>
        <Box sx={{ my: 2 }}>
          <hr />
        </Box>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button variant="contained" onClick={handleCreateClick}>
            Crear
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
