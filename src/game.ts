import { Player } from "./player";
import { Enemy } from "./enemy";
import { Scanline } from "./scanline";
import { Utils } from "./utils";
import { Gem } from "./gem";

import { PATTERN } from "./pattern";

export class Game {

    // setup
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // world map
    layer: number;
    cells: number;

    scanline: Scanline;

    // globals
    w: number;
    h: number;
    bgColor: string;
    collisionOffset: number;

    player: Player;

    enemies: Array<Enemy>;

    gems: Array<Gem>;
    gemIds: number;

    activeWave: number;

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.w = 800;
        this.h = 480;
        this.bgColor = "#533B59";
        this.collisionOffset = 5;

        this.layer = 6;
        this.cells = 16;

        this.scanline = new Scanline(this.ctx, this.w, this.h);

        // init globals
        this.activeWave = 0;

        this.player = new Player(0, this.ctx, this.layer, 0, this.w, this.h, PATTERN.waves[this.activeWave].win);

        this.enemies = new Array<Enemy>();
        for (const enemyData of PATTERN.waves[this.activeWave].enemys) {
            this.enemies.push(new Enemy(enemyData.id, this.ctx, this.w, this.h, enemyData.ring, enemyData.angle, enemyData.speed, enemyData.delay));
        }

        this.gems = new Array<Gem>();
        for (const gemData of PATTERN.waves[this.activeWave].gems) {
            this.gems.push(new Gem(gemData.id, this.ctx, this.w, this.h, gemData.type, gemData.ring, gemData.angle, gemData.speed, gemData.delay));
        }

        // gameloop
        this.update = this.update.bind(this);
        window.requestAnimationFrame(this.update);
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

        this.draw();
        window.requestAnimationFrame(this.update);
    }

    draw() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.w, this.h);

        this.drawBoard();

        this.scanline.render();

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].render();
        }

        for (let i = 0; i < this.gems.length; i++) {
            this.gems[i].render();
        }

        this.player.render();

        this.ctx.font = "13px sans-serif";
        this.ctx.fillStyle = "rgb(199, 191, 65)";
        this.ctx.fillText(`${this.player.green.toString()} | ${this.player.greenGoal.toString()}`, 30, 40);
        this.ctx.fillStyle = "rgb(0, 90, 127)";
        this.ctx.fillText(`${this.player.blue.toString()} | ${this.player.blueGoal.toString()}`, 30, 60);
        this.ctx.fillStyle = "rgb(255, 199, 54)";
        this.ctx.fillText(`${this.player.yellow.toString()} | ${this.player.yellowGoal.toString()}`, 30, 80);
    }

    drawBoard() {
        this.ctx.strokeStyle = "#D95970";
        let minR = 50;
        let scaleR = 30;

        for (let i = 0; i < this.layer + 1; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.w/2, this.h/2, minR + scaleR * i, 0, Math.PI*2);
            this.ctx.stroke();
        }

        this.drawDebugLines();

        // clear center circle
        this.ctx.fillStyle = this.bgColor;
        this.ctx.beginPath();
        this.ctx.arc(this.w/2, this.h/2, minR, 0, 2 * Math.PI);
        this.ctx.fill();

        // draw center circle aka player health
        this.ctx.fillStyle = "#D95970";
        this.ctx.beginPath();
        this.ctx.lineTo(this.w/2 + minR, this.h/2);
        this.ctx.arc(this.w/2, this.h/2, minR, 0, (this.player.health / this.player.maxHealth) * 2 * Math.PI, false);
        this.ctx.lineTo(this.w/2, this.h/2);
        this.ctx.fill();
    }

    drawDebugLines() {
        this.ctx.strokeStyle = "#D95970";
        let slice = 360 / this.cells;

        for (let i = 0; i < this.cells; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.w/2, this.h/2);
            this.ctx.lineTo((Math.cos(Utils.deg2rad(i * slice)) * 230) + this.w/2, (Math.sin(Utils.deg2rad(i * slice)) * 230) + this.h/2);
            this.ctx.stroke();
        }
    }

    resetWave() {
        this.player.reset();
    }

    advanceWave() {
        this.player.reset();
        this.activeWave++;
        // set new player goals
        this.player.setGoals(PATTERN.waves[this.activeWave].win);

        // new enemies
        for (const enemyData of PATTERN.waves[this.activeWave].enemys) {
            this.enemies.push(new Enemy(enemyData.id, this.ctx, this.w, this.h, enemyData.ring, enemyData.angle, enemyData.speed, enemyData.delay));
        }

        // new gems
        for (const gemData of PATTERN.waves[this.activeWave].gems) {
            this.gems.push(new Gem(gemData.id, this.ctx, this.w, this.h, gemData.type, gemData.ring, gemData.angle, gemData.speed, gemData.delay));
        }
    }

    
}