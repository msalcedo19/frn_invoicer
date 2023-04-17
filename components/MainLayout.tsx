import Navbar from "./Navbar";
import Footer from "./Footer";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import BasicBreadcrumbs from "@/components/MBreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/src/reducers/rootReducer";
import { useRouter } from "next/router";
import BasicAlerts from "./MAlert";

const MainLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const dataPageState = useSelector((state: RootState) => state.dataPage);
  return (
    <div>
      <Navbar />
      {dataPageState.messageInfo.show && (
        <BasicAlerts
          severity={dataPageState.messageInfo.severity}
          message={dataPageState.messageInfo.message}
        />
      )}
      <Container maxWidth="lg" component="main" sx={{ marginTop: "2.5%" }}>
        {currentRoute != "/variable" && currentRoute != "/customer" && currentRoute != "/" && (
          <BasicBreadcrumbs />
        )}
        <Box sx={{ my: 2 }} />
        {currentRoute != "/variable" && (
          <Typography variant="h5" component="h2">
            {dataPageState.title}
          </Typography>
        )}
        <Container sx={{ marginTop: "2.5%" }}>{children}</Container>
      </Container>
      <Footer />
    </div>
  );
};

export default MainLayout;
