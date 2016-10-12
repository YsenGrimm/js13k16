import { Utils } from "./utils";

export class Player {

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

    score: number;

    health: number;
    maxHealth: number;

    constructor(id: number, ctx: CanvasRenderingContext2D, layer: number, startAxis: number, gameWidth: number, gameHeigth: number) {
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

        this.width = 30;
        this.height = 4;

        this.score = 0;

        this.maxHealth = 3;
        this.health = this.maxHealth;


        document.addEventListener("keydown", e => this.handleInput(e));
    }

    private handleInput(e: KeyboardEvent) : void {

        switch (this.id) {
            case 0:
                if (e.key === "ArrowLeft") {
                    this.pos--;
                    if (this.pos < 0) {
                        this.pos = 0;
                    }
                }
                if (e.key === "ArrowRight") {
                    this.pos++;
                    if (this.pos > this.maxPos) {
                        this.pos = this.maxPos;
                    }
                }
                if (e.key === "ArrowUp") {
                    this.axis--;
                    if (this.axis < 0) {
                        this.axis = 3;
                    }
                }
                if (e.key === "ArrowDown") {
                    this.axis++;
                    if (this.axis > 3) {
                        this.axis = 0;
                    }
                }
                break;

            case 1:
                if (e.key === "a") {
                    this.pos--;
                    if (this.pos < 0) {
                        this.pos = 0;
                    }
                }
                if (e.key === "d") {
                    this.pos++;
                    if (this.pos > this.maxPos) {
                        this.pos = this.maxPos;
                    }
                }
                if (e.key === "w") {
                    this.axis--;
                    if (this.axis < 0) {
                        this.axis = 3;
                    }
                }
                if (e.key === "s") {
                    this.axis++;
                    if (this.axis > 3) {
                        this.axis = 0;
                    }
                }
                break;
        }
    }

    update() : void {
        
    }

    render() : void {
        this.ctx.fillStyle = this.color;

        if (Math.abs(Math.cos(Utils.deg2rad(this.axisPool[this.axis]))) > 0.5) {
            this.ctx.fillRect((Math.cos(Utils.deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + this.gameWidth/2 - this.width/2,
                                (Math.sin(Utils.deg2rad(this.axisPool[this.axis])) * (this.minOffset + this.offset * this.pos)) + this.gameHeigth/2 - this.height/2, this.width, this.height);
        } else {
            this.ctx.fillRect((Math.cos(Utils.deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + this.gameWidth/2 - this.height/2,
                                (Math.sin(Utils.deg2rad(this.axisPool[this.axis])) * (this.minOffset + this.offset * this.pos)) + this.gameHeigth/2 - this.width/2, this.height, this.width);
        }
    }

}