import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";

import {
  Dispatch,
  SetStateAction,
  useState,
  ChangeEvent,
  CSSProperties,
} from "react";
import { useDispatch } from "react-redux";

import { breadcrumbAction, CHECK_ACTION } from "@/src/actions/breadcrumb";
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
    textAlign: "center",
  } as CSSProperties,
  title: {
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "8px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    cursor: "pointer",
  } as CSSProperties,
  subtitle: {
    color: "gray",
    fontSize: "16px",
    marginBottom: "8px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
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

export default function CustomerCard({
  customer,
  checkedList,
  setCheckedList,
  deleteOp,
}: {
  customer: TCustomer;
  checkedList: Map<number, boolean>;
  setCheckedList: Dispatch<SetStateAction<Map<number, boolean>>>;
  deleteOp: boolean;
}) {
  function handleChange(model_id: any, e: any) {
    let isChecked = e.target.checked;
    // do whatever you want with isChecked value
    if (checkedList.get(model_id) == undefined)
      setCheckedList(new Map(checkedList.set(model_id, isChecked)));
    else {
      checkedList.delete(model_id);
      setCheckedList(new Map(checkedList));
    }
  }

  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(
      breadcrumbAction(
        CHECK_ACTION,
        {
          href: `/customer/${customer.id}`,
          value: `${customer.name}`,
          active: true,
        },
        undefined
      )
    );
  };

  const [isEditable, setIsEditable] = useState(false);
  const [editedName, setEditedName] = useState(customer.name);

  const handleNameChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setEditedName(e.target.value);
  };

  const handleNameClick = () => {
    setIsEditable(true);
  };

  const handleNameBlur = () => {
    if (editedName != customer.name) {
      fetch(`/api/customer/${customer.id}`, {
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
          if (!data) setEditedName(customer.name);
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

  return (
    <Grid item xs={12} md={4}>
      <Card style={styles.card}>
        {deleteOp && (
          <Checkbox
            style={styles.checkbox}
            checked={checkedList.get(customer.id) == true ? true : false}
            onChange={(e) => handleChange(customer.id, e)}
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
          <Typography variant="body2" component="p">
            {customer.num_invoices ? customer.num_invoices : 0} facturas
          </Typography>
        </CardContent>
        <CardActions style={styles.actions}>
          <Button size="small">
            <Link href={`/customer/${customer.id}`} onClick={handleClick}>
              Facturas
            </Link>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
