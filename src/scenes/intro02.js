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

const scrollingFunctions = [
    (characterX, characterY) => {
        return {
            x: 640 / 2 - characterX,
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

const lines = [
    {
        lines: [
            [640 / 2, 0, 640 / 2, 360],
        ]
    },
    {
        lines: [
            [0, 360 / 2, 640, 360 / 2],
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
