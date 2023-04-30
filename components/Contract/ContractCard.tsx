import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { Card, CardContent, Typography } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useState,
  ChangeEvent,
  CSSProperties,
} from "react";

import { useDispatch } from "react-redux";
import {
  processRequestToObj,
  sendMessageAction,
  getHeaders,
} from "@/pages/index";

const styles = {
  card: {
    maxWidth: 345,
    margin: "auto",
    marginBottom: 20,
    position: "relative",
    overflow: "visible",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "10px",
  } as CSSProperties,
  content: {
    paddingBottom: "16px !important",
  },
  title: {
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "8px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  } as CSSProperties,
  subtitle: {
    color: "gray",
    fontSize: "16px",
    marginBottom: "0px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  } as CSSProperties,
  checkbox: {
    position: "absolute",
    top: "10px",
    right: "10px",
  } as CSSProperties,
  actions: {
    justifyContent: "flex-end",
    borderTop: "1px solid #ccc",
    paddingTop: "10px",
  },
};

export default function ContractCard({
  contract,
  checkedList,
  setCheckedList,
  deleteOp,
}: {
  contract: TContract;
  checkedList: Map<number, boolean> | undefined;
  setCheckedList: Dispatch<SetStateAction<Map<number, boolean>>> | undefined;
  deleteOp: boolean;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [editedName, setEditedName] = useState(contract.title);

  const handleNameChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setEditedName(e.target.value);
  };
  const handleNameClick = () => {
    setIsEditable(true);
  };

  const dispatch = useDispatch();
  const handleNameBlur = () => {
    if (editedName != contract.title) {
      fetch(`/api/contract/${contract.id}`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({ title: editedName }),
      })
        .then((response) =>
          processRequestToObj(
            "error",
            "Hubo un error actualizando el contrato, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
        .then((data) => {
          if (!data) setEditedName(contract.title);
          else
            sendMessageAction(
              "success",
              "Se actualizó correctamente",
              dispatch
            );
          setIsEditable(false);
        });
    }
    setIsEditable(false);
  };

  function handleChange(model_id: any, e: any) {
    let isChecked = e.target.checked;
    if (checkedList && setCheckedList) {
      if (checkedList.get(model_id) == undefined)
        setCheckedList(new Map(checkedList.set(model_id, isChecked)));
      else {
        checkedList.delete(model_id);
        setCheckedList(new Map(checkedList));
      }
    }
  }

  return (
    <Grid item xs={12} md={4}>
      <Card style={styles.card}>
        {deleteOp && (
          <Checkbox
            style={styles.checkbox}
            checked={
              checkedList && checkedList.get(contract.id) == true ? true : false
            }
            onChange={(e) => handleChange(contract.id, e)}
          />
        )}
        <CardContent style={styles.content}>
          {isEditable ? (
            <TextField
              variant="standard"
              fullWidth
              value={editedName}
              autoFocus={true}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
            />
          ) : (
            <Typography
              variant="h5"
              component="h2"
              onClick={handleNameClick}
              style={styles.title}
            >
              {editedName}
            </Typography>
          )}
          <Typography style={styles.subtitle} variant="subtitle1" component="p">
            Precio x hora: ${contract.price_unit}
          </Typography>
          <Typography style={styles.subtitle} variant="subtitle1" component="p">
            Total horas: {contract.hours}
          </Typography>
          <Typography style={styles.subtitle} variant="subtitle1" component="p">
            Total: ${contract.amount}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
