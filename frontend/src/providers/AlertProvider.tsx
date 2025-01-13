import { FC, createContext, useContext, useMemo, useState } from "react";

import { AlertTypes } from "@edifice.io/react";

import { AlertProviderContextType, AlertProviderProviderProps } from "./types";

const AlertProviderContext = createContext<AlertProviderContextType | null>(
  null,
);

export const useAlertProvider = () => {
  const context = useContext(AlertProviderContext);
  if (!context) {
    throw new Error(
      "useAlertProvider must be used within a AlertProviderProvider",
    );
  }
  return context;
};

export const AlertProvider: FC<AlertProviderProviderProps> = ({ children }) => {
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertTypes>("success");

  const notify = (text: string, type: AlertTypes) => {
    setAlertText(text);
    setAlertType(type);
  };

  const value = useMemo<AlertProviderContextType>(
    () => ({
      alertText,
      setAlertText,
      alertType,
      setAlertType,
      notify,
    }),
    [alertText, alertType],
  );

  return (
    <AlertProviderContext.Provider value={value}>
      {children}
    </AlertProviderContext.Provider>
  );
};
