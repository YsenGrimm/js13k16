import { Stats } from "./stats";
import { States, StateManager } from './statemanager';

import { Button } from './ui/button';
import { Layout, LayoutPosition } from './ui/layout';

import { KeyCode, Input } from "./utils/input"
import { ScreenSize } from "./utils/utils";

export class Menu {

    private ctx: CanvasRenderingContext2D;
    private inputManager: Input;
    private stateManager: StateManager;
    private menuLayout: Layout;

    // global settings
    screenSize: ScreenSize;
    bgColor: string;

    buttons: Array<Button>;
    activeButton: number;

    constructor(ctx: CanvasRenderingContext2D, inputManager: Input, screenSize: ScreenSize, bgColor: string, stateManager: StateManager) {
        this.ctx = ctx;
        this.inputManager = inputManager;
        this.stateManager = stateManager;
        

        // global settings
        this.screenSize = screenSize;
        this.bgColor = bgColor;

        this.menuLayout = new Layout(this.screenSize, 10, 3);

        this.buttons = new Array<Button>();
        this.buttons = [
            new Button(this.ctx, this.menuLayout, "SINGLEPLAYER", { width: 200, height: 30 }, { row: 5, col: 1, pos: LayoutPosition.CENTER_CENTER }, () => this.stateManager.switchTo(States.GAME)), 
            new Button(this.ctx, this.menuLayout, "MULTIPLAYER", { width: 200, height: 30 }, { row: 6, col: 1, pos: LayoutPosition.CENTER_CENTER }, () => this.stateManager.switchTo(States.MENU)),
            new Button(this.ctx, this.menuLayout, "HIGHSCORE", { width: 200, height: 30 }, { row: 7, col: 1, pos: LayoutPosition.CENTER_CENTER }, () => this.stateManager.switchTo(States.MENU)),
            new Button(this.ctx, this.menuLayout, "SETTINGS", { width: 200, height: 30 }, { row: 8, col: 1, pos: LayoutPosition.CENTER_CENTER }, () => this.stateManager.switchTo(States.MENU))
        ];
        this.activeButton = 0;
    }

    public update() {
        if (this.inputManager.justPressed(KeyCode.DOWN_ARROW)) {
            this.activeButton++;
            if (this.activeButton > this.buttons.length - 1) {
                this.activeButton = 0;
            }
        }

        if (this.inputManager.justPressed(KeyCode.UP_ARROW)) {
            this.activeButton--;
            if (this.activeButton < 0) {
                this.activeButton = this.buttons.length - 1;
            }
        }

        for (const button of this.buttons) {
            button.active = false;
        }
        this.buttons[this.activeButton].active = true;

        if (this.inputManager.justPressed(KeyCode.ENTER)) {
            this.buttons[this.activeButton].press();
        }
    }

    public render() {
        this.menuLayout.showDebug(this.ctx);

        this.title();

        for (const button of this.buttons) {
            button.render();
        }
    }

    private title() {
        this.ctx.font = `140px sans-serif`;
        this.ctx.strokeStyle = "rgba(217, 89, 112, 1.0)";

        const layout = this.menuLayout.convert({ row: 3, col: 1, pos: LayoutPosition.CENTER_CENTER });
        const textWidth = this.ctx.measureText("Pulsarion").width;

        this.ctx.strokeText("Pulsarion", layout.x - textWidth/2, layout.y);
    }

}