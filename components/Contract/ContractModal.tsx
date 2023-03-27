import { SetStateAction, useState, Dispatch } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ContractModalTabs from "./ContractModalTabs";

import { useDispatch } from "react-redux";
import { processRequestToObj } from "@/pages/index";

interface ModalProps {
  reload: (model_id: string | string[] | undefined) => void;
  customer_id: Number | undefined;
  open: boolean;
  handleClose: () => void;
}

export default function PostContract(props: ModalProps) {
  const { open, handleClose } = props;
  const [name, setName] = useState("");
  const [hourlyCost, setHourlyCost] = useState("");

  const [to, setTo] = useState("Sparksuite, Inc.");
  const [address, setAddress] = useState(
    "12345 Sunny Road Sunnyville, CA 12345"
  );
  const [phone, setPhone] = useState("1234567890");

  const dispatch = useDispatch();
  function postObj() {
    if (name && hourlyCost && props.customer_id) {
      let newConsumer = {
        name: name,
        customer_id: props.customer_id,
        price_unit: Number(hourlyCost),
      };
      window
        .fetch("/api/contract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newConsumer),
        })
        .then((response) =>
          processRequestToObj(
            "error",
            "Hubo un error creando el contrato, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
        .then((data) => {
          if (data) {
            if (to && address && phone) {
              let newBillTo = {
                to: to,
                addr: address,
                phone: phone,
                contract_id: data && data.id ? data.id : undefined,
              };
              window
                .fetch("/api/billTo", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newBillTo),
                })
                .then((response) => response.json())
                .then((data) => {
                  //setTo("");
                  //setAddress("");
                  //setPhone("");
                });
            }

            props.reload(
              props.customer_id ? props.customer_id.toString() : undefined
            );
            handleClose();
            setName("");
            setHourlyCost("");
          }
        });
    }
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleHourlyCostChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHourlyCost(event.target.value);
  };

  const handleCreateClick = () => {
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
          Crear nueva contrato
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              fullWidth
              value={name}
              onChange={handleNameChange}
              helperText="Nombre del nuevo contrato"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Costo por hora"
              fullWidth
              value={hourlyCost}
              onChange={handleHourlyCostChange}
            />
          </Grid>
        </Grid>
        <Box sx={{ my: 2 }}>
          <hr />
        </Box>
        <ContractModalTabs
          to={to}
          setTo={setTo}
          address={address}
          setAddress={setAddress}
          setPhone={setPhone}
          phone={phone}
        />
        <Box sx={{ my: 2 }}>
          <Button variant="contained" onClick={handleCreateClick}>
            Crear
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
