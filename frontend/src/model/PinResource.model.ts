export interface PinResource {
  _id: string;
  id: string;
  pinned_title: string;
  pinned_description: string;
  source: string;
  structure_owner: string;
  structure_children: string[];
} // minimal model for PinResource
