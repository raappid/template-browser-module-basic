
import {element} from "../../../src/core/decorators";
import {GroupBase} from "../../../src/core/GroupBase";
import {createElement} from "../../../src/core/utils/dom";


@element("test-group-base")
class TestGroupBase extends GroupBase
{

}
describe('GroupBase Spec', () => {


    describe("setHTMLContent",()=>{

        it("should not create the children from HTMLContent if component is not initialized",()=>{

            var groupBase:TestGroupBase = document.createElement("test-group-base") as TestGroupBase;
            groupBase.setHTMLContent([document.createElement("div"),document.createElement("div")])

            expect(this.children).toBeUndefined()
        });

        it("should create the children from HTMLContent if component is initialized",()=>{

            var groupBase:TestGroupBase = document.createElement("test-group-base") as TestGroupBase;
            groupBase.initialize();

            var div1 = document.createElement("div");
            var div2 = document.createElement("div");

            div1.id = "div1";
            div2.id = "div2";

            groupBase.setHTMLContent([div1,div2]);

            expect(groupBase.children.length).toEqual(2);
        });
    });

    describe("createChildren",()=>{


        it("should create children if htmlContent is set",()=>{

            var groupBase:TestGroupBase = document.createElement("test-group-base") as TestGroupBase;

            var div1 = document.createElement("div");
            var div2 = document.createElement("div");

            div1.id = "div1";
            div2.id = "div2";

            groupBase.setHTMLContent([div1,div2]);

            groupBase.initialize();
            expect(groupBase.children.length).toEqual(2);

        });


        it("should not recreate children if htmlContent is set an component is already initialized",()=>{

            var groupBase:TestGroupBase = document.createElement("test-group-base") as TestGroupBase;

            var div1 = document.createElement("div");
            var div2 = document.createElement("div");

            div1.id = "div1";
            div2.id = "div2";

            groupBase.setHTMLContent([div1,div2]);

            groupBase.initialize();

            var div11 = groupBase.children.item(0);

            groupBase.initialize();

            var isSameReference:boolean = div11 === groupBase.children.item(0);

            expect(isSameReference).toEqual(true);

        });
    });

});