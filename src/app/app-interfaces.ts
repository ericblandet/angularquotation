export interface Line {
  [index: string]: any;
  id: string;
  description: string;
  quantity: number | undefined;
  unit: string | undefined;
  unitPrice: number | undefined;
  totalPrice: number | undefined;
  type: string;
  sort: string;
}

export interface MainGroup {
  [index: string]: any;
  id: string;
  description: string;
  itemIds: number[];
  type: string;
}

export interface SubGroup {
  [index: string]: any;
  id: string;
  description: string;
  subGroupIds: number[];
  type: string;
}

export interface Item {
  [index: string]: any;
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  type: string;
}
