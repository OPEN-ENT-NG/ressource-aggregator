export interface ResourceD {
  authors?: string[];
  date?: number;
  description?: string | null;
  disciplines?: string[];
  document_types?: string[];
  editors?: string[];
  favorite?: boolean;
  id?: string | number;
  image?: string;
  levels?: string[];
  link?: string;
  plain_text?: string[] | string;
  source?: string;
  title: string;
  favoriteId?: string;
  structure_name?: string;
  structure_uai?: string;
}

export interface Resource {
  authors: string[];
  disciplines: string[];
  document_types: string[];
  editors: string[];
  favorite: boolean;
  image: string;
  levels: string[];
  plain_text: string[] | string;
  source: string;
  title: string;
}