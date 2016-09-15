import { Utils } from "./utils";

export class Enemy {

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

    constructor(id: number, ctx: CanvasRenderingContext2D, layer: number, width: number, height: number) {
        this.id = id;
        this.ctx = ctx;

        this.layer = Utils.getRandomInt(0, 5);
        this.maxLayer = layer - 1;

        this.angle = Utils.getRandomArbitrary(0, 360);

        this.minOffset = 64;
        this.offset = 30;

        this.size = 6;

        this.speed = Utils.getRandomArbitrary(1, 4);

        this.realPos = this.minOffset + this.offset * this.layer;
        this.alpha = 1;
        this.fade = 0.006;
        this.fadeDelay = this.speed * 2;

        this.w = width;
        this.h = height;
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
        this.ctx.fillStyle = `rgba(217, 91, 91, ${this.alpha})`;

        this.ctx.beginPath();
        this.ctx.arc((Math.cos(Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.w/2,
                        (Math.sin(Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.h/2,
                        this.size, 0, Math.PI*2);
        this.ctx.fill();
    }
}