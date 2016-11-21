import { Layout, LayoutPosition, LayoutOptions } from './layout';

export class Label {

    private ctx: CanvasRenderingContext2D;
    private layout: Layout;
    private layoutOptions: LayoutOptions;

    width: number;
    height: number;

    text: string;
    textWidth: number;
    fontSize: number;

    constructor(ctx: CanvasRenderingContext2D, layout: Layout, text: string, size: { width: number, height: number }, layoutOptions: LayoutOptions) {
        this.ctx = ctx;
        this.layout = layout;
        this.layoutOptions = layoutOptions;

        this.width = size.width;
        this.height = size.height;

        this.text = text;
        this.fontSize = 16;
    }

    update() {

    }

    render() {
        this.ctx.strokeStyle = "rgba(217, 89, 112, 1.0)";
        this.ctx.fillStyle = "rgba(217, 89, 112, 1.0)";

        this.ctx.font = `${this.fontSize}px sans-serif`;

        this.textWidth = this.ctx.measureText(this.text).width;

        const layoutPos = this.layout.convert(this.layoutOptions); 

        const posx = layoutPos.x - this.width / 2;
        const posy = layoutPos.y;

        this.ctx.fillText(this.text, layoutPos.x - this.textWidth / 2, posy + this.fontSize / 2);
        // this.ctx.strokeText(this.text, layoutPos.x - this.textWidth / 2, posy + this.fontSize / 2);
    }
}