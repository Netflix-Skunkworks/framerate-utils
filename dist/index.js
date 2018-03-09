(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["FrameRateUtils"] = factory();
	else
		root["FrameRateUtils"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.secondsToSmpte = secondsToSmpte;
exports.smpteToSeconds = smpteToSeconds;
exports.smpteToMs = smpteToMs;
exports.msToSmpte = msToSmpte;
exports.smpteToTicks = smpteToTicks;
exports.ticksToSmpte = ticksToSmpte;
exports.secondsToFrame = secondsToFrame;
exports.msToFrame = msToFrame;
exports.frameToMs = frameToMs;
exports.ticksToFrame = ticksToFrame;
exports.frameToTicks = frameToTicks;
exports.frameToSmpte = frameToSmpte;
exports.extraFrames = extraFrames;
exports.smpteToFrame = smpteToFrame;
exports.frameToSeconds = frameToSeconds;
exports.seekByFrames = seekByFrames;
exports.seekToFrame = seekToFrame;
exports.toFrameTime = toFrameTime;
exports.fromTag = fromTag;
var SECONDS_PER_HOUR = exports.SECONDS_PER_HOUR = 60 * 60;
var SECONDS_PER_MINUTE = exports.SECONDS_PER_MINUTE = 60;
var MILLISECONDS_PER_SECOND = exports.MILLISECONDS_PER_SECOND = 1000;
var TICKS_PER_SECOND = exports.TICKS_PER_SECOND = 10000000;

var RATE_23_976 = exports.RATE_23_976 = create(24, 1000, 1001);
var RATE_24 = exports.RATE_24 = create(24, 1, 1);
var RATE_25 = exports.RATE_25 = create(25, 1, 1);
var RATE_29_97 = exports.RATE_29_97 = create(30, 1000, 1001);
var RATE_29_97_DROP = exports.RATE_29_97_DROP = create(30, 1000, 1001, true);
var RATE_30 = exports.RATE_30 = create(30, 1, 1);
var RATE_50 = exports.RATE_50 = create(50, 1, 1);
var RATE_59_94 = exports.RATE_59_94 = create(60, 1000, 1001);
var RATE_59_94_DROP = exports.RATE_59_94_DROP = create(60, 1000, 1001, true);
var RATE_60 = exports.RATE_60 = create(60, 1, 1);

var DEFAULT_FRAME_RATE = exports.DEFAULT_FRAME_RATE = RATE_23_976;

/*
 * Adjustment required to account for rounding of input data.
 * For example:
 * frame 836 @ 24fps = 34.83333333333333s
 * This can be rounded by input format to 34833ms
 * 34833ms @ 24fps is frame 835.992 which will be treated as frame 835.
 * To adjust for this 0.001s will be added before truncating.
 *
 * Update: Rounding with CAP files can cause up to 2ms difference, so update
 * rounding to up to 2ms.
 */
var FRAME_ROUNDING = exports.FRAME_ROUNDING = 0.002;

function pad(n) {
  if (n < 10) {
    return '0' + n.toString(10);
  } else {
    return n.toString(10);
  }
}

function create() {
  var rate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 24;
  var numerator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var denominator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var dropFrame = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  return {
    rate: rate,
    numerator: numerator,
    denominator: denominator,
    fps: rate * numerator / denominator,
    dropFrame: dropFrame
  };
}

function secondsToSmpte(frameRate, seconds) {
  return frameToSmpte(frameRate, secondsToFrame(frameRate, seconds));
}

function smpteToSeconds(frameRate, smpte) {
  return frameToSeconds(frameRate, smpteToFrame(frameRate, smpte));
}

function smpteToMs(frameRate, smpte) {
  return Math.ceil(smpteToSeconds(frameRate, smpte) * MILLISECONDS_PER_SECOND);
}

function msToSmpte(frameRate, ms) {
  return secondsToSmpte(frameRate, ms / MILLISECONDS_PER_SECOND);
}

function smpteToTicks(frameRate, smpte) {
  return Math.ceil(smpteToSeconds(frameRate, smpte) * TICKS_PER_SECOND);
}

function ticksToSmpte(frameRate, ticks) {
  return secondsToSmpte(frameRate, ticks / TICKS_PER_SECOND);
}

function secondsToFrame(frameRate, seconds) {
  var frame = seconds * frameRate.fps + FRAME_ROUNDING * frameRate.fps;
  return Math.floor(frame);
}

function msToFrame(frameRate, ms) {
  return secondsToFrame(frameRate, ms / MILLISECONDS_PER_SECOND);
}

function frameToMs(frameRate, frame) {
  return Math.ceil(frameToSeconds(frameRate, frame) * MILLISECONDS_PER_SECOND);
}

function ticksToFrame(frameRate, ticks) {
  return secondsToFrame(frameRate, ticks / TICKS_PER_SECOND);
}

function frameToTicks(frameRate, frame) {
  return Math.ceil(frameToSeconds(frameRate, frame) * TICKS_PER_SECOND);
}

function frameToSmpte(frameRate, frame) {
  var extra = extraFrames(frameRate, frame);
  var seconds = (frame + extra) / frameRate.rate;
  var f = Math.round((seconds - Math.floor(seconds)) * frameRate.rate);
  var h = Math.floor(seconds / SECONDS_PER_HOUR);
  var m = Math.floor(seconds % SECONDS_PER_HOUR / SECONDS_PER_MINUTE);
  var s = Math.floor(seconds % SECONDS_PER_MINUTE);
  var frameSeparator = frameRate.dropFrame ? ';' : ':';

  return pad(h) + ':' + pad(m) + ':' + pad(s) + frameSeparator + pad(f);
}

/**
 * Return the number of extra frames required to convert drop frame to
 * SMPTE timecode.
 * Based on calculation from http://andrewduncan.net/timecodes/
 *          D = frameNumber div 17982
 *          M = frameNumber mod 17982
 *          frameNumber +=  18*D + 2*((M - 2) div 1798)
 *
 * @param {Number} frame The actual number of frames
 * @returns {Number} The extra frames required
 */
function extraFrames(frameRate, frame) {
  if (!frameRate.dropFrame) {
    return 0;
  }

  var D = Math.floor(frame / 17982);
  var M = frame % 17982;

  return Math.max(0, 18 * D + 2 * Math.floor((M - 2) / 1798));
}

function smpteToFrame(frameRate, smpte) {
  var parts = smpte.split(/:|;/);
  var h = void 0,
      m = void 0,
      s = void 0,
      f = void 0;

  if (parts.length === 3) {
    h = 0;
    m = parseInt(parts[0]);
    s = parseInt(parts[1]);
    f = parseInt(parts[2]);
  } else if (parts.length === 4) {
    h = parseInt(parts[0]);
    m = parseInt(parts[1]);
    s = parseInt(parts[2]);
    f = parseInt(parts[3]);
  } else {
    return 0;
  }

  var seconds = h * SECONDS_PER_HOUR + m * SECONDS_PER_MINUTE + s;
  var frames = seconds * frameRate.rate + f;

  if (frameRate.dropFrame) {
    var dropped = (h * 54 + m - Math.floor(m / 10)) * 2;

    frames -= dropped;
  }

  return frames;
}

function frameToSeconds(frameRate, frame) {
  return frame / frameRate.fps;
}

function seekByFrames(frameRate, fromTimeSeconds, frameDelta) {
  var frame = secondsToFrame(frameRate, fromTimeSeconds);
  return seekToFrame(frameRate, frame + frameDelta);
}

function seekToFrame(frameRate, frame) {
  var newTime = frameToSeconds(frameRate, frame);
  var halfFrame = frameToSeconds(frameRate, 1) / 2;

  // add half frame to ensure the resulting time is in the frame
  return newTime + halfFrame;
}

function toFrameTime(frameRate, seconds) {
  return seekByFrames(frameRate, seconds, 0);
}

function fromTag(tag) {
  switch (tag) {
    case 'FPS_2397':
      return RATE_23_976;
    case 'FPS_24':
      return RATE_24;
    case 'FPS_2400':
      return RATE_24;
    case 'FPS_25':
      return RATE_25;
    case 'FPS_2500':
      return RATE_25;
    case 'FPS_2997':
      return RATE_29_97_DROP;
    case 'FPS_30':
      return RATE_30;
    case 'FPS_3000':
      return RATE_30;
    case 'FPS_50':
      return RATE_50;
    case 'FPS_5000':
      return RATE_50;
    case 'FPS_5994':
      return RATE_59_94_DROP;
    case 'FPS_60':
      return RATE_60;
    case 'FPS_6000':
      return RATE_60;
    default:
      throw 'Unknow Frame Rate ' + tag;
  }
}

/***/ })
/******/ ]);
});