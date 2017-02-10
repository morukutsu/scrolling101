# Welcome!

This guide was designed to teach the basics of 2D scrolling in games.
It contains many code examples that you can adapt to your own games.

Oh, and every snippet can be tested right here! Look at the browser game on the left.
Press **Left** and **Right** to move, **Up** to jump.


## 1. Fixed screen
In our little demo, the character can move anywhere on the screen. The map is quite small.
But when the world gets larger than the screen, the camera must follow the player.

Sometimes the whole level fits into a single screen (like in [Bubble Bobble](https://en.wikipedia.org/wiki/Bubble_Bobble#/media/File:Bubblebobble.png)). In this case, there is no scrolling.

Introducing our barebones scrolling function: the Fixed Screen!

```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 0,
        y: 0
    };
}
```

[0](play) (but it's not going to do anything interesting yet...)

The ```computeScrolling``` function takes two inputs:
* character X coordinate
* character Y coordinate

And the output is a point ```(x, y)``` corresponding to the scrolling offset.

Returning ```(0, 0)``` will simply draw the map at ```(0, 0)``` or the top left corner on the screen.

Let's see what happens when the output is ```(100, 0)```:

```js
const computeScrolling = (characterX, characterY) => {
    return {
        x: 100,
        y: 0
    };
}
```

[1](play) (press the play button to run the code above)

The map and the character are now translated by 100 pixels to the right.
Scroll (X, Y) actually defines the visible part of the map on the screen!
Which is somehow, the current camera position.

The map tiles and the character sprite screen coordinates are computed using a straightforward formula:
```js
const screenX = worldX + scrollX;
const screenY = worldY + scrollY;
```

Any element at the world position ```(0, 0)``` + the scrolling position ```(100, 0)``` will move its screen coordinates by 100 pixels to the right.

> Note. The code examples are in JavaScript. Primarily because they are directly used for the live demo.
> If you would like to see them in other languages (C#, C, Java... ) ping me or submit an issue / PR!
