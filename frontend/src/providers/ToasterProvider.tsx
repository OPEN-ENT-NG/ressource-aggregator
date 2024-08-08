import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ToasterProviderContextType, ToasterProviderProps } from "./types";
import { SearchResource } from "~/model/SearchResource.model";

const ToasterProviderContext = createContext<ToasterProviderContextType | null>(
  null,
);

export const useToasterProvider = () => {
  const context = useContext(ToasterProviderContext);
  if (!context) {
    throw new Error("useToasterProvider must be used within a ToasterProvider");
  }
  return context;
};

export const ToasterProvider: FC<ToasterProviderProps> = ({ children }) => {
  const [toasterResources, setToasterResources] = useState<
    SearchResource[] | null
  >(null);
  const [isToasterOpen, setIsToasterOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>(
    "mediacentre.signets.mine",
  );

  const isSelectable = useCallback(
    (resource: SearchResource) =>
      !!toasterResources?.find(
        (toaster) =>
          toaster.id === resource.id && toaster.source === resource.source,
      ),
    [toasterResources],
  );

  const toggleResource = useCallback(
    (resource: SearchResource) => {
      if (isSelectable(resource)) {
        setToasterResources(
          (prev) =>
            prev?.filter(
              (toaster) =>
                toaster.id !== resource.id ||
                toaster.source !== resource.source,
            ) || [],
        );
      } else {
        if (selectedTab === "mediacentre.signets.shared") {
          setToasterResources([resource]);
        } else {
          setToasterResources((prev) => [...(prev || []), resource]);
        }
      }
    },
    [isSelectable],
  );

  useEffect(() => {
    console.log("toasterResources", toasterResources);
  }, [toasterResources]);

  const resetResources = () => {
    setToasterResources(null);
  };

  useEffect(() => {
    if (toasterResources && !!toasterResources.length && !isToasterOpen) {
      setIsToasterOpen(true);
    }
  }, [toasterResources, isToasterOpen]);

  const value = useMemo<ToasterProviderContextType>(
    () => ({
      toasterResources,
      setToasterResources,
      selectedTab,
      setSelectedTab,
      isSelectable,
      toggleResource,
      isToasterOpen,
      setIsToasterOpen,
      resetResources,
    }),
    [toasterResources, isToasterOpen, selectedTab, isSelectable, toggleResource],
  );

  return (
    <ToasterProviderContext.Provider value={value}>
      {children}
    </ToasterProviderContext.Provider>
  );
};
