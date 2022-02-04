import { BeforeHighlightContext, HighlightResult } from 'highlight.js';

export interface LineFocusOptions {
    focusedStyle?: Partial<CSSStyleDeclaration>,
    unfocusedStyle?: Partial<CSSStyleDeclaration>
};

export class LineFocusPlugin {
    currentAttribute: string = "";
    options: LineFocusOptions;

    constructor(options?: LineFocusOptions) {
        this.options = options ?? undefined;
    }

    'before:highlight'(context: BeforeHighlightContext) {
        if (context.language.indexOf("@")) {
            let [lang, attr] = context.language.split('@');
            context.language = lang;
            this.currentAttribute = attr ?? "";
        }
    }

    getStyle(style?: object): string {
        if (!style) return "";
        return Object.keys(style).reduce((acc, key) => (
            acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
        ), '');
    }

    getFocusedLines(): number[] {
        const [command, param] = this.currentAttribute?.trim().split('=');
        let result = [];
        if (command === 'focus') {
            param.split(",").forEach(num => {
                if (num.indexOf(":") !== -1) {
                    let [from_s, to_s] = num.split(":");
                    let from = +from_s;
                    let to = +to_s;
                    result = result.concat(Array(to - from + 1).fill(0).map((_, i) => from + i));
                } else {
                    result.push(+num);
                }
            });
        }
        return result;
    }

    'after:highlight'(result: HighlightResult) {
        const focusedLines = this.getFocusedLines();
        if (!focusedLines.length) return;

        const lines = result.value.split("\n").map((line, num) => {
            const focused = focusedLines.indexOf(num+1) !== -1;
            const styles = this.getStyle(focused ? this.options?.focusedStyle : this.options?.unfocusedStyle);
            return `<div style="${styles}">${line || " "}</div>`;
        });
        result.value = lines.join("");
    }
};