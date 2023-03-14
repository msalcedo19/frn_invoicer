import AddIcon from "@mui/icons-material/Add";
import { Fragment } from "react";
import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import { Grid } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

type Anchor = "bottom";

export default function OptionsButton({
  children,
  check_or_cancel,
  function_1,
  function_2,
}: {
  check_or_cancel: boolean;
  function_1: () => void;
  function_2: () => void;
}) {
  const [state, setState] = React.useState({
    bottom: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  return (
    <Fragment key={"bottom"}>
      {!check_or_cancel && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={toggleDrawer("bottom", true)}
        >
          <AddIcon />
        </Fab>
      )}
      {check_or_cancel && (
        <Grid spacing={2}>
          <Fab color="primary" aria-label="add" onClick={function_1}>
            <CheckIcon />
          </Fab>
          <Fab color="primary" aria-label="add" onClick={function_2}>
            <CloseIcon />
          </Fab>
        </Grid>
      )}
      <Drawer
        anchor={"bottom"}
        open={state["bottom"]}
        onClose={toggleDrawer("bottom", false)}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer("bottom", false)}
          onKeyDown={toggleDrawer("bottom", false)}
        >
          {children}
        </Box>
      </Drawer>
    </Fragment>
  );
}
