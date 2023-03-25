// reducer.ts

import { UPDATE_TITLE, DataPageAction } from "../actions/dataPage";

export interface TDataPageObj {
  title: string;
}

export interface TDataPageState {
  title: string;
}

const initialState: TDataPageState = {
  title: "Clientes",
};

export const reducerV1 = (
  state = initialState,
  action: DataPageAction
): TDataPageState => {
  switch (action.type) {
    case UPDATE_TITLE:
      console.log(UPDATE_TITLE);
      return {
        ...state,
        title: action.payload.title,
      };
    default:
      console.log("default");
      return state;
  }
};
