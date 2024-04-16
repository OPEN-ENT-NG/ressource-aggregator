import React from "react";
import { Breadcrumb, SearchBar, Image, Button } from "@edifice-ui/react";
import './Header.scss'

interface HeaderProps {

}

export const Header: React.FC<HeaderProps> = () => {
    return (
        <div className="med-header">
            <div className="med-container">
                <Image src="/mediacentre/public/img/logo-mediacentre.svg" alt="logo" objectFit="contain" />
                <Breadcrumb
                    app={{
                        address: '/mediacentre',
                        display: false,
                        displayName: 'Médiacentre',
                        icon: '',
                        isExternal: false,
                        name: '',
                        scope: []
                    }}
                />
                <h3>Lycée Charles Despiau (à changer)</h3>
            </div>
            <div className="med-container">
                <SearchBar
                    onChange={function Ga(){}}
                    onClick={function Ga(){}}
                    placeholder="Rechercher une ressource"
                    size="md"
                />
                <Button
                    color="primary"
                    type="button"
                    variant="filled"
                >
                    Recherche avancée
                </Button>
            </div>
        </div>
    );
};
