import { Player } from "../entities/player";
import { ScreenSize } from '../../utils/utils';


export class Stats {

    player: Player;
    ctx: CanvasRenderingContext2D;
    screen: ScreenSize;

    barHeight: number;
    barWidth: number;

    bottomOffset: number;
    sideOffset: number;
    margin: number;
    sideMargin: number;

   constructor(ctx: CanvasRenderingContext2D, player: Player, screen: ScreenSize) {
       this.ctx = ctx;
       this.player = player;
       this.screen = screen;

       this.barWidth = 20;
       this.barHeight = 30;

       this.bottomOffset = 60;
       this.sideOffset = 50;
       this.margin = 10;
       this.sideMargin = 40;
    }

    render(): void {

        this.drawGemBars();
        this.drawHealthBar();

    }

    drawGemBars() {
        // draw green
        this.ctx.fillStyle = "rgba(199, 191, 65, 1)";
        this.ctx.strokeStyle = "rgba(199, 191, 65, 1)";
        for (let i = 0; i < this.player.greenGoal; i++) {
            if (i < this.player.green) {
                this.ctx.strokeRect(this.screen.width - this.sideOffset, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
                this.ctx.fillRect(this.screen.width - this.sideOffset, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
            } else {
                this.ctx.strokeRect(this.screen.width - this.sideOffset, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
                this.ctx.fillStyle = "rgba(199, 191, 65, 0.2)";
                this.ctx.fillRect(this.screen.width - this.sideOffset, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
            }            
        }

        // draw blue
        this.ctx.fillStyle = "rgba(0, 90, 127, 1)";
        this.ctx.strokeStyle = "rgba(0, 90, 127, 1)";
        for (let i = 0; i < this.player.blueGoal; i++) {
            if (i < this.player.blue) {
                this.ctx.strokeRect(this.screen.width - this.sideOffset - this.sideMargin, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
                this.ctx.fillRect(this.screen.width - this.sideOffset - this.sideMargin, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
            } else {
                this.ctx.strokeRect(this.screen.width - this.sideOffset - this.sideMargin, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
                this.ctx.fillStyle = "rgba(0, 90, 127, 0.2)";
                this.ctx.fillRect(this.screen.width - this.sideOffset - this.sideMargin, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
            }            
        }

        // draw yellow
        this.ctx.fillStyle = "rgba(255, 199, 54, 1)";
        this.ctx.strokeStyle = "rgba(255, 199, 54, 1)";
        for (let i = 0; i < this.player.yellowGoal; i++) {
            if (i < this.player.yellow) {
                this.ctx.strokeRect(this.screen.width - this.sideOffset - this.sideMargin * 2, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
                this.ctx.fillRect(this.screen.width - this.sideOffset - this.sideMargin * 2, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
            } else {
                this.ctx.strokeRect(this.screen.width - this.sideOffset - this.sideMargin * 2, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
                this.ctx.fillStyle = "rgba(255, 199, 54, 0.2)";
                this.ctx.fillRect(this.screen.width - this.sideOffset - this.sideMargin * 2, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
            }            
        }
    }

    drawHealthBar() {
        
        this.ctx.strokeStyle = "rgba(217, 89, 112, 1)";
        this.ctx.fillStyle = "rgba(217, 89, 112, 1)";
        for (let i = 0; i < this.player.maxHealth; i++) {
            if (i < this.player.health) {
                this.ctx.strokeRect(this.screen.width - this.sideOffset - i * (this.margin + this.barHeight), this.bottomOffset - this.barHeight, this.barHeight, this.barWidth);
                this.ctx.fillRect(this.screen.width - this.sideOffset - i * (this.margin + this.barHeight), this.bottomOffset - this.barHeight, this.barHeight, this.barWidth);
            } else {
                this.ctx.strokeRect(this.screen.width - this.sideOffset - i * (this.margin + this.barHeight), this.bottomOffset - this.barHeight, this.barHeight, this.barWidth);
                this.ctx.fillStyle = "rgba(217, 89, 112, 0.1)";
                this.ctx.fillRect(this.screen.width - this.sideOffset - i * (this.margin + this.barHeight), this.bottomOffset - this.barHeight, this.barHeight, this.barWidth);
            }            
        }
    }

}