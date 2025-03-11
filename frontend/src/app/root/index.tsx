import { Layout, LoadingScreen, useEdificeClient } from "@edifice.io/react";
import { Outlet, useRouteError } from "react-router-dom";
import { PageError } from "~/components/page-error";
function Root() {
  const { init } = useEdificeClient();
  const error = useRouteError();

  if (!init) return <LoadingScreen position={false} />;

  if (error)
    return (
      <Layout>
        <PageError />
      </Layout>
    );

  return init ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : null;
}

export default Root;
