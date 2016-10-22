import { Utils } from "./utils/utils";

export class Enemy {

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

    realPos: number;
    alpha: number;
    fade: number;
    fadeDelay: number;

    constructor(id: number, ctx: CanvasRenderingContext2D, width: number, height: number, layer: number, angle: number, speed: number, delay: number) {
        this.id = id;
        this.ctx = ctx;

        this.w = width;
        this.h = height;

        // other
        this.layer = layer;

        this.angle = angle;

        this.minOffset = 64;
        this.offset = 30;

        this.size = 6;

        this.speed = speed;

        this.delay = delay;

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

        this.ctx.fillStyle = `rgba(217, 91, 91, ${this.alpha})`;

        this.ctx.beginPath();
        this.ctx.arc((Math.cos(Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.w/2,
                        (Math.sin(Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.h/2,
                        this.size, 0, Math.PI*2);
        this.ctx.fill();
    }
}