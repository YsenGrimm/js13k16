import { ScreenSize, Point } from '../utils/utils';

export interface LayoutOptions {
    row: number,
    col: number,
    pos: LayoutPosition
}

export enum LayoutPosition {
    TOP_LEFT,
    TOP_RIGHT,
    TOP_CENTER,

    CENTER_LEFT,
    CENTER_RIGHT,
    CENTER_CENTER,

    BOT_LEFT,
    BOT_RIGHT,
    BOT_CENTER,
}

export class Layout {

    private size: ScreenSize;

    private rows: number;
    private cols: number;

    // rows in pixels
    private sRows: number;
    // cols in pixels
    private sCols: number;

    constructor(size: ScreenSize, rows: number, cols: number) {
        this.size = size;

        this.rows = rows;
        this.cols = cols;

        this.sRows = this.size.height / this.rows;
        this.sCols = this.size.width / this.cols;
    }

    public convert(options: LayoutOptions): Point {
        return this.convertRaw(options.row, options.col, options.pos);
    }

    public convertRaw(row: number, col: number, pos: LayoutPosition): Point {
        const convRow = this.sRows * row;
        const convCol = this.sCols * col;

        switch(pos) {
            // top
            case LayoutPosition.TOP_LEFT:
                return { x: convCol, y: convRow };

            case LayoutPosition.TOP_CENTER:
                return { x: convCol + this.sCols/2, y: convRow };

            case LayoutPosition.TOP_CENTER:
                return { x: convCol + this.sCols, y: convRow };

            // center
            case LayoutPosition.CENTER_LEFT:
                return { x: convCol, y: convRow + this.sRows/2 };

            case LayoutPosition.CENTER_CENTER:
                return { x: convCol + this.sCols/2, y: convRow + this.sRows/2 };

            case LayoutPosition.CENTER_CENTER:
                return { x: convCol + this.sCols, y: convRow + this.sRows/2 };

            // bot
            case LayoutPosition.BOT_LEFT:
                return { x: convCol, y: convRow + this.sRows };

            case LayoutPosition.BOT_CENTER:
                return { x: convCol + this.sCols/2, y: convRow + this.sRows };

            case LayoutPosition.BOT_CENTER:
                return { x: convCol + this.sCols, y: convRow + this.sRows };
        }
    }

    public showDebug(ctx: CanvasRenderingContext2D) {
        for (let x = 0; x <= this.cols; x++) {
            ctx.strokeStyle = "#ff9001";
            ctx.beginPath();
            ctx.moveTo(Math.floor(this.sCols * x) >= this.size.width ? this.size.width - 1 :  Math.floor(this.sCols * x), 0);
            ctx.lineTo(Math.floor(this.sCols * x) >= this.size.width ? this.size.width - 1 :  Math.floor(this.sCols * x), this.size.height);
            ctx.stroke();
        }

        for (let y = 0; y <= this.rows; y++) {
            ctx.strokeStyle = "#ff9001";
            ctx.beginPath();
            ctx.moveTo(0, Math.floor(this.sRows * y) >= this.size.height ? this.size.height - 1 : Math.floor(this.sRows * y));
            ctx.lineTo(this.size.width, Math.floor(this.sRows * y) >= this.size.height ? this.size.height - 1 : Math.floor(this.sRows * y));
            ctx.stroke();
        }
    }

}