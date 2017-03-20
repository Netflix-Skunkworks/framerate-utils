import * as FrameRate from '../src/index';

describe('localization/utils/FrameRate', () => {

  it('should convert 00:00:10:01 correctly', () => {
    const fr      = FrameRate.RATE_23_976;
    const frame   = FrameRate.secondsToFrame(fr, 10.052);
    const actual  = FrameRate.toFrameTime(fr, 10.052);
    const rounded = Math.round(actual * 100) / 100;
    const smpte   = FrameRate.secondsToSmpte(fr, actual);

    expect(frame).toEqual(241);
    expect(rounded).toEqual(10.07);
    expect(smpte).toEqual('00:00:10:01');
  });

  it('should convert 00:00:23:03 correctly', () => {
    const fr      = FrameRate.RATE_23_976;
    const frame   = FrameRate.secondsToFrame(fr, 23.149);
    const actual  = FrameRate.toFrameTime(fr, 23.149);
    const rounded = Math.round(actual * 100) / 100;
    const smpte   = FrameRate.secondsToSmpte(fr, actual);

    expect(frame).toEqual(555);
    expect(rounded).toEqual(23.170);
    expect(smpte).toEqual('00:00:23:03');
  });

  it('should convert 00:00:01:00 correctly', () => {
    const fr      = FrameRate.RATE_23_976;
    const frame23 = FrameRate.secondsToFrame(fr, 0.998);
    const frame24 = FrameRate.secondsToFrame(fr, 1.001);

    expect(frame23).toEqual(23);
    expect(frame24).toEqual(24);
  });

  it('should parse mm:ss:ff correctly', () => {
    const fr = FrameRate.RATE_24;

    expect(FrameRate.smpteToFrame(fr, '01:02:03')).toEqual(1491);
  });

  it('should avoid rounding error on frame to ms', () => {
    const fr     = FrameRate.RATE_23_976;
    const frame  = 473;
    const ms     = FrameRate.frameToMs(fr, frame);
    const actual = FrameRate.msToFrame(fr, ms);

    expect(actual).toEqual(frame);
  });

  it('should parse drop frame', () => {
    const fr = FrameRate.RATE_29_97_DROP;

    expect(FrameRate.smpteToMs(fr, '00:01:00;03')).toEqual(60094);
    expect(FrameRate.smpteToMs(fr, '01:11:23;07')).toEqual(4283246);
  });

  it('should format drop frame', () => {
    const fr = FrameRate.RATE_29_97_DROP;

    expect(FrameRate.msToSmpte(fr, 60094)).toEqual('00:01:00;03');
    expect(FrameRate.msToSmpte(fr, 60091)).toEqual('00:01:00;02');
    expect(FrameRate.msToSmpte(fr, 4283246)).toEqual('01:11:23;07');
    expect(FrameRate.msToSmpte(fr, 4283243)).toEqual('01:11:23;06');
    expect(FrameRate.msToSmpte(fr, 0)).toEqual('00:00:00;00');
  });

  it('should convert seconds to smpte', () => {
    const fr = FrameRate.fromTag('FPS_2397');
    const seconds = 100;

    expect(FrameRate.secondsToSmpte(fr, seconds)).toEqual('00:01:39:21');
  });
});