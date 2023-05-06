import { Dispatch, SetStateAction, useState, ChangeEvent } from "react";

import OptionsButton from "@/components/OptionsButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";

interface Props {
  delete_objs_fun: () => void;
  deleteOption: boolean;
  setDeleteOption: Dispatch<SetStateAction<boolean>>;
  handleOpen: () => void;
  textCreateOption: string;
  textDeleteOption: string;
}

export default function OptionsDrawer(props: Props) {
  return (
    <Box sx={{ position: "fixed", bottom: "32px", right: "32px" }}>
      <OptionsButton
        function_1={props.delete_objs_fun}
        function_2={() => props.setDeleteOption(false)}
        check_or_cancel={props.deleteOption}
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
      </OptionsButton>
    </Box>
  );
}
