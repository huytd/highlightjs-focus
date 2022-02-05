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

    getFocusedLines(): number[][] {
        const [command, param] = this.currentAttribute?.trim().split('=');
        let result: number[][] = [];
        if (command === 'focus') {
            param.split(",").forEach(num => {
                if (num.indexOf(":") !== -1) {
                    let [from_s, to_s] = num.split(":");
                    let from = +from_s;
                    let to = +to_s;
                    result.push([from, to]);
                } else {
                    result.push([+num]);
                }
            });
        }
        result.sort((a, b) => a[0] - b[0]);
        return result;
    }

    'after:highlight'(result: HighlightResult) {
        const focusedLines = this.getFocusedLines();
        const lines = result.value.split("\n");

        let groups: any[] = [];
        let currentGroupId = 0;
        let currentGroup = focusedLines[currentGroupId] || null;
        let i = 1;
        let group: number[] = [];

        // Collect the unfocused and focused group
        while (i <= lines.length) {
            if (currentGroup) {
                if (i < currentGroup[0]) {
                    group.push(i);
                    i++;
                } else {
                    if (group.length) groups.push({ focus: false, group });
                    groups.push({
                        focus: true,
                        group: currentGroup
                    });
                    group = [];
                    i = currentGroup[currentGroup.length-1] + 1;
                    currentGroupId++;
                    currentGroup = focusedLines[currentGroupId] || null;
                }
            } else {
                break;
            }
        }

        // See if there is any left over group
        if (i <= lines.length) {
            groups.push({
                focus: false,
                group: [i, lines.length]
            });
        }

        // Compose every blocks
        let result_value = [];
        for (let g of groups) {
            let block = [];
            const focused = g.focus;
            let ln = [];

            // Expand group into exactly line numbers
            if (g.group.length > 1) {
                for (let i = g.group[0]; i <= g.group[1]; i++) {
                    ln.push(i);
                }
            } else {
                ln = g.group;
            }

            // From line numbers, put the line into a block
            for (let i = 0; i < ln.length; i++) {
                block.push(lines[ln[i]-1] || " ");
            }

            const blockStyle = focusedLines.length === 0 ? this.options?.normalStyle : (focused ? this.options?.focusedStyle : this.options?.unfocusedStyle);
            result_value.push(`<pre style="margin: 0;${this.getStyle(blockStyle)}">${block.join("\n")}</pre>`);
        }

        result.value = result_value.join("");
    }
};
