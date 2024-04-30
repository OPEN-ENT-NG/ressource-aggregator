import React from "react";
import { Grid } from "@edifice-ui/react";
import "./ListCard.scss";


interface ListCardProps {
    title: string;
    width: string;
    color: string;
    margin: string;
    components?: any[];
}

const showComponent = (component: any) => {
    return component;
}

export const ListCard: React.FC<ListCardProps> = ({ 
    title,
    width, 
    color, 
    margin, 
    components
 }) => {
   return (
        <div className="list-card"
        style={{
            width: width,
            backgroundColor: color,
            margin: margin,
        }}
        >
        <div className="list-card-header">
            {title}
            {components && components.length > 1 && (
                    <button className="right-button">Voir plus</button>
                )}
        </div>
        <Grid>
            {components && components.map((component) => (       
                showComponent(component)
            ))}
        </Grid>
              
        </div>
    );
};