import { Stats } from "./stats";
import { Button } from './button';
import { States, StateManager } from './statemanager';

import { KeyCode, Input } from "./utils/input"
import { ScreenSize } from "./utils/utils";

export class Menu {

    private ctx: CanvasRenderingContext2D;
    private inputManager: Input;
    private stateManager: StateManager;

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

        this.buttons = new Array<Button>();
        this.buttons = [
            new Button(this.ctx, this.screenSize, "Play", 0, { width: 200, height: 30 }, () => this.stateManager.switchTo(States.GAME)), 
            new Button(this.ctx, this.screenSize, "Settings", 1, { width: 200, height: 30 }, () => this.stateManager.switchTo(States.MENU))
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
        for (const button of this.buttons) {
            button.render();
        }
    }

}