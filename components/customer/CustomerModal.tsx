import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Dispatch, SetStateAction } from "react";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export default function PostModal({
  consumerList,
  setConsumerList,
  open,
  handleClose,
}: {
  consumerList: TCustomer[];
  setConsumerList: Dispatch<SetStateAction<TCustomer[]>>;
  open: boolean;
  handleClose: () => void;
}) {
  let customerName: string | undefined;
  let customerPriceUnit: string | undefined;
  function postCostumer() {
    if (customerName && customerPriceUnit) {
      let newConsumer = {
        name: customerName,
        price_unit: customerPriceUnit,
      };
      window
        .fetch("/api/customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newConsumer),
        })
        .then((response) => response.json())
        .then((data) => {
          consumerList.push(data);
          setConsumerList(consumerList);
          handleClose();
          customerName = undefined;
          customerPriceUnit = undefined;
        });
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box component="form" sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <TextField
          required
          id="customer_name"
          label="Nombre"
          variant="outlined"
          helperText="Nombre del nuevo contrato/empresa"
          onChange={(e) => (customerName = e.target.value)}
        />
        <TextField
          required
          id="price_unit"
          label="Valor x hora"
          variant="outlined"
          onChange={(e) => (customerPriceUnit = e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={postCostumer}>
          Crear
        </Button>
      </Box>
    </Modal>
  );
}
