// rootReducer.ts

import { combineReducers } from "redux";
import { reducer } from "./breadcrumb";
import { reducerV1 } from "./dataPage";

const rootReducer = combineReducers({
  push_item: reducer,
  dataPage: reducerV1,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
