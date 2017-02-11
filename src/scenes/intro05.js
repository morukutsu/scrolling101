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
        [e, e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e, e, e, e, e, e, e, e, e, e],
        [e, e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  1,  9,  9,  17,  e,  e, e, e, e, e, e, e, e, e, e],
        [e, e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  e,  1,  9,  9,  9,  9, 17,  e, e, e, e, e, e, e, e, e, e],
        [1, 9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  9,  17],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18],
        [2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 18],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e, e],
    ]
;

const update = (character, map, computeScrolling) => {
    let scroll = computeScrolling(character.x, character.y);
    map.setScroll(scroll.x, scroll.y);
    character.update(scroll);
}

const lerp = (start, end, amount) => {
    return start + (end - start) * amount;
}

const easeOutQuad = (start, end, amount) => {
	return start -(end - start) * (amount) * (amount - 2);
}

let isInit = false;
let scrollX, scrollY;
let oldCharacterX, oldCharacterY;

const scrollingFunctions = [
    (characterX, characterY) => {
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
        scrollX = lerp(scrollX, targetX, 0.1);
        scrollY = lerp(scrollY, targetY, 0.1);

        oldCharacterX = characterX;
        oldCharacterY = characterY;

        return {
            x: scrollX,
            y: scrollY,
        };
    },

    (characterX, characterY) => {
        return {
            x: 640 / 2 - characterX,
            y: 360 / 2 - characterY,
        };
    },

    (characterX, characterY) => {
        // Position to follow (centered camera)
        const targetX = 640 / 2 - characterX;
        const targetY = 360 / 2 - characterY;

        if (!isInit) {
            // Start with the camera centered on the character
            scrollX = targetX;
            scrollY = targetY;
            oldCharacterX = characterX;
            oldCharacterY = characterY;
            isInit = true;
        }

        let offsetX = Math.sign(characterX - oldCharacterX) * 100;
        const isMoving = Math.abs(oldCharacterX - characterX) >= 0.1;
        if (!isMoving) {
            offsetX = 0;
        }

        // Smoothly, scrollX will transition to targetX. Same for Y.
        scrollX = lerp(scrollX, targetX - offsetX, 0.1);
        scrollY = lerp(scrollY, targetY, 0.1);

        oldCharacterX = characterX;
        oldCharacterY = characterY;

        return {
            x: scrollX,
            y: scrollY,
        };
    },
];

const lines = [
    {
        lines: [
            [640 / 2, 120,     640 / 2,   360 - 120],
            [240,     360 / 2, 640 - 240, 360 / 2],
        ]
    },
    {
        lines: [
            [640 / 2, 120,     640 / 2,   360 - 120],
            [240,     360 / 2, 640 - 240, 360 / 2],
        ]
    },
];


export default { update, scrollingFunctions, map, lines };
