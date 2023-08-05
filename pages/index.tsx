import Customer from "./customer";
import { AnyAction } from "redux";
import { AlertColor } from "@mui/material";

import { NextRouter } from "next/router";
import { Dispatch } from "react";
import { dataPageAction, MESSAGE_INFO_EVENT } from "@/src/actions/dataPage";
import { breadcrumbAction, RELOAD_EVENT } from "@/src/actions/breadcrumb";
import { userService } from "@/src/user";

export const getHeaders = (post: boolean = false) => {
  const requestHeaders: HeadersInit = new Headers();
  if (post && userService.userValue && userService.userValue.token) {
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("Authorization", userService.userValue.token);
    return requestHeaders;
  } else if (userService.userValue && userService.userValue.token) {
    requestHeaders.set("Authorization", userService.userValue.token);
    return requestHeaders;
  } else return requestHeaders;
};

export const sortByNameAsc = (a: TCustomer, b: TCustomer) =>
  a.name.localeCompare(b.name);
export const sortByNameDesc = (a: TCustomer, b: TCustomer) =>
  b.name.localeCompare(a.name);

export const handleBreadCrumb = async (
  router: NextRouter,
  dispatch: Dispatch<AnyAction>
) => {
  const currentRoute = router.asPath;
  let auxList = currentRoute.split("?")
  let cleanCurrentRoute = auxList.length > 0 ? auxList[0] : currentRoute
  fetch(`/api/breadcrumbs`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({ current_path: cleanCurrentRoute }),
  })
    .then((response) => {
      if (response.status == 401) {
        sendMessageAction(
          "info",
          "La sesión ha caducado, vuelve a ingresar.",
          dispatch
        );
        userService.logout();
        return [];
      } else if (response.status >= 200 || response.status < 400)
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
  if (response.status == 401) {
    sendMessageAction(
      "info",
      "La sesión ha caducado, vuelve a ingresar.",
      dispatch
    );
    userService.logout();
    return [];
  } else if (response.status == 409) {
    sendMessageAction(
      "info",
      "Contraseña incorrecta, operación cancelada.",
      dispatch
    );
    return undefined
  } else if (response.status < 200 || response.status >= 400) {
    if (userService.userValue) sendMessageAction(severity, message, dispatch);
  }
  return response.json();
}

export function processRequestToObj(
  severity: AlertColor,
  message: string,
  dispatch: Dispatch<AnyAction>,
  response: Response
) {
  if (response.status == 401) {
    sendMessageAction(
      "info",
      "La sesión ha caducado, vuelve a ingresar.",
      dispatch
    );
    userService.logout();
    return [];
  } else if (response.status == 406) {
    sendMessageAction(
      "info",
      "Dato invalido.",
      dispatch
    );
    return undefined
  } else if (response.status < 200 || response.status >= 400) {
    if (userService.userValue) sendMessageAction(severity, message, dispatch);
  }
  return response.json();
}

export function processRequestNonReponse(
  severity: AlertColor,
  message: string,
  dispatch: Dispatch<AnyAction>,
  response: Response
) {
  if (response.status == 401) {
    sendMessageAction(
      "info",
      "La sesión ha caducado, vuelve a ingresar.",
      dispatch
    );
    userService.logout();
    return [];
  } else if (response.status < 200 || response.status >= 400) {
    if (userService.userValue) sendMessageAction(severity, message, dispatch);
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

export const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  return <Customer />;
}
