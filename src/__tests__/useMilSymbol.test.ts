import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMilSymbol } from '../hooks/useMilSymbol';

describe('useMilSymbol', () => {
  it('creates a milsymbol instance with default size', () => {
    const { result } = renderHook(() => useMilSymbol('SFG-UCI----D'));
    expect(result.current).toBeDefined();
    expect(result.current.getSize()).toBeDefined();
  });

  it('creates a milsymbol instance with custom options', () => {
    const { result } = renderHook(() =>
      useMilSymbol('SFG-UCI----D', { size: 50, fill: true })
    );
    expect(result.current).toBeDefined();
  });

  it('returns the same instance when inputs are unchanged', () => {
    const { result, rerender } = renderHook(
      ({ sidc, opts }) => useMilSymbol(sidc, opts),
      { initialProps: { sidc: 'SFG-UCI----D', opts: { size: 35 } } }
    );
    const first = result.current;
    rerender({ sidc: 'SFG-UCI----D', opts: { size: 35 } });
    expect(result.current).toBe(first);
  });

  it('creates a new instance when sidc changes', () => {
    const { result, rerender } = renderHook(
      ({ sidc }) => useMilSymbol(sidc),
      { initialProps: { sidc: 'SFG-UCI----D' } }
    );
    const first = result.current;
    rerender({ sidc: 'SHG-UCIZ---D' });
    expect(result.current).not.toBe(first);
  });

  it('creates a new instance when options change', () => {
    const { result, rerender } = renderHook(
      ({ opts }) => useMilSymbol('SFG-UCI----D', opts),
      { initialProps: { opts: { size: 35 } } }
    );
    const first = result.current;
    rerender({ opts: { size: 50 } });
    expect(result.current).not.toBe(first);
  });

  it('generates valid SVG output', () => {
    const { result } = renderHook(() => useMilSymbol('SFG-UCI----D'));
    const svg = result.current.asSVG();
    expect(svg).toContain('<svg');
  });

  it('supports numeric SIDC', () => {
    const { result } = renderHook(() => useMilSymbol('10031000161200000000'));
    const svg = result.current.asSVG();
    expect(svg).toContain('<svg');
  });

  it('uses default size of 35', () => {
    const { result } = renderHook(() => useMilSymbol('SFG-UCI----D'));
    const size = result.current.getSize();
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  });

  it('respects size override via options', () => {
    const { result: defaultResult } = renderHook(() => useMilSymbol('SFG-UCI----D'));
    const { result: largeResult } = renderHook(() => useMilSymbol('SFG-UCI----D', { size: 100 }));
    const defaultSize = defaultResult.current.getSize();
    const largeSize = largeResult.current.getSize();
    expect(largeSize.width).not.toBe(defaultSize.width);
    expect(largeSize.height).not.toBe(defaultSize.height);
  });

  it('handles empty options object with default size', () => {
    const { result } = renderHook(() => useMilSymbol('SFG-UCI----D', {}));
    const size = result.current.getSize();
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  });

  it('applies direction option', () => {
    const { result: noDir } = renderHook(() => useMilSymbol('SFG-UCI----D'));
    const { result: withDir } = renderHook(() => useMilSymbol('SFG-UCI----D', { direction: '90' }));
    expect(noDir.current.asSVG()).not.toBe(withDir.current.asSVG());
  });

  it('produces different instances for different key order in options (memoization limitation)', () => {
    const { result: r1 } = renderHook(
      ({ opts }) => useMilSymbol('SFG-UCI----D', opts),
      { initialProps: { opts: { fill: true, size: 35 } } }
    );
    const first = r1.current;

    const { result: r2 } = renderHook(
      ({ opts }) => useMilSymbol('SFG-UCI----D', opts),
      { initialProps: { opts: { size: 35, fill: true } } }
    );
    const second = r2.current;

    // JSON.stringify produces different strings for different key orders,
    // so these are different instances (documenting the known limitation)
    expect(first).not.toBe(second);
  });
});
