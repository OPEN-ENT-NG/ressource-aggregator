import React from "react";
import "./SidebarIcon.scss";

interface SidebarIconProps {
  icon: React.ReactNode;
  name: string;
  action: () => void;
}

export const SidebarIcon: React.FC<SidebarIconProps> = ({
  icon,
  name,
  action,
}) => {
  return (
    <>
      <div className="sidebar-icon" onClick={action}>
        <div className="sidebar-icon-img">{icon}</div>
        <span>{name}</span>
      </div>
    </>
  );
};
