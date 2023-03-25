// actions.ts
import { TBreadcrumbOptionState } from "@/src/reducers/breadcrumb";
export const CHECK_ACTION = "CHECK_ACTION";
export const BACK_EVENT = "BACK_EVENT";
export const FORWARD_EVENT = "FORWARD_EVENT";
export const RELOAD_EVENT = "RELOAD_EVENT";

export const CUSTOMER = "CUSTOMER";
export const CONTRACT = "CONTRACT";
export const INVOICE = "INVOICE";
export interface BreadcrumbAction {
  type:
    | typeof CHECK_ACTION
    | typeof BACK_EVENT
    | typeof RELOAD_EVENT
    | typeof FORWARD_EVENT;
  payload: TBreadcrumbOptionState | TBreadcrumbOptionState[];
  check: typeof CUSTOMER | typeof CONTRACT | typeof INVOICE | undefined;
}

export const breadcrumbAction = (
  type:
    | typeof CHECK_ACTION
    | typeof BACK_EVENT
    | typeof RELOAD_EVENT
    | typeof FORWARD_EVENT,
  value: TBreadcrumbOptionState,
  check: typeof CUSTOMER | typeof CONTRACT | typeof INVOICE | undefined
): BreadcrumbAction => {
  return {
    type: type,
    payload: value,
    check: check
  };
};
