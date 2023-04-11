import {Resource} from "./resource.model";
import {model} from "entcore";

export interface IResourceBody {
    authors: string[];
    date: number;
    description: string;
    disciplines: string[];
    displayTitle: string;
    document_types: string[];
    editors: string[];
    id: string;
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
    _id: string;
    user: string;
    hash: number;
}

export class ResourceBody {
    private _authors: string[];
    private _date: number;
    private _description: string;
    private _disciplines: string[];
    private _displayTitle: string;
    private _document_types: string[];
    private _editors: string[];
    private _id: string;
    private _image: string;
    private _levels: string[];
    private _link: string;
    private _plain_text: string[];
    private _source: string;
    private _title: string;
    private _action: object;
    private _structure_name: string;
    private _structure_uai: string;
    private _display_structure_name?: boolean;
    private _user?: string;
    private _id_info: string;
    private _hash: number;

    constructor(data: any) {
        this._id = (data.source == "fr.openent.mediacentre.source.Signet") ? data._id : data.id;
        this._authors = data.authors ? data.authors : [];
        this._date = data.date;
        this._description = data.description;
        this._disciplines = data.disciplines;
        this._displayTitle = data.displayTitle;
        this._document_types = data.document_types;
        this._editors = data.editors ? data.editors : [model.me.username];
        this._image = data.image;
        this._levels = data.levels;
        this._link = (data.source == "fr.openent.mediacentre.source.Signet") ? data.link : data.url;
        this._plain_text = data.plain_text;
        this._source = data.source;
        this._title = data.title;
        this._action = data.action;
        this._structure_name = data.structure_name;
        this._structure_uai = data.structure_uai;
        this._display_structure_name = data.display_structure_name;
        this._user = data.user;
        this._id_info = (data.source == "fr.openent.mediacentre.source.Signet") ? data.id : data.id_info;
        this._hash = data.hash;
    }

    toJson(): IResourceBody {
        return {
            _id: this.id,
            authors: this.authors ? this.authors : [],
            date: this.date,
            description: this.description,
            disciplines: this.disciplines,
            displayTitle: this.displayTitle,
            editors: this.editors,
            image: this.image,
            levels: this.levels,
            link: this.link,
            plain_text: this.plain_text,
            source: this.source,
            title: this.title,
            action: this.action,
            structure_name: this.structure_name,
            structure_uai: this.structure_uai,
            display_structure_name: this.display_structure_name,
            user: this.user,
            id: this.id_info,
            document_types: this.document_types ? this.document_types : ["Signet"],
            hash: this.hash
        }
    }

    get authors(): string[] {
        return this._authors;
    }

    set authors(value: string[]) {
        this._authors = value;
    }

    get date(): number {
        return this._date;
    }

    set date(value: number) {
        this._date = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get disciplines(): string[] {
        return this._disciplines;
    }

    set disciplines(value: string[]) {
        this._disciplines = value;
    }

    get displayTitle(): string {
        return this._displayTitle;
    }

    set displayTitle(value: string) {
        this._displayTitle = value;
    }

    get document_types(): string[] {
        return this._document_types;
    }

    set document_types(value: string[]) {
        this._document_types = value;
    }

    get editors(): string[] {
        return this._editors;
    }

    set editors(value: string[]) {
        this._editors = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get image(): string {
        return this._image;
    }

    set image(value: string) {
        this._image = value;
    }

    get levels(): string[] {
        return this._levels;
    }

    set levels(value: string[]) {
        this._levels = value;
    }

    get link(): string {
        return this._link;
    }

    set link(value: string) {
        this._link = value;
    }

    get plain_text(): string[] {
        return this._plain_text;
    }

    set plain_text(value: string[]) {
        this._plain_text = value;
    }

    get source(): string {
        return this._source;
    }

    set source(value: string) {
        this._source = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get action(): object {
        return this._action;
    }

    set action(value: object) {
        this._action = value;
    }

    get structure_name(): string {
        return this._structure_name;
    }

    set structure_name(value: string) {
        this._structure_name = value;
    }

    get structure_uai(): string {
        return this._structure_uai;
    }

    set structure_uai(value: string) {
        this._structure_uai = value;
    }

    get display_structure_name(): boolean {
        return this._display_structure_name;
    }

    set display_structure_name(value: boolean) {
        this._display_structure_name = value;
    }

    get user(): string {
        return this._user;
    }

    set user(value: string) {
        this._user = value;
    }

    get id_info(): string {
        return this._id_info;
    }

    set id_info(value: string) {
        this._id_info = value;
    }

    get hash(): number {
        return this._hash;
    }

    set hash(value: number) {
        this._hash = value;
    }
}