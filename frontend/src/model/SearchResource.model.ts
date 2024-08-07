export interface SearchResource {
  authors?: string[];
  date?: number;
  description?: string | null;
  disciplines?: string[];
  document_types?: string[];
  editors?: string[];
  favorite?: boolean;
  id?: string | number;
  _id?: string;
  image?: string;
  levels?: string[];
  link?: string;
  url?: string;
  plain_text?: string[];
  source?: string;
  title?: string;
  favoriteId?: string;
  structure_name?: string;
  structure_uai?: string;
  is_textbook?: boolean;
  is_pinned?: boolean;
  published?: boolean;
  rights?: [];
  owner_id?: string;
  owner_name?: string;
  orientation?: boolean;
}
