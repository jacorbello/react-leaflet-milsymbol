import { describe, it, expect } from 'vitest';
import * as lib from '../index';

describe('public API exports', () => {
  it('exports MilSymbol component', () => {
    expect(lib.MilSymbol).toBeDefined();
    expect(typeof lib.MilSymbol).toBe('function');
  });

  it('exports useMilSymbol hook', () => {
    expect(lib.useMilSymbol).toBeDefined();
    expect(typeof lib.useMilSymbol).toBe('function');
  });

  it('does not export unexpected symbols', () => {
    const exportedKeys = Object.keys(lib);
    expect(exportedKeys).toEqual(
      expect.arrayContaining(['MilSymbol', 'useMilSymbol'])
    );
    // Only exported names should be MilSymbol and useMilSymbol
    // (types are erased at runtime)
    expect(exportedKeys).toHaveLength(2);
  });
});
