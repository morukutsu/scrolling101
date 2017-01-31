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

const MIDDLE_X          = 640 / 2;
const MIDDLE_Y          = 360 / 2;
const DEAD_ZONE_OFFSET  = 100;
const RESOLUTION_SPEED  = 5;

const INDEX_X = 0;
const INDEX_Y = 1;

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
            // center the character on the screen
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
    (characterX, characterY) => {
        return {
            x: deadZoneScrollFunc(characterX, INDEX_X, MIDDLE_X, false),
            y: deadZoneScrollFunc(characterY, INDEX_Y, MIDDLE_Y, false),
        };
    },

    (characterX, characterY) => {
        return {
            x: deadZoneScrollFunc(characterX, INDEX_X, MIDDLE_X, true, -DEAD_ZONE_OFFSET),
            y: deadZoneScrollFunc(characterY, INDEX_Y, MIDDLE_Y, true, -DEAD_ZONE_OFFSET),
        };
    },
];

const lines = [
    {
        lines: [
            [640 / 2 - 100, 360 / 2 - 100, 640 / 2 - 100, 360 / 2 + 100],
            [640 / 2 + 100, 360 / 2 - 100, 640 / 2 + 100, 360 / 2 + 100],
            [640 / 2 - 100, 360 / 2 - 100, 640 / 2 + 100, 360 / 2 - 100],
            [640 / 2 - 100, 360 / 2 + 100, 640 / 2 + 100, 360 / 2 + 100],
        ]
    },
    {
        lines: [
            [640 / 2 - 100, 360 / 2 - 100, 640 / 2 - 100, 360 / 2 + 100],
            [640 / 2 + 100, 360 / 2 - 100, 640 / 2 + 100, 360 / 2 + 100],
            [640 / 2 - 100, 360 / 2 - 100, 640 / 2 + 100, 360 / 2 - 100],
            [640 / 2 - 100, 360 / 2 + 100, 640 / 2 + 100, 360 / 2 + 100],
        ]
    },
];


export default { update, scrollingFunctions, map, lines };
