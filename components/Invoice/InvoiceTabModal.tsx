import { useState, useEffect, Fragment } from "react";
import {
  Box,
  Button,
  Grid,
  FormControlLabel,
  Typography,
  FormGroup,
  Chip,
  Checkbox,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import InvoiceModalBillTo from "@/components/Invoice/InvoiceModalBillTo";
import {
  processRequestToObj,
  sendMessageAction,
  style,
  getHeaders,
  processRequest,
} from "@/pages/index";
import { useDispatch } from "react-redux";
import { userService } from "@/src/user";

interface PostFileModalProps {
  model_id: string | string[] | undefined;
  customer_id: string | string[] | undefined;
  create_new_invoice: boolean;
  open: boolean;
  handleClose: () => void;
  reload: () => void;
  tax_1: TGlobal | undefined;
  tax_2: TGlobal | undefined;
  billTos: TBillTo[];
}

interface Contract {
  title: string;
  amount: number;
  currency: string;
  hours: number;
  price_unit: number | undefined;
  invoice_id: number | undefined;
}

export const InvoiceTabModal = (props: PostFileModalProps) => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [invoice_id, setInvoiceId] = useState("");
  const [reason, setReason] = useState("Cleaning Services");

  const [billTo, setChooseBillTo] = useState<TBillTo>();
  const [useExistingInvoice, setUseExistingInvoice] = useState<boolean>(false);
  const [with_taxes, setWith_taxes] = useState<boolean>(true);

  const dispatch = useDispatch();
  function postFile() {
    if (
      props.create_new_invoice &&
      props.customer_id &&
      invoice_id &&
      billTo &&
      !loading
    ) {
      setLoading(true);

      let newInvoice = {
        number_id: +invoice_id,
        reason: reason,
        subtotal: 0,
        tax_1: props.tax_1 ? +props.tax_1.value : undefined,
        tax_2: props.tax_2 ? +props.tax_2.value : undefined,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        customer_id: props.customer_id,
      };
      let contracts_data: Contract[] = [];
      contracts.forEach((contract_info) => {
        let contract_data: Contract = {
          title: contract_info.title,
          amount: contract_info.amount,
          currency: contract_info.currency,
          hours: contract_info.hours,
          price_unit: 0,
          invoice_id: undefined,
        };
        contracts_data.push(contract_data);
      });
      window
        .fetch(`/api/files/`, {
          method: "POST",
          headers: getHeaders(true),
          body: JSON.stringify({
            invoice: newInvoice,
            contracts: contracts_data,
            bill_to_id: billTo.id,
            use_existing_invoice: useExistingInvoice,
            with_taxes: with_taxes
          }),
        })
        .then((response) => {
          if (
            response.status != 409 &&
            (response.status < 200 || response.status >= 400)
          ) {
            sendMessageAction(
              "error",
              "Hubo un error creando la factura, por favor intentelo nuevamente",
              dispatch
            );
            return undefined;
          } else if (response.status == 409) {
            sendMessageAction(
              "error",
              "Ya existe una factura con ese número de identificación.",
              dispatch
            );
            setUseExistingInvoice(true);
            return undefined;
          }
          return response.json();
        })
        .then((data: TFile) => {
          if (data && data.id) {
            props.reload();
            props.handleClose();
            setInvoiceId("");
            setChooseBillTo(undefined);
            sendMessageAction(
              "success",
              "Se creó la factura correctamente",
              dispatch
            );
          }
          setLoading(false);
        });
    } else
      sendMessageAction("warning", "Falta rellenar algunos campos", dispatch);
  }

  const handleSetInvoiceId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceId(event.target.value);
  };

  style.width = 500;

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractTitle, setContractTitle] = useState("");
  const [contractAmount, setContractAmount] = useState(0);
  const [contractHours, setContractHours] = useState(0);

  function addContract() {
    if (contractTitle.length > 0 && contractAmount > 0) {
      let newContract: Contract = {
        title: contractTitle,
        amount: contractAmount,
        currency: "CAD",
        hours: contractHours,
      };
      setContracts((prevContracts) => [...prevContracts, newContract]);
      setContractTitle("");
      setContractAmount(0);
      setContractHours(0);
    } else
      sendMessageAction("warning", "Falta rellenar algunos campos", dispatch);
  }

  const removeContractByTitle = (title: string) => {
    // Create a new array without the contract that matches the given title
    const updatedContracts = contracts.filter(
      (contract) => contract.title !== title
    );

    // Update the contracts state with the updated array
    setContracts(updatedContracts);
  };

  return (
    <Grid container spacing={2}>
      {props.customer_id && (
        <Grid item xs={12}>
          <TextField
            label="ID factura"
            fullWidth
            type="number"
            value={invoice_id}
            onChange={handleSetInvoiceId}
            helperText="Número factura"
            disabled={contracts.length > 0 ? true : false}
          />
        </Grid>
      )}
      {useExistingInvoice && (
        <Grid item xs={12} sx={{ paddingTop: "0px !important" }}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={useExistingInvoice} onChange={(e) => setUseExistingInvoice(e.target.checked)}/>}
              label="Usar factura existente"
            />
          </FormGroup>
        </Grid>
      )}
      {props.customer_id && (
        <Grid item xs={12}>
          <TextField
            label="Reason"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={contracts.length > 0 ? true : false}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <InvoiceModalBillTo
          billTos={props.billTos}
          billTo={billTo}
          setChooseBillTo={setChooseBillTo}
          disabled={contracts.length > 0 ? true : false}
        />
      </Grid>

      <Grid item xs={12}>
        <hr />
      </Grid>

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
          type="number"
          label="Monto"
          fullWidth
          value={contractAmount}
          onChange={(e) => setContractAmount(e.target.value)}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Número de horas"
          type="number"
          fullWidth
          value={contractHours}
          onChange={(e) => setContractHours(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sx={{ }}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={with_taxes} onChange={(e) => setWith_taxes(e.target.checked)}/>}
              label="Incluir impuestos?"
            />
          </FormGroup>
        </Grid>

      <Grid item xs={12}>
        {contracts.map((contract, index) => (
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
        <hr />
      </Grid>

      <Grid item xs={6}>
        <Button
          variant="contained"
          component="label"
          fullWidth
          onClick={addContract}
          disabled={loading}
          sx={{
            height: "100%",
            backgroundColor: "green",
          }}
        >
          Agregar contrato
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          onClick={postFile}
          fullWidth
          disabled={contracts.length == 0}
          sx={{ height: "100%" }}
        >
          Finalizar
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center", marginTop: 5 }}>
        {loading && (
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress />
            <Typography variant="body1" mt={1}>
              Generando...
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};
