import hljs from "highlight.js";
import { LineFocusPlugin } from "../src";

const CODE=`// comment

const a = 10;
const b = 15;

const c = a + b;

const sum = (a, b) => {
    return a + b;
};
// another comment
const d = sum(10, 15);`;

const STYLES = {
    normalStyle: {
        background: "green"
    },
    focusedStyle: {
        background: "red"
    },
    unfocusedStyle: {
        background: "blue"
    }
};

describe('highlightFocus process', () => {
    it('should focus correctly', () => {
        const lang = "js@focus=3:4,8:10,12";
        hljs.addPlugin(new LineFocusPlugin(STYLES));
        const html = hljs.highlight(CODE, {
            language: lang
        }).value.split("</div>").map(line => line + "</div>");

        const FOCUSED_LINES = [3,4,8,9,10,12];
        for (let line of FOCUSED_LINES) {
            expect(html[line-1].includes("background:red")).toBeTruthy();
        }
        const UNFOCUSED_LINES = [1,2,5,6,7,11];
        for (let line of UNFOCUSED_LINES) {
            expect(html[line-1].includes("background:blue")).toBeTruthy();
        }
    });

    it('show normal style for non-focus code blocks', () => {
        const lang = "js";
        hljs.addPlugin(new LineFocusPlugin(STYLES));
        const html = hljs.highlight(CODE, {
            language: lang
        }).value.split("</div>").map(line => line + "</div>");
        for (let line of html) {
            if (line.includes("<div")) {
                expect(line.includes("background:green")).toBeTruthy();
            }
        }
    });
});