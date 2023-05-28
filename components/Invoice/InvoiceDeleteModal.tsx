import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
  } from "@mui/material";
  import TextField from "@mui/material/TextField";
  import React, { useState } from "react";
  import { processRequest, getHeaders } from "@/pages/index";
  import { useDispatch } from "react-redux";
  
  const InvoiceDeleteModal = ({
    open,
    onClose,
    onDelete,
  }: {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
  }) => {
    {
      const [password, setPassword] = useState("");
  
      const dispatch = useDispatch();
      const handleDelete = () => {
        window
          .fetch(`/api/user`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({
              user_password: password,
            }),
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
              // Perform delete action here
              onDelete();
              // Close the modal
              onClose();
            }
          });
        // Reset password field
        setPassword("");
      };
      return (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Confirmación</DialogTitle>
          <DialogContent>
            <p>Estás seguro que deseas eliminar esta factura?</p>
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="primary" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  };
  
  export default InvoiceDeleteModal;
  