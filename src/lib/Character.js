import 'pixi.js/dist/pixi.js';
const PIXI = global.PIXI;

import SceneGraph from '../SceneGraph';
const stage = SceneGraph.stage;

export default class Character {
    constructor(map) {
        this.map = map;
        this.frames = [];
        this.baseTexture = PIXI.BaseTexture.fromImage('assets/micro_characters_bases/PNG/Human/human_regular_hair.png');

        const tileW = 20;
        const tileH = 20;
        const RUN_POS = 20;

        const RUN_FRAMES = [1, 0, 2, 0];

        const makeFrames = (id) => {
            let frame   = new PIXI.Rectangle(id * tileW, RUN_POS, tileW, tileH);
            let texture = new PIXI.Texture(this.baseTexture, frame);

            return texture;
        };

        // Only run animation frames at the moment
        this.frames = RUN_FRAMES.map(makeFrames);

        // Define sprite
        this.sprite = new PIXI.extras.AnimatedSprite(this.frames);

        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.1;

        this.sprite.play();

        this.sprite.scale.x = 2;
        this.sprite.scale.y = 2;

        stage.addChild(this.sprite);

        // World
        this.x = 40;
        this.y = 40;
        this.vx = 0;
        this.vy = 0;
        this.w = 20;
        this.h = 15;

        // Input
        this.isLeftPressed = false;
        this.isRightPressed = false;
        this.isUpPressed = false;

        document.addEventListener('keydown', (event) => {
            if (event.keyCode === 37) {
                this.isLeftPressed = true;
            } else if (event.keyCode === 39) {
                this.isRightPressed = true;
            } else if (event.keyCode === 38) {
                this.isUpPressed = true;
            }

            event.preventDefault();
        }, false);

        document.addEventListener('keyup', (event) => {
            if (event.keyCode === 37) {
                this.isLeftPressed = false;
            } else if (event.keyCode === 39) {
                this.isRightPressed = false;
            } else if (event.keyCode === 38) {
                this.isUpPressed = false;
            }

            event.preventDefault();
        }, false);
    }

    update(scroll) {
        const GRAVITY = 1;
        const MAX_VY  = 10;
        const MAX_VX  = 8;
        const SPEED   = 1.5;
        const FRICTION = 0.80;
        const JUMP    = 15;

        // Player movement
        if (this.isLeftPressed) {
            this.vx -= SPEED;
            if (this.vx <= -MAX_VX) {
                this.vx = -MAX_VX;
            }
        }

        if (this.isRightPressed) {
            this.vx += SPEED;
            if (this.vx >= MAX_VX) {
                this.vx = MAX_VX;
            }
        }

        this.vx *= FRICTION;

        // Jump
        if (this.isUpPressed && this.isOnTheFloor) {
            this.vy = -JUMP;
            this.y -= 5;
        }

        // Gravity
        this.vy += GRAVITY;
        if (this.vy >= MAX_VY) {
            this.vy = MAX_VY;
        }

        if (this.map.isCollisionWithMapGround(this)) {
            this.vy = 0;
            this.isOnTheFloor = true;

            // Snap the character on the ground (a bit hacky)
            this.y = Math.floor(this.y / 32) * 32 + this.h + 2;
        } else {
            this.isOnTheFloor = false;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Display
        if (this.vx >= 0) {
            this.sprite.scale.x = 2;
        } else {
            this.sprite.scale.x = -2;
        }

        if (Math.abs(this.vx) > 0.1) {
            this.sprite.animationSpeed = 0.15;
        } else {
            this.sprite.animationSpeed = 0.01;
        }

        this.sprite.position.set(this.x + scroll.x, this.y + scroll.y);
    }
}
