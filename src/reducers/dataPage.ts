// reducer.ts

import { AlertColor } from "@mui/material";
import {
  UPDATE_TITLE,
  MESSAGE_INFO_EVENT,
  DataPageAction,
} from "../actions/dataPage";

interface MessageInfo {
  severity: AlertColor;
  message: string;
  show: boolean;
}

export interface TDataPageObj {
  title?: string;
  messageInfo?: MessageInfo;
}

export interface TDataPageState {
  title: string | undefined;
  messageInfo: MessageInfo ;
}

const initialState: TDataPageState = {
  title: "Clientes",
  messageInfo: {
    severity: "success",
    message: "",
    show: false,
  },
};

export const reducerV1 = (
  state = initialState,
  action: DataPageAction
): TDataPageState => {
  switch (action.type) {
    case UPDATE_TITLE:
      //console.log(UPDATE_TITLE);
      if (action.payload.title)
        return {
          ...state,
          title: action.payload.title,
        };
      return state;
    case MESSAGE_INFO_EVENT:
      //console.log(MESSAGE_INFO_EVENT);
      if (action.payload.messageInfo)
        return {
          ...state,
          messageInfo: { ...action.payload.messageInfo },
        };
      return state;
    default:
      //console.log("default");
      return state;
  }
};
