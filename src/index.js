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

function pad(n) {
  if (n < 10) {
    return `0${n.toString(10)}`;
  } else {
    return n.toString(10);
  }
}

export function create(
  rate = 24,
  numerator = 1,
  denominator = 1,
  dropFrame = false
) {
  return {
    rate,
    numerator,
    denominator,
    fps: rate * numerator / denominator,
    dropFrame,
  };
}

export function secondsToSmpte(frameRate, seconds) {
  return frameToSmpte(frameRate, secondsToFrame(frameRate, seconds));
}

export function smpteToSeconds(frameRate, smpte) {
  return frameToSeconds(frameRate, smpteToFrame(frameRate, smpte));
}

export function smpteToMs(frameRate, smpte) {
  return Math.ceil(smpteToSeconds(frameRate, smpte) * MILLISECONDS_PER_SECOND);
}

export function msToSmpte(frameRate, ms)
{
  return secondsToSmpte(frameRate, ms / MILLISECONDS_PER_SECOND);
}

export function smpteToTicks(frameRate, smpte)
{
  return Math.ceil(smpteToSeconds(frameRate, smpte) * TICKS_PER_SECOND);
}

export function ticksToSmpte(frameRate, ticks)
{
  return secondsToSmpte(frameRate, ticks / TICKS_PER_SECOND);
}

export function secondsToFrame(frameRate, seconds)
{
  const frame = (seconds * frameRate.fps) + (FRAME_ROUNDING * frameRate.fps);
  return Math.floor(frame);
}

export function msToFrame(frameRate, ms)
{
  return secondsToFrame(frameRate, ms / MILLISECONDS_PER_SECOND);
}

export function frameToMs(frameRate, frame)
{
  return Math.ceil(frameToSeconds(frameRate, frame) * MILLISECONDS_PER_SECOND);
}

export function ticksToFrame(frameRate, ticks)
{
  return secondsToFrame(frameRate, ticks / TICKS_PER_SECOND);
}

export function frameToTicks(frameRate, frame)
{
  return Math.ceil(frameToSeconds(frameRate, frame) * TICKS_PER_SECOND);
}

export function frameToSmpte(frameRate, frame)
{
  const extra = extraFrames(frameRate, frame);
  const seconds = (frame + extra) / frameRate.rate;
  const f = Math.round((seconds - Math.floor(seconds)) * frameRate.rate);
  const h = Math.floor(seconds / SECONDS_PER_HOUR);
  const m = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const s = Math.floor((seconds % SECONDS_PER_MINUTE));
  const frameSeparator = frameRate.dropFrame ? ';' : ':';

  return `${pad(h)}:${pad(m)}:${pad(s)}${frameSeparator}${pad(f)}`;
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
export function extraFrames(frameRate, frame)
{
  if (!frameRate.dropFrame) {
    return 0;
  }

  const D = Math.floor(frame / 17982);
  const M = frame % 17982;

  return Math.max(0, (18 * D) + (2 * (Math.floor((M - 2) / 1798))));
}

export function smpteToFrame(frameRate, smpte)
{
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

  const seconds = (h * SECONDS_PER_HOUR) + (m * SECONDS_PER_MINUTE) + s;
  let frames = (seconds * frameRate.rate) + f;

  if (frameRate.dropFrame) {
    const dropped = (h * 54 + m - Math.floor(m / 10)) * 2;

    frames -= dropped;
  }

  return frames;
}

export function frameToSeconds(frameRate, frame)
{
  return frame / frameRate.fps;
}

export function seekByFrames(frameRate, fromTimeSeconds, frameDelta)
{
  const frame = secondsToFrame(frameRate, fromTimeSeconds);
  return seekToFrame(frameRate, frame + frameDelta);
}

export function seekToFrame(frameRate, frame)
{
  const newTime = frameToSeconds(frameRate, frame);
  const halfFrame = frameToSeconds(frameRate, 1) / 2;

  // add half frame to ensure the resulting time is in the frame
  return newTime + halfFrame;
}

export function toFrameTime(frameRate, seconds)
{
  return seekByFrames(frameRate, seconds, 0);
}

export function fromTag(tag) {
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
      throw `Unknow Frame Rate ${tag}`;
  }
}
