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

const MIDDLEX            = 640 / 2;
const MIDDLEY           = 360 / 2;
const DEAD_ZONE_OFFSET  = 100;
const DEAD_ZONE_OFFSETY = 100;
const RESOLUTION_SPEED  = 5;

let isInitX = false;
let isInitY = false;
let scrollingStateX = STATE_DEAD_ZONE;
let scrollingStateY = STATE_DEAD_ZONE;
let scrollX, offsetX, oldCharacterX, directionX;
let scrollY, offsetY, oldCharacterY, directionY;

const scrollFuncX = (characterX, characterY) => {
    if (!isInitX) {
        // Init part runing only once
        scrollX       = MIDDLEX - characterX; // Set character at the middle of the screen

        oldCharacterX = characterX;
        isInitX        = true;
    }

    // State machine
    if (scrollingStateX === STATE_DEAD_ZONE) {
        let screenX = characterX + scrollX;

        // After a certain threshold the scrolling must start
        if (screenX > MIDDLEX + DEAD_ZONE_OFFSET ||
            screenX < MIDDLEX - DEAD_ZONE_OFFSET )
        {
            // Change the state machine state
            scrollingStateX = STATE_CATCHING_UP;

            directionX      = Math.sign(screenX - MIDDLEX);
            offsetX         = DEAD_ZONE_OFFSET;
        }
    } else {
        // Set the character at the middle of the screen
        // but offset by some pixels on the left or on the right
        scrollX = MIDDLEX - characterX + (offsetX * directionX);

        if (offsetX > 0) {
            // Reducing the offset every frame will slowly
            // center the character on the screen
            offsetX -= RESOLUTION_SPEED;
        }

        // When the character is moving very slowly we consider he stopped
        const isMoving = Math.abs(oldCharacterX - characterX) >= 0.1;

        // When the character goes back in the dead zone, resume dead zone state
        const isChangedDirection = Math.sign(oldCharacterX - characterX) === directionX;

        if (!isMoving || isChangedDirection) {
            // Go back to the initial dead zone state
            scrollingStateX = STATE_DEAD_ZONE;
        }

        // Save current character position for the next frame
        oldCharacterX = characterX;
    }

    return {
        x: scrollX,
        y: 0,
    };
};

const scrollFuncY = (characterX, characterY) => {
    if (!isInitY) {
        // Init part runing only once
        scrollY       = MIDDLEY - characterY; // Set character at the middle of the screen

        oldCharacterY = characterY;
        isInitY       = true;
    }

    // State machine
    if (scrollingStateY === STATE_DEAD_ZONE) {
        let screenY = characterY + scrollY;

        // After a certain threshold the scrolling must start
        if (screenY > MIDDLEY + DEAD_ZONE_OFFSETY ||
            screenY < MIDDLEY - DEAD_ZONE_OFFSETY )
        {
            // Change the state machine state
            scrollingStateY = STATE_CATCHING_UP;

            directionY      = Math.sign(screenY - MIDDLEY);
            offsetY         = DEAD_ZONE_OFFSETY;
        }
    } else {
        // Set the character at the middle of the screen
        // but offset by some pixels on the left or on the right
        scrollY = MIDDLEY - characterY + (offsetY * directionY);

        if (offsetY > 0) {
            // Reducing the offset every frame will slowly
            // center the character on the screen
            offsetY -= RESOLUTION_SPEED;
        }

        // When the character is moving very slowly we consider he stopped
        const isMoving = Math.abs(oldCharacterY - characterY) >= 0.1;

        // When the character goes back in the dead zone, resume dead zone state
        const isChangedDirection = Math.sign(oldCharacterY - characterY) === directionY;

        if (!isMoving || isChangedDirection) {
            // Go back to the initial dead zone state
            scrollingStateY = STATE_DEAD_ZONE;
        }

        // Save current character position for the next frame
        oldCharacterY = characterY;
    }

    return {
        x: 0,
        y: scrollY,
    };
};

const scrollingFunctions = [
    scrollFuncX,
    scrollFuncY,

    (characterX, characterY) => {
        return {
            x: scrollFuncX(characterX, characterY).x,
            y: scrollFuncY(characterX, characterY).y,
        };
    },

    (characterX, characterY) => {
        return {
            x: 640 / 2 - characterX,
            y: 360 / 2 - characterY,
        };
    },
];

const lines = [
    {
        lines: [
            [640 / 2 - 100, 0, 640 / 2 - 100, 360],
            [640 / 2 + 100, 0, 640 / 2 + 100, 360],
        ]
    },
    {
        lines: [
            [0, 360 / 2 - 100, 640, 360 / 2 - 100],
            [0, 360 / 2 + 100, 640, 360 / 2 + 100],
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
    {
        lines: [
            [640 / 2, 100,     640 / 2,   360 - 100],
            [200,     360 / 2, 640 - 200, 360 / 2],
        ]
    },
];


export default { update, scrollingFunctions, map, lines };
