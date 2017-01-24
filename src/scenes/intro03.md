# Dead zones

## 1. What are the dead zones?
A dead zone is a small area around the screen position of the character.
When the character is inside this area, the scrolling will be fixed.
The moment the character moves outside the dead zone, the camera will quickly catch-up and follow the character.

The dead zone is useful to limit the camera movements and reduce noise.
In some platforming sections, the player may be focused on some elements very close to the player.
In these situations, the player doesn't need to see new parts of the map at the left or right of the screen.

## 2. Theory

### a. State machine
From the explanation above, you can guess the implementation is more complex than the previous examples.
The scrolling function has two states:
- Dead zone: when the character is within the dead zone bounds
- Catch-up: the character went outside the dead zone and the camera must follow the player

### b. Dead Zone
When inside the dead zone (the initial state), the scrolling is fixed and We must detect when the character leaves the dead zone.
It is easier to think about the problem using screen coordinates: if the sprite goes too much to the left or the to the right, it's time for the camera to scroll.
When transitioning from the Dead Zone state to the Catch-Up state, the scrolling will be a bit off center. The next state job is to follow the character using our standard scrolling function and to slowly reduce the "off center offset", catching up the character position.

### c. Catch-Up
Catching up is analogous to a camera man trying to follow someone who starts running: at first the person will not be a the center of the screen.
But when the camera man managed to accommodate for the speed of the person, he will follow him perfectly.

This function computes the scrolling position and reduces the off center offset by a constant amount every frame until it is zero.
When the character stops moving, the state machine goes back to the dead zone state.

## 3. The code
Here is an implementation for an horizontal dead zone:

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
        // Init part runing only once
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

        if (!isMoving) {
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
