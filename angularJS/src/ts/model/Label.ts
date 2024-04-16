import http from 'axios';
import {Mix,Selectable,Selection} from 'entcore-toolkit';

export class Label implements Selectable {
    id : number | undefined;
    label : string | undefined;
    selected : boolean = false;

    constructor(id?: number, label?: string) {
        this.id = id;
        this.label = label;
    }
    toString = () => this.label;

}

export class Labels extends Selection<Label> {

    constructor () {
        super([]);
    }

    async sync (type: string): Promise<void> {
        let { data } = await http.get(`/mediacentre/${type}`);
        this.all = data.map((dataItem) => new Label(dataItem.id, dataItem.label));
    }
}