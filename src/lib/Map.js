import 'pixi.js/dist/pixi.js';
const PIXI = global.PIXI;

import SceneGraph from '../SceneGraph';
const stage = SceneGraph;

export default class Map {
    constructor(tilesetPath, width, height, tileW, tileH, mapW, mapH, emptyTile) {
        this.tiles = [];
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
    }

    setScroll(x, y) {
        this.container.position.x = x;
        this.container.position.y = y;
    }
}
