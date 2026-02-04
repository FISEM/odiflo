import { currencyFormatter, dateFormatter, numberFormatter, pluralFormatter } from '../index';

describe('Formatters', () => {
  describe('currencyFormatter', () => {
    it('should format USD by default', () => {
      const result = currencyFormatter(1234.56, 'en');
      expect(result).toBe('$1,234.56');
    });

    it('should format EUR', () => {
      const result = currencyFormatter(1234.56, 'fr', 'EUR');
      expect(result).toContain('1');
      expect(result).toContain('234');
      expect(result).toContain('56');
    });

    it('should format JPY without decimals', () => {
      const result = currencyFormatter(1234, 'ja', 'JPY');
      expect(result).toContain('1,234');
      expect(result).not.toContain('.');
    });
  });

  describe('dateFormatter', () => {
    it('should format date with default format', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = dateFormatter(date, 'en');
      expect(result).toContain('1');
      expect(result).toContain('15');
      // Accept both 2024 and 24 (short format)
      expect(result).toMatch(/2024|24/);
    });

    it('should format date with custom format', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = dateFormatter(date, 'en', 'long');
      expect(result).toContain('January');
    });

    it('should handle ISO string dates', () => {
      const result = dateFormatter('2024-01-15', 'en');
      expect(result).toMatch(/2024|24/);
    });

    it('should handle timestamp numbers', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const result = dateFormatter(timestamp, 'en');
      expect(result).toMatch(/2024|24/);
    });
  });

  describe('numberFormatter', () => {
    it('should format integer', () => {
      const result = numberFormatter(1234567, 'en');
      expect(result).toBe('1,234,567.00');
    });

    it('should format decimal with 2 decimals by default', () => {
      const result = numberFormatter(1234.5678, 'en');
      expect(result).toBe('1,234.57');
    });

    it('should format with custom decimal places', () => {
      const result = numberFormatter(1234.5678, 'en', '4');
      expect(result).toBe('1,234.5678');
    });

    it('should handle French locale', () => {
      const result = numberFormatter(1234.56, 'fr');
      expect(result).toContain('1');
      expect(result).toContain('234');
      expect(result).toContain('56');
    });
  });

  describe('pluralFormatter', () => {
    it('should return singular form for count 1', () => {
      const result = pluralFormatter(1, 'en', 'item', 'items');
      expect(result).toBe('item');
    });

    it('should return plural form for count 0', () => {
      const result = pluralFormatter(0, 'en', 'item', 'items');
      expect(result).toBe('items');
    });

    it('should return plural form for count > 1', () => {
      const result = pluralFormatter(5, 'en', 'item', 'items');
      expect(result).toBe('items');
    });

    it('should handle French pluralization', () => {
      const result = pluralFormatter(2, 'fr', 'élément', 'éléments');
      expect(result).toBe('éléments');
    });

    it('should default to plural if only one form provided', () => {
      const result = pluralFormatter(5, 'en', 'items');
      expect(result).toBe('items');
    });
  });
});
