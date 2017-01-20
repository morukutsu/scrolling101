import Map        from '../lib/Map';
import Character  from '../lib/Character';
import SceneGraph from '../SceneGraph';

const stage    = SceneGraph.stage;

const mapW = Math.ceil((640 + 640 / 2) / 32);
const mapH = Math.ceil((360 + 360 / 2) / 32);

const EMPTY_TILE = 40;

const map = new Map('assets/art_tileset.png', 256, 256, 32, 32, mapW, mapH, EMPTY_TILE);
const character = new Character(map);

const e = EMPTY_TILE;

map.setMap(
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
);

map.setScroll(0, 0);

const update = (computeScrolling) => {
    let scroll = computeScrolling(character.x, character.y);
    map.setScroll(scroll.x, scroll.y);
    character.update(scroll);
}

const scrollingFunctions = [
    (characterX, characterY) => {
        return { x: 0, y: 0 };
    },

    (characterX, characterY) => {
        return { x: 100, y: 0 };
    },
];


export default { update, scrollingFunctions };
