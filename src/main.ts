

import {sayHello} from "./lib/hello-hi";
import {sayHi} from "./lib/hello-hi";

export function sayHelloAndHi():string
{
    return sayHello() + " and " + sayHi();
}
