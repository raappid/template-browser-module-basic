
import {element} from "../../../../src/core/decorators";

import parseHTML from "../../../../src/core/utils/html-parser";

describe('html-parser Spec', () => {


    describe("parseHTML",()=>{

        it("should return collection of elements based on parsed html",()=>{

            var elements:HTMLCollection = parseHTML(`<div>
                <x-comp my-attr="what"></x-comp>
                </div>
                <div>
                <x-comp my-attr="what"></x-comp>
                </div>`)

            expect(elements.length).toEqual(2);
        });

    });
});