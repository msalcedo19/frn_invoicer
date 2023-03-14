import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";

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

export default function PostFileModal({
  model_id,
  create_new_invoice,
  open,
  handleClose,
  reload,
}: {
  model_id: string | string[] | undefined;
  create_new_invoice: boolean;
  open: boolean;
  handleClose: () => void;
  reload: () => void;
}) {
  const [file, setFile] = useState<Blob>();

  const [tax_1, setTax1] = useState<TGlobal>();
  const [tax_2, setTax2] = useState<TGlobal>();
  const [error, setError] = useState<boolean>(false);

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

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setFile(i);
      setError(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box component="form" sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Click en subir para elegir el archivo y cargar para procesarlo en el
          sistema
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Button variant="contained" component="label">
              Subir
              <input
                hidden
                type="file"
                name="myFile"
                onChange={uploadToClient}
              />
            </Button>
            {file && (
              <Grid>
                <SaveIcon />
                <CheckIcon />
              </Grid>
            )}
          </Grid>
          <Grid item xs={6} style={{ textAlign: "center" }}>
            <Button variant="contained" component="label" onClick={postFile}>
              Cargar
            </Button>
            {error && (
              <Typography>
                Hubo un error cargando el archivo, por favor vuelve a
                intentarlo.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
