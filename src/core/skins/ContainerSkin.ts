

import {Skin} from "../Skin";
import {element} from "../decorators";

import "../Group";

@element("r-container-skin")
export class ContainerSkin extends Skin
{

    protected render():string {
        return `<r-group id="contentGroup"></r-group>`;
    }
}