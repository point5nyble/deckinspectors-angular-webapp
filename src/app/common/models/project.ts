import {BuildingLocation} from "./buildingLocation";

export interface Project {
  _id: string;
  address: string;
  assignedto: string[];
  children: BuildingLocation[];
  createdate: string;
  createdby: string;
  description: string;
  editedat: string;
  lasteditedby: string;
  name: string;
  projecttype: string;
  url: string;
  invasiveChildren: BuildingLocation[];
  parentid?: string;
  parenttype?: string;
  type?: string;
  createdat: string;
}
