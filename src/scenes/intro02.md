# Horizontal and Vertical scrolling

## 1. Horizontal scrolling

```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 640 / 2 - characterX,
        y: 0
    };
}
```

[0](play)

## 2. Vertical scrolling

```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 0,
        y: 360 / 2 - characterY
    };
}
```

[1](play)

## 3. Horizontal & vertical scrolling

```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 640 / 2 - characterX,
        y: 360 / 2 - characterY
    };
}
```

[2](play)
