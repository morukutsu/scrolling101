import 'pixi.js/dist/pixi.js';
var PIXI = global.PIXI;

// Create a singleton scene graph and export it
var stage = new PIXI.Container();

const createRenderer = () => {
    // Also instantiate the PIXI renderer
    var renderer = PIXI.autoDetectRenderer(640, 360, { backgroundColor : 0x64B1BC });
    document.getElementById('gameArea').appendChild(renderer.view);
    
    return renderer;
}

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default { stage, createRenderer };
