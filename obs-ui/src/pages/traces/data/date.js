import { dropWhile as _dropWhile } from "lodash";

export const STANDARD_DATE_FORMAT = "YYYY-MM-DD";
export const STANDARD_TIME_FORMAT = "HH:mm";
export const ONE_MILLISECOND = 1000;
export const ONE_SECOND = 1000 * ONE_MILLISECOND;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const DEFAULT_MS_PRECISION = Math.log10(ONE_MILLISECOND);

const UNIT_STEPS = [
  { unit: "d", microseconds: ONE_DAY, ofPrevious: 24 },
  { unit: "h", microseconds: ONE_HOUR, ofPrevious: 60 },
  { unit: "m", microseconds: ONE_MINUTE, ofPrevious: 60 },
  { unit: "s", microseconds: ONE_SECOND, ofPrevious: 1000 },
  { unit: "ms", microseconds: ONE_MILLISECOND, ofPrevious: 1000 },
  { unit: "μs", microseconds: 1, ofPrevious: 1000 },
];

/**
 * Humanizes the duration for display.
 *
 * Example:
 * 5000ms => 5s
 * 1000μs => 1ms
 * 183840s => 2.13d
 *
 * @param {number} duration (in microseconds)
 * @return {string} formatted duration
 */
export function formatDuration(duration) {
  const [primaryUnit] = _dropWhile(
    UNIT_STEPS,
    ({ microseconds }) => microseconds > duration,
  );

  return `${(duration / primaryUnit.microseconds).toFixed(2)}${primaryUnit.unit}`;
}
