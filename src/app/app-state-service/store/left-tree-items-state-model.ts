export class LeftTreeItemsStateModel {
  items!: Item[];
}

export interface Item {
  name: string;
  id: string;
  description?: string;
  address?: string;
  parentid?: string;
  phone?: string;
  collapsed?: boolean;
  type?: string;
  nestedItems?: Item[];
}
