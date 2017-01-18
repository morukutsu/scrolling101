import React, { Component } from 'react';
import update from './scenes/intro01.js';

import SceneGraph from './SceneGraph';
const createRenderer = SceneGraph.createRenderer;
const stage = SceneGraph.stage;

class App extends Component {
    componentDidMount() {
        this.renderer = createRenderer();
        
        // Rendering loop
        const animate = () => {
            requestAnimationFrame(animate);
            update();
            this.renderer.render(stage);
        }
        
        animate();
    }
    
    render() {
        return (
            <div>
                <div>Test</div>
                <div id="gameArea" />
            </div>
        );
    }
}

export default App;
