import { Typography, TextField } from "@mui/material";

import { useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import {
  processRequestToObj,
  sendMessageAction,
  getHeaders,
} from "@/pages/index";

interface Props {
  invoice: TInvoice;
  isEditable: boolean;
  handleIsEditableClose: () => void;
}

export default function InvoiceEditable(props: Props) {
  const [editedName, setEditedName] = useState(props.invoice.number_id.toString());

  const handleNameChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setEditedName(e.target.value);
  };

  const dispatch = useDispatch();
  const handleNameBlur = () => {
    if (editedName != props.invoice.number_id.toString()) {
      fetch(`/api/invoice/${props.invoice.id}`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({ number_id: +editedName }),
      })
        .then((response) =>
          processRequestToObj(
            "error",
            "Hubo un error actualizando la factura, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
        .then((data) => {
          if (!data) setEditedName(props.invoice.number_id.toString());
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
