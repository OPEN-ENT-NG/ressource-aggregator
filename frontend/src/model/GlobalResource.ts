import { ExternalResource } from "./ExternalResource.model";

export interface GlobalResourceD extends ExternalResource {}

export interface GlobalResource extends ExternalResource {
  _id: string;
  profiles: string[];
}
