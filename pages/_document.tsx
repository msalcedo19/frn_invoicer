import { Html, Head, Main, NextScript } from "next/document";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";

export default function Document() {
  return (
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
  );
}
