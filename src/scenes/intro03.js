const EMPTY_TILE = 40;
const e = EMPTY_TILE;

const map =
    [
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e, e, e, e, e, e, e, e, e, e],
        [e, e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e, e, e, e, e, e, e, e, e, e],
        [e, e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  1,  17,  e,  e,  e, e, e, e, e, e, e, e, e, e],
        [e, e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  1,  9,  9,  17,  e,  e, e, e, e, e, e, e, e, e, e],
        [e, e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  1,  9,  9,  9,  9, 17,  e, e, e, e, e, e, e, e, e, e],
        [1, 9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  17, e, e, e, e, e, e, e, e, e],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18, e, e, e, e, e, e, e, e, e],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18, e, e, e, e, e, e, e, e, e],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18, e, e, e, e, e, e, e, e, e],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18, e, e, e, e, e, e, e, e, e],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
    ]
;

const update = (character, map, computeScrolling) => {
    let scroll = computeScrolling(character.x, character.y);
    map.setScroll(scroll.x, scroll.y);
    character.update(scroll);
}

const STATE_DEAD_ZONE   = 0;
const STATE_CATCHING_UP = 1;

const MIDDLE           = 640 / 2;
const DEAD_ZONE_OFFSET = 100;
const RESOLUTION_SPEED = 5;

let isInit = false;
let scrollingState = STATE_DEAD_ZONE;
let scrollX, offset, oldCharacterX, direction;

const scrollingFunctions = [
    (characterX, characterY) => {
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
        } else {
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
    },

    (characterX, characterY) => {
        return {
            x: 0,
            y: 360 / 2 - characterY,
        };
    },

    (characterX, characterY) => {
        return {
            x: 640 / 2 - characterX,
            y: 360 / 2 - characterY,
        };
    },
];


export default { update, scrollingFunctions, map };
