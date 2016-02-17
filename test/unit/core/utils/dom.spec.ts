
import parseHTML from "../../../../src/core/utils/html-parser";
import {createVNode} from "../../../../src/core/utils/dom";
import {createElement} from "../../../../src/core/utils/dom";
import {VNode} from "../../../../src/core/utils/dom";


describe('dom Spec', () => {


    describe("createVNode",()=>{

        it("should return object with tagName 'text' if element is of type text",()=>{

            var els:HTMLCollection = parseHTML("<div my-attr='humm'>" +
                "sdfsfsfs" +
                "</div>");

            var vnode:any = createVNode(els.item(0));

            expect(vnode.children.length).toEqual(1);
            expect(vnode.children[0].tagName).toEqual("text");
            expect(vnode.children[0].text).toEqual("sdfsfsfs");


        });

        it("should return object with tagName and attributes on the element",()=>{

            var els:HTMLCollection = parseHTML("<div my-attr='humm'></div>");

            var vnode:any = createVNode(els.item(0));

            expect(vnode.tagName.toLowerCase()).toEqual("div");
            expect(vnode.attributes['my-attr']).toEqual("humm");
        });

        it("should return object with children with same format as parent",()=>{

            var els:HTMLCollection = parseHTML("<div my-attr='humm'><div my-attr='humm'></div></div>");

            var vnode:any = createVNode(els.item(0));

            expect(vnode.children.length).toEqual(1);
            expect(vnode.children[0].attributes['my-attr']).toEqual("humm");
        });

        it("should create attribute with empty string if attribute value is not present",()=>{

            var els:HTMLCollection = parseHTML("<div my-attr ></div>");

            var vnode:any = createVNode(els.item(0));
            expect(vnode.attributes['my-attr']).toEqual("");
        });

    });

    describe("createElement",()=>{

        it("should return text node if vnode has tagName 'text'",()=>{

            var els:HTMLCollection = parseHTML("<div my-attr='humm'>" +
                "sdfsfsfs" +
                "</div>");

            var vnode:any = createVNode(els.item(0));

            var node:Node = createElement(vnode.children[0]);

            var isTextNode = node instanceof Text;

            expect(isTextNode).toBe(true);

        });

        it("should create element and all its children elements in vnode",()=>{

            var els:HTMLCollection = parseHTML("<div my-attr='humm'><div my-attr='humm'></div></div>");

            var vnode:any = createVNode(els.item(0));

            var node:Node = createElement(vnode);

            expect(node.childNodes.length).toBe(1);

        });

        it("should attach attributes to parent and all the child elements",()=>{

            var els:HTMLCollection = parseHTML("<div my-attr='humm'><div my-attr='humm'></div></div>");

            var vnode:any = createVNode(els.item(0));

            var node:Node = createElement(vnode);

            expect((node as HTMLElement).getAttribute("my-attr")).toBe("humm");

            expect((node.firstChild as HTMLElement).getAttribute("my-attr")).toBe("humm");
        });

        it("should update refs array if provided",()=>{

            var els:HTMLCollection = parseHTML("<div id='what1' my-attr='humm'><div id='what2' my-attr='humm'></div></div>");

            var refs:any = {};
            var vnode:any = createVNode(els.item(0));
            var node:Node = createElement(vnode,refs);
            expect(refs["what1"]).toBeDefined();
            expect(refs["what2"]).toBeDefined()
        });

    });
});