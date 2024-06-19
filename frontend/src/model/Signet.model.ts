import { Resource } from "./Resource.model";

export interface SignetD extends Resource {
  archived: boolean;
  collab: boolean;
  date_creation: string;
  date_modification: string;
  published: boolean;
  orientation?: boolean;
  resource_id: string;
  owner_id: string;
  owner_name: string;
  url?: string;
  _id?: string;
  shared?: boolean;
}

export interface Signet extends Resource {
  description: string;
  date?: number;
  date_modification?: number;
  date_creation?: number;
  id: string | number;
  resource_id?: string;
  owner_id?: string;
  owner_name?: string;
  link?: string;
  url?: string;
  shared?: boolean;
  archived?: boolean;
  orientation?: boolean;
  published?: boolean;
  collab?: boolean;
}