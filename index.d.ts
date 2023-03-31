type TCustomer = {
  id: number;
  name: string;
  contracts: TContract[];
};

type TContract = {
  id: number;
  name: string;
  price_unit: number;
  invoices: Array[TInvoice]
  num_invoices; number;
};

type TInvoice = {
  id: number
  number_id: number
  reason: string
  subtotal: number
  tax_1: number;
  tax_2: number;
  created: Date
  updated: Date
  customer_id: number
  files: Array[TFile]
}

type TFile = {
  id: number
  s3_xlsx_url: string
  s3_pdf_url: string
  created: Date
  invoice_id: number
}

type TTopInfo = {
  id: number
  ti_from: string
  addr: string
  email: string
  phone: string
}

type TGlobal = {
  id: number
  name: str
  value: str
  created: string
  updated: string
}

type TBillTo = {
  id: number;
  to: string
  addr: string
  phone: string
};

type Props = {
  children: React.ReactNode;
};

type TCheckedBox = {
  model_id: number,
  value: bool
};
