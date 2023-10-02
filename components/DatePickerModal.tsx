import { useState, Dispatch } from "react";
import {
  Box,
  Button,
  Grid,
  Modal,
  Typography,
  Tabs,
  Tab,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@mui/material";
import {
  getHeaders,
  processRequestToObj,
  sendMessageAction,
  style,
} from "@/pages/index";
import SeparatorWithText from "@/components/Utils";
import moment from "moment";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface PostFileModalProps {
  customer_id: string | string[] | undefined;
  open: boolean;
  handleClose: () => void;
  setFileData: Dispatch<React.SetStateAction<string | undefined>>;
}

export const DatePickerModal = (props: PostFileModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(
    dayjs(moment().subtract(180, "days").calendar())
  );
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs(moment().format()));
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const dispatch = useDispatch();
  function sendRequest() {
    if(endDate.diff(startDate, 'day') > 31){
      setMessage("No está permitido más de 31 días para generar el archivo. Por favor ajusta las fechas.")
      setError(true)
    } else {
      setError(false)
      setMessage("")
    }
    let data = {
      customer_id: props.customer_id,
      start_date: startDate ? startDate.format('YYYY-MM-DD') : "",
      end_date: endDate ? endDate.format('YYYY-MM-DD') : "",
    };
    let requestHeaders = getHeaders(true)
    requestHeaders.set("Accept", "application/octet-stream");
    window
      .fetch("/api/files", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(data),
      })
      .then((response) =>
          processRequestToObj(
            "error",
            "Hubo un error procesando el archivo, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
      .then((data) => {
        console.log(data)
        if (data) {
          props.setFileData(data["s3_file_path"]);
          props.handleClose();
          setStartDate(dayjs(moment().subtract(180, "days").calendar()));
          setEndDate(dayjs(moment().format()));
        }
      });
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" sx={style}>
          <Grid item xs={12}>
            <SeparatorWithText title="Fecha" />
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <DatePicker
                value={dayjs(startDate)}
                onChange={(newValue) => newValue ? setStartDate(newValue) : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                value={dayjs(endDate)}
                onChange={(newValue) => newValue ? setEndDate(newValue) : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={sendRequest}
                fullWidth
                disabled={loading}
                sx={{ height: "100%" }}
              >
                Descargar
              </Button>
            </Grid>

            <Grid item xs={12}>
            {error && (
              <Typography color="error">
                {message}
              </Typography>
            )}
          </Grid>
          </Grid>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};
