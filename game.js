// setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// globals
const w = 800;
const h = 480;
const bgColor = "#533B59";

// world map
const layer = 6
const cells = 16

window.requestAnimationFrame(update);

function update() {

    draw();
    window.requestAnimationFrame(update);
}

function draw() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    drawBoard();

}

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
