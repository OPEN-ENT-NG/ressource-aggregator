export interface Pin {
  _id: string;
  id: string;
  source: string;
  pinned_title: string;
  pinned_description?: string;
  structure_owner: string;
  structure_children: string[];
  link?: string;
  url?: string;
  image?: string;
  is_textbook?: boolean;
  is_pinned?: boolean;
  is_parent?: boolean;
}
