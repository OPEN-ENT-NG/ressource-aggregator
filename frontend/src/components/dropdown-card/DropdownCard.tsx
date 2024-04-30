import React, { RefAttributes, useEffect } from "react";
import "./Resource.scss";
import {
  Dropdown,
} from "@edifice-ui/react";
import { Resource } from "../resource/Resource";

interface DropdownCardProps {
    image: string;
    title: string;
    ownerName: string;
}

export const DropdownCard: React.FC<DropdownCardProps> = ({
    image,
    title,
    ownerName,
}) => {
    
    return (
        <Dropdown block>
            <Resource image={image} title={title} ownerName={ownerName}/>
    
            <Dropdown.Menu>
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
            <Dropdown.Item>Dropdown Item</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}