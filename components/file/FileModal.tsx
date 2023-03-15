import { useState, useEffect } from "react";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { Save as SaveIcon, Check as CheckIcon } from "@mui/icons-material";

interface PostFileModalProps {
  model_id: string | string[] | undefined;
  create_new_invoice: boolean;
  open: boolean;
  handleClose: () => void;
  reload: () => void;
}

const PostFileModal = ({
  model_id,
  create_new_invoice,
  open,
  handleClose,
  reload,
}: PostFileModalProps) => {
  const [file, setFile] = useState<Blob>();
  const [error, setError] = useState<boolean>(false);

  const [tax_1, setTax1] = useState<TGlobal>();
  const [tax_2, setTax2] = useState<TGlobal>();

  const uploadToClient = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(false);
    }
  };

  useEffect(() => {
    window
      .fetch(`/api/global/tax_1`)
      .then((response) => response.json())
      .then((data) => {
        setTax1(data);
      });

    window
      .fetch(`/api/global/tax_2`)
      .then((response) => response.json())
      .then((data) => {
        setTax2(data);
      });
  }, [model_id]);

  function postFile() {
    if (file && create_new_invoice) {
      let newInvoice = {
        reason: "Cleaning Services",
        subtotal: 0,
        tax_1: tax_1 ? +tax_1.value : undefined,
        tax_2: tax_2 ? +tax_2.value : undefined,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        customer_id: model_id ? +model_id : undefined,
      };

      window
        .fetch(`/api/invoice/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newInvoice),
        })
        .then((response) => {
          if (response.status < 200 || response.status >= 400) {
            return undefined;
          }
          return response.json();
        })
        .then((data: TInvoice) => {
          if (data) {
            let info_data = new FormData();
            info_data.append("invoice_id", data.id.toString());
            info_data.append("file", file);
            window
              .fetch(`/api/file_manage/`, {
                method: "POST",
                body: info_data,
              })
              .then((response) => {
                if (response.status < 200 || response.status >= 400) {
                  return undefined;
                }
                return response.json();
              })
              .then((data) => {
                reload();
                handleClose()
              });
          } else {
            setError(true);
          }
        });
    } else if (file && model_id) {
      let info_data = new FormData();
      info_data.append("invoice_id", model_id.toString());
      info_data.append("file", file);
      window
        .fetch(`/api/file_manage/`, {
          method: "POST",
          body: info_data,
        })
        .then((response) => {
          if (response.status < 200 || response.status >= 400) {
            return undefined;
          }
          return response.json();
        })
        .then((data) => {
          reload();
          handleClose()
        });
    }
  }

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box component="form" sx={style}>
        <Typography variant="h6" align="center">
          Subir archivo para procesar
        </Typography>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ height: "100%" }}
            >
              Subir archivo
              <input
                hidden
                type="file"
                name="myFile"
                onChange={uploadToClient}
              />
            </Button>
            {file && (
              <Typography mt={1}>
                Archivo seleccionado: {file.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={postFile}
              fullWidth
              disabled={!file}
              sx={{ height: "100%" }}
            >
              Procesar archivo
            </Button>
            {error && (
              <Typography color="error" mt={1}>
                Hubo un error procesando el archivo. Por favor, intenta de
                nuevo.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default PostFileModal;