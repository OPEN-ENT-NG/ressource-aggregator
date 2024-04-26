import React, {useState, useEffect} from "react";
import { Column, Grid } from "@edifice-ui/react";
import "./ListCard.scss";


interface ListCardProps {
    title: string;
    width: string;
    color: string;
    margin: string;
    components?: any[];
}


export const ListCard: React.FC<ListCardProps> = ({ 
    title,
    width, 
    color, 
    margin, 
    components
}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const showComponent = (component: any, index: number) => {
        if(windowWidth<768 && index>3){}
        else if(windowWidth<1280 && index>3){}
        else if (index>5){}
        else {return component;}
    }
    
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
                    <a>Voir plus</a>
                )}
        </div>
        <Grid>     
            {components && components.map((component, index) => (       
                showComponent(component, index)
            ))}
        </Grid>
        </div>
    );
};