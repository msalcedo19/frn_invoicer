import * as React from "react";
import Alert, { AlertColor } from "@mui/material/Alert";
import { Slide } from "@mui/material";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { dataPageAction, MESSAGE_INFO_EVENT } from "@/src/actions/dataPage";

interface AlertProps {
  severity: AlertColor;
  message: string;
}

export default function BasicAlerts(props: AlertProps) {
  const dispatch = useDispatch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        dataPageAction(MESSAGE_INFO_EVENT, {
          messageInfo: {
            severity: "success",
            message: "",
            show: false,
          },
        })
      );
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 9999,
        paddingTop: "2.5%",
        left: 0,
        right: 0,
        margin: "auto",
        width: "50%",
      }}
    >
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <Alert severity={props.severity}>{props.message}</Alert>
      </Slide>
    </Box>
  );
}
