import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { Card, CardContent, Typography } from "@mui/material";
import { Dispatch, SetStateAction, Fragment } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { breadcrumbAction, CHECK_ACTION } from "@/src/actions/breadcrumb";
const styles = {
  card: {
    maxWidth: 345,
    margin: "auto",
    marginBottom: 20,
    position: "relative",
    overflow: "visible",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "10px",
  },
  content: {
    paddingBottom: "16px !important",
    textAlign: "center"
  },
  title: {
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "8px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
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
  },
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

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleNameClick = () => {
    setIsEditable(true);
  };

  const handleNameBlur = () => {
    if (editedName != customer.name) {
      fetch(`/api/customer/${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedName }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
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
          {customer.contracts &&
            ((customer.contracts.length > 0 && (
              <Grid container spacing={2}>
                {customer.contracts.map((contract, index) => (
                  <Fragment key={contract.id}>
                    <Grid item xs={6} sx={{ textAlign: "center" }}>
                      <Typography variant="subtitle1">
                        {contract.name}
                      </Typography>
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            )) || (
              <Typography variant="subtitle1">
                Aún no se han registrado contratos
              </Typography>
            ))}
        </CardContent>
        <CardActions style={styles.actions}>
          <Button size="small">
            <Link href={`/customer/${customer.id}`} onClick={handleClick}>
              Contratos
            </Link>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
