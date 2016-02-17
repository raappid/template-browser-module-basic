
import {element} from "../../../src/core/decorators";
import {UIElement} from "../../../src/core/UIElement";

describe('UIElement Spec', () => {


    describe("createdCallback",()=>{

        it("should be called when Component is created",()=>{
            var testCompCreated:boolean = false;

            @element("my-test-comp")
            class TestComp extends UIElement
            {
                createdCallback() {
                    testCompCreated = true;
                }

                attachedCallback() {
                }

                attributeChangedCallback(attrName:string, oldVal:string, newVal:string) {
                }
            }
            var testComp = document.createElement("my-test-comp") as UIElement;

            expect(testCompCreated).toBe(true);
        });
    });


    describe("setAttribute",()=>{

        it("should call function with setAttributeProperty if the method is found on the UIElement",(done)=>{

            @element("my-test-comp-set-attr")
            class TestComp extends UIElement
            {
                setAttrProp(value:string):void
                {
                    expect(value).toEqual("humm");
                    done()
                }
            }

            var testComp = document.createElement("my-test-comp-set-attr") as UIElement;
            testComp.setAttribute("attr-prop","humm");

        });
    });

    describe("attachedCallback",()=>{

        it("should be called when component is attached",(done)=>{

            @element("my-test-comp1")
            class TestComp extends UIElement
            {
                createdCallback() {
                }

                attachedCallback() {
                    super.attachedCallback();
                    done()
                }

                attributeChangedCallback(attrName:string, oldVal:string, newVal:string) {
                }
            }

            var testComp = document.createElement("my-test-comp1") as UIElement;
            document.body.appendChild(testComp);

        });
    });

    describe("attributeChangedCallback",()=>{

        it("should be called when attribute is set",(done)=>{

            @element("my-test-comp2")
            class TestComp extends UIElement
            {
                attributeChangedCallback(attrName:string, oldVal:string, newVal:string) {


                    super.attributeChangedCallback(attrName,oldVal,newVal);
                    expect(attrName).toEqual("my-attr");
                    expect(newVal).toEqual("humm");
                    done();
                }
            }

            var testComp = document.createElement("my-test-comp2");
            testComp.setAttribute("my-attr","humm");

        });

        it("should be called when attribute is changed",(done)=>{

            var valueSet:boolean = false;
            @element("my-test-comp3")
            class TestComp extends UIElement
            {
                attributeChangedCallback(attrName:string, oldVal:string, newVal:string) {


                    if(valueSet)
                    {
                        expect(attrName).toEqual("my-attr");
                        expect(oldVal).toEqual("humm");
                        expect(newVal).toEqual("humm2");
                        done();
                    }
                    else
                    {
                        valueSet = true;
                    }

                }
            }

            var testComp = document.createElement("my-test-comp3");
            testComp.setAttribute("my-attr","humm");
            testComp.setAttribute("my-attr","humm2");
        });
    });
});