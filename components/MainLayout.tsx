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

import { useEffect, useState } from "react";
import { userService } from "@/src/user";

const MainLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const dataPageState = useSelector((state: RootState) => state.dataPage);

  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeComplete", authCheck);
    };
  }, []);

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    setUser(userService.userValue);
    const publicPaths = ["/login"];
    const path = url.split("?")[0];
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    } else if (userService.userValue) {
      setAuthorized(true);
    }
  }

  return (
    <div>
      {authorized && <Navbar />}
      {dataPageState.messageInfo.show && (
        <BasicAlerts
          severity={dataPageState.messageInfo.severity}
          message={dataPageState.messageInfo.message}
        />
      )}

      <Container maxWidth="xl" component="main" sx={{ marginTop: "2.5%" }}>
        {authorized &&
          currentRoute != "/variable" &&
          currentRoute != "/customer" &&
          currentRoute != "/" && <BasicBreadcrumbs />}
        <Box sx={{ my: 2 }} />
        {authorized && currentRoute != "/variable" && (
          <Typography variant="h5" component="h2">
            {dataPageState.title}
          </Typography>
        )}
        <Container
          sx={{
            marginTop: "2.5%",
            padding: "0 !important",
            maxWidth: "none !important",
          }}
        >
          {children}
        </Container>
      </Container>
      {authorized && <Footer />}
    </div>
  );
};

export default MainLayout;
