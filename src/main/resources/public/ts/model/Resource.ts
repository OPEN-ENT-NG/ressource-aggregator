export interface Resource {
    authors: string[];
    date: number;
    description: string;
    disciplines: string[];
    displayTitle: string;
    document_types: string[];
    editors: string[];
    hash: number;
    id: string;
    favorite?: boolean;
    image: string;
    levels: string[];
    link: string;
    plain_text: string[];
    source: string;
    title: string;
    action: object;
}