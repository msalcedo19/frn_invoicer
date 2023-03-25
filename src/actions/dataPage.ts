// actions.ts
import { TDataPageState } from "@/src/reducers/dataPage";
export const UPDATE_TITLE = "UPDATE_TITLE";

export interface DataPageAction {
  type: typeof UPDATE_TITLE;
  payload: TDataPageState;
}

export const dataPageAction = (
  type: typeof UPDATE_TITLE,
  value: TDataPageState
): DataPageAction => {
  return {
    type: type,
    payload: value,
  };
};
