import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateField } from "@mui/x-date-pickers/DateField";
import moment from "moment";
import dayjs from 'dayjs';

interface DatePickerManagerProps {
    currentDate: string | undefined;
  }

export default function DatePickerManager(props: DatePickerManagerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker defaultValue={dayjs(props.currentDate ? props.currentDate : moment().format("L"))} />
    </LocalizationProvider>
  );
}
