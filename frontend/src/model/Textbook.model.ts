import { Resource } from "./Resource.model";

export interface TextbookD extends Resource {
  date: number;
  structure_name: string;
  structure_uai: string;
  user: string;
  _id?: string;
  url?: string;
}

export interface Textbook extends Resource {
  link: string;
  id: string | number;
  date: number;
  favoriteId?: string;
  structure_name: string;
  structure_uai: string;
  user?: string;
}
