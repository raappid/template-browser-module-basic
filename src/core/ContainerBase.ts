

import {Component} from "./Component";
import {skinPart} from "./decorators";
import {GroupBase} from "./GroupBase";

export abstract class ContainerBase extends Component
{

    private _htmlContent:Node[];

    @skinPart("contentGroup",false)
    contentGroup:GroupBase;


    createdCallback():void {
        super.createdCallback();
    }

    getHTMLContent():Node[]
    {
        return this._htmlContent;
    }

    setHTMLContent(nodes:Node[]):void
    {
       this._htmlContent = nodes;

       if(this.contentGroup)
       {
           this.contentGroup.setHTMLContent(this._htmlContent);
       }
    }


    partAdded(id:string, instance:any):void {
        super.partAdded(id, instance);

        if(instance === this.contentGroup)
        {
            this.contentGroup.setHTMLContent(this._htmlContent);
        }
    }


    replaceChild(newChild:Node, oldChild:Node):Node {
        if(this.contentGroup)
             return this.contentGroup.replaceChild(newChild, oldChild);
    }

    insertAdjacentElement(position:string, insertedElement:Element):Element {
        if(this.contentGroup)
            return this.contentGroup.insertAdjacentElement(position, insertedElement);
    }

    insertBefore(newChild:Node, refChild?:Node):Node {
        if(this.contentGroup)
            return this.contentGroup.insertBefore(newChild, refChild);
    }

    removeAllChildren():void {
        if(this.contentGroup)
            return this.contentGroup.removeAllChildren();
    }

    appendChildAt(element:Node, index:number):void {
        if(this.contentGroup)
            return this.contentGroup.appendChildAt(element, index);
    }

    appendChild(newChild:Node):Node {

        if(this.contentGroup)
            return this.contentGroup.appendChild(newChild);
    }

}