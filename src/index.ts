import { pad, padMs } from './utils/string';

const { round, ceil, floor, max } = Math;

export const SECONDS_PER_HOUR = 60 * 60;
export const SECONDS_PER_MINUTE = 60;
export const MILLISECONDS_PER_SECOND = 1000;
export const TICKS_PER_SECOND = 10000000;

export const RATE_23_976 = create(24, 1000, 1001);
export const RATE_24 = create(24, 1, 1);
export const RATE_25 = create(25, 1, 1);
export const RATE_29_97 = create(30, 1000, 1001);
export const RATE_29_97_DROP = create(30, 1000, 1001, true);
export const RATE_30 = create(30, 1, 1);
export const RATE_47_95 = create(48, 1000, 1001);
export const RATE_48 = create(48, 1, 1);
export const RATE_50 = create(50, 1, 1);
export const RATE_59_94 = create(60, 1000, 1001);
export const RATE_59_94_DROP = create(60, 1000, 1001, true);
export const RATE_60 = create(60, 1, 1);

export const DEFAULT_FRAME_RATE = RATE_23_976;

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
export const FRAME_ROUNDING = 0.002;

export interface FrameRate {
  rate: number;
  numerator: number;
  denominator: number;
  fps: number;
  dropFrame: boolean;
}

export function create(
  rate = 24,
  numerator = 1,
  denominator = 1,
  dropFrame = false
): FrameRate {
  return {
    rate,
    numerator,
    denominator,
    fps: (rate * numerator) / denominator,
    dropFrame,
  };
}

export function secondsToSmpte(frameRate: FrameRate, seconds: number) {
  return frameToSmpte(frameRate, secondsToFrame(frameRate, seconds));
}

export function smpteToSeconds(frameRate: FrameRate, smpte: string) {
  return frameToSeconds(frameRate, smpteToFrame(frameRate, smpte));
}

export function smpteToMs(frameRate: FrameRate, smpte: string) {
  return ceil(smpteToSeconds(frameRate, smpte) * MILLISECONDS_PER_SECOND);
}

export function msToSmpte(frameRate: FrameRate, ms: number) {
  return secondsToSmpte(frameRate, ms / MILLISECONDS_PER_SECOND);
}

export function smpteToTicks(frameRate: FrameRate, smpte: string) {
  return ceil(smpteToSeconds(frameRate, smpte) * TICKS_PER_SECOND);
}

export function ticksToSmpte(frameRate: FrameRate, ticks: number) {
  return secondsToSmpte(frameRate, ticks / TICKS_PER_SECOND);
}

export function secondsToFrame(frameRate: FrameRate, seconds: number) {
  const frame = seconds * frameRate.fps + FRAME_ROUNDING * frameRate.fps;
  return floor(frame);
}

export function msToFrame(frameRate: FrameRate, ms: number) {
  return secondsToFrame(frameRate, ms / MILLISECONDS_PER_SECOND);
}

export function frameToMs(frameRate: FrameRate, frame: number) {
  return ceil(frameToSeconds(frameRate, frame) * MILLISECONDS_PER_SECOND);
}

export function ticksToFrame(frameRate: FrameRate, ticks: number) {
  return secondsToFrame(frameRate, ticks / TICKS_PER_SECOND);
}

export function frameToTicks(frameRate: FrameRate, frame: number) {
  return ceil(frameToSeconds(frameRate, frame) * TICKS_PER_SECOND);
}

export function frameToSmpte(frameRate: FrameRate, frame: number) {
  const extra = extraFrames(frameRate, frame);
  const seconds = (frame + extra) / frameRate.rate;
  const f = round((seconds - floor(seconds)) * frameRate.rate);
  const h = floor(seconds / SECONDS_PER_HOUR);
  const m = floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const s = floor(seconds % SECONDS_PER_MINUTE);
  const frameSeparator = frameRate.dropFrame ? ';' : ':';

  return `${pad(h)}:${pad(m)}:${pad(s)}${frameSeparator}${pad(f)}`;
}

function div(dividend: number, divisor: number) {
  return Math.floor(dividend / divisor);
}

/**
 * Return the number of extra frames required to convert drop frame to
 * SMPTE timecode.
 * Based on calculation from http://andrewduncan.net/timecodes/
 *          D = frameNumber div 17982
 *          M = frameNumber mod 17982
 *          frameNumber +=  18*D + 2*((M - 2) div 1798)
 * See also https://video.stackexchange.com/questions/22722/how-are-frames-in-59-94-drop-frame-timecode-dropped/22724#22724
 * for support for 59.94fps
 *
 * @param {FrameRate} frameRate The frame rate to use for conversion
 * @param {Number} frame The actual number of frames
 * @returns {Number} The extra frames required
 */
export function extraFrames(frameRate: FrameRate, frame: number) {
  if (!frameRate.dropFrame) {
    return 0;
  }

  let framesPer10Mins = 17982;
  let dropFrames = 2;

  if (frameRate.rate === 60) {
    framesPer10Mins = 35964;
    dropFrames = 4;
  }

  const D = div(frame, framesPer10Mins);
  let M = frame % framesPer10Mins;
  if (M < dropFrames) {
    // Special case for M=0 and M=1: -2 div 1798 should be 0
    M = dropFrames;
  }

  return max(
    0,
    9 * dropFrames * D +
      dropFrames * div(M - dropFrames, div(framesPer10Mins, 10))
  );
}

// Return the number of frames to subtract to convert smpte drop frame
// back to frame number.
// http://andrewduncan.net/timecodes/
// totalMinutes = 60 * hours + minutes
// frameNumber  = 108000 * hours + 1800 * minutes
//                  + 30 * seconds + frames
//                   - 2 * (totalMinutes - totalMinutes div 10)
export function subtractFrames(frameRate: FrameRate, h: number, m: number) {
  if (!frameRate.dropFrame) {
    return 0;
  }

  let dropFrames = 2;

  if (frameRate.rate === 60) {
    dropFrames = 4;
  }

  const totalMinutes = h * 60 + m;

  return dropFrames * (totalMinutes - div(totalMinutes, 10));
}

export function smpteToFrame(frameRate: FrameRate, smpte: string) {
  const parts = smpte.split(/:|;/);
  let h, m, s, f;

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

  const seconds = h * SECONDS_PER_HOUR + m * SECONDS_PER_MINUTE + s;
  const frames = seconds * frameRate.rate + f;

  return frames - subtractFrames(frameRate, h, m);
}

export function frameToSeconds(frameRate: FrameRate, frame: number) {
  return frame / frameRate.fps;
}

export function seekByFrames(
  frameRate: FrameRate,
  fromTimeSeconds: number,
  frameDelta: number
) {
  const frame = secondsToFrame(frameRate, fromTimeSeconds);
  return seekToFrame(frameRate, frame + frameDelta);
}

export function seekToFrame(frameRate: FrameRate, frame: number) {
  const newTime = frameToSeconds(frameRate, frame);
  const halfFrame = frameToSeconds(frameRate, 1) / 2;

  // add half frame to ensure the resulting time is in the frame
  return newTime + halfFrame;
}

export function toFrameTime(frameRate: FrameRate, seconds: number) {
  return seekByFrames(frameRate, seconds, 0);
}

export function mediaToSeconds(media: string) {
  const parts = media.split(/:|\.|,/);
  let h, m, s, ms;

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

export function secondsToMedia(seconds: number) {
  var sec = floor(seconds);
  var ms = round((seconds - sec) * MILLISECONDS_PER_SECOND);
  var h = floor(sec / SECONDS_PER_HOUR);
  var m = floor((sec % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  var s = floor(sec % SECONDS_PER_MINUTE);

  return pad(h) + ':' + pad(m) + ':' + pad(s) + '.' + padMs(ms);
}

export function mediaFramesToSeconds(fr: FrameRate, media: string) {
  var parts = media.split(/:/);
  let h, m, s, f;

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

export function secondsToMediaFrames(fr: FrameRate, seconds: number) {
  var sec = floor(seconds);
  var f = round((seconds - sec) * fr.fps);
  var h = floor(sec / SECONDS_PER_HOUR);
  var m = floor((sec % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  var s = floor(sec % SECONDS_PER_MINUTE);

  return pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(f);
}

export function ticksToSeconds(ticks: number) {
  return ticks / TICKS_PER_SECOND;
}

export function secondsToTicks(seconds: number) {
  return floor(seconds * TICKS_PER_SECOND);
}

export function msToSeconds(ms: number) {
  return ms / MILLISECONDS_PER_SECOND;
}

export function secondsToMs(seconds: number) {
  return seconds * MILLISECONDS_PER_SECOND;
}

export function fromTag(tag: string) {
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
    case 'FPS_4795':
      return RATE_47_95;
    case 'FPS_48':
      return RATE_48;
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
      throw new TypeError(`Unknown Frame Rate ${tag}`);
  }
}
