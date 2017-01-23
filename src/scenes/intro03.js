const EMPTY_TILE = 40;
const e = EMPTY_TILE;

const map =
    [
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e, e, e, e, e, e, e, e, e, e, e],
        [1, 9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  17, e, e, e, e, e, e, e, e, e, e],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18, e, e, e, e, e, e, e, e, e, e],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18, e, e, e, e, e, e, e, e, e, e],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18, e, e, e, e, e, e, e, e, e, e],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18, e, e, e, e, e, e, e, e, e, e],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18, e, e, e, e, e, e, e, e, e, e],
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
let scrollX = 0;
let scrollingState = 0;
let offset = 0;
let oldCharacterX;
let direction = 0;

const scrollingFunctions = [
    (characterX, characterY) => {
        if (!isInit) {
            scrollX = MIDDLE - characterX;
            oldCharacterX = characterX;
            isInit = true;
        }

        if (scrollingState == STATE_DEAD_ZONE) {
            let screenX = characterX + scrollX;

            if (screenX > MIDDLE + DEAD_ZONE_OFFSET ||
                screenX < MIDDLE - DEAD_ZONE_OFFSET )
            {
                scrollingState = STATE_CATCHING_UP;
                direction      = Math.sign(screenX - MIDDLE);
                offset         = DEAD_ZONE_OFFSET;
            }

        } else {
            scrollX = MIDDLE - characterX + (offset * direction);

            if (offset > 0) {
                offset = offset - RESOLUTION_SPEED;
            }

            const isMoving = Math.abs(oldCharacterX - characterX) >= 0.1;
            if (!isMoving) {
                scrollingState = STATE_DEAD_ZONE;
            }
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
