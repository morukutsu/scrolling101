# Horizontal and Vertical scrolling

## 1. Horizontal scrolling
In several old school games, the map scrolls only in a single direction. A famous example is Super Mario Bros.
This chapter covers a simple implementation of the horizontal scrolling. And will serve as a basis for our future improvements!

Our character can move left or right and we would like to display the sprite centered horizontally on the screen.
> Little reminder: In the previous chapter, the formula used to display the screen coordinates of any sprite was the following:
```js
const screenX = characterX + scrollX
```

Using a ```scrollX``` value of ```SCREEN_WIDTH / 2```, when the character position ```characterX``` is 0, ```screenX``` will be set to the middle of the screen.

But when the character moves, the camera must follow the character. So the scrolling value is dependent of the character position.
Subtracting ```characterX``` from ```scrollX``` is a correct way to do that. When the character moves right the map moves left, creating an illusion of movement.

```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 640 / 2 - characterX, // Set the scrolling at the middle of the screen
        y: 0                     // and subtract the character position
    };
}
```

[0](play)

To understand why the character stays centered, observe the explanation below:
```
    screenX = worldX + scrollX;                 // "world to screen" coordinates formula
    screenX = worldX + (640 / 2) - characterX;  // Replace scrollX by the computeScrolling output
                                                // But characterX == worldX (true for the entity being "tracked")
    screenX = 640 / 2;                          // screenX is constant!
```


## 2. Vertical scrolling
The same logic is used for vertical scrolling:

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
And combine both for vertical and horizontal scrolling:
```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 640 / 2 - characterX,
        y: 360 / 2 - characterY
    };
}
```

[2](play) (it's starting to look like a real game!)
