import { ExternalResource } from "./ExternalResource.model";
import { Moodle } from "./Moodle.model";
import { Signet } from "./Signet.model";
import { Textbook } from "./Textbook.model";

export interface SearchResultData {
  signets: Signet[];
  moodle: Moodle[];
  externals_resources: ExternalResource[] | Textbook[];
}
