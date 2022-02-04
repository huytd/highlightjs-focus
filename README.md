# Highlight.js Focus Plugin

This plugin provide the ability to highlight a focused line when using Highlight.js

To use, first, register this plugin with `addPlugin` command:

```js
hljs.addPlugin(new LineFocusPlugin({
    focusedStyle: {
        borderLeft: "2px solid #78e08f55",
        background: "#78e08f05",
        padding: "2px",
        paddingLeft: "10px",
    },
    unfocusedStyle: {
        borderLeft: "2px solid transparent",
        paddingLeft: "10px",
        opacity: "0.5",
        filter: "grayscale(1)"
    }
}));
```

Then in your code, or in your markdown source, add the language with the format:

```
<language>@focus=<lines>
```

For example:

```
js@focus=5,8:12,14
```