export interface Section {
  _id: string;
  count: number;
  furtherinvasivereviewrequired: boolean;
  visualsignsofleak: boolean;
  name: string;
  conditionalassessment: string;
  visualreview: string;
  coverUrl?: string;
  sequenceNo?: string;
}

export interface BuildingLocation {
  _id: string;
  createdat: string;
  count: number;
  createdby: string;
  description: string;
  editedat: string;
  lasteditedby: string;
  name: string;
  parentid: string;
  parenttype: string;
  type: string;
  url: string;
  sections: Section[];
  invasiveSections: Section[];
  address?: string;
  isInvasive: boolean;
  sequenceNo?: string;
}
