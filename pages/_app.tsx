import "@/styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "@/components/MainLayout";
import BasicBreadcrumbs from "@/components/MBreadCrumbs";
import { Provider } from "react-redux";
import store from "@/src/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MainLayout>
        <BasicBreadcrumbs />
        <Component {...pageProps} />
      </MainLayout>
    </Provider>
  );
}
