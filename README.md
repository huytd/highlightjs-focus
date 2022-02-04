```
js@focus=5,8:12,14
```

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