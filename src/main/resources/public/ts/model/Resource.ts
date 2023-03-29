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
    structure_name: string;
    structure_uai: string;
    display_structure_name?: boolean;
    _id?: string;
}

// export class ResourceModel {
//     authors: string[];
//     date: number;
//     description: string;
//     disciplines: string[];
//     displayTitle: string;
//     document_types: string[];
//     editors: string[];
//     hash: number;
//     id: string;
//     favorite?: boolean;
//     image: string;
//     levels: string[];
//     link: string;
//     plain_text: string[];
//     source: string;
//     title: string;
//     action: object;
//     structure_name: string;
//     structure_uai: string;
//     display_structure_name?: boolean;
//     _id?: string;
//
//     user?: string;
//
//     build(data: Resource): ResourceModel {
//         this.id = data.id;
//         this.authors = data.authors;
//         this.date = data.date;
//         this.description = data.description;
//         this.disciplines = data.disciplines;
//         this.displayTitle = data.displayTitle;
//         this.document_types = data.document_types;
//         this.editors = data.editors;
//         this.hash = data.hash;
//         this.favorite = data.favorite;
//         this.image = data.image;
//         this.levels = data.levels;
//         this.link = data.link;
//         this.plain_text = data.plain_text;
//         this.source = data.source;
//         this.title = data.title;
//         this.action = data.action;
//         this.structure_name = data.structure_name;
//         this.structure_uai = data.structure_uai;
//         this.display_structure_name = data.display_structure_name;
//         this._id = data._id;
//         this.user = data.user;
//
//         return this;
//     }
// }