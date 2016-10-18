import { Utils } from "./utils";

export enum GemType {
    G,
    B,
    Y,

    size
}

export class Gem {

    // default
    id: number;
    ctx: CanvasRenderingContext2D;

    w: number;
    h: number;

    // other
    layer: number;

    angle: number;

    minOffset: number;
    offset: number;

    size: number;

    speed: number;

    delay: number;

    type: GemType;

    realPos: number;
    alpha: number;
    fade: number;
    fadeDelay: number;    

    constructor(id: number, ctx: CanvasRenderingContext2D, width: number, height: number, 
                type: string, layer: number, angle: number, speed: number, delay: number) {
        this.id = id;
        this.ctx = ctx;

        this.w = width;
        this.h = height;

        // other
        this.layer = layer;

        this.angle = angle;

        this.minOffset = 64;
        this.offset = 30;

        this.size = 14;

        this.speed = speed;

        this.delay = delay;

        switch (type) {
            case "green":
                this.type = GemType.G;
                break;
            
            case "blue":
                this.type = GemType.B;
                break;
            
            case "yellow":
                this.type = GemType.Y;
                break;

            default:
                this.type = GemType.G;
        }

        this.realPos = this.minOffset + this.offset * this.layer;
        this.alpha = 1;
        this.fade = 0.006;
        this.fadeDelay = this.speed * 2;
    }

    update(): void {
        if (this.delay > 0) {
            // 1 frame ~ 16.666 ms at 60 fps
            this.delay -= 16;
            return;
        }

        this.angle += this.speed;
        this.angle %= 360;

        this.fadeDelay--;
        if (this.fadeDelay < 0) {
            this.alpha -= this.fade;
            if (this.alpha < 0) {
                this.alpha = 0;
                this.fadeDelay = 5;
            }
        }

    }

    render(): void {
        if (this.delay > 0) { return; }

        switch (this.type) {
            case GemType.G:
                this.ctx.fillStyle = `rgb(153, 138, 47)`;
                break;
            
            case GemType.B:
                this.ctx.fillStyle = `rgb(0, 60, 85)`;
                break;
            
            case GemType.Y:
                this.ctx.fillStyle = `rgb(255, 166, 68)`;
                break;
        }

        const x = (Math.cos(Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.w/2;
        const y = (Math.sin(Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.h/2;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y - this.size / 2);
        this.ctx.lineTo(x + this.size / 2, y);
        this.ctx.lineTo(x, y + this.size / 2);
        this.ctx.lineTo(x, y - this.size / 2);
        this.ctx.fill();

        switch (this.type) {
            case GemType.G:
                this.ctx.fillStyle = `rgb(199, 191, 65)`;
                break;
            
            case GemType.B:
                this.ctx.fillStyle = `rgb(0, 90, 127)`;
                break;
            
            case GemType.Y:
                this.ctx.fillStyle = `rgb(255, 199, 54)`;
                break;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(x, y + this.size / 2);
        this.ctx.lineTo(x - this.size / 2, y);
        this.ctx.lineTo(x, y - this.size / 2);
        this.ctx.lineTo(x, y + this.size / 2);
        this.ctx.fill();
    }

}