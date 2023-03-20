import Navbar from "./Navbar";
import Footer from "./Footer";
import Container from "@mui/material/Container";

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" component="main" sx={{ marginTop: "5%" }}>
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default MainLayout;
