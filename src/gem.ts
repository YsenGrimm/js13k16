import { Utils } from "./utils";

export enum GemType {
    G,
    B,
    Y,

    size
}

export class Gem {

    id: number;
    ctx: CanvasRenderingContext2D;

    layer: number;
    maxLayer: number;

    angle: number;

    minOffset: number;
    offset: number;

    size: number;

    speed: number;

    realPos: number;
    alpha: number;
    fade: number;
    fadeDelay: number;

    w: number;
    h: number;

    type: GemType;

    constructor(id: number, ctx: CanvasRenderingContext2D, layer: number, width: number, height: number) {
        this.id = id;
        this.ctx = ctx;

        this.layer = Utils.getRandomInt(0, 5);
        this.maxLayer = layer - 1;

        this.angle = Utils.getRandomArbitrary(0, 360);

        this.minOffset = 64;
        this.offset = 30;

        this.size = 14;

        this.speed = Utils.getRandomArbitrary(1, 4);

        this.realPos = this.minOffset + this.offset * this.layer;
        this.alpha = 1;
        this.fade = 0.006;
        this.fadeDelay = this.speed * 2;

        this.w = width;
        this.h = height;

        switch (Utils.getRandomInt(0, GemType.size-1)) {
            case 0:
                this.type = GemType.G;
                break;
            
            case 1:
                this.type = GemType.B;
                break;
            
            case 2:
                this.type = GemType.Y;
                break;

            default:
                this.type = GemType.G;
        }
    }

    update(): void {
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
        // this.ctx.fillStyle = `rgba(217, 91, 91, ${this.alpha})`;

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