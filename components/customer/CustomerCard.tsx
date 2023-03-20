import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import { Card, CardContent, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

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
  },
  title: {
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "8px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
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
      breadcrumbAction(CHECK_ACTION, {
        href: `/customer/${customer.id}`,
        value: `${customer.name}`,
        active: true,
      }, undefined)
    );
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
          <Typography style={styles.title} variant="h5" component="h2">
            {customer.name}
          </Typography>
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
