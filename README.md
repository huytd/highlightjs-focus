# Highlight.js Focus Plugin

This plugin provide the ability to highlight a focused line when using Highlight.js

<img width="622" alt="image" src="https://user-images.githubusercontent.com/613943/152668852-63207574-93da-46d2-8a0d-f91b20985a44.png">

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
