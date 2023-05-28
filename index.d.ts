type TCustomer = {
  id: number;
  name: string;
  invoices: TInvoice[];
  num_invoices: number;
  number;
};

type TContract = {
  id: number;
  title: str;
  amount: number;
  currency: str;
  hours: number;
  price_unit: number;
  file_id: number;
};

type TInvoice = {
  id: number;
  number_id: number;
  reason: string;
  tax_1: number;
  tax_2: number;
  created: Date;
  updated: Date;
  customer_id: number;
  files: TFile[];
};

type TFile = {
  id: number;
  s3_xlsx_url: string;
  s3_pdf_url: string;
  created: Date;
  invoice_id: number;
  bill_to_id: number;
  services: TContract[];
};

type TTopInfo = {
  id: number;
  ti_from: string;
  addr: string;
  email: string;
  phone: string;
};

type TGlobal = {
  id: number;
  identifier: number;
  name: str;
  value: str;
  created: string;
  updated: string;
};

type TBillTo = {
  id: number;
  to: string;
  addr: string;
  phone: string;
  email: string;
};

type Props = {
  children: React.ReactNode;
};

type TCheckedBox = {
  model_id: number;
  value: bool;
};
