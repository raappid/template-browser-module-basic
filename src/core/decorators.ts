
var webComponents = require("document-register-element");

declare var document:any;

export function element(name: string):ClassDecorator {
    return (constructor: Function) => {

        document.registerElement(name,constructor);
    }
}

export function skinPart(id:string,required:boolean = false):PropertyDecorator{

    return function (target: any, key: string):void {
        if(!target.skinParts)
            target.skinParts = {};

        target.skinParts[id] = {required:true,key:key};
    }
}