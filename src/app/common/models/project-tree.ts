export interface Item {
    name: string;
    collapsed?: boolean;
    nestedItems?: Item[];
  }