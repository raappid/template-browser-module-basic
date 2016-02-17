

import {Component} from "./Component";
import {skinPart} from "./decorators";
import {Group} from "./Group";
import {GroupBase} from "./GroupBase";
import {ContainerBase} from "./ContainerBase";

require("./skins/ContainerSkin");


export abstract class Container extends ContainerBase
{


    createdCallback():void {
        super.createdCallback();
        this.setSkinElement("r-container-skin");
    }
}