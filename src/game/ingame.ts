import { Player } from "./entities/player";
import { Enemy } from "./entities/enemy";
import { Scanline } from "./scanline";
import { Utils, ScreenSize } from "../utils/utils";
import { Gem } from "./entities/gem";
import { Stats } from "./ui/stats";
import { Input } from "../utils/input"

import { GameBackground } from "./gamebg";
import { PatternManager } from "./patterns/patternmanager";

export class Ingame {

    private ctx: CanvasRenderingContext2D;
    private inputManager: Input;

    // global settings
    screenSize: ScreenSize;
    bgColor: string;
    collisionOffset: number;

    // board settings
    layer: number;
    cells: number;

    patternManager: PatternManager;
    gamebg: GameBackground;
    scanline: Scanline;
    stats: Stats;

    player: Player;
    enemies: Array<Enemy>;
    gems: Array<Gem>;

    activeWave: number;

    constructor(ctx: CanvasRenderingContext2D, inputManager: Input, screenSize: ScreenSize, bgColor: string) {
        this.ctx = ctx;
        this.inputManager = inputManager;

        // global settings
        this.screenSize = screenSize;
        this.bgColor = bgColor;
        this.collisionOffset = 5;

        // board settings
        this.layer = 6;
        this.cells = 16;

        this.activeWave = 0;

        this.patternManager = new PatternManager();

        this.player = new Player(0, this.ctx, this.inputManager, this.layer, 0, this.screenSize.width, this.screenSize.height, this.patternManager.getPattern(0).waves[this.activeWave].win);

        this.enemies = new Array<Enemy>();
        for (const enemyData of this.patternManager.getPattern(0).waves[this.activeWave].enemies) {
            this.enemies.push(new Enemy(enemyData.id, this.ctx, this.screenSize.width, this.screenSize.height, enemyData.ring, enemyData.angle, enemyData.speed, enemyData.delay));
        }

        this.gems = new Array<Gem>();
        for (const gemData of this.patternManager.getPattern(0).waves[this.activeWave].gems) {
            this.gems.push(new Gem(gemData.id, this.ctx, this.screenSize.width, this.screenSize.height, gemData.type, gemData.ring, gemData.angle, gemData.speed, gemData.delay));
        }

        this.gamebg = new GameBackground(this.ctx, this.screenSize, this.layer, this.cells);
        this.scanline = new Scanline(this.ctx, this.screenSize.width, this.screenSize.height);
        this.stats = new Stats(this.ctx, this.player, { width: this.screenSize.width, height: this.screenSize.height });        
    }

    update() {
        this.scanline.update();
        
        // update enemies
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();

            if (Math.abs(this.enemies[i].realPos - this.scanline.scanlinePos) < 2) {
                this.enemies[i].alpha = 1;
            }
        }

        // update gems
        for (let i = 0; i < this.gems.length; i++) {
            this.gems[i].update();

            if (Math.abs(this.gems[i].realPos - this.scanline.scanlinePos) < 2) {
                this.gems[i].alpha = 1;
            }
        }

        // update player
        this.player.update();

        if (this.player.checkGoals()) {
            this.advanceWave();
        }

        // player enemy collision
        for (let j = 0; j < this.enemies.length; j++) {
            if (this.player.pos === this.enemies[j].layer) {
                if (Math.abs(this.player.axisPool[this.player.axis] - this.enemies[j].angle) < this.collisionOffset) {                        
                    this.player.health--;

                    this.enemies = this.enemies.filter((e) => e !== this.enemies[j]);
                }
            }
        }

        // player gem collision
        for (let j = 0; j < this.gems.length; j++) {
            if (this.player.pos === this.gems[j].layer) {
                if (Math.abs(this.player.axisPool[this.player.axis] - this.gems[j].angle) < this.collisionOffset) {                        
                    this.player.collectGem(this.gems[j].type);

                    this.gems = this.gems.filter((e) => e !== this.gems[j]);
                }
            }
        }

        if (this.player.health < 0) {
            this.resetWave();
        }

        this.inputManager.update();
    }

    render() {
        this.gamebg.render();
        this.scanline.render();

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].render();
        }

        for (let i = 0; i < this.gems.length; i++) {
            this.gems[i].render();
        }

        this.player.render();

        this.stats.render();
    }

    public resetWave() {
        this.player.reset();
    }

    public advanceWave() {
        this.player.reset();
        this.activeWave++;
        // set new player goals
        this.player.setGoals(this.patternManager.getPattern(0).waves[this.activeWave].win);

        // new enemies
        for (const enemyData of this.patternManager.getPattern(0).waves[this.activeWave].enemies) {
            this.enemies.push(new Enemy(enemyData.id, this.ctx, this.screenSize.width, this.screenSize.height, enemyData.ring, enemyData.angle, enemyData.speed, enemyData.delay));
        }

        // new gems
        for (const gemData of this.patternManager.getPattern(0).waves[this.activeWave].gems) {
            this.gems.push(new Gem(gemData.id, this.ctx, this.screenSize.width, this.screenSize.height, gemData.type, gemData.ring, gemData.angle, gemData.speed, gemData.delay));
        }
    }

}