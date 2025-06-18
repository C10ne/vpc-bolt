import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useToast, toast as globalToast, reducer } from './use-toast'; // import reducer for state reset
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"; // For typing if needed

// Helper to reset the internal state of the toast module since it's module-scoped
const resetToastModuleState = () => {
  // This is a bit of a hack. Ideally, the module would provide a reset function.
  // We are modifying the internal 'memoryState' which is not directly exported.
  // A more robust way would be to mock the entire module or specific functions like dispatch.
  // For now, let's try to influence it via the reducer if possible, or by re-evaluating `dispatch`.
  // However, the most straightforward way is to ensure `memoryState` is reset.
  // The `reducer` itself doesn't reset `memoryState` to initial, it acts on current `memoryState`.

  // The actual memoryState is not exported. We can try to dispatch REMOVE_TOAST for all.
  // Or, more directly, if we could access `memoryState` or `dispatch` to reset.
  // Let's assume for now that tests will clean up after themselves by dismissing toasts.
  // A proper reset would be:
  // memoryState = { toasts: [] }; // This line cannot be executed here as memoryState is not exported
  // listeners.length = 0; // This line cannot be executed here
  // count = 0; // This line cannot be executed here
  // For now, we will rely on dismissing toasts in afterEach.
  // A better approach would be to mock the module or parts of it.

  // Let's try dispatching a clear all action.
  // The reducer has a case for REMOVE_TOAST without toastId to clear all.
  // We need access to dispatch or a function that calls it.
  // The hook itself provides `dismiss()` which can clear all.
  const { result } = renderHook(() => useToast());
  act(() => {
    result.current.dismiss(); // This should clear all toasts by setting open: false
  });
  // And then to truly empty the array for the next test:
  act(() => {
    // Dispatching internal action directly if reducer and an internal dispatcher were available
    // For now, this is the best we can do with the exported API.
    // This should eventually lead to REMOVE_TOAST via timeouts, but delay is too long.
    // The tests will focus on the immediate state changes.
  });
};


describe('useToast Hook and toast function', () => {
  beforeEach(() => {
    // Reset count for genId to ensure consistent IDs if not mocking genId
    // This is tricky as `count` is not exported. Tests might need to be less reliant on specific IDs.
    // vi.resetModules() could also be an option if the module was fully self-contained
    // and didn't have side effects like global event listeners (which this one doesn't seem to have).

    // Clear all toasts before each test using the available dismiss function from a fresh hook instance.
    // This ensures that `memoryState.toasts` becomes empty of "open" toasts.
    // The actual removal from the array is delayed, but `open: false` is the important part for visibility.
    const { result: currentHook } = renderHook(() => useToast());
    act(() => {
        currentHook.current.dismiss(); // Dismiss all, sets open to false
    });
    // To fully clear the array for the next test (bypassing long delay),
    // we'd ideally need a direct way to call dispatch({ type: "REMOVE_TOAST" })
    // or reset memoryState. Since we don't, tests must be written carefully.
    // For robust testing, mocking `genId` and the `dispatch` mechanism or `reducer` would be better.
  });


  it('should initialize with an empty toasts array', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('should add a toast using the toast function from hook', () => {
    const { result } = renderHook(() => useToast());
    const toastProps = { title: 'Test Toast', description: 'This is a test.' };

    act(() => {
      result.current.toast(toastProps);
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0]).toMatchObject(toastProps);
    expect(result.current.toasts[0].open).toBe(true);
  });

  it('should add a toast using the global toast function', () => {
    const { result } = renderHook(() => useToast()); // Hook to observe state
    const toastProps = { title: 'Global Toast', description: 'Another test.' };

    act(() => {
      globalToast(toastProps);
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0]).toMatchObject(toastProps);
  });

  it('should dismiss a toast using the dismiss function from hook', () => {
    const { result } = renderHook(() => useToast());
    let toastId: string | undefined;

    act(() => {
      const t = result.current.toast({ title: 'Dismissible Toast' });
      toastId = t.id;
    });

    expect(result.current.toasts.length).toBe(1);

    act(() => {
      if (toastId) {
        result.current.dismiss(toastId);
      }
    });

    expect(result.current.toasts.length).toBe(1); // Toast is still there but marked as not open
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('should dismiss all toasts when dismiss is called without an ID', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' }); // This will replace Toast 1 due to TOAST_LIMIT = 1
    });
     expect(result.current.toasts.length).toBe(1); // Only one toast due to limit

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.toasts.length).toBe(1); // Still 1 due to limit, but should be marked as closed
    if (result.current.toasts.length > 0) {
        result.current.toasts.forEach(t => expect(t.open).toBe(false));
    }
  });

  it('should update a toast using the update function', () => {
    const { result } = renderHook(() => useToast());
    const initialProps = { title: 'Initial Title' };
    const updatedProps = { title: 'Updated Title' };
    let toastInstance: { id: string; dismiss: () => void; update: (props: any) => void; } | undefined;

    act(() => {
      toastInstance = result.current.toast(initialProps);
    });

    expect(result.current.toasts[0].title).toBe('Initial Title');

    act(() => {
      toastInstance?.update(updatedProps);
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Updated Title');
  });

  it('should respect TOAST_LIMIT', () => {
    const { result } = renderHook(() => useToast());
    // Assuming TOAST_LIMIT is 1 as per the source code
    act(() => {
      result.current.toast({ title: 'Toast A' });
      result.current.toast({ title: 'Toast B' });
      result.current.toast({ title: 'Toast C' });
    });

    expect(result.current.toasts.length).toBe(1); // TOAST_LIMIT
    expect(result.current.toasts[0].title).toBe('Toast C'); // Last one in
  });

  // Removed the onOpenChange test as the hook's dismiss doesn't directly call the user's onOpenChange.
  // That prop is for the UI component to call.
});
