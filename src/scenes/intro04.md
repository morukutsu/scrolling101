# Dead Zones Part II.

## 1. Border snapping
During the catching up state, the scrolling function is always trying to center the camera on the character.
Some games does not implement this part so the character is not centered on the screen during the scrolling.
The sprite will snap to the border of the dead zone.

This technique is useful to limit the camera movements. One drawback is that less map is visible in the direction the character is moving.
It can be used in a situation in which the character is being chased by an enemy.

[0](play)

## 2. Opposite border snapping
To fix the drawback of the previous Border Snapping algorithm, instead of centering on the middle of the screen, the scrolling function can center on the border at the opposite of the character. In this case, the player can see more map at front of the character.

When using this algorithm, the camera can move a lot especially during direction changes. A lot of parameters can be adjusted to create a better effect. Reducing the dead zone size or using an easing function during the catch up phase are good ways of improvements.

[1](play)

Here is the code for these two types of scrolling.
The scrolling function is now generic for X and Y scrolling.
There are not many changes:
- the activation of the catching up part is now configurable
- the snapping point can be changed

```js
const STATE_DEAD_ZONE   = 0;
const STATE_CATCHING_UP = 1;

const MIDDLE_X          = 640 / 2;
const MIDDLE_Y          = 360 / 2;
const DEAD_ZONE_OFFSET  = 100;
const RESOLUTION_SPEED  = 5;

const INDEX_X = 0;
const INDEX_Y = 1;

// Each state variable is duplicated: one for the X scrolling function and one other for Y
let isInit               = [false, false];
let scroll               = [0, 0];
let offset               = [0, 0];
let direction            = [0, 0];
let scrollingState       = [STATE_DEAD_ZONE, STATE_DEAD_ZONE];
let oldCharacterPosition = [0, 0];

const deadZoneScrollFunc = (position, index, middle, isCatchingUp, catchUpPosition) => {
    if (!isInit[index]) {
        // Init part runing only once
        scroll[index] = middle - position; // Set character at the middle of the screen

        oldCharacterPosition[index] = position;
        isInit[index] = true;
    }

    // State machine
    if (scrollingState[index] === STATE_DEAD_ZONE) {
        let screenPos = position + scroll[index];

        // After a certain threshold the scrolling must start
        if (screenPos > middle + DEAD_ZONE_OFFSET ||
            screenPos < middle - DEAD_ZONE_OFFSET )
        {
            // Change the state machine state
            scrollingState[index] = STATE_CATCHING_UP;

            direction[index] = Math.sign(screenPos - middle);
            offset[index]    = DEAD_ZONE_OFFSET;
        }
    } else {
        // Set the character at the middle of the screen
        // but offset by some pixels on the left or on the right
        scroll[index] = middle - position + (offset[index] * direction[index]);

        if (isCatchingUp && offset[index] > catchUpPosition) {
            // Reducing the offset every frame will slowly
            // snap to the catchUpPosition
            offset[index] -= RESOLUTION_SPEED;
        }

        // When the character is moving very slowly we consider he stopped
        const isMoving = Math.abs(oldCharacterPosition[index] - position) >= 0.1;

        // When the character goes back in the dead zone, resume dead zone state
        const isChangedDirection = Math.sign(oldCharacterPosition[index] - position) === direction[index];

        if (!isMoving || isChangedDirection) {
            // Go back to the initial dead zone state
            scrollingState[index] = STATE_DEAD_ZONE;
        }

        // Save current character position for the next frame
        oldCharacterPosition[index] = position;
    }

    return scroll[index];
}

const scrollingFunctions = [
    // Border snapping
    (characterX, characterY) => {
        return {
            x: deadZoneScrollFunc(characterX, INDEX_X, MIDDLE_X, false),
            y: deadZoneScrollFunc(characterY, INDEX_Y, MIDDLE_Y, false),
        };
    },

    // Opposite border snapping
    (characterX, characterY) => {
        return {
            x: deadZoneScrollFunc(characterX, INDEX_X, MIDDLE_X, true, -DEAD_ZONE_OFFSET),
            y: deadZoneScrollFunc(characterY, INDEX_Y, MIDDLE_Y, true, -DEAD_ZONE_OFFSET),
        };
    },
];
```
