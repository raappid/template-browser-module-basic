
import {Skin} from "./Skin";
import {createElement} from "./utils/dom";
import {UIElement} from "./UIElement";

export abstract class Component extends UIElement
{

    private _skinElementName:string;

    private _skinElement:Skin;

    skinParts:any;

    createdCallback():void {
        super.createdCallback();
    }


    detachedCallback():void {
        this.detachSkin();
    }

    setSkinElement(value:string) {

        if(this._skinElementName !== value)
        {
            this._skinElementName = value;

            if(this.initialized)
                this.validateSkinChange();
        }
    }

    partAdded(id:string, instance:any):void {
        //Override this method to add functionality to various skin component
    };

    partRemoved(id:string, instance:any):void {
        //Override this method to add functionality to various skin component
    };


    protected createChildren():void {
        this.validateSkinChange();
    }

    protected validateSkinChange(){

        if (this._skinElement)
             this.detachSkin();

        this.attachSkin();
    }

    private attachSkin():void {

        if(this._skinElementName && this._skinElementName !== "")
        {
            this._skinElement = createElement(this._skinElementName) as Skin;
            super.appendChild(this._skinElement);
            this.findSkinParts();
            this.validateSkinState();
        }
    }

    protected validateSkinState(){

    }

    private detachSkin():void {
        if(this._skinElement)
        {
            this.clearSkinParts();
            this.removeChild(this._skinElement);
        }
    }

    protected findSkinParts() {
        if (this._skinElement) {
            for (var id in this.skinParts) {
                var skinPart = this.skinParts[id];
                var skinPartFound = false;

                var skinPartElement:HTMLElement = this._skinElement.getSkinPartByID(id);

                if (skinPartElement) {
                    skinPartFound = true;
                    this[skinPart.key] = skinPartElement;
                    this.partAdded(id, skinPartElement)
                }

                if (skinPart.required === true && !skinPartFound) {
                    throw new ReferenceError("Required Skin part not found: " + id + " in the Attached skin");
                }
            }
        }
    }

    protected clearSkinParts(){

        if (this._skinElement) {
            for (var id in this.skinParts) {
                var skinPart = this.skinParts[id];
                if(this[skinPart.key] !== null)
                {
                    this.partRemoved(id, this[skinPart.key]);
                }
            }
        }

    }


    appendChild(newChild:Node):Node {
        return null;
    }
}