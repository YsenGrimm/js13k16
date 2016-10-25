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
	var ingame_1 = __webpack_require__(2);
	var menu_1 = __webpack_require__(11);
	var statemanager_1 = __webpack_require__(12);
	var input_1 = __webpack_require__(5);
	var Game = (function () {
	    function Game() {
	        this.canvas = document.getElementById("game");
	        this.ctx = this.canvas.getContext("2d", { alpha: false });
	        this.ctx.translate(0.5, 0.5);
	        this.inputManager = new input_1.Input();
	        // Settings
	        this.screenSize = { width: 800, height: 480 };
	        this.bgColor = "#533B59";
	        // States
	        this.stateManager = new statemanager_1.StateManager(statemanager_1.States.MENU);
	        this.ingame = new ingame_1.Ingame(this.ctx, this.inputManager, this.screenSize, this.bgColor);
	        this.menu = new menu_1.Menu(this.ctx, this.inputManager, this.screenSize, this.bgColor, this.stateManager);
	        // gameloop
	        this.update = this.update.bind(this);
	        window.requestAnimationFrame(this.update);
	    }
	    Game.prototype.update = function () {
	        switch (this.stateManager.activeState) {
	            case statemanager_1.States.GAME:
	                this.ingame.update();
	                break;
	            case statemanager_1.States.MENU:
	                this.menu.update();
	                break;
	            case statemanager_1.States.SCORE:
	                break;
	        }
	        this.draw();
	        window.requestAnimationFrame(this.update);
	    };
	    Game.prototype.draw = function () {
	        this.ctx.fillStyle = this.bgColor;
	        this.ctx.fillRect(0, 0, this.screenSize.width, this.screenSize.height);
	        switch (this.stateManager.activeState) {
	            case statemanager_1.States.GAME:
	                this.ingame.render();
	                break;
	            case statemanager_1.States.MENU:
	                this.menu.render();
	                break;
	            case statemanager_1.States.SCORE:
	                break;
	        }
	    };
	    return Game;
	}());
	exports.Game = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var player_1 = __webpack_require__(3);
	var enemy_1 = __webpack_require__(7);
	var scanline_1 = __webpack_require__(8);
	var utils_1 = __webpack_require__(4);
	var gem_1 = __webpack_require__(6);
	var stats_1 = __webpack_require__(9);
	var pattern_1 = __webpack_require__(10);
	var Ingame = (function () {
	    function Ingame(ctx, inputManager, screenSize, bgColor) {
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
	        this.player = new player_1.Player(0, this.ctx, this.inputManager, this.layer, 0, this.screenSize.width, this.screenSize.height, pattern_1.PATTERN.waves[this.activeWave].win);
	        this.enemies = new Array();
	        for (var _i = 0, _a = pattern_1.PATTERN.waves[this.activeWave].enemys; _i < _a.length; _i++) {
	            var enemyData = _a[_i];
	            this.enemies.push(new enemy_1.Enemy(enemyData.id, this.ctx, this.screenSize.width, this.screenSize.height, enemyData.ring, enemyData.angle, enemyData.speed, enemyData.delay));
	        }
	        this.gems = new Array();
	        for (var _b = 0, _c = pattern_1.PATTERN.waves[this.activeWave].gems; _b < _c.length; _b++) {
	            var gemData = _c[_b];
	            this.gems.push(new gem_1.Gem(gemData.id, this.ctx, this.screenSize.width, this.screenSize.height, gemData.type, gemData.ring, gemData.angle, gemData.speed, gemData.delay));
	        }
	        this.scanline = new scanline_1.Scanline(this.ctx, this.screenSize.width, this.screenSize.height);
	        this.stats = new stats_1.Stats(this.ctx, this.player, { width: this.screenSize.width, height: this.screenSize.height });
	    }
	    Ingame.prototype.update = function () {
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
	        this.inputManager.update();
	    };
	    Ingame.prototype.render = function () {
	        this.drawBoard();
	        this.scanline.render();
	        for (var i = 0; i < this.enemies.length; i++) {
	            this.enemies[i].render();
	        }
	        for (var i = 0; i < this.gems.length; i++) {
	            this.gems[i].render();
	        }
	        this.player.render();
	        this.stats.render();
	    };
	    Ingame.prototype.drawBoard = function () {
	        this.ctx.strokeStyle = "#D95970";
	        var minR = 50;
	        var scaleR = 30;
	        for (var i = 0; i < this.layer + 1; i++) {
	            this.ctx.beginPath();
	            this.ctx.arc(this.screenSize.width / 2, this.screenSize.height / 2, minR + scaleR * i, 0, Math.PI * 2);
	            this.ctx.stroke();
	        }
	        this.ctx.strokeStyle = "#D95970";
	        var slice = 360 / this.cells;
	        for (var i = 0; i < this.cells; i++) {
	            this.ctx.beginPath();
	            this.ctx.moveTo(this.screenSize.width / 2, this.screenSize.height / 2);
	            this.ctx.lineTo((Math.cos(utils_1.Utils.deg2rad(i * slice)) * 230) + this.screenSize.width / 2, (Math.sin(utils_1.Utils.deg2rad(i * slice)) * 230) + this.screenSize.height / 2);
	            this.ctx.stroke();
	        }
	        // fill center circle
	        this.ctx.fillStyle = "#D95970";
	        this.ctx.beginPath();
	        this.ctx.arc(this.screenSize.width / 2, this.screenSize.height / 2, minR, 0, 2 * Math.PI);
	        this.ctx.fill();
	    };
	    Ingame.prototype.resetWave = function () {
	        this.player.reset();
	    };
	    Ingame.prototype.advanceWave = function () {
	        this.player.reset();
	        this.activeWave++;
	        // set new player goals
	        this.player.setGoals(pattern_1.PATTERN.waves[this.activeWave].win);
	        // new enemies
	        for (var _i = 0, _a = pattern_1.PATTERN.waves[this.activeWave].enemys; _i < _a.length; _i++) {
	            var enemyData = _a[_i];
	            this.enemies.push(new enemy_1.Enemy(enemyData.id, this.ctx, this.screenSize.width, this.screenSize.height, enemyData.ring, enemyData.angle, enemyData.speed, enemyData.delay));
	        }
	        // new gems
	        for (var _b = 0, _c = pattern_1.PATTERN.waves[this.activeWave].gems; _b < _c.length; _b++) {
	            var gemData = _c[_b];
	            this.gems.push(new gem_1.Gem(gemData.id, this.ctx, this.screenSize.width, this.screenSize.height, gemData.type, gemData.ring, gemData.angle, gemData.speed, gemData.delay));
	        }
	    };
	    return Ingame;
	}());
	exports.Ingame = Ingame;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(4);
	var input_1 = __webpack_require__(5);
	var gem_1 = __webpack_require__(6);
	var Player = (function () {
	    function Player(id, ctx, inputManager, layer, startAxis, gameWidth, gameHeigth, goal) {
	        this.inputMarager = inputManager;
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
	        this.width = 28;
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
	    }
	    Player.prototype.update = function () {
	        switch (this.id) {
	            case 0:
	                // right
	                if (this.axisPool[this.axis] === 0) {
	                    if (this.inputMarager.justPressed(input_1.KeyCode.LEFT_ARROW)) {
	                        this.pos--;
	                        if (this.pos < 0) {
	                            this.pos = 0;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.RIGHT_ARROW)) {
	                        this.pos++;
	                        if (this.pos > this.maxPos) {
	                            this.pos = this.maxPos;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.UP_ARROW)) {
	                        this.axis--;
	                        if (this.axis < 0) {
	                            this.axis = 3;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.DOWN_ARROW)) {
	                        this.axis++;
	                        if (this.axis > 3) {
	                            this.axis = 0;
	                        }
	                    }
	                }
	                // bottom
	                if (this.axisPool[this.axis] === 90) {
	                    if (this.inputMarager.justPressed(input_1.KeyCode.UP_ARROW)) {
	                        this.pos--;
	                        if (this.pos < 0) {
	                            this.pos = 0;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.DOWN_ARROW)) {
	                        this.pos++;
	                        if (this.pos > this.maxPos) {
	                            this.pos = this.maxPos;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.RIGHT_ARROW)) {
	                        this.axis--;
	                        if (this.axis < 0) {
	                            this.axis = 3;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.LEFT_ARROW)) {
	                        this.axis++;
	                        if (this.axis > 3) {
	                            this.axis = 0;
	                        }
	                    }
	                }
	                // left
	                if (this.axisPool[this.axis] === 180) {
	                    if (this.inputMarager.justPressed(input_1.KeyCode.RIGHT_ARROW)) {
	                        this.pos--;
	                        if (this.pos < 0) {
	                            this.pos = 0;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.LEFT_ARROW)) {
	                        this.pos++;
	                        if (this.pos > this.maxPos) {
	                            this.pos = this.maxPos;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.DOWN_ARROW)) {
	                        this.axis--;
	                        if (this.axis < 0) {
	                            this.axis = 3;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.UP_ARROW)) {
	                        this.axis++;
	                        if (this.axis > 3) {
	                            this.axis = 0;
	                        }
	                    }
	                }
	                // top
	                if (this.axisPool[this.axis] === 270) {
	                    if (this.inputMarager.justPressed(input_1.KeyCode.DOWN_ARROW)) {
	                        this.pos--;
	                        if (this.pos < 0) {
	                            this.pos = 0;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.UP_ARROW)) {
	                        this.pos++;
	                        if (this.pos > this.maxPos) {
	                            this.pos = this.maxPos;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.LEFT_ARROW)) {
	                        this.axis--;
	                        if (this.axis < 0) {
	                            this.axis = 3;
	                        }
	                    }
	                    if (this.inputMarager.justPressed(input_1.KeyCode.RIGHT_ARROW)) {
	                        this.axis++;
	                        if (this.axis > 3) {
	                            this.axis = 0;
	                        }
	                    }
	                }
	                break;
	        }
	    };
	    Player.prototype.render = function () {
	        this.ctx.fillStyle = this.color;
	        this.ctx.strokeStyle = this.color;
	        if (Math.abs(Math.cos(utils_1.Utils.deg2rad(this.axisPool[this.axis]))) > 0.5) {
	            var posx = (Math.cos(utils_1.Utils.deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + this.gameWidth / 2 - this.width / 2;
	            var posy = (Math.sin(utils_1.Utils.deg2rad(this.axisPool[this.axis])) * (this.minOffset + this.offset * this.pos)) + this.gameHeigth / 2 - this.height / 2;
	            this.ctx.strokeRect(posx, posy, this.width, this.height);
	            this.ctx.fillRect(posx, posy, this.width, this.height);
	        }
	        else {
	            var posx = (Math.cos(utils_1.Utils.deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + this.gameWidth / 2 - this.height / 2;
	            var posy = (Math.sin(utils_1.Utils.deg2rad(this.axisPool[this.axis])) * (1 + this.minOffset + this.offset * this.pos)) + this.gameHeigth / 2 - this.width / 2;
	            this.ctx.strokeRect(posx, posy, this.height, this.width);
	            this.ctx.fillRect(posx, posy, this.height, this.width);
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
/* 4 */
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
/* 5 */
/***/ function(module, exports) {

	"use strict";
	(function (KeyCode) {
	    KeyCode[KeyCode["BACKSPACE"] = 8] = "BACKSPACE";
	    KeyCode[KeyCode["TAB"] = 9] = "TAB";
	    KeyCode[KeyCode["ENTER"] = 13] = "ENTER";
	    KeyCode[KeyCode["SHIFT"] = 16] = "SHIFT";
	    KeyCode[KeyCode["CTRL"] = 17] = "CTRL";
	    KeyCode[KeyCode["ALT"] = 18] = "ALT";
	    KeyCode[KeyCode["PAUSE"] = 19] = "PAUSE";
	    KeyCode[KeyCode["CAPS_LOCK"] = 20] = "CAPS_LOCK";
	    KeyCode[KeyCode["ESCAPE"] = 27] = "ESCAPE";
	    KeyCode[KeyCode["SPACE"] = 32] = "SPACE";
	    KeyCode[KeyCode["PAGE_UP"] = 33] = "PAGE_UP";
	    KeyCode[KeyCode["PAGE_DOWN"] = 34] = "PAGE_DOWN";
	    KeyCode[KeyCode["END"] = 35] = "END";
	    KeyCode[KeyCode["HOME"] = 36] = "HOME";
	    KeyCode[KeyCode["LEFT_ARROW"] = 37] = "LEFT_ARROW";
	    KeyCode[KeyCode["UP_ARROW"] = 38] = "UP_ARROW";
	    KeyCode[KeyCode["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
	    KeyCode[KeyCode["DOWN_ARROW"] = 40] = "DOWN_ARROW";
	    KeyCode[KeyCode["INSERT"] = 45] = "INSERT";
	    KeyCode[KeyCode["DELETE"] = 46] = "DELETE";
	    KeyCode[KeyCode["KEY_0"] = 48] = "KEY_0";
	    KeyCode[KeyCode["KEY_1"] = 49] = "KEY_1";
	    KeyCode[KeyCode["KEY_2"] = 50] = "KEY_2";
	    KeyCode[KeyCode["KEY_3"] = 51] = "KEY_3";
	    KeyCode[KeyCode["KEY_4"] = 52] = "KEY_4";
	    KeyCode[KeyCode["KEY_5"] = 53] = "KEY_5";
	    KeyCode[KeyCode["KEY_6"] = 54] = "KEY_6";
	    KeyCode[KeyCode["KEY_7"] = 55] = "KEY_7";
	    KeyCode[KeyCode["KEY_8"] = 56] = "KEY_8";
	    KeyCode[KeyCode["KEY_9"] = 57] = "KEY_9";
	    KeyCode[KeyCode["A"] = 65] = "A";
	    KeyCode[KeyCode["B"] = 66] = "B";
	    KeyCode[KeyCode["C"] = 67] = "C";
	    KeyCode[KeyCode["D"] = 68] = "D";
	    KeyCode[KeyCode["E"] = 69] = "E";
	    KeyCode[KeyCode["F"] = 70] = "F";
	    KeyCode[KeyCode["G"] = 71] = "G";
	    KeyCode[KeyCode["H"] = 72] = "H";
	    KeyCode[KeyCode["I"] = 73] = "I";
	    KeyCode[KeyCode["J"] = 74] = "J";
	    KeyCode[KeyCode["K"] = 75] = "K";
	    KeyCode[KeyCode["L"] = 76] = "L";
	    KeyCode[KeyCode["M"] = 77] = "M";
	    KeyCode[KeyCode["N"] = 78] = "N";
	    KeyCode[KeyCode["O"] = 79] = "O";
	    KeyCode[KeyCode["P"] = 80] = "P";
	    KeyCode[KeyCode["Q"] = 81] = "Q";
	    KeyCode[KeyCode["R"] = 82] = "R";
	    KeyCode[KeyCode["S"] = 83] = "S";
	    KeyCode[KeyCode["T"] = 84] = "T";
	    KeyCode[KeyCode["U"] = 85] = "U";
	    KeyCode[KeyCode["V"] = 86] = "V";
	    KeyCode[KeyCode["W"] = 87] = "W";
	    KeyCode[KeyCode["X"] = 88] = "X";
	    KeyCode[KeyCode["Y"] = 89] = "Y";
	    KeyCode[KeyCode["Z"] = 90] = "Z";
	    KeyCode[KeyCode["LEFT_META"] = 91] = "LEFT_META";
	    KeyCode[KeyCode["RIGHT_META"] = 92] = "RIGHT_META";
	    KeyCode[KeyCode["SELECT"] = 93] = "SELECT";
	    KeyCode[KeyCode["NUMPAD_0"] = 96] = "NUMPAD_0";
	    KeyCode[KeyCode["NUMPAD_1"] = 97] = "NUMPAD_1";
	    KeyCode[KeyCode["NUMPAD_2"] = 98] = "NUMPAD_2";
	    KeyCode[KeyCode["NUMPAD_3"] = 99] = "NUMPAD_3";
	    KeyCode[KeyCode["NUMPAD_4"] = 100] = "NUMPAD_4";
	    KeyCode[KeyCode["NUMPAD_5"] = 101] = "NUMPAD_5";
	    KeyCode[KeyCode["NUMPAD_6"] = 102] = "NUMPAD_6";
	    KeyCode[KeyCode["NUMPAD_7"] = 103] = "NUMPAD_7";
	    KeyCode[KeyCode["NUMPAD_8"] = 104] = "NUMPAD_8";
	    KeyCode[KeyCode["NUMPAD_9"] = 105] = "NUMPAD_9";
	    KeyCode[KeyCode["MULTIPLY"] = 106] = "MULTIPLY";
	    KeyCode[KeyCode["ADD"] = 107] = "ADD";
	    KeyCode[KeyCode["SUBTRACT"] = 109] = "SUBTRACT";
	    KeyCode[KeyCode["DECIMAL"] = 110] = "DECIMAL";
	    KeyCode[KeyCode["DIVIDE"] = 111] = "DIVIDE";
	    KeyCode[KeyCode["F1"] = 112] = "F1";
	    KeyCode[KeyCode["F2"] = 113] = "F2";
	    KeyCode[KeyCode["F3"] = 114] = "F3";
	    KeyCode[KeyCode["F4"] = 115] = "F4";
	    KeyCode[KeyCode["F5"] = 116] = "F5";
	    KeyCode[KeyCode["F6"] = 117] = "F6";
	    KeyCode[KeyCode["F7"] = 118] = "F7";
	    KeyCode[KeyCode["F8"] = 119] = "F8";
	    KeyCode[KeyCode["F9"] = 120] = "F9";
	    KeyCode[KeyCode["F10"] = 121] = "F10";
	    KeyCode[KeyCode["F11"] = 122] = "F11";
	    KeyCode[KeyCode["F12"] = 123] = "F12";
	    KeyCode[KeyCode["NUM_LOCK"] = 144] = "NUM_LOCK";
	    KeyCode[KeyCode["SCROLL_LOCK"] = 145] = "SCROLL_LOCK";
	    KeyCode[KeyCode["SEMICOLON"] = 186] = "SEMICOLON";
	    KeyCode[KeyCode["EQUALS"] = 187] = "EQUALS";
	    KeyCode[KeyCode["COMMA"] = 188] = "COMMA";
	    KeyCode[KeyCode["DASH"] = 189] = "DASH";
	    KeyCode[KeyCode["PERIOD"] = 190] = "PERIOD";
	    KeyCode[KeyCode["FORWARD_SLASH"] = 191] = "FORWARD_SLASH";
	    KeyCode[KeyCode["GRAVE_ACCENT"] = 192] = "GRAVE_ACCENT";
	    KeyCode[KeyCode["OPEN_BRACKET"] = 219] = "OPEN_BRACKET";
	    KeyCode[KeyCode["BACK_SLASH"] = 220] = "BACK_SLASH";
	    KeyCode[KeyCode["CLOSE_BRACKET"] = 221] = "CLOSE_BRACKET";
	    KeyCode[KeyCode["SINGLE_QUOTE"] = 222] = "SINGLE_QUOTE";
	})(exports.KeyCode || (exports.KeyCode = {}));
	var KeyCode = exports.KeyCode;
	var Input = (function () {
	    function Input() {
	        var _this = this;
	        this.keys = {};
	        this.keysPressed = {};
	        document.addEventListener("keydown", function (e) { return _this.keyDown(e); });
	        document.addEventListener("keyup", function (e) { return _this.keyUp(e); });
	    }
	    Input.prototype.update = function () { };
	    Input.prototype.isDown = function (key) {
	        if (!this.keys[key]) {
	            return false;
	        }
	        return this.keys[key];
	    };
	    Input.prototype.justPressed = function (key) {
	        if (!this.keys[key] || this.keysPressed[key]) {
	            return false;
	        }
	        this.keysPressed[key] = true;
	        return this.keys[key];
	    };
	    Input.prototype.isUp = function (key) {
	        if (!this.keys[key]) {
	            return true;
	        }
	        return this.keys[key];
	    };
	    Input.prototype.keyDown = function (e) {
	        var key = e.keyCode;
	        this.keys[key] = true;
	    };
	    Input.prototype.keyUp = function (e) {
	        var key = e.keyCode;
	        this.keys[key] = false;
	        this.keysPressed[key] = false;
	    };
	    return Input;
	}());
	exports.Input = Input;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(4);
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(4);
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
/* 8 */
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
/* 9 */
/***/ function(module, exports) {

	"use strict";
	var Stats = (function () {
	    function Stats(ctx, player, screen) {
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
	    Stats.prototype.render = function () {
	        this.drawGemBars();
	        this.drawHealthBar();
	    };
	    Stats.prototype.drawGemBars = function () {
	        // draw green
	        this.ctx.fillStyle = "rgba(199, 191, 65, 1)";
	        this.ctx.strokeStyle = "rgba(199, 191, 65, 1)";
	        for (var i = 0; i < this.player.greenGoal; i++) {
	            if (i < this.player.green) {
	                this.ctx.strokeRect(this.screen.width - this.sideOffset, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	                this.ctx.fillRect(this.screen.width - this.sideOffset, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	            }
	            else {
	                this.ctx.strokeRect(this.screen.width - this.sideOffset, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	                this.ctx.fillStyle = "rgba(199, 191, 65, 0.2)";
	                this.ctx.fillRect(this.screen.width - this.sideOffset, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	            }
	        }
	        // draw blue
	        this.ctx.fillStyle = "rgba(0, 90, 127, 1)";
	        this.ctx.strokeStyle = "rgba(0, 90, 127, 1)";
	        for (var i = 0; i < this.player.blueGoal; i++) {
	            if (i < this.player.blue) {
	                this.ctx.strokeRect(this.screen.width - this.sideOffset - this.sideMargin, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	                this.ctx.fillRect(this.screen.width - this.sideOffset - this.sideMargin, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	            }
	            else {
	                this.ctx.strokeRect(this.screen.width - this.sideOffset - this.sideMargin, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	                this.ctx.fillStyle = "rgba(0, 90, 127, 0.2)";
	                this.ctx.fillRect(this.screen.width - this.sideOffset - this.sideMargin, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	            }
	        }
	        // draw yellow
	        this.ctx.fillStyle = "rgba(255, 199, 54, 1)";
	        this.ctx.strokeStyle = "rgba(255, 199, 54, 1)";
	        for (var i = 0; i < this.player.yellowGoal; i++) {
	            if (i < this.player.yellow) {
	                this.ctx.strokeRect(this.screen.width - this.sideOffset - this.sideMargin * 2, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	                this.ctx.fillRect(this.screen.width - this.sideOffset - this.sideMargin * 2, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	            }
	            else {
	                this.ctx.strokeRect(this.screen.width - this.sideOffset - this.sideMargin * 2, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	                this.ctx.fillStyle = "rgba(255, 199, 54, 0.2)";
	                this.ctx.fillRect(this.screen.width - this.sideOffset - this.sideMargin * 2, this.screen.height - this.bottomOffset - i * (this.margin + this.barHeight), this.barWidth, this.barHeight);
	            }
	        }
	    };
	    Stats.prototype.drawHealthBar = function () {
	        this.ctx.strokeStyle = "rgba(217, 89, 112, 1)";
	        this.ctx.fillStyle = "rgba(217, 89, 112, 1)";
	        for (var i = 0; i < this.player.maxHealth; i++) {
	            if (i < this.player.health) {
	                this.ctx.strokeRect(this.screen.width - this.sideOffset - i * (this.margin + this.barHeight), this.bottomOffset - this.barHeight, this.barHeight, this.barWidth);
	                this.ctx.fillRect(this.screen.width - this.sideOffset - i * (this.margin + this.barHeight), this.bottomOffset - this.barHeight, this.barHeight, this.barWidth);
	            }
	            else {
	                this.ctx.strokeRect(this.screen.width - this.sideOffset - i * (this.margin + this.barHeight), this.bottomOffset - this.barHeight, this.barHeight, this.barWidth);
	                this.ctx.fillStyle = "rgba(217, 89, 112, 0.1)";
	                this.ctx.fillRect(this.screen.width - this.sideOffset - i * (this.margin + this.barHeight), this.bottomOffset - this.barHeight, this.barHeight, this.barWidth);
	            }
	        }
	    };
	    return Stats;
	}());
	exports.Stats = Stats;


/***/ },
/* 10 */
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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var statemanager_1 = __webpack_require__(12);
	var button_1 = __webpack_require__(13);
	var layout_1 = __webpack_require__(14);
	var input_1 = __webpack_require__(5);
	var Menu = (function () {
	    function Menu(ctx, inputManager, screenSize, bgColor, stateManager) {
	        var _this = this;
	        this.ctx = ctx;
	        this.inputManager = inputManager;
	        this.stateManager = stateManager;
	        // global settings
	        this.screenSize = screenSize;
	        this.bgColor = bgColor;
	        this.menuLayout = new layout_1.Layout(this.screenSize, 10, 3);
	        this.buttons = new Array();
	        this.buttons = [
	            new button_1.Button(this.ctx, this.menuLayout, "SINGLEPLAYER", { width: 200, height: 30 }, { row: 5, col: 1, pos: layout_1.LayoutPosition.CENTER_CENTER }, function () { return _this.stateManager.switchTo(statemanager_1.States.GAME); }),
	            new button_1.Button(this.ctx, this.menuLayout, "MULTIPLAYER", { width: 200, height: 30 }, { row: 6, col: 1, pos: layout_1.LayoutPosition.CENTER_CENTER }, function () { return _this.stateManager.switchTo(statemanager_1.States.MENU); }),
	            new button_1.Button(this.ctx, this.menuLayout, "HIGHSCORE", { width: 200, height: 30 }, { row: 7, col: 1, pos: layout_1.LayoutPosition.CENTER_CENTER }, function () { return _this.stateManager.switchTo(statemanager_1.States.MENU); }),
	            new button_1.Button(this.ctx, this.menuLayout, "SETTINGS", { width: 200, height: 30 }, { row: 8, col: 1, pos: layout_1.LayoutPosition.CENTER_CENTER }, function () { return _this.stateManager.switchTo(statemanager_1.States.MENU); })
	        ];
	        this.activeButton = 0;
	    }
	    Menu.prototype.update = function () {
	        if (this.inputManager.justPressed(input_1.KeyCode.DOWN_ARROW)) {
	            this.activeButton++;
	            if (this.activeButton > this.buttons.length - 1) {
	                this.activeButton = 0;
	            }
	        }
	        if (this.inputManager.justPressed(input_1.KeyCode.UP_ARROW)) {
	            this.activeButton--;
	            if (this.activeButton < 0) {
	                this.activeButton = this.buttons.length - 1;
	            }
	        }
	        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
	            var button = _a[_i];
	            button.active = false;
	        }
	        this.buttons[this.activeButton].active = true;
	        if (this.inputManager.justPressed(input_1.KeyCode.ENTER)) {
	            this.buttons[this.activeButton].press();
	        }
	    };
	    Menu.prototype.render = function () {
	        this.menuLayout.showDebug(this.ctx);
	        this.title();
	        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
	            var button = _a[_i];
	            button.render();
	        }
	    };
	    Menu.prototype.title = function () {
	        this.ctx.font = "140px sans-serif";
	        this.ctx.strokeStyle = "rgba(217, 89, 112, 1.0)";
	        var layout = this.menuLayout.convert({ row: 3, col: 1, pos: layout_1.LayoutPosition.CENTER_CENTER });
	        var textWidth = this.ctx.measureText("Pulsarion").width;
	        this.ctx.strokeText("Pulsarion", layout.x - textWidth / 2, layout.y);
	    };
	    return Menu;
	}());
	exports.Menu = Menu;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	(function (States) {
	    States[States["MENU"] = 0] = "MENU";
	    States[States["GAME"] = 1] = "GAME";
	    States[States["SCORE"] = 2] = "SCORE";
	})(exports.States || (exports.States = {}));
	var States = exports.States;
	var StateManager = (function () {
	    function StateManager(initialState) {
	        if (initialState === void 0) { initialState = States.GAME; }
	        this.activeState = initialState;
	    }
	    StateManager.prototype.switchTo = function (state) {
	        this.activeState = state;
	    };
	    return StateManager;
	}());
	exports.StateManager = StateManager;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	var Button = (function () {
	    function Button(ctx, layout, text, size, layoutOptions, onPress) {
	        this.ctx = ctx;
	        this.layout = layout;
	        this.layoutOptions = layoutOptions;
	        this.text = text;
	        this.textWidth = this.ctx.measureText(this.text).width;
	        this.fontSize = 24;
	        this.boxWidth = size.width;
	        this.boxHeight = size.height;
	        this.boxOffset = 50;
	        this.active = false;
	        this.onPress = onPress;
	    }
	    Button.prototype.update = function () {
	    };
	    Button.prototype.render = function () {
	        this.ctx.strokeStyle = "rgba(217, 89, 112, 1.0)";
	        this.ctx.fillStyle = "rgba(217, 89, 112, 1.0)";
	        this.ctx.font = this.fontSize + "px sans-serif";
	        this.textWidth = this.ctx.measureText(this.text).width;
	        var layoutPos = this.layout.convert(this.layoutOptions);
	        var posx = layoutPos.x - this.boxWidth / 2;
	        var posy = layoutPos.y - this.boxHeight / 2;
	        this.ctx.fillText(this.text, layoutPos.x - this.textWidth / 2, posy + this.fontSize + 2 - (this.boxHeight - this.fontSize) / 2);
	        if (this.active) {
	            this.ctx.fillStyle = "rgba(217, 89, 112, 0.2)";
	            this.ctx.strokeRect(posx, posy, this.boxWidth, this.boxHeight);
	            this.ctx.fillRect(posx, posy, this.boxWidth, this.boxHeight);
	        }
	        else {
	            this.ctx.strokeRect(posx, posy, this.boxWidth, this.boxHeight);
	        }
	    };
	    Button.prototype.press = function () {
	        this.onPress();
	    };
	    return Button;
	}());
	exports.Button = Button;


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	(function (LayoutPosition) {
	    LayoutPosition[LayoutPosition["TOP_LEFT"] = 0] = "TOP_LEFT";
	    LayoutPosition[LayoutPosition["TOP_RIGHT"] = 1] = "TOP_RIGHT";
	    LayoutPosition[LayoutPosition["TOP_CENTER"] = 2] = "TOP_CENTER";
	    LayoutPosition[LayoutPosition["CENTER_LEFT"] = 3] = "CENTER_LEFT";
	    LayoutPosition[LayoutPosition["CENTER_RIGHT"] = 4] = "CENTER_RIGHT";
	    LayoutPosition[LayoutPosition["CENTER_CENTER"] = 5] = "CENTER_CENTER";
	    LayoutPosition[LayoutPosition["BOT_LEFT"] = 6] = "BOT_LEFT";
	    LayoutPosition[LayoutPosition["BOT_RIGHT"] = 7] = "BOT_RIGHT";
	    LayoutPosition[LayoutPosition["BOT_CENTER"] = 8] = "BOT_CENTER";
	})(exports.LayoutPosition || (exports.LayoutPosition = {}));
	var LayoutPosition = exports.LayoutPosition;
	var Layout = (function () {
	    function Layout(size, rows, cols) {
	        this.size = size;
	        this.rows = rows;
	        this.cols = cols;
	        this.sRows = this.size.height / this.rows;
	        this.sCols = this.size.width / this.cols;
	    }
	    Layout.prototype.convert = function (options) {
	        return this.convertRaw(options.row, options.col, options.pos);
	    };
	    Layout.prototype.convertRaw = function (row, col, pos) {
	        var convRow = this.sRows * row;
	        var convCol = this.sCols * col;
	        switch (pos) {
	            // top
	            case LayoutPosition.TOP_LEFT:
	                return { x: convCol, y: convRow };
	            case LayoutPosition.TOP_CENTER:
	                return { x: convCol + this.sCols / 2, y: convRow };
	            case LayoutPosition.TOP_CENTER:
	                return { x: convCol + this.sCols, y: convRow };
	            // center
	            case LayoutPosition.CENTER_LEFT:
	                return { x: convCol, y: convRow + this.sRows / 2 };
	            case LayoutPosition.CENTER_CENTER:
	                return { x: convCol + this.sCols / 2, y: convRow + this.sRows / 2 };
	            case LayoutPosition.CENTER_CENTER:
	                return { x: convCol + this.sCols, y: convRow + this.sRows / 2 };
	            // bot
	            case LayoutPosition.BOT_LEFT:
	                return { x: convCol, y: convRow + this.sRows };
	            case LayoutPosition.BOT_CENTER:
	                return { x: convCol + this.sCols / 2, y: convRow + this.sRows };
	            case LayoutPosition.BOT_CENTER:
	                return { x: convCol + this.sCols, y: convRow + this.sRows };
	        }
	    };
	    Layout.prototype.showDebug = function (ctx) {
	        for (var x = 0; x <= this.cols; x++) {
	            ctx.strokeStyle = "#ff9001";
	            ctx.beginPath();
	            ctx.moveTo(Math.floor(this.sCols * x) >= this.size.width ? this.size.width - 1 : Math.floor(this.sCols * x), 0);
	            ctx.lineTo(Math.floor(this.sCols * x) >= this.size.width ? this.size.width - 1 : Math.floor(this.sCols * x), this.size.height);
	            ctx.stroke();
	        }
	        for (var y = 0; y <= this.rows; y++) {
	            ctx.strokeStyle = "#ff9001";
	            ctx.beginPath();
	            ctx.moveTo(0, Math.floor(this.sRows * y) >= this.size.height ? this.size.height - 1 : Math.floor(this.sRows * y));
	            ctx.lineTo(this.size.width, Math.floor(this.sRows * y) >= this.size.height ? this.size.height - 1 : Math.floor(this.sRows * y));
	            ctx.stroke();
	        }
	    };
	    return Layout;
	}());
	exports.Layout = Layout;


/***/ }
/******/ ]);
//# sourceMappingURL=game.js.map