import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";

import { useDispatch } from "react-redux";
import { breadcrumbAction, CHECK_ACTION } from "@/src/actions/breadcrumb";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ButtonBase from "@mui/material/ButtonBase";

interface Props {
  invoice: TInvoice;
  deleteOp?: boolean;
  checkedList: Map<number, boolean>;
  setCheckedList: Dispatch<SetStateAction<Map<number, boolean>>>;
}

const styles = {
  title: {
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "8px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    cursor: "pointer",
    textAlign: "center",
  },
  content: {
    paddingY: "16px !important",
  },
  actions: {
    justifyContent: "flex-end",
    borderTop: "1px solid #ccc",
    paddingTop: "10px",
  },
};
export default function InvoiceCard({
  invoice,
  checkedList,
  setCheckedList,
  deleteOp,
}: Props) {
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
          href: `/invoice/${invoice.id}`,
          value: `${invoice.id}`,
          active: true,
        },
        undefined
      )
    );
  };

  const [hover, setHover] = useState(false);
  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };

  const [isEditable, setIsEditable] = useState(false);
  const [editedName, setEditedName] = useState(invoice.number_id.toString());
  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };
  const handleNameClick = () => {
    setIsEditable(true);
  };
  const handleNameBlur = () => {
    if (editedName != invoice.number_id.toString()) {
      fetch(`/api/invoice/${invoice.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number_id: +editedName }),
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
    <Grid item xs={12} sm={6} md={4} sx={{ mb: 2 }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardHeader
          title={
            isEditable ? (
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
                #{editedName}
              </Typography>
            )
          }
          titleTypographyProps={{ align: "center", variant: "h5" }}
          subheaderTypographyProps={{ align: "center" }}
          subheader={invoice.reason}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
          }}
        />
        <CardContent sx={{ flexGrow: 1 }} style={styles.content}>
          {deleteOp && (
            <Checkbox
              checked={checkedList.get(invoice.id) ?? false}
              inputProps={{
                "aria-label": "Checkbox A",
              }}
              onChange={(e) => handleChange(invoice.id, e)}
            />
          )}
            {invoice.files != undefined && invoice.files.length > 0 && (
                  <Link target="_blank" href={invoice.files[0].s3_pdf_url}>
                    <Grid container sx={{ textAlign: "center" }}>
                      <Grid item xs={12}>
                        <ButtonBase >
                          <PictureAsPdfIcon/>
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} >
                        <Typography variant="subtitle1">Descargar</Typography>
                      </Grid>
                    </Grid>
                  </Link>
            )}
        </CardContent>
        <CardActions style={styles.actions}>
          <Button size="small">
            <Link
              href={`/invoice/${invoice.id}`}
              onClick={handleClick}
              color="inherit"
              sx={{ fontWeight: 700 }}
            >
              Ver Versiones
            </Link>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
