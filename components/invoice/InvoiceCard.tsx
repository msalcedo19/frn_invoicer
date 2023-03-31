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
import { Dispatch, SetStateAction, useState, ChangeEvent, CSSProperties } from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ButtonBase from "@mui/material/ButtonBase";

import { useDispatch } from "react-redux";
import { breadcrumbAction, CHECK_ACTION } from "@/src/actions/breadcrumb";
import { processRequestToObj } from "@/pages/index";

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
  } as CSSProperties,
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
    paddingY: "16px !important",
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
export function InvoiceCard({
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
  const handleNameChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
        .then((response) =>
          processRequestToObj(
            "error",
            "Hubo un error actualizando la factura, por favor intentelo nuevamente",
            dispatch,
            response
          )
        )
        .then((data) => {
          if (!data) setEditedName(invoice.number_id.toString());
          setIsEditable(false);
        });
    }
    setIsEditable(false);
  };

  return (
    <Grid item xs={12} sm={6} md={4} sx={{ mb: 2 }}>
      <Card
        style={styles.card}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardHeader
          title={
            <Grid container>
              <Grid item xs={12}>
                {" "}
                {deleteOp && (
                  <Checkbox
                    style={styles.checkbox}
                    checked={checkedList.get(invoice.id) ?? false}
                    inputProps={{
                      "aria-label": "Checkbox A",
                    }}
                    onChange={(e) => handleChange(invoice.id, e)}
                  />
                )}
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
                    #{editedName}
                  </Typography>
                )}
              </Grid>
            </Grid>
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
          {invoice.files != undefined && invoice.files.length > 0 && (
            <Link target="_blank" href={invoice.files[0].s3_pdf_url}>
              <Grid
                container
                sx={{
                  textAlign: "center",
                  "&:hover": {
                    color: "#115293",
                    "& .MuiTypography-root": {
                      fontWeight: 800,
                    },
                  },
                }}
              >
                <Grid item xs={12}>
                  <ButtonBase>
                    <PictureAsPdfIcon />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12}>
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
            >
              Ver Versiones
            </Link>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
