export interface Item {
  // [index: string]: any;
  id: string;
  description: string;
  quantity: number | undefined;
  unit: string | undefined;
  unitPrice: number | undefined;
  totalPrice: number | undefined;
  type: string;
  parentId: string | undefined;
  childrenIds: string[];
}

export interface Header {
  name: string;
  width: string;
  display: string;
  sort: number;
}
