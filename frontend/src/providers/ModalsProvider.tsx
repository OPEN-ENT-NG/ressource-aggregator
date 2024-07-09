import { FC, createContext, useContext, useMemo, useState } from "react";

import { ModalProviderContextType, ModalProviderProviderProps } from "./types";
import { ExternalResource } from "~/model/ExternalResource.model";
import { Moodle } from "~/model/Moodle.model";
import { SearchResource } from "~/model/SearchResource.model";
import { Signet } from "~/model/Signet.model";
import { Textbook } from "~/model/Textbook.model";

const ModalProviderContext = createContext<ModalProviderContextType | null>(
  null,
);

export const useModalProvider = () => {
  const context = useContext(ModalProviderContext);
  if (!context) {
    throw new Error(
      "useModalProvider must be used within a ModalProviderProvider",
    );
  }
  return context;
};

export const ModalProvider: FC<ModalProviderProviderProps> = ({ children }) => {
  const [modalResource, setModalResource] = useState<
    Textbook | Signet | ExternalResource | Moodle | SearchResource | null
  >(null);
  const [isCreatedOpen, setIsCreatedOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const value = useMemo<ModalProviderContextType>(
    () => ({
      modalResource,
      setModalResource,
      isCreatedOpen,
      setIsCreatedOpen,
      isEditOpen,
      setIsEditOpen,
    }),
    [modalResource, isCreatedOpen, isEditOpen],
  );

  return (
    <ModalProviderContext.Provider value={value}>
      {children}
    </ModalProviderContext.Provider>
  );
};
