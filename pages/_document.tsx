import { Html, Head, Main, NextScript } from "next/document";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

export default function Document() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Html lang="en">
        <Head />
        <body>
          <GlobalStyles
            styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
          />
          <CssBaseline />
          <Main />
          <NextScript />
        </body>
      </Html>
    </LocalizationProvider>
  );
}
