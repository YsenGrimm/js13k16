import { PATTERN } from "./pattern";

export class PatternManager {

    private patterns: Array<Pattern>;

    constructor() {
        this.patterns = [PATTERN]
    }

    public getPattern(index: number): Pattern {
        if (index >= this.patterns.length) { return null; }
        return this.patterns[index];
    }

    public writePattern(pattern: Pattern): void {
        this.patterns.push(pattern);
    }

}

export interface Pattern {
    waves: Array<Wave>
}

interface Wave {
    id: number,
    win: {
        green: number,
        blue: number,
        yellow: number,
    },
    enemies: Array<Enemies>,
    gems: Array<Gems>
}

interface Enemies {
    id: number,
    ring: number,
    speed: number,
    delay: number,
    angle: number
}

interface Gems {
    type: string,
    id: number,
    ring: number,
    speed: number,
    delay: number,
    angle: number
}