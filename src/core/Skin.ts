
import {ViewBase} from "./ViewBase";

export abstract class Skin extends ViewBase
{

    getSkinPartByID(id:string):HTMLElement
    {
        var part:HTMLElement = this.refs[id];

        return part ? part: null;
    }
}