import { Ingame } from './game/ingame';
import { Menu } from './menu';
import { Editor } from './editor/editor';
import { States, StateManager } from './statemanager';

import { Input } from "./utils/input"
import { ScreenSize } from "./utils/utils"

export class Game {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    inputManager: Input;

    // Settings
    screenSize: ScreenSize; 
    bgColor: string;

    // States
    stateManager: StateManager;
    ingame: Ingame;
    menu: Menu;
    editor: Editor;

    constructor() {
        this.canvas = document.getElementById("game") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d", {alpha: false});
        this.ctx.translate(0.5, 0.5);

        this.inputManager = new Input();

        // Settings
        this.screenSize = { width: 800, height: 480 };
        this.bgColor = "#533B59";

        // States
        this.stateManager = new StateManager(States.MENU);
        this.ingame = new Ingame(this.ctx, this.inputManager, this.screenSize, this.bgColor);
        this.menu = new Menu(this.ctx, this.inputManager, this.screenSize, this.bgColor, this.stateManager);
        this.editor = new Editor(this.ctx, this.inputManager, this.screenSize);

        // gameloop
        this.update = this.update.bind(this);
        window.requestAnimationFrame(this.update);
    }   

    update() {
        switch(this.stateManager.activeState) {
            case States.GAME:
                this.ingame.update();
                break;
            
            case States.MENU:
                this.menu.update();
                break;

            case States.SCORE:
                break;
            
            case States.EDITOR:
                this.editor.update();
        }
        

        this.draw();
        window.requestAnimationFrame(this.update);
    }

    draw() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.screenSize.width, this.screenSize.height);

        switch(this.stateManager.activeState) {
            case States.GAME:
                this.ingame.render();
                break;
            
            case States.MENU:
                this.menu.render();
                break;

            case States.SCORE:
                break;

            case States.EDITOR:
                this.editor.render();
        }
    }
}