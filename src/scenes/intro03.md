# Dead Zones I.

## 1. What are the dead zones?
A dead zone is a small area around the screen position of the character.
When the character stays within this area, the scrolling is fixed.
Outside of the dead zone, the camera will follow the character.

A dead zone is a useful tool to prevent abrupt camera movements.
In many situations, the player is focused on the elements very close to the character.
The player does not necessarily want the camera to follow all his movements.

## 2. Theory

### a. State machine
Unfortunately, the implementation is more complex than the previous examples.
The scrolling function can be broken down in two states:
- **Dead zone state**: the character is inside the dead zone (initial state)
- **Catch-up state**: the character went outside the dead zone and the camera must start following the player

### b. Dead Zone
Inside the dead zone, the scrolling is fixed and the function must detect when the character is leaving the dead zone.
It is easier to think about the problem using screen coordinates: if the sprite goes too far from the screen center, the camera will start following the player.
When transitioning from the **dead zone state** to the **catch-up state**, the scrolling will be a bit off center. The next state job is to follow the character using our standard scrolling function and to slowly reduce the "off center offset", catching up the character position.

### c. Catch-Up
Catching up is analogous to a camera man trying to follow someone who starts running: at first the actor will be a bit off center.
However, when the camera accommodates for the speed of the runner, he will appear centered.

This function computes the scrolling position and reduces the off center offset by a constant amount every frame until it reaches zero.
When the character stops moving, the state machine goes back to the dead zone state.

## 3. The code
Here is an implementation of the horizontal scrolling with a 100 pixels dead zone:

```js
const STATE_DEAD_ZONE   = 0;
const STATE_CATCHING_UP = 1;

const MIDDLE           = 640 / 2;
const DEAD_ZONE_OFFSET = 100;
const RESOLUTION_SPEED = 5;

let isInit = false;
let scrollingState = STATE_DEAD_ZONE;
let scrollX, offset, oldCharacterX, direction;

const computeScrolling = (characterX, characterY) => {
    if (!isInit) {
        // Initialization part running only once
        scrollX       = MIDDLE - characterX; // Set character at the middle of the screen

        oldCharacterX = characterX;
        isInit        = true;
    }

    // State machine
    if (scrollingState === STATE_DEAD_ZONE) {
        let screenX = characterX + scrollX;

        // After a certain threshold the scrolling must start
        if (screenX > MIDDLE + DEAD_ZONE_OFFSET ||
            screenX < MIDDLE - DEAD_ZONE_OFFSET )
        {
            // Change the state machine state
            scrollingState = STATE_CATCHING_UP;

            direction      = Math.sign(screenX - MIDDLE);
            offset         = DEAD_ZONE_OFFSET;
        }
    } else if (scrollingState === STATE_CATCHING_UP) {
        // Set the character at the middle of the screen
        // but offset by some pixels on the left or on the right
        scrollX = MIDDLE - characterX + (offset * direction);

        if (offset > 0) {
            // Reducing the offset every frame will slowly
            // center the character on the screen
            offset -= RESOLUTION_SPEED;
        }

        // When the character is moving very slowly we consider he stopped
        const isMoving = Math.abs(oldCharacterX - characterX) >= 0.1;

        // When the character goes back in the dead zone, resume dead zone state
        const isChangedDirection = Math.sign(oldCharacterX - characterX) === directionX;

        if (!isMoving ||isChangedDirection) {
            // Go back to the initial dead zone state
            scrollingState = STATE_DEAD_ZONE;
        }

        // Save current character position for the next frame
        oldCharacterX = characterX;
    }

    return {
        x: scrollX,
        y: 0,
    };
}
```

[0](play)

The vertical version is similar, just replacing X with Y and setting MIDDLE to SCREEN_HEIGHT / 2:

[1](play)

Horizontal and vertical:

[2](play)

Compare with the version not using dead zones:

[3](play)

Experiment with both versions to feel the difference. Depending of your gameplay choices, you may prefer one or the other.
