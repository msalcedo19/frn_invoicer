import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Modal,
  Typography,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { Contract, ContractSectionPanel } from "./InvoiceTabModal";
import SeparatorWithText from "../Utils";

interface PostFileModalProps {
  model_id: string | string[] | undefined;
  customer_id: string | string[] | undefined;
  number_id: string | string[] | undefined;
  create_new_invoice: boolean;
  bill_to_id: number | undefined;
  open: boolean;
  handleClose: () => void;
  reload: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const PostInvoiceModal = ({
  model_id,
  customer_id,
  number_id,
  create_new_invoice,
  bill_to_id,
  open,
  handleClose,
  reload,
}: PostFileModalProps) => {
  const [file, setFile] = useState<Blob>();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [invoice_id, setInvoiceId] = useState("");
  const [reason, setReason] = useState("Cleaning Services");

  const [tax_1, setTax1] = useState<TGlobal>();
  const [tax_2, setTax2] = useState<TGlobal>();

  const [billTos, setBillTos] = useState<TBillTo[]>([]);
  const [billTo, setChooseBillTo] = useState<TBillTo>();

  const [with_taxes, setWith_taxes] = useState<boolean>(true);
  const [with_tables, setWith_tables] = useState<boolean>(true);

  const uploadToClient = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(false);
    }
  };

  useEffect(() => {
    window
      .fetch(`/api/global`, {
        method: "GET",
        headers: getHeaders(),
      })
      .then((response) =>
        processRequest(
          "error",
          "Hubo un error cargando los datos, recargue la página",
          dispatch,
          response
        )
      )
      .then((data) => {
        if (data) {
          for (let variable of data) {
            if (variable.identifier == 1) setTax1(variable);
            else if (variable.identifier == 2) setTax2(variable);
          }
        }
      });

    window
      .fetch(`/api/billTo`, {
        method: "GET",
        headers: getHeaders(),
      })
      .then((response) =>
        processRequest(
          "error",
          "Hubo un error cargando los datos, recargue la página",
          dispatch,
          response
        )
      )
      .then((data) => {
        if (data && data.length > 0) {
          setBillTos(data);
        }
      });
  }, [model_id]);

  const dispatch = useDispatch();
  function postFile() {
    if (file && chosenPages.length == 0) {
      sendMessageAction(
        "warning",
        "Debes seleccionar al menos una hoja del excel y vuelve a intentarlo",
        dispatch
      );
      return;
    }
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

    if (create_new_invoice && customer_id && invoice_id && billTo && !loading) {
      setLoading(true);

      let newInvoice = {
        number_id: +invoice_id,
        reason: reason,
        subtotal: 0,
        tax_1: tax_1 ? +tax_1.value : undefined,
        tax_2: tax_2 ? +tax_2.value : undefined,
        with_taxes: with_taxes,
        with_tables: with_tables,
        customer_id: customer_id,
      };

      let info_data = new FormData();
      info_data.append("bill_to_id", billTo.id.toString());
      info_data.append("invoice", JSON.stringify(newInvoice));
      info_data.append("contracts", JSON.stringify(contracts_data));
      info_data.append("pages", JSON.stringify(chosenPages));
      if (file != undefined) info_data.append("file", file);
      info_data.append("with_taxes", with_taxes.toString());
      info_data.append("with_tables", with_tables.toString());
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set("Authorization", userService.userValue.token);

      window
        .fetch(`/api/file_manage/`, {
          method: "POST",
          headers: requestHeaders,
          body: info_data,
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
              "Ya existe una factura con ese número de identificación",
              dispatch
            );
            return undefined;
          }
          return response.json();
        })
        .then((data: TFile) => {
          if (data && data.id) {
            reload();
            handleClose();
            setInvoiceId("");
            setContracts([]);
            setFile(undefined);
            setChooseBillTo(undefined);
            setChosenPages([]);
            setPages([]);
            sendMessageAction(
              "success",
              "Se creó la factura correctamente",
              dispatch
            );
          }
          setLoading(false);
        });
    } else if (model_id && billTo && !loading) {
      setLoading(true);

      let info_data = new FormData();
      if (number_id)
        info_data.append("invoice_number_id", number_id.toString());
      if (customer_id)
        info_data.append("invoice_customer_id", customer_id.toString());
      info_data.append("bill_to_id", billTo.id.toString());
      info_data.append("contracts", JSON.stringify(contracts_data));
      info_data.append("pages", JSON.stringify(chosenPages));

      if (file != undefined) info_data.append("file", file);

      info_data.append("with_taxes", with_taxes.toString());
      info_data.append("with_tables", with_tables.toString());
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set("Authorization", userService.userValue.token);
      window
        .fetch(`/api/file_manage`, {
          method: "POST",
          headers: requestHeaders,
          body: info_data,
        })
        .then((response) =>
          processRequestToObj(
            "error",
            "Hubo un error creando la factura, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
        .then((data: TFile) => {
          if (data && data.id) {
            reload();
            handleClose();
            sendMessageAction(
              "success",
              "Se creó la factura correctamente",
              dispatch
            );

            setInvoiceId("");
            setFile(undefined);
            setContracts([]);
            setChosenPages([]);
            setPages([]);
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
  const [pages, setPages] = useState<string[]>([]);
  const [chosenPages, setChosenPages] = useState<string[]>([]);

  useEffect(() => {
    get_pages();
  }, [file]);

  useEffect(() => {
    if (billTo == undefined)
      for (let billto of billTos) {
        if (billto.id == bill_to_id) {
          setChooseBillTo(billto);
          break;
        }
      }
  }, [bill_to_id]);

  function get_pages() {
    if (file != undefined) {
      let info_data = new FormData();
      info_data.append("file", file);

      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set("Authorization", userService.userValue.token);
      window
        .fetch(`/api/get_pages/`, {
          method: "POST",
          headers: requestHeaders,
          body: info_data,
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => setPages(data.pages));
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
        <Grid item xs={12}>
          <SeparatorWithText title="Factura" />
        </Grid>
        <Grid container spacing={2} mt={1}>
          {!model_id && (
            <Grid item xs={4}>
              <TextField
                label="ID*"
                fullWidth
                value={invoice_id}
                onChange={handleSetInvoiceId}
                helperText="Número factura"
              />
            </Grid>
          )}
          {!model_id && (
            <Grid item xs={8}>
              <TextField
                label="Reason"
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <InvoiceModalBillTo
              billTos={billTos}
              billTo={billTo}
              setChooseBillTo={setChooseBillTo}
              disabled={billTo != undefined}
            />
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <SeparatorWithText title="Contratos" />
              </AccordionSummary>
              <AccordionDetails>
                <Grid item xs={12}>
                  <ContractSectionPanel
                    customer_id={customer_id}
                    model_id={model_id}
                    number_id={number_id}
                    open={open}
                    loading={loading}
                    contracts={contracts}
                    setContracts={setContracts}
                  />
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <SeparatorWithText title="Opciones" />
          </Grid>
          <Grid item xs={6} sx={{}}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={with_taxes}
                    onChange={(e) => setWith_taxes(e.target.checked)}
                  />
                }
                label="Incluir impuestos"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={6} sx={{}}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={with_tables}
                    onChange={(e) => setWith_tables(e.target.checked)}
                  />
                }
                label="Incluir tablas"
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <SeparatorWithText title="Archivo" />
          </Grid>

          <Grid item xs={12}>
            {pages.map((page, index) => (
              <Chip
                sx={{
                  backgroundColor: chosenPages.find((p) => page == p)
                    ? "green"
                    : "",
                  marginX: "2px",
                }}
                key={index}
                label={page}
                onClick={() => {
                  if (chosenPages.includes(page)) {
                    // If the item is present, remove it
                    setChosenPages((prevChosenPages) =>
                      prevChosenPages.filter((p) => p !== page)
                    );
                  } else {
                    // If the item is not present, add it
                    setChosenPages((prevChosenPages) => [
                      ...prevChosenPages,
                      page,
                    ]);
                  }
                }}
              />
            ))}
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                height: "100%",
                backgroundColor: file ? "green" : "primary",
              }}
            >
              Subir archivo
              <input
                hidden
                type="file"
                name="myFile"
                onChange={uploadToClient}
              />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <SeparatorWithText title="" />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={postFile}
              fullWidth
              disabled={loading}
              sx={{ height: "100%" }}
            >
              Enviar
            </Button>
          </Grid>
          <Grid item xs={12}>
            {file && (
              <Typography sx={{ fontStyle: "italic", color: "gray" }}>
                Archivo seleccionado: {file.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            {error && (
              <Typography color="error">
                Hubo un error procesando el archivo. Por favor, intenta de
                nuevo.
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            {loading && (
              <Box display="flex" flexDirection="column" alignItems="center">
                <CircularProgress />
                <Typography variant="body1" mt={1}>
                  Subiendo...
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
