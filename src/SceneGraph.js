import 'pixi.js/dist/pixi.js';
var PIXI = global.PIXI;

// Create a singleton scene graph and export it
var stage = new PIXI.Container();

// Also instantiate the PIXI renderer
var renderer = PIXI.autoDetectRenderer(640, 360, { backgroundColor : 0x64B1BC });
document.body.appendChild(renderer.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default { renderer, stage };
