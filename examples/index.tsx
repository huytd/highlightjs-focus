import * as React from 'react';
import { render } from 'react-dom';
import hljs from 'highlight.js';
import { LineFocusPlugin } from '../dist/main';

const CODE = `const a = 10;
const b = 15;

const fn = (a, b) => {
    return a * b + 10;
};

console.log("hello!);`;

const App = () => {
    hljs.addPlugin(new LineFocusPlugin({
        normalStyle: {
            background: "#ff0"
        },
        focusedStyle: {
            background: "#f00",
        },
        unfocusedStyle: {
            opacity: "0.25"
        }
    }));

    const html = hljs.highlight(CODE, {
        language: 'js@focus=1,4:6'
    }).value;

    const htmlNoFocus = hljs.highlight(CODE, {
        language: 'js'
    }).value;

    return (
        <div>
            <div style={{ border: "1px solid #000" }}>
                <pre dangerouslySetInnerHTML={{ __html: html }}></pre>
            </div>
            <div style={{ border: "1px solid #000" }}>
                <pre dangerouslySetInnerHTML={{ __html: htmlNoFocus }}></pre>
            </div>
        </div>
    )
};

render(<App/>, document.getElementById("root"));