import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export default function CustomerCard({
  consumer,
  checkedList,
  setCheckedList,
}: {
  consumer: TConsumer;
  checkedList: Map<number, boolean>;
  setCheckedList: Dispatch<SetStateAction<Map<number, boolean>>>;
}) {
  function handleChange(model_id: any, e: any) {
    let isChecked = e.target.checked;
    // do whatever you want with isChecked value
    console.log(checkedList.get(model_id));
    if (checkedList.get(model_id) == undefined)
      setCheckedList(new Map(checkedList.set(model_id, isChecked)));
    else {
      checkedList.delete(model_id);
      setCheckedList(new Map(checkedList));
    }
  }
  return (
    <Grid
      item
      xs={12}
      //sm={consumer.title === "Enterprise" ? 12 : 6}
      md={4}
    >
      <Card>
        <CardHeader
          title={consumer.name}
          titleTypographyProps={{ align: "center" }}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
          }}
          action={
            <Checkbox
              checked={checkedList.get(consumer.id) == true ? true : false}
              inputProps={{
                "aria-label": "Checkbox A",
              }}
              onChange={(e) => handleChange(consumer.id, e)}
            />
          }
        />
        <CardContent>
          <ul>
            <Typography
              component="li"
              variant="subtitle1"
              align="center"
              key={consumer.tax1}
            >
              tax 1: {consumer.tax1}
            </Typography>
            <Typography
              component="li"
              variant="subtitle1"
              align="center"
              key={consumer.tax2}
            >
              tax 2: {consumer.tax2}
            </Typography>
            <Typography
              component="li"
              variant="subtitle1"
              align="center"
              key={consumer.price_unit}
            >
              $ hora: {consumer.price_unit}
            </Typography>
          </ul>
        </CardContent>
        <CardActions>
          <Button fullWidth variant="contained">
            <Link href={`/customer/${consumer.id}`}>
              Facturas
            </Link>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
