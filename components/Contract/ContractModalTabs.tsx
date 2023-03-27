import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState, Dispatch, SetStateAction } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setTo(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setAddress(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setPhone(event.target.value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
        >
          <Tab label="Nuevo billTo" {...a11yProps(0)} />
          <Tab label="Existentes" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="To"
              fullWidth
              value={props.to}
              onChange={handleToChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              fullWidth
              value={props.address}
              onChange={handleAddressChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              fullWidth
              value={props.phone}
              onChange={handlePhoneChange}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
}
