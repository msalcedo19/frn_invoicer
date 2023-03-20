// rootReducer.ts

import { combineReducers } from 'redux';
import reducer from './breadcrumb';

const rootReducer = combineReducers({
  push_item: reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
