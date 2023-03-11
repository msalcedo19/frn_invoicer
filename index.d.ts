type TConsumer = {
  id: number;
  name: string;
  price_unit: number;
  invoices: Array[TInvoice]
};

type TInvoice = {
  id: number
  number: number
  reason: string
  subtotal: number
  tax1: number;
  tax2: number;
  created: Date
  updated: Date
}

type TFile = {
  id: number
  s3_xlsx_url: string
  s3_pdf_url: string
  created: Date
  invoice_id: number
}

type TGlobal = {
  id: number
  name: str
  value: str
  created: Date
}

type Props = {
  children: React.ReactNode;
};

type TCheckedBox = {
  model_id: number,
  value: bool
};
