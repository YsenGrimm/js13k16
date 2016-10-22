export interface Square {
    x: number,
    y: number,
    width: number,
    height: number
}

export interface Point {
    x: number,
    y: number
}

export interface StaticPoint {
    readonly x: number,
    readonly y: number
}

export interface ScreenSize {
    readonly width: number,
    readonly height: number
}

export class Utils {
    static deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomArbitrary(min: number, max:number): number {
        return Math.random() * (max - min) + min;
    }

    static getRandomColor(): string {
        return `rgb(${Utils.getRandomInt(0, 255)}, ${Utils.getRandomInt(0, 255)}, ${Utils.getRandomInt(0, 255)})`;
    }
}