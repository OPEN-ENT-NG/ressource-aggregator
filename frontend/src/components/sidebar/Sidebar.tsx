import React, { useEffect, useRef } from "react";

import "./Sidebar.scss";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HomeIcon from "@mui/icons-material/Home";
import LaptopIcon from "@mui/icons-material/Laptop";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import { redirect, useLocation, useSearchParams } from "react-router-dom";

import { SidebarIcon } from "../sidebar-icon/SidebarIcon";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  toggleSidebar,
}) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        sidebarOpen
      ) {
        toggleSidebar();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`} ref={sidebarRef}>
      <div className="icons-container">
        <SidebarIcon
          action={() => redirect("/")}
          icon={<HomeIcon />}
          name="Accueil"
          selected={location.pathname === "/"}
        />
        <SidebarIcon
          action={() => console.log(2)}
          icon={<StarIcon />}
          name="Favoris"
          selected={location.pathname === "/favorites"}
        />
        <SidebarIcon
          action={() => console.log(3)}
          icon={<SchoolIcon />}
          name="Manuels"
          selected={
            location.pathname === "/search" &&
            searchParams.get("type") === "manuals"
          }
        />
        <SidebarIcon
          action={() => console.log(4)}
          icon={<LaptopIcon />}
          name="Ressources"
          selected={
            location.pathname === "/search" &&
            searchParams.get("type") === "resources"
          }
        />
        <SidebarIcon
          action={() => console.log(5)}
          icon={<BookmarkIcon />}
          name="Signets"
          selected={location.pathname === "/signets"}
        />
        <SidebarIcon
          action={() => console.log(6)}
          icon={<MenuBookIcon />}
          name="CDI"
        />
      </div>
    </div>
  );
};
