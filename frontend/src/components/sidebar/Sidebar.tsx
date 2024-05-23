import React, { useEffect, useRef } from "react";

import "./Sidebar.scss";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HomeIcon from "@mui/icons-material/Home";
import LaptopIcon from "@mui/icons-material/Laptop";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate(); // uniquement pour routes react, utiliser des <a> pour rediriger vers angular
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
      {/* <a href="/mediacentre#/favorite">favorite</a>
      <a href="/mediacentre#/search/plain_text">search</a>
      <a href="/mediacentre#/signet">signet</a> */}
      <div className="icons-container">
        <SidebarIcon
          action={() => navigate("/")}
          icon={<HomeIcon />}
          name="Accueil"
          selected={location.pathname === "/"}
        />
        <SidebarIcon
          action={() => navigate("/favorite")}
          icon={<StarIcon />}
          name="Favoris"
          selected={location.pathname === "/favorites"}
        />
        <SidebarIcon
          action={() => navigate("/search/plain_text")}
          icon={<SchoolIcon />}
          name="Manuels"
          selected={
            location.pathname === "/search" &&
            searchParams.get("type") === "manuals"
          }
        />
        <SidebarIcon
          action={() => navigate("/search/plain_text")}
          icon={<LaptopIcon />}
          name="Ressources"
          selected={
            location.pathname === "/search" &&
            searchParams.get("type") === "resources"
          }
        />
        <SidebarIcon
          action={() => navigate("/signet")}
          icon={<BookmarkIcon />}
          name="Signets"
          selected={location.pathname === "/signet"}
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
