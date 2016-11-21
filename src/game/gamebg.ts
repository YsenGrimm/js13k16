import { ScreenSize, Utils } from "../utils/utils";

export class GameBackground {

    private ctx: CanvasRenderingContext2D;
    private screenSize: ScreenSize;

    private layer: number;
    private cells: number;

    private strokeColor: string;

    constructor(ctx: CanvasRenderingContext2D, screenSize: ScreenSize, layer: number, cells: number) {
        this.ctx = ctx;
        this.screenSize = screenSize;

        this.layer = layer;
        this.cells = cells;

        this.strokeColor = "#D95970";
    }

    update() {

    }

    render() {

        this.ctx.strokeStyle = this.strokeColor;
        let minR = 50;
        let scaleR = 30;

        for (let i = 0; i < this.layer + 1; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.screenSize.width/2, this.screenSize.height/2, minR + scaleR * i, 0, Math.PI*2);
            this.ctx.stroke();
        }

        this.ctx.strokeStyle = this.strokeColor;
        let slice = 360 / this.cells;

        for (let i = 0; i < this.cells; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.screenSize.width/2, this.screenSize.height/2);
            this.ctx.lineTo(
                (Math.cos(Utils.deg2rad(i * slice)) * 230) + this.screenSize.width/2,
                (Math.sin(Utils.deg2rad(i * slice)) * 230) + this.screenSize.height/2);
            this.ctx.stroke();
        }

        // fill center circle
        this.ctx.fillStyle = this.strokeColor;
        this.ctx.beginPath();
        this.ctx.arc(this.screenSize.width/2, this.screenSize.height/2, minR, 0, 2 * Math.PI);
        this.ctx.fill();

    }

}