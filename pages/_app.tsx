import "@/styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "@/components/MainLayout";
import { Provider } from "react-redux";
import store from "@/src/store";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "./login";
import { userService } from "@/src/user";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Provider>
  );
}
