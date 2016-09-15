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
}