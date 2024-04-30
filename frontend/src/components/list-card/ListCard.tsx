import React, {useState, useEffect} from "react";
import { Grid } from "@edifice-ui/react";
import "./ListCard.scss";


interface ListCardProps {
    title: string;
    width: string;
    height: string;
    components?: any[];
}


export const ListCard: React.FC<ListCardProps> = ({ 
    title,
    width, 
    height,
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

    const nbComponentsToShow = () => {
        // for small and medium screen
        if (windowWidth<1280) { return 4;} // 4*1 on medium and 2*2 on small
        // for large screen
        return 6;
    }

    const tooMuchComponents = (components: any[]) => {
        return components.length > nbComponentsToShow()
    }

    const showComponent = (component: any, index: number) => {
        if(index<nbComponentsToShow()) return component
    }
    
    return (
        <div className="list-card"
        style={{
            width: width,
            height: height,
        }}
        >
        <div className="list-card-header">
            <span className="title">{title}</span>
            {components && tooMuchComponents(components) && (
                    <a className="right-button">Voir plus</a>
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