import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PREF_STRUCTURE } from "~/core/const/preferences.const";
import usePreferences from "~/hooks/usePreferences";
import { SelectedStructureProviderContextType, SelectedStructureProviderProviderProps } from "./types";
import { useUser } from "@edifice-ui/react";

const SelectedStructureProviderContext = createContext<SelectedStructureProviderContextType | null>(null);

export const useSelectedStructureProvider = () => {
  const context = useContext(SelectedStructureProviderContext);
  if (!context) {
    throw new Error("useSelectedStructureProvider must be used within a SelectedStructureProviderProvider");
  }
  return context;
}

export const SelectedStructureProvider: React.FC<SelectedStructureProviderProviderProps> = ({ children }) => {
    const [idSelectedStructure, setIdSelectedStructure] = useState<string | undefined>(undefined);
    const [nameSelectedStructure, setNameSelectedStructure] = useState<string | undefined>(undefined);
    const { user } = useUser();
    const { getPreference, savePreference } = usePreferences(PREF_STRUCTURE);

    useEffect(() => {
        (async () => {
            const idPrefStructure = await getPreference();

            if (idPrefStructure) {
                setIdSelectedStructure(idPrefStructure);
                return;
            }
            if(user?.structures.length) {
                setIdSelectedStructure(user?.structures[0]);
            }
        })();
    }, [PREF_STRUCTURE]);

    useEffect(() => {
        if(nameSelectedStructure && user) {
        const index = user.structureNames.indexOf(nameSelectedStructure);
        const id = user.structures[index];
        setIdSelectedStructure(id);
        savePreference(id);
        }
    }, [nameSelectedStructure]);

    const value = useMemo<SelectedStructureProviderContextType>(
        () => ({
            nameSelectedStructure,
            setNameSelectedStructure,
            idSelectedStructure,
        }),
        [idSelectedStructure, setIdSelectedStructure],
    );

    return (
        <SelectedStructureProviderContext.Provider value={value}>
            {children}
        </SelectedStructureProviderContext.Provider>
    );
}


