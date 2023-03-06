type TConsumer = {
  id: number;
  name: string;
  tax1: number;
  tax2: number;
  price_unit: number;
  invoices: Array[TInvoice]
};

type TInvoice = {
  id: number
  number: number
  reason: string
  subtotal: number
  total: number
  created: Date
  updated: Date
}

type Props = {
  children: React.ReactNode;
};

type TCheckedBox = {
  model_id: number,
  value: bool
};
