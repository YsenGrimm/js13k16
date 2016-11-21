import { Layout, LayoutPosition, LayoutOptions } from './layout';

export class Button {
    ctx: CanvasRenderingContext2D;
    layout: Layout;
    layoutOptions: LayoutOptions;

    text: string;
    textWidth: number;
    fontSize: number;

    boxWidth: number;
    boxHeight: number;
    boxOffset: number;

    active: boolean;

    onPress: () => void;

    constructor(ctx: CanvasRenderingContext2D, layout: Layout, text: string, size: { width: number, height: number }, 
                layoutOptions: LayoutOptions, onPress: () => void) {
        this.ctx = ctx;
        this.layout = layout;
        this.layoutOptions = layoutOptions;

        this.text = text;
        this.textWidth = this.ctx.measureText(this.text).width;
        this.fontSize = 24;

        this.boxWidth = size.width;
        this.boxHeight = size.height;
        this.boxOffset = 50;

        this.active = false;

        this.onPress = onPress;
    }

    update() {

    }

    render() {
        this.ctx.strokeStyle = "rgba(217, 89, 112, 1.0)";
        this.ctx.fillStyle = "rgba(217, 89, 112, 1.0)";

        this.ctx.font = `${this.fontSize}px sans-serif`;

        this.textWidth = this.ctx.measureText(this.text).width;
        
        const layoutPos = this.layout.convert(this.layoutOptions); 

        const posx = layoutPos.x - this.boxWidth / 2;
        const posy = layoutPos.y - this.boxHeight / 2;

        this.ctx.fillText(this.text, layoutPos.x - this.textWidth / 2, posy + this.fontSize + 2 - (this.boxHeight - this.fontSize) / 2);

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