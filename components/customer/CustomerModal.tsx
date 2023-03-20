import { SetStateAction, useState, Dispatch } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface ModalProps {
  reload: () => void;
  open: boolean;
  handleClose: () => void;
}

export default function PostModal(props: ModalProps) {
  const { open, handleClose } = props;
  const [name, setName] = useState("");

  function postObj() {
    if (name) {
      let newCustomer = {
        name: name,
      };
      window
        .fetch("/api/customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCustomer),
        })
        .then((response) => response.json())
        .then((data) => {
          props.reload();
          handleClose();
          setName("");
        });
    }
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCreateClick = () => {
    //handleCreate(name, hourlyCost, to, address, phone);
    postObj();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Crear nueva empresa/contrato
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
        <Box sx={{ my: 2 }}>
          <Button variant="contained" onClick={handleCreateClick}>
            Crear
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
