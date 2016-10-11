import { Player } from "./player";
import { Enemy } from "./enemy";
import { Scanline } from "./scanline";
import { Utils } from "./utils";
import { Gem } from "./gem";

export class Game {

    // setup
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // globals
    w: number;
    h: number;
    bgColor: string;
    collisionOffset: number;

    // world map
    layer: number;
    cells: number;

    player: Player;
    enemies: Array<Enemy>;
    enemyIds: number;

    gems: Array<Gem>;
    gemIds: number;

    scanline: Scanline;

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.w = 800;
        this.h = 480;
        this.bgColor = "#533B59";
        this.collisionOffset = 5;

        this.layer = 6;
        this.cells = 16;

        this.player = new Player(0, this.ctx, this.layer, 0, this.w, this.h);

        this.enemies = new Array<Enemy>();
        this.enemyIds = 0;
        for (let i = 0; i < 10; i++) {
            this.enemies.push(new Enemy(this.enemyIds++, this.ctx, this.layer, this.w, this.h));
        }

        this.gems = new Array<Gem>();
        this.gemIds = 0;
        for (let i = 0; i < 10; i++) {
            this.gems.push(new Gem(this.gemIds++, this.ctx, this.layer, this.w, this.h));
        }

        this.scanline = new Scanline(this.ctx, this.w, this.h);

        this.update = this.update.bind(this);
        window.requestAnimationFrame(this.update);
    }   

    update() {
        this.scanline.update();

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();

            if (Math.abs(this.enemies[i].realPos - this.scanline.scanlinePos) < 2) {
                this.enemies[i].alpha = 1;
            }
        }

        for (let i = 0; i < this.gems.length; i++) {
            this.gems[i].update();

            if (Math.abs(this.gems[i].realPos - this.scanline.scanlinePos) < 2) {
                this.gems[i].alpha = 1;
            }
        }

        this.player.update();

        for (let j = 0; j < this.enemies.length; j++) {
            if (this.player.pos === this.enemies[j].layer) {
                if (Math.abs(this.player.axisPool[this.player.axis] - this.enemies[j].angle) < this.collisionOffset) {                        
                    this.player.health--;

                    this.enemies = this.enemies.filter((e) => e !== this.enemies[j]);
                    this.enemies.push(new Enemy(this.enemyIds++, this.ctx, this.layer, this.w, this.h));
                }
            }
        }

        for (let j = 0; j < this.gems.length; j++) {
            if (this.player.pos === this.gems[j].layer) {
                if (Math.abs(this.player.axisPool[this.player.axis] - this.gems[j].angle) < this.collisionOffset) {                        
                    this.player.score++;

                    this.gems = this.gems.filter((e) => e !== this.gems[j]);
                    this.gems.push(new Gem(this.gemIds++, this.ctx, this.layer, this.w, this.h));
                }
            }
        }

        if (this.player.health < 0) {
            this.resetGame();
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

        this.ctx.font = "18px sans-serif";
        this.ctx.fillStyle = "#F28963";
        this.ctx.fillText(this.player.score.toString(), 30, 40);
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

    resetGame() {
        this.player.health = this.player.maxHealth;
        this.player.score = 0;
    }
}