import React, { Component } from 'react';
import remark from 'remark';
import reactRenderer from 'remark-react';

import content from './Content.js';

import SceneGraph from './SceneGraph';
const createRenderer = SceneGraph.createRenderer;
const stage = SceneGraph.stage;
const PIXI = global.PIXI;

import parseDataUri from 'parse-data-uri';

import RemarkLowlight from 'remark-react-lowlight';
import js from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/monokai.css';

// Create Character and Map
import Map        from './lib/Map';
import Character  from './lib/Character';
const mapW = Math.ceil((640 + 640 / 2) / 32);
const mapH = Math.ceil((360 + 360 / 2) / 32);

const EMPTY_TILE = 40;
const map = new Map('assets/art_tileset.png', 256, 256, 32, 32, mapW, mapH, EMPTY_TILE);
const character = new Character(map);

// Routing
import LocationBar from 'location-bar';
const locationBar = new LocationBar();

const styles = {
    outerContainer: {
        textAlign: 'center',
    },

    container: {
        flexDirection: 'row',
        display: 'inline-block',
    },

    gameArea: {
    },

    title: {
        fontFamily: "Open Sans",
        margin: 8,
        color: '#333',
    },

    game: {
        position: 'fixed',
        minHeight: 0,
    },

    article: {
        paddingTop: 32,
        paddingLeft: 680,
        color: '#333',
        width: 770,
        minHeight: 0,
        textAlign: 'left',
    },

    play: {
        cursor: "pointer",
        fontWeight: "bold",
        height: 40,
        display: 'block'
    },

    next: {
        cursor: "pointer",
        fontWeight: "bold",
        marginRight: 30,
        height: 40,
        width: 150,
        display: 'inline-block'
    }
};

const MD_CONTENT_ID = 0;
const JS_CONTENT_ID = 1;
const TITLE_CONTENT_ID = 2;

let globalComputeScrolling;
let globalCurrentPage = 0;
let globalCodeId = 0;
let linesGfx = null;

const showLines = (enable) => {
    if (linesGfx) {
        stage.removeChild(linesGfx);
    }

    const lines = content[globalCurrentPage][JS_CONTENT_ID].lines;
    if (lines) {
        linesGfx = new PIXI.Graphics();

        linesGfx.lineStyle(1, 0xFFFFFF, 1);

        if (lines[globalCodeId]) {
            for (let i = 0; i < lines[globalCodeId].lines.length; i++) {
                const a = lines[globalCodeId].lines[i];

                linesGfx.moveTo(a[0], a[1]);
                linesGfx.lineTo(a[2], a[3]);
            }

            linesGfx.alpha = 0.5;
            stage.addChild(linesGfx);
        }
    }
}

const playCode = (i) => {
    const scrollingFunctions = content[globalCurrentPage][JS_CONTENT_ID].scrollingFunctions;
    globalComputeScrolling = scrollingFunctions[i];
    globalCodeId = i;

    showLines(true);
}

// Hack to create react components from markdown
const Link = (props) => {
    if (props.href === "play") {
        return (
            <a
                style={styles.play}
                onClick={() => playCode(props.children[0])}
            >
                ► Play
            </a>
        );
    } else {
        return (
            <a href={props.href}>{ props.children[0] }</a>
        );
    }
}

class App extends Component {
    constructor() {
        super();

        this.state = {
            currentPage: 0
        }
    }

    componentWillMount() {
        locationBar.onChange((path) => this.manageUrl(path));

        locationBar.start({
            pushState: true
        });
    }

    componentDidMount() {
        this.renderer = createRenderer();

        const mapData = content[this.state.currentPage][JS_CONTENT_ID].map;
        map.setMap(mapData);

        playCode(0);

        // Rendering loop
        const animate = () => {
            requestAnimationFrame(animate);
            this.gameUpdate();
            this.renderer.render(stage);
        }

        animate();
    }

    manageUrl(path) {
        const matchs = path.match(/^(\d+)-/);
        if (matchs) {
            const id = parseInt(matchs[1], 10);
            if (id < content.length) {
                globalCurrentPage = id;
            }
        } else {
            // Index
            globalCurrentPage = 0;
        }

        const mapData = content[globalCurrentPage][JS_CONTENT_ID].map;
        map.setMap(mapData);

        playCode(0);

        this.setState({
            currentPage: globalCurrentPage
        });

        window.scrollTo(0, 0);
    }

    gameUpdate() {
        const update = content[this.state.currentPage][JS_CONTENT_ID].update;
        update(character, map, globalComputeScrolling);
    }

    changePage(id) {
        if (id < content.length) {
            const title = content[id][TITLE_CONTENT_ID].replace(/\s/g, '-');
            locationBar.update(id + "-" + title, {
                trigger: true
            });
        } else {
            locationBar.update("/", {
                trigger: true
            });
        }
    }

    render() {
        const mdString = parseDataUri(content[this.state.currentPage][MD_CONTENT_ID]).data.toString();
        const mdContent = remark().use(reactRenderer, {
            sanitize: false,
            remarkReactComponents: {
                code: RemarkLowlight({
                    js
                }),

                a: Link
            }
        }).process(mdString).contents;

        return (
            <div style={styles.outerContainer}>
                <div style={styles.container}>
                    <div style={styles.game}>
                        <h1 style={styles.title}>Scrolling 101: 2D scrolling workshop!</h1>
                        <div id="gameArea" style={styles.gameArea}/>
                    </div>

                    <div style={styles.article}>
                        <div key={Math.random()}>
                            { mdContent }
                        </div>

                        {
                            this.state.currentPage > 0 ?
                            <a
                                style={styles.next}
                                onClick={() => this.changePage(this.state.currentPage - 1)}
                            >
                                Previous
                            </a>
                            :
                            null
                        }

                        {
                            this.state.currentPage < content.length - 1 ?
                            <a
                                style={styles.next}
                                onClick={() => this.changePage(this.state.currentPage + 1)}
                            >
                                Next
                            </a>
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
