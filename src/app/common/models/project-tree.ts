export interface Item {
    name: string;
    id: string;
    description?: string;
    address?: string;
    collapsed?: boolean;
    nestedItems?: Item[];
  }
