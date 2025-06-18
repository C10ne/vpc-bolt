import { describe, it, expect } from 'vitest';
import { formatCurrency, truncateText } from '../shared/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats a number as USD currency by default', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats a number with the specified currency', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
      expect(formatCurrency(1000, 'JPY')).toBe('¥1,000');
      expect(formatCurrency(1000, 'GBP')).toBe('£1,000.00');
    });
  });

  describe('truncateText', () => {
    it('returns the original text if it is shorter than the max length', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
      expect(truncateText('', 5)).toBe('');
    });

    it('truncates the text and adds ellipsis if it exceeds the max length', () => {
      expect(truncateText('Hello, world!', 5)).toBe('Hello...');
      expect(truncateText('This is a long text', 7)).toBe('This is...');
    });
  });
});