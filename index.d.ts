
declare module 'framerate-utils' {

  export interface IFrameRate {
    denominator: number;
    dropFrame: boolean;
    fps: number;
    numerator: number;
    rate: number;
  }

  export function create(rate: IFrameRate['rate'], numerator: IFrameRate['numerator'], denominator: IFrameRate['denominator'], dropFrame: IFrameRate['dropFrame']): IFrameRate;

  export function fromTag(tag: string): IFrameRate;
  export function frameToSmpte(frameRate: IFrameRate, frame: number): string;
  export function secondsToSmpte(frameRate: IFrameRate, seconds: number): string;
  export function smpteToSeconds(frameRate: IFrameRate, smpte: string): number;
  export function smpteToMs(frameRate: IFrameRate, smpte: string): number;
  export function msToSmpte(frameRate: IFrameRate, ms: number): string;
  export function smpteToTicks(frameRate: IFrameRate, smpte: string): number;
  export function ticksToSmpte(frameRate: IFrameRate, ticks: number): string;
  export function secondsToFrame(frameRate: IFrameRate, seconds: number): string;
  export function msToFrame(frameRate: IFrameRate, ms: number): number;
  export function frameToMs(frameRate: IFrameRate, frame: number): number;
  export function ticksToFrame(frameRate: IFrameRate, ticks: number): number;
  export function frameToTicks(frameRate: IFrameRate, frame: number): number;
  export function frameToSmpte(frameRate: IFrameRate, frame: number): string;
  export function extraFrames(frameRate: IFrameRate, frame: number): number;
  export function smpteToFrame(frameRate: IFrameRate, smpte: string): number;
  export function frameToSeconds(frameRate: IFrameRate, frame: number): number;
  export function seekByFrames(frameRate: IFrameRate, fromTimeSeconds: number, frameDelta: number): number;
  export function seekToFrame(frameRate: IFrameRate, frame: number): number;
  export function toFrameTime(frameRate: IFrameRate, seconds: number): number;
  export function mediaToSeconds(media: string): number;
  export function secondsToMedia(seconds: number): string;
  export function mediaFramesToSeconds(frameRate: IFrameRate, media: string): number;
  export function secondsToMediaFrames(frameRate: IFrameRate, seconds: number): string;
  export function ticksToSeconds(ticks: number): number;
  export function secondsToTicks(seconds: number): number;
  export function msToSeconds(ms: number): number;
  export function secondsToMs(seconds: number): number;

  export const FRAME_ROUNDING: number;
  export const MILLISECONDS_PER_SECOND: number;
  export const SECONDS_PER_HOUR: number;
  export const SECONDS_PER_MINUTE: number;
  export const TICKS_PER_SECOND: number;

  export const RATE_23_976: IFrameRate;
  export const RATE_24: IFrameRate;
  export const RATE_25: IFrameRate;
  export const RATE_29_97: IFrameRate;
  export const RATE_29_97_DROP: IFrameRate;
  export const RATE_30: IFrameRate;
  export const RATE_48: IFrameRate;
  export const RATE_50: IFrameRate;
  export const RATE_59_94: IFrameRate;
  export const RATE_59_94_DROP: IFrameRate;
  export const RATE_60: IFrameRate;
  export const DEFAULT_FRAME_RATE: IFrameRate;
}