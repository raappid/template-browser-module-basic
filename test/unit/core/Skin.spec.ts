
import {Skin} from "../../../src/core/Skin";
import {element} from "../../../src/core/decorators";
import {createElement} from "../../../src/core/utils/dom";

@element("test-skin")
class TestSkin extends Skin
{

    protected render():string {
        return `<div>
        <div id="humm"></div>
        </div>`;
    }
}
describe('Skin Spec', () => {


    describe("getSkinPartByID",()=>{

        it("should return null if no element with provided id found",()=>{

            var skin:Skin = createElement("test-skin") as Skin;

            var part = skin.getSkinPartByID("test");
            expect(part).toBeNull();
        });

        it("should return HTMLElement with provided",()=>{
            var skin:Skin = createElement("test-skin") as Skin;

            var part = skin.getSkinPartByID("humm");
            expect(part).not.toBeNull();

            expect(skin.getSkinPartByID("humm") instanceof HTMLDivElement).toBe(true);
        })
    });

});