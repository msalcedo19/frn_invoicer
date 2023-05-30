import { Typography, TextField } from "@mui/material";

import { useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import {
  processRequestToObj,
  sendMessageAction,
  getHeaders,
} from "@/pages/index";

interface Props {
  customer: TCustomer;
  isEditable: boolean;
  handleIsEditableClose: () => void;
}

export default function CustomerEditable(props: Props) {
  const [editedName, setEditedName] = useState(props.customer.name);

  const handleNameChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setEditedName(e.target.value);
  };

  const dispatch = useDispatch();
  const handleNameBlur = () => {
    if (editedName != props.customer.name) {
      fetch(`/api/customer/${props.customer.id}`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({ name: editedName }),
      })
        .then((response) =>
          processRequestToObj(
            "error",
            "Hubo un error actualizando el cliente, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
        .then((data) => {
          if (!data) setEditedName(props.customer.name);
          else
            sendMessageAction(
              "success",
              "Se actualizó correctamente",
              dispatch
            );
        });
      props.handleIsEditableClose();
    }
  };
  return (
    <div>
      {" "}
      {props.isEditable ? (
        <TextField
          variant="standard"
          fullWidth
          value={editedName}
          autoFocus={true}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          
        />
      ) : (
        <Typography>{editedName}</Typography>
      )}
    </div>
  );
}
