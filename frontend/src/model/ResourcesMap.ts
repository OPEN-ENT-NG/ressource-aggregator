import { Textbook } from "./Textbook.model";
import { ExternalResource } from "./ExternalResource.model";
import { Moodle } from "./Moodle.model";
import { Signet } from "./Signet.model";
export interface ResourcesMap {
  textbooks: Textbook[];
  externalResources: ExternalResource[];
  moodle: Moodle[];
  signets: Signet[];
}
