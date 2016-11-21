import { ScreenSize } from '../utils/utils';
import { KeyCode, Input } from "../utils/input"

import { Layout, LayoutOptions, LayoutPosition } from '../ui/layout';
import { Label } from '../ui/label';

import { Ingame } from '../game/ingame';

export class Editor {

    private ctx: CanvasRenderingContext2D;
    private screenSize: ScreenSize;
    private inputManager: Input;
    private editorLayout: Layout;

    labels: Array<Label>;

    ingame: Ingame;

    constructor(ctx: CanvasRenderingContext2D, inputManager: Input, screenSize: ScreenSize) {
        this.ctx = ctx;
        this.screenSize = screenSize;
        this.inputManager = inputManager;

        this.editorLayout = new Layout(this.screenSize, 10, 5);

        this.labels = [
            new Label(this.ctx, this.editorLayout, "Test", { width: 100, height: 20 }, { row: 0, col: 0, pos: LayoutPosition.CENTER_CENTER })
        ];

        this.ingame = new Ingame(this.ctx, this.inputManager, this.screenSize, "#533B59");
    }

    update() {
        this.ingame.update();
    }

    render() {
        this.editorLayout.showDebug(this.ctx);
        for (const label of this.labels) {
            label.render();
        }
        this.ingame.render();
    }

}