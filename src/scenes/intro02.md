# Horizontal and Vertical scrolling

## 1. Horizontal scrolling
In some games, the map scrolls only in the horizontal direction. An example is Super Mario Bros. on the NES.
This chapter covers a very simple implementation of the horizontal scrolling.

Since our character can move left or right, it makes sense to display its sprite centered on the screen (horizontally).
In the previous chapter, the formula used to display the screen coordinates of any sprite was the following: ```const screenX = worldX + scrollX```.

To display the sprite at the middle, we just have to use a scrollX value of SCREEN_WIDTH / 2.
When the character position is 0, screenX will be set to the middle of the screen.

But when the character moves, the camera must follow the character. To make the scrolling dependent of the character position, subtracting characterX from scrollX will do the trick. When the character moves right, the map position moves to left.

See the full code below:

```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 640 / 2 - characterX,
        y: 0
    };
}
```

[0](play)

Here is why the character stays centered on the screen while the map moves:
```
    screenX = worldX + scrollX;                 // the world to screen position formula
    screenX = worldX + (640 / 2) - characterX;  // replace scrollX by the computeScrolling output
                                                // characterX == worldX
    screenX = 640 / 2;                          // screenX is constant!
```


## 2. Vertical scrolling
Same logic applies to vertical scrolling:

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
And combined for vertical and horizontal scrolling:
```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 640 / 2 - characterX,
        y: 360 / 2 - characterY
    };
}
```

[2](play)
