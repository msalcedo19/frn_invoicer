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
}

export default function CustomerEditable(props: Props) {
  const [editable, setEditable] = useState(false);
  const [editedName, setEditedName] = useState(props.customer.name);

  const handleNameChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setEditedName(e.target.value);
  };

  const handleNameClick = () => {
    setEditable(true);
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
    }
    setEditable(false);
  };
  return (
    <div>
      {" "}
      {editable ? (
        <TextField
          variant="standard"
          fullWidth
          value={editedName}
          autoFocus={true}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
        />
      ) : (
        <Typography onClick={props.isEditable ? handleNameClick : () => {}}>
          {editedName}
        </Typography>
      )}
    </div>
  );
}
