import { ScreenSize } from '../utils/utils';
import { KeyCode, Input } from "../utils/input"

import { Layout, LayoutOptions, LayoutPosition } from '../ui/layout';

import { GameBackground } from "../game/gamebg";

export class Editor {

    private ctx: CanvasRenderingContext2D;
    private screenSize: ScreenSize;
    private inputManager: Input;
    private editorLayout: Layout;

    private layer: number;
    private cells: number;

    private gameBg: GameBackground;

    constructor(ctx: CanvasRenderingContext2D, inputManager: Input, screenSize: ScreenSize) {
        this.ctx = ctx;
        this.screenSize = screenSize;
        this.inputManager = inputManager;

        this.editorLayout = new Layout(this.screenSize, 10, 5);

        this.layer = 6;
        this.cells = 16;

        this.gameBg = new GameBackground(this.ctx, this.screenSize, this.layer, this.cells);
    }

    update() {
        
    }

    render() {
        this.gameBg.render();
    }

}