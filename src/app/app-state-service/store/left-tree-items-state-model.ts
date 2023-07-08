export class LeftTreeItemsStateModel {
  items!: Item[];
}

interface Item {
  name: string;
  id: string;
  description?: string;
  address?: string;
  collapsed?: boolean;
  nestedItems?: Item[];
}
