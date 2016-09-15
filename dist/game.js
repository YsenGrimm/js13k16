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
	var enemy_1 = __webpack_require__(4);
	var scanline_1 = __webpack_require__(5);
	var utils_1 = __webpack_require__(3);
	var Game = (function () {
	    function Game() {
	        console.log("foobar");
	        this.canvas = document.getElementById("canvas");
	        this.ctx = this.canvas.getContext("2d");
	        this.w = 800;
	        this.h = 480;
	        this.bgColor = "#533B59";
	        this.collisionOffset = 5;
	        this.layer = 6;
	        this.cells = 16;
	        this.players = new Array();
	        this.players[0] = new player_1.Player(0, this.ctx, this.layer, "#F28963", 0, this.w, this.h);
	        this.players[1] = new player_1.Player(1, this.ctx, this.layer, "#F2D680", 2, this.w, this.h);
	        this.enemies = new Array();
	        this.enemyIds = 0;
	        for (var i = 0; i < 10; i++) {
	            this.enemies.push(new enemy_1.Enemy(this.enemyIds++, this.ctx, this.layer, this.w, this.h));
	        }
	        this.scanline = new scanline_1.Scanline(this.ctx, this.w, this.h);
	        this.update = this.update.bind(this);
	        window.requestAnimationFrame(this.update);
	    }
	    Game.prototype.update = function () {
	        var _this = this;
	        this.scanline.update();
	        for (var i = 0; i < this.enemies.length; i++) {
	            this.enemies[i].update();
	            if (Math.abs(this.enemies[i].realPos - this.scanline.scanlinePos) < 2) {
	                this.enemies[i].alpha = 1;
	            }
	        }
	        for (var i = 0; i < this.players.length; i++) {
	            var _loop_1 = function(j) {
	                if (this_1.players[i].pos === this_1.enemies[j].layer) {
	                    if (Math.abs(this_1.players[i].axisPool[this_1.players[i].axis] - this_1.enemies[j].angle) < this_1.collisionOffset) {
	                        // console.log("hit: " + enemies[j].id);
	                        this_1.players[i].score++;
	                        this_1.enemies = this_1.enemies.filter(function (e) { return e !== _this.enemies[j]; });
	                        this_1.enemies.push(new enemy_1.Enemy(this_1.enemyIds++, this_1.ctx, this_1.layer, this_1.w, this_1.h));
	                    }
	                }
	            };
	            var this_1 = this;
	            for (var j = 0; j < this.enemies.length; j++) {
	                _loop_1(j);
	            }
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
	        for (var i = 0; i < this.players.length; i++) {
	            this.players[i].render();
	        }
	        this.ctx.font = "18px sans-serif";
	        this.ctx.fillStyle = "#F28963";
	        this.ctx.fillText(this.players[0].score.toString(), 30, 40);
	        this.ctx.fillStyle = "#F2D680";
	        this.ctx.fillText(this.players[1].score.toString(), this.w - 40, 40);
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
	        this.ctx.fillStyle = "#D95970";
	        this.ctx.beginPath();
	        this.ctx.arc(this.w / 2, this.h / 2, minR, 0, Math.PI * 2);
	        this.ctx.fill();
	        this.drawDebugLines();
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
	    return Game;
	}());
	exports.Game = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(3);
	var Player = (function () {
	    function Player(id, ctx, layer, color, startAxis, gameWidth, gameHeigth) {
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
	        this.gameWidth = gameWidth;
	        this.gameHeigth = gameHeigth;
	        this.handleInput = this.handleInput.bind(this);
	        document.addEventListener("keydown", this.handleInput);
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
	    return Utils;
	}());
	exports.Utils = Utils;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(3);
	var Enemy = (function () {
	    function Enemy(id, ctx, layer, width, height) {
	        this.id = id;
	        this.ctx = ctx;
	        this.layer = utils_1.Utils.getRandomInt(0, 5);
	        this.maxLayer = layer - 1;
	        this.angle = utils_1.Utils.getRandomArbitrary(0, 360);
	        this.minOffset = 64;
	        this.offset = 30;
	        this.size = 6;
	        this.speed = utils_1.Utils.getRandomArbitrary(1, 4);
	        this.realPos = this.minOffset + this.offset * this.layer;
	        this.alpha = 1;
	        this.fade = 0.006;
	        this.fadeDelay = this.speed * 2;
	        this.w = width;
	        this.h = height;
	    }
	    Enemy.prototype.update = function () {
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
	        this.ctx.fillStyle = "rgba(217, 91, 91, " + this.alpha + ")";
	        this.ctx.beginPath();
	        this.ctx.arc((Math.cos(utils_1.Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.w / 2, (Math.sin(utils_1.Utils.deg2rad(this.angle)) * (this.minOffset + this.offset * this.layer)) + this.h / 2, this.size, 0, Math.PI * 2);
	        this.ctx.fill();
	    };
	    return Enemy;
	}());
	exports.Enemy = Enemy;


/***/ },
/* 5 */
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


/***/ }
/******/ ]);
//# sourceMappingURL=game.js.map