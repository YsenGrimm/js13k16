import { Utils } from "./utils/utils";
import { Input, KeyCode } from "./utils/input"

import { GemType } from "./gem";

export class Player {

    inputMarager: Input;

    id: number;
    ctx: CanvasRenderingContext2D;
    color: string;
    pos: number;
    axis: number;
    axisPool: Array<number>;
    maxPos: number;
    minOffset: number;
    offset: number;

    gameWidth: number;
    gameHeigth: number;

    size: number;

    width: number;
    height: number;

    health: number;
    maxHealth: number;

    // gems goal
    green: number;
    greenGoal: number;

    blue: number;
    blueGoal: number;

    yellow: number;
    yellowGoal: number;

    constructor(id: number, ctx: CanvasRenderingContext2D, inputManager: Input, layer: number, startAxis: number, gameWidth: number, gameHeigth: 
                number, goal: {green: number, blue: number, yellow: number}) {

        this.inputMarager = inputManager;

        this.id = id;
        this.ctx = ctx;
        this.color = "rgb(242, 214, 128)";

        this.pos = 0;
        this.axis = startAxis;
        this.axisPool = [0, 90, 180, 270];
        this.maxPos = layer - 1;
        this.minOffset = 64;
        this.offset = 30;

        this.gameWidth = gameWidth;
        this.gameHeigth = gameHeigth;

        this.size = 6;

        this.width = 28;
        this.height = 4;

        this.maxHealth = 3;
        this.health = this.maxHealth;

        // gems goal
        this.green = 0;
        this.greenGoal = goal.green;
        
        this.blue = 0;
        this.blueGoal = goal.blue;

        this.yellow = 0;
        this.yellowGoal = goal.yellow;        
    }

    update(): void {
        switch (this.id) {
            case 0:
                // right
                if (this.axisPool[this.axis] === 0) {
                    if (this.inputMarager.justPressed(KeyCode.LEFT_ARROW)) {
                        this.pos--;
                        if (this.pos < 0) {
                            this.pos = 0;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.RIGHT_ARROW)) {
                        this.pos++;
                        if (this.pos > this.maxPos) {
                            this.pos = this.maxPos;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.UP_ARROW)) {
                        this.axis--;
                        if (this.axis < 0) {
                            this.axis = 3;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.DOWN_ARROW)) {
                        this.axis++;
                        if (this.axis > 3) {
                            this.axis = 0;
                        }
                    }
                } 
                
                // bottom
                if (this.axisPool[this.axis] === 90) {
                    if (this.inputMarager.justPressed(KeyCode.UP_ARROW)) {
                        this.pos--;
                        if (this.pos < 0) {
                            this.pos = 0;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.DOWN_ARROW)) {
                        this.pos++;
                        if (this.pos > this.maxPos) {
                            this.pos = this.maxPos;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.RIGHT_ARROW)) {
                        this.axis--;
                        if (this.axis < 0) {
                            this.axis = 3;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.LEFT_ARROW)) {
                        this.axis++;
                        if (this.axis > 3) {
                            this.axis = 0;
                        }
                    }
                }

                // left
                if (this.axisPool[this.axis] === 180) {
                    if (this.inputMarager.justPressed(KeyCode.RIGHT_ARROW)) {
                        this.pos--;
                        if (this.pos < 0) {
                            this.pos = 0;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.LEFT_ARROW)) {
                        this.pos++;
                        if (this.pos > this.maxPos) {
                            this.pos = this.maxPos;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.DOWN_ARROW)) {
                        this.axis--;
                        if (this.axis < 0) {
                            this.axis = 3;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.UP_ARROW)) {
                        this.axis++;
                        if (this.axis > 3) {
                            this.axis = 0;
                        }
                    }
                }

                // top
                if (this.axisPool[this.axis] === 270) {
                    if (this.inputMarager.justPressed(KeyCode.DOWN_ARROW)) {
                        this.pos--;
                        if (this.pos < 0) {
                            this.pos = 0;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.UP_ARROW)) {
                        this.pos++;
                        if (this.pos > this.maxPos) {
                            this.pos = this.maxPos;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.LEFT_ARROW)) {
                        this.axis--;
                        if (this.axis < 0) {
                            this.axis = 3;
                        }
                    }
                    if (this.inputMarager.justPressed(KeyCode.RIGHT_ARROW)) {
                        this.axis++;
                        if (this.axis > 3) {
                            this.axis = 0;
                        }
                    }
                }
                
                break;
        }
    }

    render() : void {
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;

        if (Math.abs(Math.cos(Utils.deg2rad(this.axisPool[this.axis]))) > 0.5) {
            const posx = (Math.cos(Utils.deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + this.gameWidth/2 - this.width/2;
            const posy = (Math.sin(Utils.deg2rad(this.axisPool[this.axis])) * (this.minOffset + this.offset * this.pos)) + this.gameHeigth/2 - this.height/2;

            this.ctx.strokeRect(posx, posy, this.width, this.height);
            this.ctx.fillRect(posx, posy, this.width, this.height);                                
        } else {
            const posx = (Math.cos(Utils.deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + this.gameWidth/2 - this.height/2;
            const posy = (Math.sin(Utils.deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + this.gameHeigth/2 - this.width/2;

            this.ctx.strokeRect(posx, posy, this.height, this.width);
            this.ctx.fillRect(posx, posy, this.height, this.width);
        }
    }

    collectGem(gem: GemType): void {
        switch (gem) {
            case GemType.G:
                this.green++;
                break;
            case GemType.B:
                this.blue++;
                break;
            case GemType.Y:
                this.yellow++;
                break;
        }
    }

    checkGoals(): boolean {
        return (this.green === this.greenGoal && this.blue === this.blueGoal && this.yellow === this.yellowGoal);
    }

    reset(): void {
        this.health = this.maxHealth;

        this.green = 0;
        this.blue = 0;
        this.yellow = 0;
    }

    setGoals(goal: {green: number, blue: number, yellow: number}): void {
        this.greenGoal = goal.green;
        this.blueGoal = goal.blue;
        this.yellowGoal = goal.yellow;
    }

}