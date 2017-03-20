JavaScript Framerate Utils
--------------------------

Utilities for formatting and converting times to frame rates

## Installation

``` sh
npm install --save framerate-utils
```

## Example usage

``` js
import { fromTag, secondsToSmpte } from 'framerate-utils';

const fr = FrameRate.fromTag('FPS_2397');
const seconds = 100;
const smpte = FrameRate.secondsToSmpte(fr, seconds);

console.log(smpte);
// output 00:01:39:21

```

## API

There are numerous functions and constants available for use. While looking
through methods if you come across a `frameRate` argument, you will need to
create one first and pass that in.

This `FrameRate` object has the following shape:

``` js
{
  rate: number // The frame rate
  numerator: number // The numerator of the frame rate multiplier
  denominator: number // The numerator of the frame rate multiplier
  dropFrame: bool // drop mode, true - NTSC drop frame, false - non drop frame
  fps: number // The effective frame rate in frames per second (rate * (numerator/denominator))
}
```

And can be created using the following code:

``` js
import { create } from 'framerate-utils';

const frameRate = create();
```

### Constants

- `SECONDS_PER_HOUR`
- `SECONDS_PER_MINUTE`
- `MILLISECONDS_PER_SECOND`
- `TICKS_PER_SECOND`

### Functions

- `create(rate = 24, numerator = 1, denominator = 1, dropFrame = false)` - Creates a new FrameRate object
- `secondsToSmpte(frameRate, seconds)` - Returns seconds converted to SMPTE time.
- `smpteToSeconds(frameRate, smtpe)` - Returns SMPTE time converted to seconds.
- `smpteToMs` - Returns SMPTE time converted to milliseconds.
- `msToSmpte` - Returns milliseconds converted to SMPTE time.

For all functions view the `src/index.js` file.
