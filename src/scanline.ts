import { Utils } from "./utils/utils";

export class Scanline {

    ctx: CanvasRenderingContext2D;
    scanlineStart: number;
    scanlineEnd: number;

    scanlinePos: number;
    scanlineSpeed: number;

    w: number;
    h: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.scanlineStart = 30;
        this.scanlineEnd = 240;

        this.scanlinePos = this.scanlineStart;
        this.scanlineSpeed = 1.5;

        this.w = width;
        this.h = height;
    }

    update() {
        this.scanlinePos += this.scanlineSpeed;
        if (this.scanlinePos > this.scanlineEnd) {
            this.scanlinePos = this.scanlineStart;
        }
    }

    render() {
        this.ctx.strokeStyle = "#D95970";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.w/2, this.h/2, this.scanlinePos, 0, Math.PI*2);
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
    }

}