import * as FrameRate from '../src/index';
import {
  RATE_23_976,
  RATE_24,
  RATE_25,
  RATE_29_97_DROP,
  RATE_30,
  RATE_47_95,
  RATE_48,
  RATE_50,
  RATE_59_94_DROP,
  RATE_60,
} from '../src/index';

describe('localization/utils/FrameRate', () => {
  it('should convert drop frame to smpte correctly', () => {
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 1798)).toEqual(
      '00:00:59;28'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 1799)).toEqual(
      '00:00:59;29'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 1800)).toEqual(
      '00:01:00;02'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 1801)).toEqual(
      '00:01:00;03'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 8990)).toEqual(
      '00:04:59;28'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 8991)).toEqual(
      '00:04:59;29'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 8992)).toEqual(
      '00:05:00;02'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 17980)).toEqual(
      '00:09:59;28'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 17981)).toEqual(
      '00:09:59;29'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 17982)).toEqual(
      '00:10:00;00'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 17983)).toEqual(
      '00:10:00;01'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_29_97_DROP, 17984)).toEqual(
      '00:10:00;02'
    );
  });

  it('should convert smpte to drop frame correctly', () => {
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:00:59;28')
    ).toEqual(1798);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:00:59;29')
    ).toEqual(1799);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:01:00;02')
    ).toEqual(1800);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:01:00;03')
    ).toEqual(1801);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:04:59;28')
    ).toEqual(8990);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:04:59;29')
    ).toEqual(8991);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:05:00;02')
    ).toEqual(8992);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:09:59;28')
    ).toEqual(17980);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:09:59;29')
    ).toEqual(17981);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:10:00;00')
    ).toEqual(17982);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:10:00;01')
    ).toEqual(17983);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_29_97_DROP, '00:10:00;02')
    ).toEqual(17984);
  });

  it('should convert 59.94 drop frame to smpte correctly', () => {
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 3598)).toEqual(
      '00:00:59;58'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 3599)).toEqual(
      '00:00:59;59'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 3600)).toEqual(
      '00:01:00;04'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 3601)).toEqual(
      '00:01:00;05'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 17982)).toEqual(
      '00:04:59;58'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 17983)).toEqual(
      '00:04:59;59'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 17984)).toEqual(
      '00:05:00;04'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 35962)).toEqual(
      '00:09:59;58'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 35963)).toEqual(
      '00:09:59;59'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 35964)).toEqual(
      '00:10:00;00'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 35965)).toEqual(
      '00:10:00;01'
    );
    expect(FrameRate.frameToSmpte(FrameRate.RATE_59_94_DROP, 35966)).toEqual(
      '00:10:00;02'
    );
  });

  it('should convert 59.94 smpte to drop frame correctly', () => {
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:00:59;58')
    ).toEqual(3598);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:00:59;59')
    ).toEqual(3599);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:01:00;04')
    ).toEqual(3600);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:01:00;05')
    ).toEqual(3601);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:04:59;58')
    ).toEqual(17982);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:04:59;59')
    ).toEqual(17983);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:05:00;04')
    ).toEqual(17984);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:09:59;58')
    ).toEqual(35962);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:09:59;59')
    ).toEqual(35963);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:10:00;00')
    ).toEqual(35964);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:10:00;01')
    ).toEqual(35965);
    expect(
      FrameRate.smpteToFrame(FrameRate.RATE_59_94_DROP, '00:10:00;02')
    ).toEqual(35966);
  });

  it('should convert 00:00:10:01 correctly', () => {
    const fr = FrameRate.RATE_23_976;
    const frame = FrameRate.secondsToFrame(fr, 10.052);
    const actual = FrameRate.toFrameTime(fr, 10.052);
    const rounded = Math.round(actual * 100) / 100;
    const smpte = FrameRate.secondsToSmpte(fr, actual);

    expect(frame).toEqual(241);
    expect(rounded).toEqual(10.07);
    expect(smpte).toEqual('00:00:10:01');
  });

  it('should convert 00:00:23:03 correctly', () => {
    const fr = FrameRate.RATE_23_976;
    const frame = FrameRate.secondsToFrame(fr, 23.149);
    const actual = FrameRate.toFrameTime(fr, 23.149);
    const rounded = Math.round(actual * 100) / 100;
    const smpte = FrameRate.secondsToSmpte(fr, actual);

    expect(frame).toEqual(555);
    expect(rounded).toEqual(23.17);
    expect(smpte).toEqual('00:00:23:03');
  });

  it('should convert 00:00:01:00 correctly', () => {
    const fr = FrameRate.RATE_23_976;
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
    const fr = FrameRate.RATE_23_976;
    const frame = 473;
    const ms = FrameRate.frameToMs(fr, frame);
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

  it('should convert ms to seconds', () => {
    expect(FrameRate.msToSeconds(2500)).toEqual(2.5);
  });

  it('should convert seconds to ms', () => {
    expect(FrameRate.secondsToMs(4.123)).toEqual(4123);
  });

  it('should convert seconds to ticks', () => {
    expect(FrameRate.secondsToTicks(2.5)).toEqual(25000000);
    expect(FrameRate.secondsToTicks(1.23456789)).toEqual(12345678);
  });

  it('should convert ticks to seconds', () => {
    expect(FrameRate.secondsToTicks(3.14)).toEqual(31400000);
  });

  it('should convert media to seconds', () => {
    expect(FrameRate.mediaToSeconds('01:02:03.456')).toEqual(3723.456);
  });

  it('should convert seconds to media', () => {
    expect(FrameRate.secondsToMedia(10921.7654)).toEqual('03:02:01.765');
    expect(FrameRate.secondsToMedia(10921.7657)).toEqual('03:02:01.766');
    expect(FrameRate.secondsToMedia(1.011)).toEqual('00:00:01.011');
    expect(FrameRate.secondsToMedia(1.003)).toEqual('00:00:01.003');
  });

  it('should convert media frames to seconds', () => {
    const fr = FrameRate.RATE_24;
    expect(FrameRate.mediaFramesToSeconds(fr, '01:02:03:06')).toEqual(3723.25);
  });

  it('should convert seconds to media', () => {
    const fr = FrameRate.RATE_25;
    expect(FrameRate.secondsToMediaFrames(fr, 10921.12)).toEqual('03:02:01:03');
    expect(FrameRate.secondsToMediaFrames(fr, 10921.8)).toEqual('03:02:01:20');
  });

  it('should convert SRT media media to seconds', () => {
    expect(FrameRate.mediaToSeconds('01:02:03,456')).toEqual(3723.456);
  });

  it('should support all frame rates from tag', () => {
    expect(FrameRate.fromTag('FPS_2397')).toEqual(RATE_23_976);
    expect(FrameRate.fromTag('FPS_24')).toEqual(RATE_24);
    expect(FrameRate.fromTag('FPS_2400')).toEqual(RATE_24);
    expect(FrameRate.fromTag('FPS_25')).toEqual(RATE_25);
    expect(FrameRate.fromTag('FPS_2500')).toEqual(RATE_25);
    expect(FrameRate.fromTag('FPS_2997')).toEqual(RATE_29_97_DROP);
    expect(FrameRate.fromTag('FPS_30')).toEqual(RATE_30);
    expect(FrameRate.fromTag('FPS_3000')).toEqual(RATE_30);
    expect(FrameRate.fromTag('FPS_4795')).toEqual(RATE_47_95);
    expect(FrameRate.fromTag('FPS_48')).toEqual(RATE_48);
    expect(FrameRate.fromTag('FPS_4800')).toEqual(RATE_48);
    expect(FrameRate.fromTag('FPS_50')).toEqual(RATE_50);
    expect(FrameRate.fromTag('FPS_5000')).toEqual(RATE_50);
    expect(FrameRate.fromTag('FPS_5994')).toEqual(RATE_59_94_DROP);
    expect(FrameRate.fromTag('FPS_60')).toEqual(RATE_60);
    expect(FrameRate.fromTag('FPS_6000')).toEqual(RATE_60);
  });
});
