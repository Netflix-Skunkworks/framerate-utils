export declare const SECONDS_PER_HOUR: number;
export declare const SECONDS_PER_MINUTE = 60;
export declare const MILLISECONDS_PER_SECOND = 1000;
export declare const TICKS_PER_SECOND = 10000000;
export declare const RATE_23_976: FrameRate;
export declare const RATE_24: FrameRate;
export declare const RATE_25: FrameRate;
export declare const RATE_29_97: FrameRate;
export declare const RATE_29_97_DROP: FrameRate;
export declare const RATE_30: FrameRate;
export declare const RATE_48: FrameRate;
export declare const RATE_50: FrameRate;
export declare const RATE_59_94: FrameRate;
export declare const RATE_59_94_DROP: FrameRate;
export declare const RATE_60: FrameRate;
export declare const DEFAULT_FRAME_RATE: FrameRate;
export declare const FRAME_ROUNDING = 0.002;
export interface FrameRate {
    rate: number;
    numerator: number;
    denominator: number;
    fps: number;
    dropFrame: boolean;
}
export declare function create(rate?: number, numerator?: number, denominator?: number, dropFrame?: boolean): FrameRate;
export declare function secondsToSmpte(frameRate: FrameRate, seconds: number): string;
export declare function smpteToSeconds(frameRate: FrameRate, smpte: string): number;
export declare function smpteToMs(frameRate: FrameRate, smpte: string): number;
export declare function msToSmpte(frameRate: FrameRate, ms: number): string;
export declare function smpteToTicks(frameRate: FrameRate, smpte: string): number;
export declare function ticksToSmpte(frameRate: FrameRate, ticks: number): string;
export declare function secondsToFrame(frameRate: FrameRate, seconds: number): number;
export declare function msToFrame(frameRate: FrameRate, ms: number): number;
export declare function frameToMs(frameRate: FrameRate, frame: number): number;
export declare function ticksToFrame(frameRate: FrameRate, ticks: number): number;
export declare function frameToTicks(frameRate: FrameRate, frame: number): number;
export declare function frameToSmpte(frameRate: FrameRate, frame: number): string;
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
export declare function extraFrames(frameRate: FrameRate, frame: number): number;
export declare function subtractFrames(frameRate: FrameRate, h: number, m: number): number;
export declare function smpteToFrame(frameRate: FrameRate, smpte: string): number;
export declare function frameToSeconds(frameRate: FrameRate, frame: number): number;
export declare function seekByFrames(frameRate: FrameRate, fromTimeSeconds: number, frameDelta: number): number;
export declare function seekToFrame(frameRate: FrameRate, frame: number): number;
export declare function toFrameTime(frameRate: FrameRate, seconds: number): number;
export declare function mediaToSeconds(media: string): number;
export declare function secondsToMedia(seconds: number): string;
export declare function mediaFramesToSeconds(fr: FrameRate, media: string): number;
export declare function secondsToMediaFrames(fr: FrameRate, seconds: number): string;
export declare function ticksToSeconds(ticks: number): number;
export declare function secondsToTicks(seconds: number): number;
export declare function msToSeconds(ms: number): number;
export declare function secondsToMs(seconds: number): number;
export declare function fromTag(tag: string): FrameRate;
