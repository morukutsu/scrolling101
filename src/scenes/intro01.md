# Basics

## Welcome!
This is a guide that anyone could use to learn about scrolling in 2D games.
It contains a rich amount of code examples that you can adapt to your own games.

Oh, and every example can be tested right here in the browser game on the left!
The controls are very simple: press **Left** and **Right** to move, **Up** to jump!

## 1. Fixed screen
In a plateformer game the player can move anywhere on the screen. When the world is larger than the screen, it is necessary for the camera to follow the player.

However, sometimes the whole level fits into a single screen (like in [Bubble Bobble](https://en.wikipedia.org/wiki/Bubble_Bobble#/media/File:Bubblebobble.png)). In this case, there is no scrolling involved.

This introduces the "Fixed screen" type of scrolling.

```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 0,
        y: 0
    };
}
```

[0](play)

The ```computeScrolling``` function takes two inputs:
* character X coordinate (horizontal)
* character Y coordinate (vertical)

The output is a point (x, y) describing the scrolling offset.

In this example, returning (0, 0), will simply display the map at (0, 0) the top left corner on the screen.

Let's see when the output is (100, 0):

```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 100,
        y: 0
    };
}
```

[1](play)

*press the Play button to run this example*

On the screen, the map tiles and the character are translated by 100 pixels to the right.
The scrolling variables (called scroll.x and scroll.y) actually define the visible part of map on the screen!

To display the map tiles and the character sprite we use a simple formula:
```js
const screenX = worldX + scrollX;
const screenY = worldY + scrollY;
```

This explains the previous example, an element at the world position (0, 0) + the scrolling position (100, 0) will move the screen position by 100 pixels to the right.
