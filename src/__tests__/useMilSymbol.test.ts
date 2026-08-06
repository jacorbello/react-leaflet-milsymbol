import { describe, it, expect, vi, afterEach } from 'vitest';
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

  describe('invalid SIDC warning', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    // The dedupe Set in useMilSymbol is module-scoped and persists for the whole
    // test file, so every SIDC here — valid ones included — must be unique to this
    // block. Reusing one that an earlier test already passed through would let the
    // dedupe suppress a warning these tests are supposed to catch.

    it('warns when the SIDC is invalid', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      renderHook(() => useMilSymbol('NOTASIDC-A'));
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain('NOTASIDC-A');
    });

    it('warns only once for the same invalid SIDC', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      renderHook(() => useMilSymbol('NOTASIDC-B'));
      renderHook(() => useMilSymbol('NOTASIDC-B'));
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it('does not warn for a valid SIDC', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      renderHook(() => useMilSymbol('SFGPEWRH--MT'));
      renderHook(() => useMilSymbol('10031000001211000000'));
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
