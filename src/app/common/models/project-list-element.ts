
export interface ProjectListElement {
  _id?: string;
  createdat?: string;
  createdby?: string;
  description?: string;
  name: string;
  parentid?: string;
  assignedto?: string[];
  parenttype?: string;
  type?: string;
  url?: string;
  address?: string;
  isInvasive?: boolean;
  sequenceNo?: string;
}
