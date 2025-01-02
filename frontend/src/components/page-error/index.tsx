import { useState, useEffect } from "react";

import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export const PageError = () => {
  const error = useRouteError();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (isRouteErrorResponse(error) && error.status === 404) {
      const loadComponent = async () => {
        const rawHash = window.location.hash;

        try {
          if (!rawHash.includes("#/")) {
            const { App } = await import("../../routes/app");
            setComponent(() => App);
            return;
          }

          const path = rawHash.split("#/")[1].split("#")[0];

          const routeMap: Record<
            string,
            () => Promise<{ default: React.ComponentType }>
          > = {
            search: () =>
              import("../../routes/search").then((m) => ({
                default: m.Search,
              })),
            favorites: () =>
              import("../../routes/favorites").then((m) => ({
                default: m.FavoritePage,
              })),
            textbook: () =>
              import("../../routes/textbook").then((m) => ({
                default: m.TextbookPage,
              })),
            resources: () =>
              import("../../routes/resources").then((m) => ({
                default: m.ResourcePage,
              })),
            signets: () =>
              import("../../routes/signets").then((m) => ({
                default: m.SignetPage,
              })),
          };

          if (path in routeMap) {
            const module = await routeMap[path]();
            setComponent(() => module.default);
          } else {
            const { App } = await import("../../routes/app");
            setComponent(() => App);
          }
        } catch (e) {
          console.error("Failed to load component:", e);
          const { App } = await import("../../routes/app");
          setComponent(() => App);
        }
      };

      loadComponent();
    }
  }, [error]);

  if (isRouteErrorResponse(error) && error.status === 404 && Component) {
    return <Component />;
  }

  if (isRouteErrorResponse(error) && error.status === 404) {
    return null;
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error instanceof Error ? error.message : "Unknown error"}</i>
      </p>
    </div>
  );
};

export default PageError;
