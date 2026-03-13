import { describe, it, expect } from '@rstest/core';
import { randomNum } from './tool';

describe('randomNum function', () => {
  it('should return a number greater than 0 with default parameters', () => {
    const result = randomNum();
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  it('should return a number between min and max (inclusive)', () => {
    const min = 5;
    const max = 10;
    const result = randomNum(min, max);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it('should return min when min and max are the same', () => {
    const value = 42;
    const result = randomNum(value, value);
    expect(result).toBe(value);
  });

  it('should handle negative numbers', () => {
    const min = -5;
    const max = 5;
    const result = randomNum(min, max);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });
});
