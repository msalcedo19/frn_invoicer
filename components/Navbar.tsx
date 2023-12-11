import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Link from "next/link";
import Toolbar from "@mui/material/Toolbar";
import { userService } from "@/src/user";
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
        <Link href="/" passHref>
          <Typography variant="h6" style={styles.logo}>
            Invoicer
          </Typography>
        </Link>
        <div>
          <Link href="/customer" passHref>
            <Button style={styles.navLink} component="a">
              Clientes
            </Button>
          </Link>
          <Link href="/variable" passHref>
            <Button style={styles.navLink} component="a">
              Variables
            </Button>
          </Link>
          <Button style={styles.navLink} onClick={userService.logout}>
            Log out
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
