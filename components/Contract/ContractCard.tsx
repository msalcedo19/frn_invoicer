import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography } from "@mui/material";
import {
  useState,
  CSSProperties,
} from "react";

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
};

export default function ContractCard({ contract }: { contract: TContract }) {
  const [editedName, setEditedName] = useState(contract.title);

  return (
    <Grid item xs={12} md={4}>
      <Card style={styles.card}>
        <CardContent style={styles.content}>
          <Typography variant="h5" component="h2" style={styles.title}>
            {editedName}
          </Typography>
          <Typography style={styles.subtitle} variant="subtitle1" component="p">
            Precio x hora: ${contract.price_unit != 0 ? contract.price_unit : contract.hours != 0 ? parseFloat((contract.amount/contract.hours).toFixed(2)) : 0}
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
