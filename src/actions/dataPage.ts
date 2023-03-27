// actions.ts
import { TDataPageObj } from "@/src/reducers/dataPage";
export const UPDATE_TITLE = "UPDATE_TITLE";
export const MESSAGE_INFO_EVENT = "MESSAGE_INFO_EVENT";

export interface DataPageAction {
  type: typeof UPDATE_TITLE | typeof MESSAGE_INFO_EVENT;
  payload: TDataPageObj;
}

export const dataPageAction = (
  type: typeof UPDATE_TITLE | typeof MESSAGE_INFO_EVENT,
  value: TDataPageObj
): DataPageAction => {
  return {
    type: type,
    payload: value,
  };
};
