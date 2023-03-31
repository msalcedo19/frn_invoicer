import Customer from "./customer";
import { AnyAction } from "redux";
import { AlertColor } from "@mui/material";

import { NextRouter } from "next/router";
import { Dispatch } from "react";
import { dataPageAction, MESSAGE_INFO_EVENT } from "@/src/actions/dataPage";
import { breadcrumbAction, RELOAD_EVENT } from "@/src/actions/breadcrumb";
import { API_ENDPOINT } from "config";

export const sortByNameAsc = (a, b) => a.name.localeCompare(b.name);
export const sortByNameDesc = (a, b) => b.name.localeCompare(a.name);

export const handleBreadCrumb = async (
  router: NextRouter,
  dispatch: Dispatch<AnyAction>
) => {
  const currentRoute = router.asPath;
  fetch(`${API_ENDPOINT}/breadcrumbs/`, {
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
    dispatch(
      dataPageAction(MESSAGE_INFO_EVENT, {
        messageInfo: {
          severity: severity,
          message: message,
          show: true,
        },
      })
    );
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
    dispatch(
      dataPageAction(MESSAGE_INFO_EVENT, {
        messageInfo: {
          severity: severity,
          message: message,
          show: true,
        },
      })
    );
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
    dispatch(
      dataPageAction(MESSAGE_INFO_EVENT, {
        messageInfo: {
          severity: severity,
          message: message,
          show: true,
        },
      })
    );
    return true;
  }
  return false;
}
export default function Home() {
  return <Customer />;
}
