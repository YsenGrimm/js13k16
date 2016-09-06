// setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// globals
const w = 800;
const h = 480;
const bgColor = "#533B59";

// world map
const layer = 6
const cells = 16

// init
// player
let players = [];
players[0] = new Player();
players[0].init(0, ctx, layer, "#F28963", 0);
players[1] = new Player();
players[1].init(1, ctx, layer, "#F2D680", 2);

const collisionOffset = 5;

// enemy
let enemies = [];
let enemyIds = 0;
for (let i = 0; i < 10; i++) {
    let enemy = new Enemy();
    enemy.init(enemyIds++, ctx, layer);
    enemies.push(enemy);
}

// scanline
let scanline = new Scanline();
scanline.init(ctx);

window.requestAnimationFrame(update);

function update() {
    scanline.update();

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update();

        if (Math.abs(enemies[i].realPos - scanline.scanlinePos) < 2) {
            enemies[i].alpha = 1;
        }
    }

    for (var i = 0; i < players.length; i++) {
        for (var j = 0; j < enemies.length; j++) {
            if (players[i].pos === enemies[j].layer) {
                if (Math.abs(players[i].axisPool[players[i].axis] - enemies[j].angle) < collisionOffset) {
                    // console.log("hit: " + enemies[j].id);
                    players[i].score++;

                    enemies = enemies.filter((e, i, a) => e !== enemies[j]);
                    let enemy = new Enemy();
                    enemy.init(enemyIds++, ctx, layer);
                    enemies.push(enemy);
                }
            }
        }
    }

    draw();
    window.requestAnimationFrame(update);
}

function draw() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    drawBoard();

    scanline.render();

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].render();
    }

    for (var i = 0; i < players.length; i++) {
        players[i].render();
    }

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#F28963";
    ctx.fillText(players[0].score, 30, 40);
    ctx.fillStyle = "#F2D680";
    ctx.fillText(players[1].score, w - 40, 40);
}

/************
 * Render Helper
 ************/
function drawBoard() {
    ctx.strokeStyle = "#D95970";
    let minR = 50;
    let scaleR = 30;

    for (var i = 0; i < layer + 1; i++) {
        ctx.beginPath();
        ctx.arc(w/2, h/2, minR + scaleR * i, 0, Math.PI*2);
        ctx.stroke();
    }

    ctx.fillStyle = "#D95970";
    ctx.beginPath();
    ctx.arc(w/2, h/2, minR, 0, Math.PI*2);
    ctx.fill();

    drawDebugLines();
}

function drawDebugLines() {
    ctx.strokeStyle = "#D95970";
    let slice = 360 / cells;

    for (var i = 0; i < cells; i++) {
        ctx.beginPath();
        ctx.moveTo(w/2, h/2);
        ctx.lineTo((Math.cos(deg2rad(i * slice)) * 230) + w/2, (Math.sin(deg2rad(i * slice)) * 230) + h/2);
        ctx.stroke();
    }
}

/************
 * Scanline
 ************/
function Scanline() {

    this.init = function(ctx) {
        this.ctx = ctx;
        this.scanlineStart = 30;
        this.scanlineEnd = 240;

        this.scanlinePos = this.scanlineStart;
        this.scanlineSpeed = 1.5;
    }

    this.update = function() {
        this.scanlinePos += this.scanlineSpeed;
        if (this.scanlinePos > this.scanlineEnd) {
            this.scanlinePos = this.scanlineStart;
        }
    }

    this.render = function() {
        this.ctx.strokeStyle = "#D95970";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath()
        this.ctx.arc(w/2, h/2, this.scanlinePos, 0, Math.PI*2);
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
    }
}

/************
 * Player
 ************/
function Player() {

    this.init = function(id, ctx, layer, color, startAxis) {
        this.id = id;
        this.ctx = ctx;
        this.color = color;

        this.pos = 0;
        this.axis = startAxis;
        this.axisPool = [0, 90, 180, 270];
        this.maxPos = layer - 1;
        this.minOffset = 64;
        this.offset = 30;

        this.size = 6;

        this.width = 30;
        this.height = 3;

        this.score = 0;

        this.handleInput = this.handleInput.bind(this);
        document.addEventListener("keydown", this.handleInput);
    }

    this.handleInput = function(e) {

        switch (this.id) {
            case 0:
                if (e.key === "ArrowLeft") {
                    this.pos--;
                    if (this.pos < 0) {
                        this.pos = 0;
                    }
                }
                if (e.key === "ArrowRight") {
                    this.pos++;
                    if (this.pos > this.maxPos) {
                        this.pos = this.maxPos;
                    }
                }
                if (e.key === "ArrowUp") {
                    this.axis--;
                    if (this.axis < 0) {
                        this.axis = 3;
                    }
                }
                if (e.key === "ArrowDown") {
                    this.axis++;
                    if (this.axis > 3) {
                        this.axis = 0;
                    }
                }
                break;

            case 1:
                if (e.key === "a") {
                    this.pos--;
                    if (this.pos < 0) {
                        this.pos = 0;
                    }
                }
                if (e.key === "d") {
                    this.pos++;
                    if (this.pos > this.maxPos) {
                        this.pos = this.maxPos;
                    }
                }
                if (e.key === "w") {
                    this.axis--;
                    if (this.axis < 0) {
                        this.axis = 3;
                    }
                }
                if (e.key === "s") {
                    this.axis++;
                    if (this.axis > 3) {
                        this.axis = 0;
                    }
                }
                break;
        }
    }

    this.update = function() {

    }

    this.render = function() {
        this.ctx.fillStyle = this.color;

        if (Math.abs(Math.cos(deg2rad(this.axisPool[this.axis]))) > 0.5) {
            this.ctx.fillRect((Math.cos(deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + w/2 - this.width/2,
                                (Math.sin(deg2rad(this.axisPool[this.axis])) * (this.minOffset + this.offset * this.pos)) + h/2 - this.height/2, this.width, this.height);
        } else {
            this.ctx.fillRect((Math.cos(deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + w/2 - this.height/2,
                                (Math.sin(deg2rad(this.axisPool[this.axis])) * (this.minOffset + this.offset * this.pos)) + h/2 - this.width/2, this.height, this.width);
        }
    }

}

/************
 * Enemy
 ************/
function Enemy() {

    this.init = function(id, ctx, layer) {
        this.id = id;
        this.ctx = ctx;

        this.layer = getRandomInt(0, 5);
        this.maxLayer = layer - 1;

        this.angle = getRandomArbitrary(0, 360);

        this.minOffset = 64;
        this.offset = 30;

        this.size = 6;

        this.speed = getRandomArbitrary(1, 4);

        this.realPos = this.minOffset + this.offset * this.layer;
        this.alpha = 1;
        this.fade = 0.006;
        this.fadeDelay = this.speed * 2;
    }

    this.update = function() {
        this.angle += this.speed;
        this.angle %= 360;

        this.fadeDelay--;
        if (this.fadeDelay < 0) {
            this.alpha -= this.fade;
            if (this.alpha < 0) {
                this.alpha = 0;
                this.fadeDelay = 5;
            }
        }

    }

    this.render = function() {
        this.ctx.fillStyle = `rgba(217, 91, 91, ${this.alpha})`;

        this.ctx.beginPath();
        this.ctx.arc((Math.cos(deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + w/2,
                        (Math.sin(deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + h/2,
                        this.size, 0, Math.PI*2);
        this.ctx.fill();
    }

}
