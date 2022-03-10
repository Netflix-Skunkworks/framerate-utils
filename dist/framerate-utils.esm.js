function pad(n) {
  if (n < 10) {
    return "0" + n.toString(10);
  } else {
    return n.toString(10);
  }
}
function padMs(n) {
  if (n < 10) {
    return "00" + n.toString(10);
  } else if (n < 100) {
    return "0" + n.toString(10);
  } else {
    return n.toString(10);
  }
}

var round = Math.round,
    ceil = Math.ceil,
    floor = Math.floor,
    max = Math.max;
var SECONDS_PER_HOUR = 60 * 60;
var SECONDS_PER_MINUTE = 60;
var MILLISECONDS_PER_SECOND = 1000;
var TICKS_PER_SECOND = 10000000;
var RATE_23_976 = /*#__PURE__*/create(24, 1000, 1001);
var RATE_24 = /*#__PURE__*/create(24, 1, 1);
var RATE_25 = /*#__PURE__*/create(25, 1, 1);
var RATE_29_97 = /*#__PURE__*/create(30, 1000, 1001);
var RATE_29_97_DROP = /*#__PURE__*/create(30, 1000, 1001, true);
var RATE_30 = /*#__PURE__*/create(30, 1, 1);
var RATE_48 = /*#__PURE__*/create(48, 1, 1);
var RATE_50 = /*#__PURE__*/create(50, 1, 1);
var RATE_59_94 = /*#__PURE__*/create(60, 1000, 1001);
var RATE_59_94_DROP = /*#__PURE__*/create(60, 1000, 1001, true);
var RATE_60 = /*#__PURE__*/create(60, 1, 1);
var DEFAULT_FRAME_RATE = RATE_23_976;
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

var FRAME_ROUNDING = 0.002;
function create(rate, numerator, denominator, dropFrame) {
  if (rate === void 0) {
    rate = 24;
  }

  if (numerator === void 0) {
    numerator = 1;
  }

  if (denominator === void 0) {
    denominator = 1;
  }

  if (dropFrame === void 0) {
    dropFrame = false;
  }

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
  return ceil(smpteToSeconds(frameRate, smpte) * MILLISECONDS_PER_SECOND);
}
function msToSmpte(frameRate, ms) {
  return secondsToSmpte(frameRate, ms / MILLISECONDS_PER_SECOND);
}
function smpteToTicks(frameRate, smpte) {
  return ceil(smpteToSeconds(frameRate, smpte) * TICKS_PER_SECOND);
}
function ticksToSmpte(frameRate, ticks) {
  return secondsToSmpte(frameRate, ticks / TICKS_PER_SECOND);
}
function secondsToFrame(frameRate, seconds) {
  var frame = seconds * frameRate.fps + FRAME_ROUNDING * frameRate.fps;
  return floor(frame);
}
function msToFrame(frameRate, ms) {
  return secondsToFrame(frameRate, ms / MILLISECONDS_PER_SECOND);
}
function frameToMs(frameRate, frame) {
  return ceil(frameToSeconds(frameRate, frame) * MILLISECONDS_PER_SECOND);
}
function ticksToFrame(frameRate, ticks) {
  return secondsToFrame(frameRate, ticks / TICKS_PER_SECOND);
}
function frameToTicks(frameRate, frame) {
  return ceil(frameToSeconds(frameRate, frame) * TICKS_PER_SECOND);
}
function frameToSmpte(frameRate, frame) {
  var extra = extraFrames(frameRate, frame);
  var seconds = (frame + extra) / frameRate.rate;
  var f = round((seconds - floor(seconds)) * frameRate.rate);
  var h = floor(seconds / SECONDS_PER_HOUR);
  var m = floor(seconds % SECONDS_PER_HOUR / SECONDS_PER_MINUTE);
  var s = floor(seconds % SECONDS_PER_MINUTE);
  var frameSeparator = frameRate.dropFrame ? ';' : ':';
  return pad(h) + ":" + pad(m) + ":" + pad(s) + frameSeparator + pad(f);
}
/**
 * Return the number of extra frames required to convert drop frame to
 * SMPTE timecode.
 * Based on calculation from http://andrewduncan.net/timecodes/
 *          D = frameNumber div 17982
 *          M = frameNumber mod 17982
 *          frameNumber +=  18*D + 2*((M - 2) div 1798)
 *
 * @param {FrameRate} frameRate The frame rate to use for conversion
 * @param {Number} frame The actual number of frames
 * @returns {Number} The extra frames required
 */

function extraFrames(frameRate, frame) {
  if (!frameRate.dropFrame) {
    return 0;
  }

  var D = floor(frame / 17982);
  var M = frame % 17982;

  if (M < 2) {
    // Special case for M=0 and M=1: -2 div 1798 should be 0
    M = 2;
  }

  return max(0, 18 * D + 2 * floor((M - 2) / 1798));
}
function smpteToFrame(frameRate, smpte) {
  var parts = smpte.split(/:|;/);
  var h, m, s, f;

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
    var dropped = (h * 54 + m - floor(m / 10)) * 2;
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
  var halfFrame = frameToSeconds(frameRate, 1) / 2; // add half frame to ensure the resulting time is in the frame

  return newTime + halfFrame;
}
function toFrameTime(frameRate, seconds) {
  return seekByFrames(frameRate, seconds, 0);
}
function mediaToSeconds(media) {
  var parts = media.split(/:|\.|,/);
  var h, m, s, ms;

  if (parts.length === 4) {
    h = parseInt(parts[0]);
    m = parseInt(parts[1]);
    s = parseInt(parts[2]);
    ms = parseInt(parts[3]);
  } else {
    return 0;
  }

  var seconds = h * SECONDS_PER_HOUR + m * SECONDS_PER_MINUTE + s;
  return seconds + ms / 1000;
}
function secondsToMedia(seconds) {
  var sec = floor(seconds);
  var ms = round((seconds - sec) * MILLISECONDS_PER_SECOND);
  var h = floor(sec / SECONDS_PER_HOUR);
  var m = floor(sec % SECONDS_PER_HOUR / SECONDS_PER_MINUTE);
  var s = floor(sec % SECONDS_PER_MINUTE);
  return pad(h) + ':' + pad(m) + ':' + pad(s) + '.' + padMs(ms);
}
function mediaFramesToSeconds(fr, media) {
  var parts = media.split(/:/);
  var h, m, s, f;

  if (parts.length === 4) {
    h = parseInt(parts[0]);
    m = parseInt(parts[1]);
    s = parseInt(parts[2]);
    f = parseInt(parts[3]);
  } else {
    return 0;
  }

  var seconds = h * SECONDS_PER_HOUR + m * SECONDS_PER_MINUTE + s;
  return seconds + f / fr.fps;
}
function secondsToMediaFrames(fr, seconds) {
  var sec = floor(seconds);
  var f = round((seconds - sec) * fr.fps);
  var h = floor(sec / SECONDS_PER_HOUR);
  var m = floor(sec % SECONDS_PER_HOUR / SECONDS_PER_MINUTE);
  var s = floor(sec % SECONDS_PER_MINUTE);
  return pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(f);
}
function ticksToSeconds(ticks) {
  return ticks / TICKS_PER_SECOND;
}
function secondsToTicks(seconds) {
  return floor(seconds * TICKS_PER_SECOND);
}
function msToSeconds(ms) {
  return ms / MILLISECONDS_PER_SECOND;
}
function secondsToMs(seconds) {
  return seconds * MILLISECONDS_PER_SECOND;
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

    case 'FPS_4800':
      return RATE_48;

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
      throw new TypeError("Unknown Frame Rate " + tag);
  }
}

export { DEFAULT_FRAME_RATE, FRAME_ROUNDING, MILLISECONDS_PER_SECOND, RATE_23_976, RATE_24, RATE_25, RATE_29_97, RATE_29_97_DROP, RATE_30, RATE_48, RATE_50, RATE_59_94, RATE_59_94_DROP, RATE_60, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, TICKS_PER_SECOND, create, extraFrames, frameToMs, frameToSeconds, frameToSmpte, frameToTicks, fromTag, mediaFramesToSeconds, mediaToSeconds, msToFrame, msToSeconds, msToSmpte, secondsToFrame, secondsToMedia, secondsToMediaFrames, secondsToMs, secondsToSmpte, secondsToTicks, seekByFrames, seekToFrame, smpteToFrame, smpteToMs, smpteToSeconds, smpteToTicks, ticksToFrame, ticksToSeconds, ticksToSmpte, toFrameTime };
//# sourceMappingURL=framerate-utils.esm.js.map
