import { BehaviorSubject } from "rxjs";
import { sendMessageAction } from "@/pages/index";
import Router from "next/router";
import { Dispatch } from "react";
import { AnyAction } from "redux";

const userSubject = new BehaviorSubject(
  typeof window !== "undefined" &&
    (localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : undefined)
);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  logout,
};

async function login(
  username: string,
  password: string,
  dispatch: Dispatch<AnyAction>
) {
  const user = new FormData();
  user.append("username", username);
  user.append("password", password);
  window
    .fetch("/api/authenticate", {
      method: "POST",
      body: user,
    })
    .then((response) => {
      if (!response || response.status < 200 || response.status >= 400) {
        sendMessageAction(
          "error",
          "Hubo un error, contacte a su administrador",
          dispatch
        );
        return undefined;
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        // publish user to subscribers and store in local storage to stay logged in between page refreshes
        const token = {
          token: `${data["token_type"]} ${data["access_token"]}`,
        };
        localStorage.setItem("user", JSON.stringify(token));
        userSubject.next(token);
        Router.push("/");
      }
    });
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  if (userSubject.value) {
    userSubject.next(null);
    localStorage.removeItem("user");
    Router.push("/");
  }
}
