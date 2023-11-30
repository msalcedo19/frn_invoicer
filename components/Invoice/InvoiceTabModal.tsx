import { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  Grid,
  Chip,
} from "@mui/material";
import TextField from "@mui/material/TextField";

import { sendMessageAction, style } from "@/pages/index";
import { useDispatch } from "react-redux";

interface PostFileModalProps {
  model_id: string | string[] | undefined;
  customer_id: string | string[] | undefined;
  number_id: string | string[] | undefined;
  open: boolean;
  loading: boolean;
  contracts: Contract[];
  setContracts: Dispatch<SetStateAction<Contract[]>>;
}

export interface Contract {
  title: string;
  amount: number;
  currency: string;
  hours: number;
  price_unit: number | undefined;
  invoice_id: number | undefined;
}

export const ContractSectionPanel = (props: PostFileModalProps) => {
  const [contractTitle, setContractTitle] = useState("");
  const [contractAmount, setContractAmount] = useState("0");
  const [contractHours, setContractHours] = useState("0");

  style.width = 500;

  const dispatch = useDispatch();
  function addContract() {
    if (contractTitle.length > 0 && parseFloat(contractAmount) > 0) {
      let newContract: Contract = {
        title: contractTitle,
        amount: parseFloat(contractAmount),
        currency: "CAD",
        hours: parseFloat(contractHours),
        price_unit: undefined,
        invoice_id: undefined,
      };
      props.setContracts((prevContracts) => [...prevContracts, newContract]);
      setContractTitle("");
      setContractAmount("0");
      setContractHours("0");
    } else
      sendMessageAction("warning", "Falta rellenar algunos campos", dispatch);
  }

  const removeContractByTitle = (title: string) => {
    // Create a new array without the contract that matches the given title
    const updatedContracts = props.contracts.filter(
      (contract) => contract.title !== title
    );

    // Update the contracts state with the updated array
    props.setContracts(updatedContracts);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          required
          label="Nombre Contrato"
          fullWidth
          value={contractTitle}
          onChange={(e) => setContractTitle(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          required
          label="Monto"
          fullWidth
          value={contractAmount}
          onChange={(e) => setContractAmount(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          required
          label="Número de horas"
          fullWidth
          value={contractHours}
          onChange={(e) => setContractHours(e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        {props.contracts.map((contract, index) => (
          <Chip
            key={index}
            label={contract.title}
            onDelete={() => {
              removeContractByTitle(contract.title);
            }}
          />
        ))}
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          component="label"
          fullWidth
          onClick={addContract}
          disabled={props.loading}
          sx={{
            height: "100%",
            backgroundColor: "green",
          }}
        >
          Agregar contrato
        </Button>
      </Grid>
    </Grid>
  );
};
