import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InvoiceModalBillTo from "../Invoice/InvoiceModalBillTo";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ModalProps {
  to: string;
  address: string;
  phone: string;
  setTo: Dispatch<SetStateAction<string>>;
  setAddress: Dispatch<SetStateAction<string>>;
  setPhone: Dispatch<SetStateAction<string>>;
}
export default function ContractModalTabs(props: ModalProps) {
  const [value, setValue] = React.useState(0);
  const [billTos, setBillTos] = useState<TBillTo[]>([]);
  const [billTo, setChooseBillTo] = useState<TBillTo>();

  useEffect(() => {
    window
      .fetch(`/api/billTo/`)
      .then((response) => response.json())
      .then((data) => {
        setBillTos(data);
        if (data && data.length > 0) setChooseBillTo(data[0]);
      });
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InvoiceModalBillTo
            billTos={billTos}
            setChooseBillTo={setChooseBillTo}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
