export interface SearchResource {
  authors?: string[];
  date?: number;
  description?: string | null;
  disciplines?: string[];
  document_types?: string[];
  editors?: string[];
  favorite?: boolean;
  id?: string;
  image?: string;
  levels?: string[];
  link?: string;
  plain_text?: string[];
  source?: string;
  title?: string;
  favoriteId?: string;
  structure_name?: string;
  structure_uai?: string;
}