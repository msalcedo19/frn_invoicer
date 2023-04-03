import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Dispatch } from "react";
import { Typography } from "@mui/material";

interface ModalBillToProps {
  billTos: TBillTo[];
  setChooseBillTo: Dispatch<React.SetStateAction<TBillTo | undefined>>;
}

export default function InvoiceModalBillTo(props: ModalBillToProps) {
  const handleChange = (event: SelectChangeEvent) => {
    let chose = props.billTos.find(
      (billTo) => billTo.id.toString() == event.target.value
    );
    if (chose) props.setChooseBillTo(chose);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Para</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.billTos.length > 0 ? props.billTos[0].id.toString() : ""}
          label="Age"
          onChange={handleChange}
        >
          {props.billTos.map((billTo) => (
            <MenuItem key={billTo.id} value={billTo.id.toString()}>
              {billTo.to}
            </MenuItem>
          ))}
          {props.billTos.length == 0 && (
            <MenuItem>
              <Typography>Aún no existe ningún destinatario</Typography>
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
