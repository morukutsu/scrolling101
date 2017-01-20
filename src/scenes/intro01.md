# Part I: Basics

## Welcome!
This is a guide that anyone could use to learn about scrolling in 2D games.
It is meant to be a resource with ready-to-use code examples (in JavaScript).

Oh, and every example can be tested right here, in the browser game on the left!
The controls are very simple: press **Left** and **Right** to move, **Up** to jump!

## 1. Fixed screen
In a plateformer game, the player can move everywhere on the screen.
Sometimes, the whole level fits into a single screen (like in Bubble Bobble). In this case, there is no scrolling involved.

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

*press the Play button to run this example*

The computeScrolling(characterX, characterY) function takes two inputs: the character X coordinate (horizontal) and Y coordinate (vertical).
The output is a point describing the scrolling offset.

In this example, the output is (0, 0), which simply means that the map will be displayed at (0, 0) on the screen (top left hand corner).

Let's say the output is now (100, 0):

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
