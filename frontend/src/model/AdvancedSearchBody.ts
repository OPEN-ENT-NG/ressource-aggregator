import { AdvancedSearchEnum } from "../core/enum/advanced-search.enum";
import { SEARCH_TYPE } from "../core/enum/search-type.enum";

export interface IAdvancedSearchBody {
  title?: IFieldData;
  authors?: IFieldData;
  editors?: IFieldData;
  disciplines?: IFieldData;
  levels?: IFieldData;
}

export class AdvancedSearchBody implements IAdvancedSearchBody {
  private _title?: IFieldData;
  private _authors?: IFieldData;
  private _editors?: IFieldData;
  private _disciplines?: IFieldData;
  private _levels?: IFieldData;

  get title(): IFieldData | undefined {
    return this._title;
  }

  set title(value: IFieldData | undefined) {
    this._title = value;
  }

  get authors(): IFieldData | undefined {
    return this._authors;
  }

  set authors(value: IFieldData | undefined) {
    this._authors = value;
  }

  get editors(): IFieldData | undefined {
    return this._editors;
  }

  set editors(value: IFieldData | undefined) {
    this._editors = value;
  }

  get disciplines(): IFieldData | undefined {
    return this._disciplines;
  }

  set disciplines(value: IFieldData | undefined) {
    this._disciplines = value;
  }

  get levels(): IFieldData | undefined {
    return this._levels;
  }

  set levels(value: IFieldData | undefined) {
    this._levels = value;
  }

  toJson(): IAdvancedSearchBody {
    const jsonAdvancedSearch: IAdvancedSearchBody = {};

    if (this._title && this._title.value !== "")
      jsonAdvancedSearch.title = this._title.toJson();
    if (this._authors && this._authors.value !== "")
      jsonAdvancedSearch.authors = this._authors.toJson();
    if (this._editors && this._editors.value !== "")
      jsonAdvancedSearch.editors = this._editors.toJson();
    if (this._disciplines && this._disciplines.value !== "")
      jsonAdvancedSearch.disciplines = this._disciplines.toJson();
    if (this._levels && this._levels.value !== "")
      jsonAdvancedSearch.levels = this._levels.toJson();

    return jsonAdvancedSearch;
  }

  addFieldData(fieldData: FieldData, type: AdvancedSearchEnum): void {
    switch (type) {
      case AdvancedSearchEnum.title:
        this._title = fieldData;
        break;
      case AdvancedSearchEnum.author:
        this._authors = fieldData;
        break;
      case AdvancedSearchEnum.editor:
        this._editors = fieldData;
        break;
      case AdvancedSearchEnum.discipline:
        this._disciplines = fieldData;
        break;
      case AdvancedSearchEnum.level:
        this._levels = fieldData;
        break;
      default:
        break;
    }
  }

  static isIAdvancedSearchBody(object: any): boolean {
    return (
      (!!object.title && !!object.title.value) ||
      (!!object.authors && FieldData.isFieldData(object.authors)) ||
      (!!object.editors && FieldData.isFieldData(object.editors)) ||
      (!!object.disciplines && FieldData.isFieldData(object.disciplines)) ||
      (!!object.levels && FieldData.isFieldData(object.levels))
    );
  }

  static generateAdvancedSearchParam = (
    query: IAdvancedSearchBody,
    sources: string[],
  ): object => {
    return {
      state: SEARCH_TYPE.ADVANCED,
      data: query,
      event: "search",
      sources: sources,
    };
  };
}

export interface IFieldData {
  value: string;
  comparator?: string;

  toJson(): any;
}

export class FieldData implements IFieldData {
  private _value: string;
  private _comparator?: string;

  constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  get comparator(): string | undefined {
    return this._comparator;
  }

  set comparator(comparator: string | undefined) {
    this._comparator = comparator;
  }

  toJson(): any {
    const jsonFieldData: any = { value: this._value };
    if (this._comparator) jsonFieldData.comparator = this._comparator;
    return jsonFieldData;
  }

  static isFieldData(object: any): boolean {
    return !!object.value && !!object.comparator;
  }
}
