import { useState, useEffect } from "react";
import { Box, Button, Grid, Modal, Typography, Tabs, Tab, FormGroup, Checkbox, FormControlLabel } from "@mui/material";
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
import { InvoiceTabModal } from "./InvoiceTabModal";

interface PostFileModalProps {
  model_id: string | string[] | undefined;
  customer_id: string | string[] | undefined;
  number_id: string | string[] | undefined;
  create_new_invoice: boolean;
  open: boolean;
  handleClose: () => void;
  reload: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export const PostInvoiceModal = ({
  model_id,
  customer_id,
  number_id,
  create_new_invoice,
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
          //setChooseBillTo(data[0]);
        }
      });
  }, [model_id]);

  const dispatch = useDispatch();
  function postFile() {
    if (create_new_invoice && customer_id && invoice_id && billTo && !loading) {
      setLoading(true);

      let newInvoice = {
        number_id: +invoice_id,
        reason: reason,
        subtotal: 0,
        tax_1: tax_1 ? +tax_1.value : undefined,
        tax_2: tax_2 ? +tax_2.value : undefined,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        customer_id: customer_id,
      };

      window
        .fetch(`/api/invoice/`, {
          method: "POST",
          headers: getHeaders(true),
          body: JSON.stringify(newInvoice),
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
        .then((invoice_response: TInvoice) => {
          if (file && invoice_response && invoice_response.id) {
            let info_data = new FormData();
            model_id = invoice_response.id.toString();
            info_data.append("invoice_id", invoice_response.id.toString());
            info_data.append("bill_to_id", billTo.id.toString());
            info_data.append("file", file);
            info_data.append("with_taxes", with_taxes.toString());
            const requestHeaders: HeadersInit = new Headers();
            requestHeaders.set("Authorization", userService.userValue.token);
            window
              .fetch(`/api/file_manage/`, {
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
                  setInvoiceId("");
                  sendMessageAction(
                    "success",
                    "Se creó la factura correctamente",
                    dispatch
                  );

                  setFile(undefined);
                } else {
                  window.fetch(`/api/invoice/${invoice_response.id}`, {
                    method: "DELETE",
                    headers: getHeaders(),
                  });
                  sendMessageAction(
                    "error",
                    "Hubo un error creando la factura, por favor intentelo nuevamente",
                    dispatch
                  );
                }
                setLoading(false);
              });
          } else if (!file || !invoice_response || !invoice_response.id) {
            setError(true);
            setLoading(false);
          }
        });
    } else if (file && model_id && billTo && !loading) {
      setLoading(true);

      let info_data = new FormData();
      info_data.append("invoice_id", model_id.toString());
      info_data.append("bill_to_id", billTo.id.toString());
      info_data.append("file", file);
      info_data.append("with_taxes", with_taxes.toString());
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
            setChooseBillTo(undefined);
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
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box component="form" sx={style}>
        <Typography variant="h6" align="center" className="post-title">
          Generar factura
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            aria-label="tabs"
          >
            <Tab label="Subir Archivo" {...a11yProps(0)} />
            <Tab label="Generar" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Grid container spacing={2}>
            {!model_id && (
              <Grid item xs={12}>
                <TextField
                  label="ID factura"
                  fullWidth
                  value={invoice_id}
                  onChange={handleSetInvoiceId}
                  helperText="Número factura"
                />
              </Grid>
            )}
            {!model_id && (
              <Grid item xs={12}>
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
                disabled={false}
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
              <hr />
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                disabled={file != undefined}
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
            <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={postFile}
                fullWidth
                disabled={!file || loading}
                sx={{ height: "100%" }}
              >
                Procesar archivo
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
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <InvoiceTabModal
            customer_id={customer_id}
            model_id={model_id}
            number_id={number_id}
            open={open}
            handleClose={handleClose}
            reload={reload}
            tax_1={tax_1}
            tax_2={tax_2}
            billTos={billTos}
          />
        </CustomTabPanel>
      </Box>
    </Modal>
  );
};
