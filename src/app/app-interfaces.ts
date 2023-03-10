export interface Item {
  // [index: string]: any;
  id: string;
  description: string;
  quantity: number | null;
  unit: string | null;
  unitPrice: number | null;
  totalPrice: number | null;
  type: string;
  parentId: string | null;
  childrenIds: string[];
}

export interface Header {
  name: string;
  width: string;
  display: string;
  sort: number;
}
export interface Quote {
  id: string;
  items: Item[];
}
