export interface InspectionReport {
  [key: string]: any;
  _id: string;
  additionalconsiderations: string;
  awe: string;
  conditionalassessment: string;
  createdat: string;
  createdby: string;
  editedat: string;
  eee: string;
  exteriorelements: string[];
  furtherinvasivereviewrequired: boolean;
  images: string[];
  lasteditedby: string | null;
  lbc: string;
  name: string;
  parentid: string;
  visualreview: string;
  visualsignsofleak: boolean;
  waterproofingelements: string[];
  invasiveimages:[];
  conclusiveimages:[];
  propowneragreed:boolean;
  invasiverepairsinspectedandcompleted:boolean;
}
