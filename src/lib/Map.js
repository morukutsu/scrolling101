import 'pixi.js/dist/pixi.js';
const PIXI = global.PIXI;

import SceneGraph from '../SceneGraph';
const stage = SceneGraph.stage;

export default class Map {
    constructor(tilesetPath, width, height, tileW, tileH, mapW, mapH, emptyTile) {
        this.tiles = [];
        this.tileW = tileW;
        this.tileH = tileH;
        this.emptyTileId = emptyTile;
        this.baseTexture = PIXI.BaseTexture.fromImage(tilesetPath);

        // Construct array of all tiles
        for (let i = 0; i < width / tileW; i++) {
            for (let j = 0; j < height / tileH; j++) {
                let frame   = new PIXI.Rectangle(i * tileW, j * tileH, tileW, tileH);
                let texture = new PIXI.Texture(this.baseTexture, frame);

                this.tiles.push(texture);
            }
        }

        this.map = [];
        this.container = new PIXI.Container();

        // Construct map tiles
        for (let i = 0; i < mapW; i++) {
            let line = [];
            for (let j = 0; j < mapH; j++) {
                let tile = new PIXI.Sprite(this.tiles[emptyTile]);
                tile.anchor.x = 0;
                tile.anchor.y = 0;

                tile.position.x = i * tileW;
                tile.position.y = j * tileH;

                this.container.addChild(tile);

                line.push(tile);
            }

            this.map.push(line);
        }

        stage.addChild(this.container);
    }

    setMap(map) {
        const mapW = map[0].length;
        const mapH = map.length;

        for (let i = 0; i < mapW; i++) {
            for (let j = 0; j < mapH; j++) {
                this.map[i][j].texture = this.tiles[map[j][i]];
            }
        }

        this.logicMap = map;
        this.mapW = mapW;
        this.mapH = mapH;
    }

    setScroll(x, y) {
        this.container.position.x = x;
        this.container.position.y = y;
    }

    isCollisionWithMapGround(character) {
        const tx = Math.floor((character.x + character.vx) / this.tileW);
        const ty = Math.floor((character.y + character.h + character.vy) / this.tileH);

        if (ty >= 0 && ty < this.mapH && tx >= 0 && tx < this.mapW) {
            const tile = this.logicMap[ty][tx];

            // Enough for floor collision
            if (tile !== this.emptyTileId) {
                return true;
            }
        }

        return false;
    }

    isCollisionWithMapWall(character) {
        const xOffset = Math.sign(character.vx) * 2;

        const tx = Math.floor((character.x + character.vx + xOffset) / this.tileW);
        const ty = Math.floor((character.y + character.vy) / this.tileH);

        if (ty >= 0 && ty < this.mapH && tx >= 0 && tx < this.mapW) {
            const tile = this.logicMap[ty][tx];

            // Enough for floor collision
            if (tile !== this.emptyTileId) {
                return true;
            }
        }

        return false;
    }
}
