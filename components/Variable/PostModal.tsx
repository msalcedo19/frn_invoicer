import { useState } from "react";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { Typography } from "@mui/material";

import { useDispatch } from "react-redux";
import { sendMessageAction, style, processRequestToObj } from "@/pages/index";

interface Props {
  open: boolean;
  handleClose: () => void;
  reload: () => void;
}

function PostModalVariable(props: Props) {
  const [to, setTo] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTo(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const dispatch = useDispatch();
  function postObj() {
    if (to && address && phone && email) {
      let newBillto = {
        to: to,
        addr: address,
        phone: phone,
        email: email,
      };
      window
        .fetch("/api/billTo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBillto),
        })
        .then((response) =>
          processRequestToObj(
            "error",
            "Hubo un error creando el destinatario, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
        .then((data) => {
          if (data) {
            props.handleClose();
            setTo("");
            setAddress("");
            setPhone("");
            setEmail("");
            sendMessageAction(
              "success",
              "Se creó el destinatario correctamente",
              dispatch
            );
            props.reload();
          }
        });
    } else
      sendMessageAction("warning", "Falta rellenar algunos campos", dispatch);
  }

  style.width = 500;
  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom className="post-title">
          Crear nuevo destinatario
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Para"
              fullWidth
              value={to}
              onChange={handleToChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              fullWidth
              value={address}
              onChange={handleAddressChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Teléfono"
              fullWidth
              value={phone}
              onChange={handlePhoneChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Correo"
              fullWidth
              value={email}
              onChange={handleEmailChange}
            />
          </Grid>

          <Grid item xs={12}>
            <hr />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: "100%" }}
              onClick={postObj}
            >
              Crear
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default PostModalVariable;
