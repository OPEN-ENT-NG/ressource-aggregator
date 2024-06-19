import { Resource } from "./Resource.model";
import { Textbook } from "./Textbook.model";

export interface ExternalResourceD extends Textbook {}

export interface ExternalResource extends Resource {
  date: number;
  favoriteId?: string;
  id: string | number;
  link: string;
  structure_name: string;
  structure_uai: string;
  user?: string;
}
