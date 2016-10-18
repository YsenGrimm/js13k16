/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var game_1 = __webpack_require__(1);
	var gameStart = new game_1.Game();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var player_1 = __webpack_require__(2);
	var enemy_1 = __webpack_require__(5);
	var scanline_1 = __webpack_require__(6);
	var utils_1 = __webpack_require__(3);
	var gem_1 = __webpack_require__(4);
	var pattern_1 = __webpack_require__(7);
	var Game = (function () {
	    function Game() {
	        this.canvas = document.getElementById("canvas");
	        this.ctx = this.canvas.getContext("2d");
	        this.w = 800;
	        this.h = 480;
	        this.bgColor = "#533B59";
	        this.collisionOffset = 5;
	        this.layer = 6;
	        this.cells = 16;
	        this.scanline = new scanline_1.Scanline(this.ctx, this.w, this.h);
	        // init globals
	        this.activeWave = 0;
	        this.player = new player_1.Player(0, this.ctx, this.layer, 0, this.w, this.h, pattern_1.PATTERN.waves[this.activeWave].win);
	        this.enemies = new Array();
	        for (var _i = 0, _a = pattern_1.PATTERN.waves[this.activeWave].enemys; _i < _a.length; _i++) {
	            var enemyData = _a[_i];
	            this.enemies.push(new enemy_1.Enemy(enemyData.id, this.ctx, this.w, this.h, enemyData.ring, enemyData.angle, enemyData.speed, enemyData.delay));
	        }
	        this.gems = new Array();
	        for (var _b = 0, _c = pattern_1.PATTERN.waves[this.activeWave].gems; _b < _c.length; _b++) {
	            var gemData = _c[_b];
	            this.gems.push(new gem_1.Gem(gemData.id, this.ctx, this.w, this.h, gemData.type, gemData.ring, gemData.angle, gemData.speed, gemData.delay));
	        }
	        // gameloop
	        this.update = this.update.bind(this);
	        window.requestAnimationFrame(this.update);
	    }
	    Game.prototype.update = function () {
	        var _this = this;
	        this.scanline.update();
	        // update enemies
	        for (var i = 0; i < this.enemies.length; i++) {
	            this.enemies[i].update();
	            if (Math.abs(this.enemies[i].realPos - this.scanline.scanlinePos) < 2) {
	                this.enemies[i].alpha = 1;
	            }
	        }
	        // update gems
	        for (var i = 0; i < this.gems.length; i++) {
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
	        var _loop_1 = function(j) {
	            if (this_1.player.pos === this_1.enemies[j].layer) {
	                if (Math.abs(this_1.player.axisPool[this_1.player.axis] - this_1.enemies[j].angle) < this_1.collisionOffset) {
	                    this_1.player.health--;
	                    this_1.enemies = this_1.enemies.filter(function (e) { return e !== _this.enemies[j]; });
	                }
	            }
	        };
	        var this_1 = this;
	        for (var j = 0; j < this.enemies.length; j++) {
	            _loop_1(j);
	        }
	        // player gem collision
	        var _loop_2 = function(j) {
	            if (this_2.player.pos === this_2.gems[j].layer) {
	                if (Math.abs(this_2.player.axisPool[this_2.player.axis] - this_2.gems[j].angle) < this_2.collisionOffset) {
	                    this_2.player.collectGem(this_2.gems[j].type);
	                    this_2.gems = this_2.gems.filter(function (e) { return e !== _this.gems[j]; });
	                }
	            }
	        };
	        var this_2 = this;
	        for (var j = 0; j < this.gems.length; j++) {
	            _loop_2(j);
	        }
	        if (this.player.health < 0) {
	            this.resetWave();
	        }
	        this.draw();
	        window.requestAnimationFrame(this.update);
	    };
	    Game.prototype.draw = function () {
	        this.ctx.fillStyle = this.bgColor;
	        this.ctx.fillRect(0, 0, this.w, this.h);
	        this.drawBoard();
	        this.scanline.render();
	        for (var i = 0; i < this.enemies.length; i++) {
	            this.enemies[i].render();
	        }
	        for (var i = 0; i < this.gems.length; i++) {
	            this.gems[i].render();
	        }
	        this.player.render();
	        this.ctx.font = "13px sans-serif";
	        this.ctx.fillStyle = "rgb(199, 191, 65)";
	        this.ctx.fillText(this.player.green.toString() + " | " + this.player.greenGoal.toString(), 30, 40);
	        this.ctx.fillStyle = "rgb(0, 90, 127)";
	        this.ctx.fillText(this.player.blue.toString() + " | " + this.player.blueGoal.toString(), 30, 60);
	        this.ctx.fillStyle = "rgb(255, 199, 54)";
	        this.ctx.fillText(this.player.yellow.toString() + " | " + this.player.yellowGoal.toString(), 30, 80);
	    };
	    Game.prototype.drawBoard = function () {
	        this.ctx.strokeStyle = "#D95970";
	        var minR = 50;
	        var scaleR = 30;
	        for (var i = 0; i < this.layer + 1; i++) {
	            this.ctx.beginPath();
	            this.ctx.arc(this.w / 2, this.h / 2, minR + scaleR * i, 0, Math.PI * 2);
	            this.ctx.stroke();
	        }
	        this.drawDebugLines();
	        // clear center circle
	        this.ctx.fillStyle = this.bgColor;
	        this.ctx.beginPath();
	        this.ctx.arc(this.w / 2, this.h / 2, minR, 0, 2 * Math.PI);
	        this.ctx.fill();
	        // draw center circle aka player health
	        this.ctx.fillStyle = "#D95970";
	        this.ctx.beginPath();
	        this.ctx.lineTo(this.w / 2 + minR, this.h / 2);
	        this.ctx.arc(this.w / 2, this.h / 2, minR, 0, (this.player.health / this.player.maxHealth) * 2 * Math.PI, false);
	        this.ctx.lineTo(this.w / 2, this.h / 2);
	        this.ctx.fill();
	    };
	    Game.prototype.drawDebugLines = function () {
	        this.ctx.strokeStyle = "#D95970";
	        var slice = 360 / this.cells;
	        for (var i = 0; i < this.cells; i++) {
	            this.ctx.beginPath();
	            this.ctx.moveTo(this.w / 2, this.h / 2);
	            this.ctx.lineTo((Math.cos(utils_1.Utils.deg2rad(i * slice)) * 230) + this.w / 2, (Math.sin(utils_1.Utils.deg2rad(i * slice)) * 230) + this.h / 2);
	            this.ctx.stroke();
	        }
	    };
	    Game.prototype.resetWave = function () {
	        this.player.reset();
	    };
	    Game.prototype.advanceWave = function () {
	        this.player.reset();
	        this.activeWave++;
	        // set new player goals
	        this.player.setGoals(pattern_1.PATTERN.waves[this.activeWave].win);
	        // new enemies
	        for (var _i = 0, _a = pattern_1.PATTERN.waves[this.activeWave].enemys; _i < _a.length; _i++) {
	            var enemyData = _a[_i];
	            this.enemies.push(new enemy_1.Enemy(enemyData.id, this.ctx, this.w, this.h, enemyData.ring, enemyData.angle, enemyData.speed, enemyData.delay));
	        }
	        // new gems
	        for (var _b = 0, _c = pattern_1.PATTERN.waves[this.activeWave].gems; _b < _c.length; _b++) {
	            var gemData = _c[_b];
	            this.gems.push(new gem_1.Gem(gemData.id, this.ctx, this.w, this.h, gemData.type, gemData.ring, gemData.angle, gemData.speed, gemData.delay));
	        }
	    };
	    return Game;
	}());
	exports.Game = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(3);
	var gem_1 = __webpack_require__(4);
	var Player = (function () {
	    function Player(id, ctx, layer, startAxis, gameWidth, gameHeigth, goal) {
	        var _this = this;
	        this.id = id;
	        this.ctx = ctx;
	        this.color = "rgb(242, 214, 128)";
	        this.pos = 0;
	        this.axis = startAxis;
	        this.axisPool = [0, 90, 180, 270];
	        this.maxPos = layer - 1;
	        this.minOffset = 64;
	        this.offset = 30;
	        this.gameWidth = gameWidth;
	        this.gameHeigth = gameHeigth;
	        this.size = 6;
	        this.width = 30;
	        this.height = 4;
	        this.maxHealth = 3;
	        this.health = this.maxHealth;
	        // gems goal
	        this.green = 0;
	        this.greenGoal = goal.green;
	        this.blue = 0;
	        this.blueGoal = goal.blue;
	        this.yellow = 0;
	        this.yellowGoal = goal.yellow;
	        document.addEventListener("keydown", function (e) { return _this.handleInput(e); });
	    }
	    Player.prototype.handleInput = function (e) {
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
	    };
	    Player.prototype.update = function () {
	    };
	    Player.prototype.render = function () {
	        this.ctx.fillStyle = this.color;
	        if (Math.abs(Math.cos(utils_1.Utils.deg2rad(this.axisPool[this.axis]))) > 0.5) {
	            this.ctx.fillRect((Math.cos(utils_1.Utils.deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + this.gameWidth / 2 - this.width / 2, (Math.sin(utils_1.Utils.deg2rad(this.axisPool[this.axis])) * (this.minOffset + this.offset * this.pos)) + this.gameHeigth / 2 - this.height / 2, this.width, this.height);
	        }
	        else {
	            this.ctx.fillRect((Math.cos(utils_1.Utils.deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + this.gameWidth / 2 - this.height / 2, (Math.sin(utils_1.Utils.deg2rad(this.axisPool[this.axis])) * (this.minOffset + this.offset * this.pos)) + this.gameHeigth / 2 - this.width / 2, this.height, this.width);
	        }
	    };
	    Player.prototype.collectGem = function (gem) {
	        switch (gem) {
	            case gem_1.GemType.G:
	                this.green++;
	                break;
	            case gem_1.GemType.B:
	                this.blue++;
	                break;
	            case gem_1.GemType.Y:
	                this.yellow++;
	                break;
	        }
	    };
	    Player.prototype.checkGoals = function () {
	        return (this.green === this.greenGoal && this.blue === this.blueGoal && this.yellow === this.yellowGoal);
	    };
	    Player.prototype.reset = function () {
	        this.health = this.maxHealth;
	        this.green = 0;
	        this.blue = 0;
	        this.yellow = 0;
	    };
	    Player.prototype.setGoals = function (goal) {
	        this.greenGoal = goal.green;
	        this.blueGoal = goal.blue;
	        this.yellowGoal = goal.yellow;
	    };
	    return Player;
	}());
	exports.Player = Player;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var Utils = (function () {
	    function Utils() {
	    }
	    Utils.deg2rad = function (deg) {
	        return deg * (Math.PI / 180);
	    };
	    Utils.getRandomInt = function (min, max) {
	        return Math.floor(Math.random() * (max - min + 1)) + min;
	    };
	    Utils.getRandomArbitrary = function (min, max) {
	        return Math.random() * (max - min) + min;
	    };
	    Utils.getRandomColor = function () {
	        return "rgb(" + Utils.getRandomInt(0, 255) + ", " + Utils.getRandomInt(0, 255) + ", " + Utils.getRandomInt(0, 255) + ")";
	    };
	    return Utils;
	}());
	exports.Utils = Utils;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(3);
	(function (GemType) {
	    GemType[GemType["G"] = 0] = "G";
	    GemType[GemType["B"] = 1] = "B";
	    GemType[GemType["Y"] = 2] = "Y";
	    GemType[GemType["size"] = 3] = "size";
	})(exports.GemType || (exports.GemType = {}));
	var GemType = exports.GemType;
	var Gem = (function () {
	    function Gem(id, ctx, width, height, type, layer, angle, speed, delay) {
	        this.id = id;
	        this.ctx = ctx;
	        this.w = width;
	        this.h = height;
	        // other
	        this.layer = layer;
	        this.angle = angle;
	        this.minOffset = 64;
	        this.offset = 30;
	        this.size = 14;
	        this.speed = speed;
	        this.delay = delay;
	        switch (type) {
	            case "green":
	                this.type = GemType.G;
	                break;
	            case "blue":
	                this.type = GemType.B;
	                break;
	            case "yellow":
	                this.type = GemType.Y;
	                break;
	            default:
	                this.type = GemType.G;
	        }
	        this.realPos = this.minOffset + this.offset * this.layer;
	        this.alpha = 1;
	        this.fade = 0.006;
	        this.fadeDelay = this.speed * 2;
	    }
	    Gem.prototype.update = function () {
	        if (this.delay > 0) {
	            // 1 frame ~ 16.666 ms at 60 fps
	            this.delay -= 16;
	            return;
	        }
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
	    };
	    Gem.prototype.render = function () {
	        if (this.delay > 0) {
	            return;
	        }
	        switch (this.type) {
	            case GemType.G:
	                this.ctx.fillStyle = "rgb(153, 138, 47)";
	                break;
	            case GemType.B:
	                this.ctx.fillStyle = "rgb(0, 60, 85)";
	                break;
	            case GemType.Y:
	                this.ctx.fillStyle = "rgb(255, 166, 68)";
	                break;
	        }
	        var x = (Math.cos(utils_1.Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.w / 2;
	        var y = (Math.sin(utils_1.Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.h / 2;
	        this.ctx.beginPath();
	        this.ctx.moveTo(x, y - this.size / 2);
	        this.ctx.lineTo(x + this.size / 2, y);
	        this.ctx.lineTo(x, y + this.size / 2);
	        this.ctx.lineTo(x, y - this.size / 2);
	        this.ctx.fill();
	        switch (this.type) {
	            case GemType.G:
	                this.ctx.fillStyle = "rgb(199, 191, 65)";
	                break;
	            case GemType.B:
	                this.ctx.fillStyle = "rgb(0, 90, 127)";
	                break;
	            case GemType.Y:
	                this.ctx.fillStyle = "rgb(255, 199, 54)";
	                break;
	        }
	        this.ctx.beginPath();
	        this.ctx.moveTo(x, y + this.size / 2);
	        this.ctx.lineTo(x - this.size / 2, y);
	        this.ctx.lineTo(x, y - this.size / 2);
	        this.ctx.lineTo(x, y + this.size / 2);
	        this.ctx.fill();
	    };
	    return Gem;
	}());
	exports.Gem = Gem;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(3);
	var Enemy = (function () {
	    function Enemy(id, ctx, width, height, layer, angle, speed, delay) {
	        this.id = id;
	        this.ctx = ctx;
	        this.w = width;
	        this.h = height;
	        // other
	        this.layer = layer;
	        this.angle = angle;
	        this.minOffset = 64;
	        this.offset = 30;
	        this.size = 6;
	        this.speed = speed;
	        this.delay = delay;
	        this.realPos = this.minOffset + this.offset * this.layer;
	        this.alpha = 1;
	        this.fade = 0.006;
	        this.fadeDelay = this.speed * 2;
	    }
	    Enemy.prototype.update = function () {
	        if (this.delay > 0) {
	            // 1 frame ~ 16.666 ms at 60 fps
	            this.delay -= 16;
	            return;
	        }
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
	    };
	    Enemy.prototype.render = function () {
	        if (this.delay > 0) {
	            return;
	        }
	        this.ctx.fillStyle = "rgba(217, 91, 91, " + this.alpha + ")";
	        this.ctx.beginPath();
	        this.ctx.arc((Math.cos(utils_1.Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.w / 2, (Math.sin(utils_1.Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.h / 2, this.size, 0, Math.PI * 2);
	        this.ctx.fill();
	    };
	    return Enemy;
	}());
	exports.Enemy = Enemy;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	var Scanline = (function () {
	    function Scanline(ctx, width, height) {
	        this.ctx = ctx;
	        this.scanlineStart = 30;
	        this.scanlineEnd = 240;
	        this.scanlinePos = this.scanlineStart;
	        this.scanlineSpeed = 1.5;
	        this.w = width;
	        this.h = height;
	    }
	    Scanline.prototype.update = function () {
	        this.scanlinePos += this.scanlineSpeed;
	        if (this.scanlinePos > this.scanlineEnd) {
	            this.scanlinePos = this.scanlineStart;
	        }
	    };
	    Scanline.prototype.render = function () {
	        this.ctx.strokeStyle = "#D95970";
	        this.ctx.lineWidth = 3;
	        this.ctx.beginPath();
	        this.ctx.arc(this.w / 2, this.h / 2, this.scanlinePos, 0, Math.PI * 2);
	        this.ctx.stroke();
	        this.ctx.lineWidth = 1;
	    };
	    return Scanline;
	}());
	exports.Scanline = Scanline;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	exports.PATTERN = {
	    waves: [
	        {
	            id: 0,
	            win: {
	                green: 2,
	                blue: 1,
	                yellow: 1
	            },
	            enemys: [
	                {
	                    id: 0,
	                    ring: 0,
	                    speed: 2.0,
	                    delay: 2000,
	                    angle: 180
	                }
	            ],
	            gems: [
	                {
	                    type: "blue",
	                    id: 0,
	                    ring: 1,
	                    speed: 1.2,
	                    delay: 0,
	                    angle: 90
	                },
	                {
	                    type: "green",
	                    id: 1,
	                    ring: 4,
	                    speed: 3.4,
	                    delay: 3200,
	                    angle: 90
	                },
	                {
	                    type: "green",
	                    id: 2,
	                    ring: 2,
	                    speed: 2.3,
	                    delay: 1600,
	                    angle: 90
	                },
	                {
	                    type: "yellow",
	                    id: 3,
	                    ring: 1,
	                    speed: 2.0,
	                    delay: 0,
	                    angle: 90
	                }
	            ]
	        },
	        {
	            id: 1,
	            win: {
	                green: 4,
	                blue: 2,
	                yellow: 2
	            },
	            enemys: [
	                {
	                    id: 0,
	                    ring: 5,
	                    speed: 2.0,
	                    delay: 1000,
	                    angle: 180
	                },
	                {
	                    id: 0,
	                    ring: 1,
	                    speed: 2.0,
	                    delay: 0,
	                    angle: 180
	                },
	                {
	                    id: 0,
	                    ring: 2,
	                    speed: 2.0,
	                    delay: 0,
	                    angle: 180
	                },
	                {
	                    id: 0,
	                    ring: 4,
	                    speed: 2.0,
	                    delay: 0,
	                    angle: 180
	                }
	            ],
	            gems: [
	                {
	                    type: "blue",
	                    id: 0,
	                    ring: 1,
	                    speed: 1.5,
	                    delay: 2000,
	                    angle: 90
	                },
	                {
	                    type: "blue",
	                    id: 1,
	                    ring: 2,
	                    speed: 1.5,
	                    delay: 4000,
	                    angle: 90
	                },
	                {
	                    type: "green",
	                    id: 2,
	                    ring: 2,
	                    speed: 1.2,
	                    delay: 0,
	                    angle: 90
	                },
	                {
	                    type: "green",
	                    id: 3,
	                    ring: 3,
	                    speed: 1.5,
	                    delay: 0,
	                    angle: 90
	                },
	                {
	                    type: "green",
	                    id: 4,
	                    ring: 4,
	                    speed: 1.8,
	                    delay: 0,
	                    angle: 90
	                },
	                {
	                    type: "green",
	                    id: 5,
	                    ring: 5,
	                    speed: 2.0,
	                    delay: 0,
	                    angle: 90
	                },
	                {
	                    type: "yellow",
	                    id: 6,
	                    ring: 0,
	                    speed: 2.0,
	                    delay: 4000,
	                    angle: 90
	                },
	                {
	                    type: "yellow",
	                    id: 7,
	                    ring: 1,
	                    speed: 2.5,
	                    delay: 5000,
	                    angle: 90
	                }
	            ]
	        }
	    ]
	};


/***/ }
/******/ ]);
//# sourceMappingURL=game.js.map