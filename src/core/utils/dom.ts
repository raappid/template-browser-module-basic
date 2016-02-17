

import {UIElement} from "../UIElement";
import {camelCase} from "./string-utils";
import {PropertySetter} from "../support_classes/PropertySetter";
import {trim} from "./string-utils";
import {GroupBase} from "../GroupBase";
import {titleCase} from "./string-utils";
import {ContainerBase} from "../ContainerBase";

export declare interface VNode
{
    tagName:string;
    children?:any[];
    attributes?:any;
    stateManagedAttributes?:any;
    text?:string;

}
export function createVNode(el:Element):VNode
{
    if(!el.tagName && el.nodeType === Node.TEXT_NODE){

        return {tagName:"text",text:el.textContent};
    }


    var attributes:any = {};

    var stateManagedAttributes:any= {};

    if(el.attributes){

        for(var i = 0; i < el.attributes.length; i++){
            var attr = el.attributes[i];
            if(attr.name){

                var nameAndState = attr.name.split('.');

                if(nameAndState.length == 2)
                {
                    var stateName:string = nameAndState[1].toLowerCase();
                    if(stateManagedAttributes[stateName] === undefined)
                    {
                        stateManagedAttributes[stateName] = {};
                    }

                    stateManagedAttributes[stateName][nameAndState[0]] = attr.value;
                }
                else
                {
                    var value = attr.value;
                    if(!value)
                        value = "";

                    attributes[attr.name] = attr.value;
                }

            }
        }
    }


    var output:VNode= {
        tagName:el.tagName,
        attributes:attributes,
        stateManagedAttributes:stateManagedAttributes,
        children:[]};

    for(var i = 0; i < el.childNodes.length; i++){
        var childNode:VNode = createVNode(el.childNodes[i] as HTMLElement);
        if(childNode.tagName === "text")
        {
            if(childNode.text && trim(childNode.text) !== "")
            {
                output.children.push(childNode);
            }
        }
        else
        {
            output.children.push(childNode);
        }

    }

    return output;
}

export function createElement(tag:VNode|string,refs?:any,stateManagedProperties?:any):Node
{
    var vnode:VNode;
    if(typeof tag == "string")
    {
        vnode = {tagName:(tag as string)}
    }
    else
    {
        vnode = tag as VNode;
    }

    if(vnode.tagName =="text")
        return document.createTextNode(vnode.text);


    var node:Element = document.createElement(vnode.tagName);

    if(vnode.attributes)
    {
        for (var attrName in vnode.attributes) {
            node.setAttribute(attrName, vnode.attributes[attrName])
        }
    }

    var children = vnode.children;

    if(children)
    {
        for (var i = 0; i < children.length; i++) {
            var childNode:Element = createElement(children[i],refs,stateManagedProperties) as Element;
            if (childNode) {

                if(node instanceof UIElement)
                {
                    var functionName:string = "set" + titleCase(childNode.tagName.toLowerCase());

                    if(node[functionName]) //checking if we need to transclude content
                    {
                        node[functionName]((childNode as HTMLElement).children);
                    }
                    else if(node instanceof GroupBase || node instanceof ContainerBase) //check if need to put to htmlContent
                    {
                        var _htmlContent = (node as GroupBase).getHTMLContent();

                        if(!_htmlContent)
                        {
                            _htmlContent = [];
                            (node as GroupBase).setHTMLContent(_htmlContent);
                        }

                        _htmlContent.push(childNode);
                    }
                    else
                    {
                        node.appendChild(childNode);
                    }
                }
                else
                {
                    if(!(node instanceof UIElement) && childNode instanceof UIElement)
                    {

                        (childNode as UIElement).initialize();
                    }
                    node.appendChild(childNode)
                }

            }
        }
    }

    registerRefs(refs,vnode,node);

    registerStateManagedComponent(node,stateManagedProperties,vnode.stateManagedAttributes);

    return node;
}

function registerRefs(refs:any,vnode:VNode,element:Element)
{
    if(refs && vnode.attributes.id){
        refs[vnode.attributes.id] = element;
    }
}

function registerStateManagedComponent(element:Element,stateManagedProperties:any,stateManagedAttributes:any)
{
    if(stateManagedProperties && stateManagedAttributes)
    {
        for (var stateName in stateManagedAttributes) {

            if(stateManagedProperties[stateName] === undefined)
            {
                stateManagedProperties[stateName] = [];
            }

            var attributes:any = stateManagedAttributes[stateName];

            for (var attrName in attributes) {


                var propertySetter = new PropertySetter(element,attrName,attributes[attrName])

                stateManagedProperties[stateName].push(propertySetter);
            }

        }
    }
}