import React, {useState, useEffect} from "react";
import { Grid } from "@edifice-ui/react";
import "./ListCard.scss";
import { ListCardType } from "../../core/enum/list-card-type";
import { NbColumns } from "~/model/NbColumns";
import { NbComponents } from "~/model/NbComponents";

interface ListCardProps {
    type: ListCardType;
    title: string;
    nbColumns: NbColumns;
    nbComponent: NbComponents;
    components?: any[];
}

export const ListCard: React.FC<ListCardProps> = ({ 
    type,
    title,
    nbColumns,
    nbComponent,
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

    const NbComponents = (windowWidth: number) => {
        if (windowWidth < 768) return nbComponent.sm;
        if (windowWidth < 1280) return nbComponent.md;
        return nbComponent.lg;
    }

    const NbColumns = (windowWidth: number) => {
        if (windowWidth < 768) return nbColumns.sm;
        if (windowWidth < 1280) return nbColumns.md;
        return nbColumns.lg;
    }

    const tooMuchComponents = (components: any[]) => {
        return components.length > NbComponents(windowWidth);
    };

    const showComponent = (component: any, index: number) => {
        if (index < NbComponents(windowWidth)) {
            return component;
        }
    };
    
    return (
        <div className={`list-card ${type}`}>
        <div className="list-card-header">
            <span className="title">{title}</span>
            {components && tooMuchComponents(components) && (
                    <a className="right-button">Voir plus</a>
                )}
        </div>
        <Grid className={`grid-${NbColumns(windowWidth)}`}>     
            {components && components.map((component, index) => (       
                showComponent(component, index)
            ))}
        </Grid>
        </div>
    );
};