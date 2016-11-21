
export class Color {

    private red: number;
    private green: number;
    private blue: number;
    private alpha: number;

    constructor(red: number, green: number, blue: number, alpha = 0) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    public getRGB(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    public getRGBA(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }

    public getHex(): string {
        return `#${Color.numberToHex(this.red)}${Color.numberToHex(this.green)}${Color.numberToHex(this.blue)}`
    }

    public static numberToHex(x: number): string {
        let hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

}
