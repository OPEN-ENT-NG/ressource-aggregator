import { createHashRouter } from "react-router-dom";

import Root from "~/app/root";
import { PageError } from "~/components/page-error";
import "~/styles/page/home.scss";

const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        index: true,
        async lazy() {
          const { App } = await import("./app");
          return {
            Component: App,
          };
        },
      },
    ],
  },
  {
    path: "/search",
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        index: true,
        async lazy() {
          const { Search } = await import("./search");
          return {
            Component: Search,
          };
        },
      },
    ],
  },
  {
    path: "/favorites",
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        index: true,
        async lazy() {
          const { FavoritePage } = await import("./favorites");
          return {
            Component: FavoritePage,
          };
        },
      },
    ],
  },
  {
    path: "/textbook",
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        index: true,
        async lazy() {
          const { TextbookPage } = await import("./textbook");
          return {
            Component: TextbookPage,
          };
        },
      },
    ],
  },
  {
    path: "/resources",
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        index: true,
        async lazy() {
          const { ResourcePage } = await import("./resources");
          return {
            Component: ResourcePage,
          };
        },
      },
    ],
  },
  {
    path: "/signets",
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        index: true,
        async lazy() {
          const { SignetPage } = await import("./signets");
          return {
            Component: SignetPage,
          };
        },
      },
    ],
  },
  {
    path: "*",
    element: <PageError isNotFoundError />,
  },
];

// add # before roots to distinguish front roots (#/search) from back roots (/search)
export const router = createHashRouter(routes);
