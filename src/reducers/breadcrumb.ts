// reducer.ts

import {
  PUSH_ITEM,
  CHECK_ACTION,
  BACK_EVENT,
  CUSTOMER,
  CONTRACT,
  INVOICE,
  BreadcrumbAction,
} from "../actions/breadcrumb";

export interface TBreadcrumbOptionState {
  value: string;
  href: string;
  active: boolean;
}

export interface TBreadcrumbState {
  options: TBreadcrumbOptionState[];
  lastBreadcrumb: TBreadcrumbOptionState[];
}

const initialState: TBreadcrumbState = {
  options: [
    {
      value: "Clientes",
      href: "/customer",
      active: true,
    },
  ],
  lastBreadcrumb: [],
};

const reducer = (
  state = initialState,
  action: BreadcrumbAction
): TBreadcrumbState => {
  let updatedBreadcrumbs: TBreadcrumbOptionState[] = [];
  switch (action.type) {
    case PUSH_ITEM:
      console.log(PUSH_ITEM);
      return { ...state, options: [...state.options, action.payload] };
    case CHECK_ACTION:
      console.log(CHECK_ACTION);
      updatedBreadcrumbs = state.options.map((obj) => {
        if (obj.active) {
          return { ...obj, active: false };
        }
        return obj;
      });
      return {
        ...state,
        options: [...updatedBreadcrumbs, action.payload],
        lastBreadcrumb: [...state.lastBreadcrumb, action.payload],
      };
    case BACK_EVENT:
      console.log(BACK_EVENT);
      if (action.check == CUSTOMER && state.options.length < 2) return state;
      else if (action.check == CONTRACT && state.options.length < 3)
        return state;
      else if (action.check == INVOICE && state.options.length < 4)
        return state;
      let lastElementBreadcrumb: TBreadcrumbOptionState | undefined = undefined;
      if (state.lastBreadcrumb.length > 0)
        lastElementBreadcrumb =
          state.lastBreadcrumb[state.lastBreadcrumb.length - 1];
      return {
        ...state,
        options: lastElementBreadcrumb
          ? [
              ...state.options.filter(
                (breadcrumb) =>
                  breadcrumb.value !== lastElementBreadcrumb!.value
              ),
            ]
          : [...state.options],
        lastBreadcrumb: [
          ...state.lastBreadcrumb.filter(
            (breadcrumb) =>
              lastElementBreadcrumb &&
              breadcrumb.value !== lastElementBreadcrumb.value
          ),
        ],
      };
    default:
      console.log("default");
      return state;
  }
};

export default reducer;
