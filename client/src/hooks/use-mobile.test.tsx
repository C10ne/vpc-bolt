import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIsMobile } from './use-mobile';

describe('useIsMobile Hook', () => {
  const getWindowInnerWidth = () => window.innerWidth;
  const setWindowInnerWidth = (width: number) => {
    // @ts-ignore
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
  };

  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = getWindowInnerWidth();
    act(() => { // Wrap initial setup
      setWindowInnerWidth(1024);
    });
  });

  afterEach(() => {
    setWindowInnerWidth(originalInnerWidth);
    vi.restoreAllMocks();
  });

  it('should initialize with isMobile false for desktop width', () => {
    let hookResult: ReturnType<typeof renderHook<boolean, unknown>>;
    act(() => {
      setWindowInnerWidth(1024);
      hookResult = renderHook(() => useIsMobile());
    });
    // @ts-ignore
    expect(hookResult.result.current).toBe(false);
  });

  it('should initialize with isMobile true for mobile width', () => {
    let hookResult: ReturnType<typeof renderHook<boolean, unknown>>;
    act(() => {
      setWindowInnerWidth(500);
      hookResult = renderHook(() => useIsMobile());
    });
    // @ts-ignore
    expect(hookResult.result.current).toBe(true);
  });

  it('should update isMobile to true when window is resized to mobile width', () => {
    let hookResult: ReturnType<typeof renderHook<boolean, unknown>>;
    act(() => {
      setWindowInnerWidth(1024);
      hookResult = renderHook(() => useIsMobile());
    });
    // @ts-ignore
    expect(hookResult.result.current).toBe(false); // Initial state check

    act(() => {
      setWindowInnerWidth(500);
    });
    expect(hookResult.result.current).toBe(true); // Corrected: use hookResult
  });

  it('should update isMobile to false when window is resized to desktop width', () => {
    let hookResult: ReturnType<typeof renderHook<boolean, unknown>>;
    act(() => {
      setWindowInnerWidth(500);
      hookResult = renderHook(() => useIsMobile());
    });
    // @ts-ignore
    expect(hookResult.result.current).toBe(true); // Initial state check

    act(() => {
      setWindowInnerWidth(1024);
    });
    expect(hookResult.result.current).toBe(false); // Corrected: use hookResult
  });

  // The hook useIsMobile does not accept a threshold argument in its current implementation.
  // This test verifies behavior with the default threshold.
  it('should reflect mobile state based on default threshold (768px)', () => {
    let hookResult: ReturnType<typeof renderHook<boolean, unknown>>; // Renamed for consistency
    act(() => {
      setWindowInnerWidth(800); // Above default threshold
      hookResult = renderHook(() => useIsMobile());
    });
    // @ts-ignore
    expect(hookResult.result.current).toBe(false); // Initial state check

    act(() => {
      setWindowInnerWidth(700); // Below default threshold
    });
    expect(hookResult.result.current).toBe(true); // Corrected: use hookResult

    act(() => {
      setWindowInnerWidth(768); // At threshold (exclusive for < 768), so not mobile
    });
    expect(hookResult.result.current).toBe(false); // Corrected: use hookResult

    act(() => {
      setWindowInnerWidth(767); // Just below threshold
    });
    expect(hookResult.result.current).toBe(true); // Corrected: use hookResult
  });

  it('should add event listener on mount and remove on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useIsMobile());

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
