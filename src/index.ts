import { BeforeHighlightContext, HighlightResult } from 'highlight.js';

export interface LineFocusOptions {
    normalStyle?: Partial<CSSStyleDeclaration>,
    focusedStyle?: Partial<CSSStyleDeclaration>,
    unfocusedStyle?: Partial<CSSStyleDeclaration>
};

export class LineFocusPlugin {
    currentAttribute: string = "";
    options?: LineFocusOptions;

    constructor(options?: LineFocusOptions) {
        this.options = options;
    }

    'before:highlight'(context: BeforeHighlightContext) {
        if (context.language.indexOf("@")) {
            let [lang, attr] = context.language.split('@');
            context.language = lang;
            this.currentAttribute = attr ?? "";
        }
    }

    getStyle(style?: any): string {
        if (!style) return "";
        return Object.keys(style).reduce((acc, key) => (
            acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
        ), '');
    }

    getFocusedLines(input: string): number[] {
        const [command, param] = input.trim().split('=');
        let result: number[] = [];
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
        result = result.filter(n => n > 0 && !isNaN(n)).sort((a, b) => a - b);
        return [...new Set(result)];
    }

    'after:highlight'(result: HighlightResult) {
        if (!result.value.includes('hljs-focus-processed')) {
            const focusedLines = this.getFocusedLines(this.currentAttribute);
            const lines = result.value.split("\n").map((line, num) => {
                const focused = focusedLines.indexOf(num + 1) !== -1;
                const styles = this.getStyle(
                    focusedLines.length === 0 ?
                        this.options?.normalStyle :
                        (focused ? this.options?.focusedStyle : this.options?.unfocusedStyle)
                );
                return `<div style="${styles}">${line || " "}</div>`;
            });
            result.value = lines.join("") + "<i class='hljs-focus-processed'></i>";
        }
    }
};
