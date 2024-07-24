import React, { useEffect, useState } from "react";

import { Breadcrumb, Dropdown, SearchBar, useUser } from "@edifice-ui/react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

import "./Header.scss";
import { PREF_STRUCTURE } from "~/core/const/preferences.const";
import usePreferences from "~/hooks/usePreferences";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [searchValue, setSearchValue] = React.useState("");
  const navigate = useNavigate();

  const search = () => {
    navigate("/search?query=" + searchValue);
  };

  const { getPreference, savePreference } = usePreferences(PREF_STRUCTURE);

  const { user } = useUser();

  const [indexSelectedStructure, setIndexSelectedStructure] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const indexPrefStructure = await getPreference();

      if (indexPrefStructure) {
        setIndexSelectedStructure(indexPrefStructure);
        return;
      }
      setIndexSelectedStructure(0);
    })();
  }, [PREF_STRUCTURE]);

  const handleSavePreference = async (structureName: string) => {
    const index = user?.structureNames.indexOf(structureName);
    await savePreference(index);
    setIndexSelectedStructure(index);
  };

  return (
    <div className="med-header">
      <div className="med-header-container med-menu">
        <div className="med-burger-icon sidebar-toggle">
          <MenuIcon onClick={toggleSidebar} />
        </div>
        <a href="/mediacentre">
          <Breadcrumb
            app={{
              address: "/mediacentre",
              display: false,
              displayName: "Médiacentre",
              icon: "mediacentre",
              isExternal: false,
              name: "",
              scope: [],
            }}
          />
        </a>
        {indexSelectedStructure !== undefined &&
          user?.structureNames[indexSelectedStructure] &&
          user.structureNames.length && (
            <Dropdown>
              <Dropdown.Trigger
                label={user.structureNames[indexSelectedStructure]}
              />
              <Dropdown.Menu>
                {[...user.structureNames].sort().map((structureName, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => {
                      handleSavePreference(structureName);
                    }}
                  >
                    {structureName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
      </div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            search();
          }
        }}
        className="med-header-container med-search-bar"
      >
        <SearchBar
          isVariant={false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchValue(e.target.value)
          }
          onClick={() => search()}
          placeholder="Rechercher une ressource"
          size="md"
        />
      </div>
    </div>
  );
};
