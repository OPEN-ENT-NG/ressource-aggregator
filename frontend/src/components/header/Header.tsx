import React from "react";

import { Breadcrumb, Dropdown, SearchBar, useUser } from "@edifice.io/react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

import "./Header.scss";
import { useSelectedStructureProvider } from "~/providers/SelectedStructureProvider";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [searchValue, setSearchValue] = React.useState("");
  const navigate = useNavigate();

  const search = () => {
    navigate("/search?query=" + searchValue);
  };

  const { user } = useUser();

  const { nameSelectedStructure, setNameSelectedStructure } =
    useSelectedStructureProvider();

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
        {user && user.structures.length > 1 ? (
          <Dropdown>
            <Dropdown.Trigger
              className="dropdown-toggle med-header-structure"
              label={nameSelectedStructure}
            />
            <Dropdown.Menu>
              {[...user.structureNames].sort().map((structureName, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => {
                    setNameSelectedStructure(structureName);
                  }}
                >
                  {structureName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <div className="med-header-structure">{nameSelectedStructure}</div>
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
