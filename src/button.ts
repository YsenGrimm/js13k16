import { ScreenSize } from './utils/utils';

export class Button {
    ctx: CanvasRenderingContext2D;
    screenSize: ScreenSize;

    text: string;
    textWidth: number;
    fontSize: number;

    position: number;

    offset: number;

    boxWidth: number;
    boxHeight: number;
    boxOffset: number;

    active: boolean;

    onPress: () => void;

    constructor(ctx: CanvasRenderingContext2D, screenSize: ScreenSize, text: string, position: number, 
                size: { width: number, height: number }, onPress: () => void) {
        this.ctx = ctx;
        this.screenSize = screenSize;

        this.text = text;
        this.textWidth = this.ctx.measureText(this.text).width;
        this.fontSize = 24;

        this.position = position;

        this.boxWidth = size.width;
        this.boxHeight = size.height;
        this.boxOffset = 50;

        this.active = false;

        this.onPress = onPress;
    }

    update() {

    }

    render() {
        this.textWidth = this.ctx.measureText(this.text).width;

        this.ctx.strokeStyle = "rgba(217, 89, 112, 1.0)";
        this.ctx.fillStyle = "rgba(217, 89, 112, 1.0)";

        this.ctx.font = `${this.fontSize}px serif`;

        const posx = this.screenSize.width / 2 - this.boxWidth / 2;
        const posy = this.screenSize.height / 2 - this.boxHeight + this.boxOffset * this.position;

        this.ctx.fillText(this.text, this.screenSize.width / 2 - this.textWidth / 2, posy + this.fontSize - (this.boxHeight - this.fontSize) / 2);
        if (this.active) {
            this.ctx.fillStyle = "rgba(217, 89, 112, 0.2)";
            this.ctx.strokeRect(posx, posy, this.boxWidth, this.boxHeight);
            this.ctx.fillRect(posx, posy, this.boxWidth, this.boxHeight);
        } else {
            this.ctx.strokeRect(posx, posy, this.boxWidth, this.boxHeight);
        } 
    }

    press() {
        this.onPress();
    }

}