import Customer from "./customer";
import { AnyAction } from "redux";
import { AlertColor } from "@mui/material";

import { NextRouter } from "next/router";
import { Dispatch } from "react";
import { dataPageAction, MESSAGE_INFO_EVENT } from "@/src/actions/dataPage";
import { breadcrumbAction, RELOAD_EVENT } from "@/src/actions/breadcrumb";

export const sortByNameAsc = (
  a: TCustomer | TContract,
  b: TCustomer | TContract
) => a.name.localeCompare(b.name);
export const sortByNameDesc = (
  a: TCustomer | TContract,
  b: TCustomer | TContract
) => b.name.localeCompare(a.name);

export const handleBreadCrumb = async (
  router: NextRouter,
  dispatch: Dispatch<AnyAction>
) => {
  const currentRoute = router.asPath;
  fetch(`/api/breadcrumbs/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ current_path: currentRoute }),
  })
    .then((response) => {
      if (response.status >= 200 || response.status < 400)
        return response.json();
    })
    .then((data) => {
      if (data)
        dispatch(breadcrumbAction(RELOAD_EVENT, data["options"], undefined));
    });
};

export function processRequest(
  severity: AlertColor,
  message: string,
  dispatch: Dispatch<AnyAction>,
  response: Response
) {
  if (response.status < 200 || response.status >= 400) {
    sendMessageAction(severity, message, dispatch);
    return [];
  }
  return response.json();
}

export function processRequestToObj(
  severity: AlertColor,
  message: string,
  dispatch: Dispatch<AnyAction>,
  response: Response
) {
  if (response.status < 200 || response.status >= 400) {
    sendMessageAction(severity, message, dispatch);
    return undefined;
  }
  return response.json();
}

export function processRequestNonReponse(
  severity: AlertColor,
  message: string,
  dispatch: Dispatch<AnyAction>,
  response: Response
) {
  if (response.status < 200 || response.status >= 400) {
    sendMessageAction(severity, message, dispatch);
    return true;
  }
  return false;
}

export function sendMessageAction(
  severity: AlertColor,
  message: string,
  dispatch: Dispatch<AnyAction>
) {
  dispatch(
    dataPageAction(MESSAGE_INFO_EVENT, {
      messageInfo: {
        severity: severity,
        message: message,
        show: true,
      },
    })
  );
}

export default function Home() {
  return <Customer />;
}
