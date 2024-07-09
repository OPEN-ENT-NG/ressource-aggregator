export interface PinResource {
  _id: string;
  id: string;
  source: string;
  pinned_title: string;
  pinned_descritpion?: string;
  structure_owner: string;
  structure_children: string[];
}
