import React, { Dispatch, SetStateAction, Fragment } from "react";
import {
  Grid,
  Fab,
  Drawer,
  Box,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

interface Props {
  handleOpenToDelete: () => void;
  deleteOption: boolean;
  setDeleteOption: Dispatch<SetStateAction<boolean>>;
  handleOpen: () => void;
  editable: boolean;
  setEditable: Dispatch<SetStateAction<boolean>>;
  setSelected: Dispatch<SetStateAction<readonly number[]>>;
  textCreateOption: string;
  textUpdateOption: string;
  textDeleteOption: string;
}

type Anchor = "bottom";
export default function InvoiceOptionsDrawer(props: Props) {
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

  function onCloseIcon() {
    if (!props.editable) {
      props.setDeleteOption(false);
      props.setSelected([]);
    } else props.setEditable(false);
  }

  return (
    <Box sx={{ position: "fixed", bottom: "32px", right: "32px" }}>
      <Fragment key={"bottom"}>
        {!props.deleteOption && !props.editable && (
          <Fab
            color="primary"
            aria-label="add"
            onClick={toggleDrawer("bottom", true)}
          >
            <AddIcon />
          </Fab>
        )}
        {(props.deleteOption || props.editable) && (
          <Grid container>
            <Grid item>
              <Tooltip title={props.editable ? "Confirmar" : "Eliminar"}>
                <Fab
                  sx={{ backgroundColor: "green" }}
                  aria-label="add"
                  onClick={() =>
                    !props.editable
                      ? props.handleOpenToDelete()
                      : props.setEditable(false)
                  }
                >
                  <CheckIcon />
                </Fab>
              </Tooltip>
            </Grid>
            <Grid item>
              <Fab color="primary" aria-label="add" onClick={onCloseIcon}>
                <CloseIcon />
              </Fab>
            </Grid>
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
            <List>
              <ListItem key={"new_key"} disablePadding>
                <ListItemButton onClick={props.handleOpen}>
                  <ListItemIcon>
                    <CreateIcon />
                  </ListItemIcon>
                  <ListItemText primary={props.textCreateOption} />
                </ListItemButton>
              </ListItem>
              <ListItem key={"update_key"} disablePadding>
                <ListItemButton onClick={() => props.setEditable(true)}>
                  <ListItemIcon>
                    <AutoFixHighIcon />
                  </ListItemIcon>
                  <ListItemText primary={props.textUpdateOption} />
                </ListItemButton>
              </ListItem>
              <ListItem key={"delete_key"} disablePadding>
                <ListItemButton onClick={() => props.setDeleteOption(true)}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary={props.textDeleteOption} />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem key={"exit"} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Cerrar"} />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Fragment>
    </Box>
  );
}
