import { Player } from "./player";
import { Enemy } from "./enemy";
import { Scanline } from "./scanline";
import { Utils } from "./utils";

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

    players: Array<Player>;
    enemies: Array<Enemy>;
    enemyIds: number;

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

        this.players = new Array<Player>();
        this.players[0] = new Player(0, this.ctx, this.layer, "#F28963", 0, this.w, this.h);
        this.players[1] = new Player(1, this.ctx, this.layer, "#F2D680", 2, this.w, this.h);

        this.enemies = new Array<Enemy>();
        this.enemyIds = 0;
        for (let i = 0; i < 10; i++) {
            this.enemies.push(new Enemy(this.enemyIds++, this.ctx, this.layer, this.w, this.h));
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

        for (let i = 0; i < this.players.length; i++) {
            for (let j = 0; j < this.enemies.length; j++) {
                if (this.players[i].pos === this.enemies[j].layer) {
                    if (Math.abs(this.players[i].axisPool[this.players[i].axis] - this.enemies[j].angle) < this.collisionOffset) {
                        // console.log("hit: " + enemies[j].id);
                        this.players[i].score++;

                        this.enemies = this.enemies.filter((e) => e !== this.enemies[j]);
                        this.enemies.push(new Enemy(this.enemyIds++, this.ctx, this.layer, this.w, this.h));
                    }
                }
            }
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

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].render();
        }

        this.ctx.font = "18px sans-serif";
        this.ctx.fillStyle = "#F28963";
        this.ctx.fillText(this.players[0].score.toString(), 30, 40);
        this.ctx.fillStyle = "#F2D680";
        this.ctx.fillText(this.players[1].score.toString(), this.w - 40, 40);
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

        this.ctx.fillStyle = "#D95970";
        this.ctx.beginPath();
        this.ctx.arc(this.w/2, this.h/2, minR, 0, Math.PI*2);
        this.ctx.fill();

        this.drawDebugLines();
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
}