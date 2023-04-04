import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";

const styles = {
  appBar: {
    backgroundColor: "#212121",
    boxShadow: "none",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "24px",
    letterSpacing: "2px",
    color: "#fff",
    textDecoration: "none",
  },
  navLink: {
    fontWeight: "bold",
    color: "#fff",
    margin: "0 10px",
    "&:hover": {
      color: "#212121",
      backgroundColor: "#fff",
      borderRadius: "5px",
    },
  },
};

export default function Navbar() {
  return (
    <AppBar position="static" style={styles.appBar}>
      <Toolbar style={styles.toolbar}>
        <Typography variant="h6" component="a" href="/" style={styles.logo}>
          Invoicer
        </Typography>
        <div>
          <Button style={styles.navLink}>
            <Link href="/customer">Clientes</Link>
          </Button>
          <Button style={styles.navLink}>
            <Link href="/variable">Variables</Link>
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
