
import parseHTML from "./utils/html-parser";
import {createElement} from "./utils/dom";
import {createVNode} from "./utils/dom";
import {Dictionary} from "./utils/Dictionary";
import {VNode} from "./utils/dom";
import {State} from "./support_classes/State";
import {camelCase} from "./utils/string-utils";
import {PropertySetter} from "./support_classes/PropertySetter";
import {GroupBase} from "./GroupBase";

export const ViewErrors = {
    ERROR_INVALID_RENDER_STRING:
        `Error: 'render' function returned invalid string,'render' function must not return empty string, null or undefined value

         Please make sure your view has implemented the 'render' function properly. `,

    ERROR_MULTIPLE_NODES_FOUND:
        `Error: Multiple nodes found during rendering,'render' function must return string with one root node.

         Please make sure your view has implemented the 'render' function properly. `,
};

var viewCache:Dictionary<string,{vnodes:VNode[],states:VNode}> = new Dictionary<string,{vnodes:VNode[],states:VNode}>();

export abstract class ViewBase extends GroupBase
{

    private _vnodes:{vnodes:VNode[],states:VNode};

    private _viewStates:State[];

    private _stateManagedProperties;

    protected refs:any;

    private _currentState:string;
    protected _tempCurrentState:string;

    createdCallback():void {
        super.createdCallback();
        this.refs = {};
        this._viewStates = [];
        this._stateManagedProperties = {};
        this.parse();
        this._currentState = "";

        this._viewStates.forEach((state:State)=>{
            if (this._stateManagedProperties.hasOwnProperty(state.name)) {

                state.propertySetters.push.apply(state.propertySetters, this._stateManagedProperties[state.name]);
            }

            state.stateGroups.forEach((stateGroup)=>{
                if (this._stateManagedProperties.hasOwnProperty(stateGroup)) {

                    state.propertySetters.push.apply(state.propertySetters, this._stateManagedProperties[stateGroup]);
                }
            })

        })
    }


    initialize():void {
        super.initialize();
        this.setCurrentState(this._tempCurrentState);
    }

    private parse():void
    {
        var vnodes:{vnodes:VNode[],states:VNode} = viewCache.get(this.tagName);
        if(!vnodes)
        {
            vnodes = {vnodes:[],states:null};

            viewCache.set(this.tagName,vnodes);

            var renderString:string = this.render();

            if(renderString === null || renderString === undefined)
            {
                renderString = "";
            }

            var elements:HTMLCollection = parseHTML(renderString);

            if(elements && elements.length > 0)
            {
                for(var i=0; i<elements.length; i++)
                {
                    var el:Element = elements.item(i);
                    var vnode:VNode = createVNode(el);

                    if(vnode.tagName.toLowerCase() === "states")
                    {
                        vnodes.states = vnode;
                    }
                    else
                    {
                        vnodes.vnodes.push(vnode);
                    }

                }
            }
        }

        this._vnodes = vnodes;

        if(this._vnodes.states && this._vnodes.states.children)
        {
            for (var j = 0; j < this._vnodes.states.children.length; j++)
            {
                var stateNode:VNode = this._vnodes.states.children[j];
                if(stateNode.attributes && stateNode.attributes["name"] !== null && stateNode.attributes["name"] !== undefined)
                {
                    var state:State = new State(stateNode.attributes["name"], stateNode.attributes["state-groups"]);
                    this._viewStates.push(state);
                }
            }
        }

        var _htmlContent:Node[] = [];
        for(var i=0; i<this._vnodes.vnodes.length; i++)
        {
            var vnode:VNode = this._vnodes.vnodes[i];

            var el:Element = createElement(vnode,this.refs,this._stateManagedProperties) as Element;

            _htmlContent.push(el);
        }

        this.setHTMLContent(_htmlContent);
    }

    hasState(stateName):boolean
    {
        for (var i = 0; i < this._viewStates.length; i++)
        {
            if (this._viewStates[i].name == stateName)
                return true;
        }
        return false;

    };

    getCurrentState():string
    {
        if(!this.initialized)
            return this._tempCurrentState;

        return this._currentState;
    }
    setCurrentState(stateName:string):void {

        var oldState = this.getState(this._currentState);

        if (this.initialized) {

            if(this.isBaseState(stateName))
            {
                this.removeState(oldState);
                this._currentState = stateName;

            }
            else
            {

                var destination = this.getState(stateName);

                this.initializeState(stateName);

                // Remove the existing state
                this.removeState(oldState);
                this._currentState = stateName;

                this.applyState(destination);
            }

        }
        else
        {
            this._tempCurrentState = stateName;
        }
    }

    protected isBaseState(stateName):boolean {
        return !stateName || stateName == "";
    }

    protected initializeState(stateName):void
    {
        var state = this.getState(stateName);

        if (state)
        {
            state.initialize();
        }
    }

    protected removeState(state){

        if(state)
        {
            for(var i = 0; i< state.propertySetters.length; i++)
            {
                state.propertySetters[i].remove();
            }
        }

    }

    protected applyState(state){

        if(state)
        {
            for(var i = 0; i< state.propertySetters.length; i++)
            {
                state.propertySetters[i].apply();
            }
        }

    }

    getState(stateName:string):State
    {
        if (!this._viewStates || this.isBaseState(stateName))
            return null;

        for (var i = 0; i < this._viewStates.length; i++)
        {
            if (this._viewStates[i].name == stateName)
                return this._viewStates[i];
        }

        throw new ReferenceError("State not Found Exception: The state '" + stateName +
            "' being set on the component is not found in the skin");
    }

    protected abstract render():string;

}