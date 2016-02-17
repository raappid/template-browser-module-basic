
import {UIElement} from "./UIElement";
import {VNode,createElement} from "./utils/dom";

export abstract class GroupBase extends UIElement
{

    private _htmlContent:Node[];

    getHTMLContent():Node[]
    {
        return this._htmlContent;
    }

    setHTMLContent(nodes:Node[]):void
    {
        this._htmlContent = nodes;

        if (this.initialized) {
            this.removeAllChildren();
            this.createChildren();
        }
    }


    protected createChildren():void {

        if(this._htmlContent)
        {
            for(var i=0; i<this._htmlContent.length; i++)
            {
                var node:Node = this._htmlContent[i];
                this.appendChild(node);
            }
        }
    }
}