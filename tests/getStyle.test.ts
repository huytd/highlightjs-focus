import { LineFocusPlugin } from "../src";

describe('getStyle Function', () => {
    it('Should parse empty object correctly', () => {
        let plugin = new LineFocusPlugin();
        expect(plugin.getStyle({})).toEqual("");
    });

    it('Should parse style object correctly', () => {
        let plugin = new LineFocusPlugin();
        const style: Partial<CSSStyleDeclaration> = {
            background: "#F00",
            transform: "translateX(10)",
            borderLeft: "1px solid #000"
        };
        expect(plugin.getStyle(style)).toEqual("background:#F00;transform:translateX(10);border-left:1px solid #000;");
    });
});