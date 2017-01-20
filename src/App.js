import React, { Component } from 'react';
import remark from 'remark';
import reactRenderer from 'remark-react';

import intro01 from './scenes/intro01.js';
const update = intro01.update;
const scrollingFunctions = intro01.scrollingFunctions;

import pageContent from './scenes/intro01.md';

import SceneGraph from './SceneGraph';
const createRenderer = SceneGraph.createRenderer;
const stage = SceneGraph.stage;

import parseDataUri from 'parse-data-uri';

import RemarkLowlight from 'remark-react-lowlight';
import js from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/monokai.css';

const styles = {
    container: {
        padding: 10,
        display: 'flex',
        flexDirection: 'row'
    },

    gameArea: {
    },

    title: {
        fontFamily: "Open Sans",
        margin: 8,
        color: '#333',
    },

    game: {

    },

    article: {
        paddingTop: 32,
        paddingLeft: 32,
        color: '#333',
        width: 770,
    },

    play: {
        cursor: "pointer"
    }
};

/*let computeScrolling = (characterX, characterY) => {
    let scrollX = 0;
    let scrollY = 0;

    //scrollX = 640 / 2 - character.x;
    //scrollY = 360 / 2 - character.y;

    return {
        x: scrollX,
        y: scrollY
    };
}*/

let computeScrolling;

const playCode = (i) => {
    computeScrolling = scrollingFunctions[i];
}

// Hack to create react components from markdown
const Link = (props) => {
    if (props.href === "play") {
        return (
            <a
                style={styles.play}
                onClick={() => playCode(props.children[0])}
            >
                Play
            </a>
        );
    } else {
        return (
            <a href={props.href}>{ props.children[0] }</a>
        );
    }
}

class App extends Component {
    componentDidMount() {
        this.renderer = createRenderer();

        playCode(0);

        // Rendering loop
        const animate = () => {
            requestAnimationFrame(animate);
            update(computeScrolling);
            this.renderer.render(stage);
        }

        animate();
    }

    render() {
        const mdString = parseDataUri(pageContent).data.toString();

        return (
            <div style={styles.container}>
                <div style={styles.game}>
                    <h1 style={styles.title}>Scrolling 101: 2D scrolling course</h1>
                    <div id="gameArea" style={styles.gameArea}/>
                </div>

                <div style={styles.article}>
                    {
                        remark().use(reactRenderer, {
                            sanitize: false,
                            remarkReactComponents: {
                                code: RemarkLowlight({
                                    js
                                }),

                                a: Link
                            }
                        }).process(mdString).contents
                    }
                </div>
            </div>
        );
    }
}

export default App;
