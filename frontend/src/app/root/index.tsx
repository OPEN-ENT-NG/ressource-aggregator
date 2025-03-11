import { Layout, LoadingScreen, useEdificeClient } from "@edifice.io/react";
import { Outlet } from "react-router-dom";
function Root() {
  const { init } = useEdificeClient();
  // const error = useRouteError();

  if (!init) return <LoadingScreen position={false} />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default Root;
