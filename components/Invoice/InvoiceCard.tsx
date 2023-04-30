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
import {
  Dispatch,
  SetStateAction,
  useState,
  ChangeEvent,
  CSSProperties,
} from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ButtonBase from "@mui/material/ButtonBase";

import { useDispatch } from "react-redux";
import { breadcrumbAction, CHECK_ACTION } from "@/src/actions/breadcrumb";
import {
  processRequestToObj,
  sendMessageAction,
  getHeaders,
} from "@/pages/index";
import { useEffect } from "react";

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
    justifyContent: "space-between",
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
  const handleNameChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setEditedName(e.target.value);
  };
  const handleNameClick = () => {
    setIsEditable(true);
  };
  const handleNameBlur = () => {
    if (editedName != invoice.number_id.toString()) {
      fetch(`/api/invoice/${invoice.id}`, {
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
          if (!data) setEditedName(invoice.number_id.toString());
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

  const [total, setTotal] = useState(0);
  const [total_no_taxes, setTotalNoTaxes] = useState(0);
  const [total_tax_1, setTotalTax1] = useState(0);
  const [total_tax_2, setTotalTax2] = useState(0);
  function calculateTotal() {
    let subtotal = 0;
    invoice.files[0].services.forEach(
      (service) => (subtotal += service.amount)
    );
    let a_tax_1 = (invoice.tax_1 / 100) * subtotal;
    let a_tax_2 = (invoice.tax_2 / 100) * subtotal;
    a_tax_1 = parseFloat(a_tax_1.toFixed(2));
    a_tax_2 = parseFloat(a_tax_2.toFixed(2));

    let a_total = a_tax_1 + a_tax_2 + subtotal;

    setTotal(a_total);
    setTotalNoTaxes(subtotal);
    setTotalTax1(a_tax_1);
    setTotalTax2(a_tax_2);
  }

  useEffect(() => {
    calculateTotal();
  }, []);

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
          {invoice.files != undefined &&
            invoice.files.length > 0 &&
            invoice.files[0].s3_pdf_url && (
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

          <Typography
            sx={{
              color: "gray",
              fontSize: "16px",
              marginBottom: "0px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            variant="subtitle1"
            component="p"
          >
            Subtotal: ${total_no_taxes}
          </Typography>
          <Typography
            sx={{
              color: "gray",
              fontSize: "16px",
              marginBottom: "0px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            variant="subtitle1"
            component="p"
          >
            TPS: ${total_tax_1}
          </Typography>
          <Typography
            sx={{
              color: "gray",
              fontSize: "16px",
              marginBottom: "0px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            variant="subtitle1"
            component="p"
          >
            TVQ: ${total_tax_2}
          </Typography>
          <Typography
            sx={{
              color: "gray",
              fontSize: "16px",
              marginBottom: "0px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            variant="subtitle1"
            component="p"
          >
            Total: ${total}
          </Typography>
        </CardContent>
        <CardActions style={styles.actions}>
          <Button size="small" disabled={invoice.files[0] ? false : true}>
            <Link
              href={`/files/${
                invoice.files[0] ? invoice.files[0].id : undefined
              }`}
              onClick={handleClick}
              color="inherit"
            >
              Contratos
            </Link>
          </Button>
          <Button size="small" disabled={invoice.files[0] ? false : true}>
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
