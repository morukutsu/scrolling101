# Lerp based scrolling

In modern 2D games, another type of scrolling is popular: the lerp based scrolling.
Basic on Linear Interpolation, this method is easy to implement and is very nice looking.

## 1. Linear Interpolation
The [linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation) is a mathematical method used to create intermediate points between two values.
When drawing a straight line between two points, the interpolation function can be used to retrieve the coordinates of any the points on the line.

```js
const lerp = (start, end, amount) => {
    return start + (end - start) * amount;
}
```

The ```start``` parameter is the initial value and ```end``` the target value.
The ```amount``` parameter is a value between 0 and 1 and describes how close the output of the function will be to ```start``` or ```end```.

## 2. Applying lerp to scrolling
Ideally, the character should be centered on the screen.
With lerp, the camera should smoothly transition from the current camera position to the ideal position.

Every frame, the ```start``` parameter will take the current camera position and the ```end``` parameter will be the center of the screen.
There is one parameter left to fill, ```amount```. It defines at what speed the camera will follow the character.
Using a low value close to 0 will make the camera slow to react when the character position changes.
Experiment with different values for a different look and feel!

```js
let isInit = false;
let scrollX, scrollY;

const computeScrolling = (characterX, characterY) => {
    // Position to follow (centered camera)
    const targetX = 640 / 2 - characterX;
    const targetY = 360 / 2 - characterY;

    if (!isInit) {
        // Start with the camera centered on the character
        scrollX = targetX;
        scrollY = targetY;

        isInit = true;
    }

    // Smoothly, scrollX will transition to targetX. Same for Y.
    scrollX = lerp(scrollX, targetX, 0.08);
    scrollY = lerp(scrollY, targetY, 0.08);

    return {
        x: scrollX,
        y: scrollY,
    };
}
```  

[0](play)

As you can see, the code is fairly simple. Compare with the fixed scrolling below.

[1](play)

Using lerp, the camera movements are smoother and nicer for the player.
For more variety, you can combine lerp with the previous algorithms, or substitute lerp with a different [easing function](http://easings.net/).
