import { ID } from "edifice-ts-client";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";

import "./index.css";

// const ExportModal = lazy(async () => await import("~/features/export-modal"));

export interface AppProps {
  _id: string;
  created: Date;
  description: string;
  map: string;
  modified: Date;
  name: string;
  owner: { userId: ID; displayName: string };
  shared: any[];
  thumbnail: string;
}

export const App = () => {
  console.log("i am in app user");
  const location = useLocation();
  console.log("location : ", location);
  const params = useParams();
  console.log("params : ", params);
  const [searchParams] = useSearchParams();
  console.log("query : ", searchParams.get("type"));
  return (
    <>
      <div>coucou je suis user</div>
      <Link to={`/user`}>click to access user </Link>
      <Link to={`/info`}>click to access info </Link>
      <Link to={`/`}>click to access /</Link>
    </>
  );
};
