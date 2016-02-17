
import {element} from "../../../src/core/decorators";
import {skinPart} from "../../../src/core/decorators";
import {createElement} from "../../../src/core/utils/dom";

var testCompCreated:boolean = false;
@element("x-test")
class TesComp extends HTMLElement
{
    createdCallback() {
        testCompCreated = true;
    }
}

describe('decorators Spec', () => {


    describe("element decorator",()=>{


        it("should register the constructor",()=>{

            var isUNKnownElement:boolean = createElement("x-test") instanceof HTMLUnknownElement;

            expect(isUNKnownElement).toBe(false);

            expect(testCompCreated).toBe(true);
        });

        it("should throw error if element is already registered",()=>{



            var throws = function() {
                @element("x-test")
                class TesComp extends HTMLElement{}
            };

            expect(throws).toThrowError();
        });


    });

    describe("skinPart decorator",()=>{


        it("should add skinpart",()=>{


            @element("skin-part-test")
            class TesComp2 extends HTMLElement{

                @skinPart("humm")
                part1:HTMLElement;

                @skinPart("humm2")
                part2:HTMLElement;
            }


            var testComp:any = createElement("skin-part-test");

            expect(testComp.skinParts["humm"]).toBeDefined();
            expect(testComp.skinParts["humm2"]).toBeDefined();
        });


    });
});