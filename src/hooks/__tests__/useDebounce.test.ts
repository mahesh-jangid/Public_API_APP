import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  jest.useFakeTimers();

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'updated', delay: 500 });
    
    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the value should be updated
    expect(result.current).toBe('updated');
  });

  it('should cancel previous timer on new updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // First update
    rerender({ value: 'first update', delay: 500 });
    
    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Second update before first one completes
    rerender({ value: 'second update', delay: 500 });
    
    // Advance time to when first update would have happened
    act(() => {
      jest.advanceTimersByTime(250);
    });
    
    // Value should still be initial
    expect(result.current).toBe('initial');

    // Advance time to when second update should happen
    act(() => {
      jest.advanceTimersByTime(250);
    });
    
    // Now we should see the second update
    expect(result.current).toBe('second update');
  });
});