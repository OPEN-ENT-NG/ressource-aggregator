import { FC } from "react";
import { PageErrorProps } from "./types";

export const PageError: FC<PageErrorProps> = ({ isNotFoundError = false }) => {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
};
