import { cn, formatDate, formatDateTime, generateId, isOverdue } from './utils';

describe('lib/utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', false && 'hidden', 'visible');
      expect(result).toBe('base-class visible');
    });

    it('should merge Tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle null and undefined', () => {
      const result = cn(null, undefined, 'valid-class');
      expect(result).toBe('valid-class');
    });
  });

  describe('generateId', () => {
    it('should generate a valid UUID', () => {
      const id = generateId();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidRegex);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should always return a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });
  });

  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date(2024, 0, 15); // 15 de janeiro de 2024
      const result = formatDate(date);
      expect(result).toBe('15/01/2024');
    });

    it('should format string date correctly', () => {
      const dateString = '2024-01-15';
      const result = formatDate(dateString);
      expect(result).toBe('15/01/2024');
    });

    it('should handle null input', () => {
      const result = formatDate(null);
      expect(result).toBe('-');
    });

    it('should handle ISO string with time', () => {
      const dateString = '2024-01-15T10:30:00.000Z';
      const result = formatDate(dateString);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should format different months correctly', () => {
      const date = new Date(2024, 11, 25); // 25 de dezembro de 2024
      const result = formatDate(date);
      expect(result).toBe('25/12/2024');
    });

    it('should handle single-digit days and months', () => {
      const date = new Date(2024, 0, 5); // 5 de janeiro de 2024
      const result = formatDate(date);
      expect(result).toBe('05/01/2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format Date object with time', () => {
      const date = new Date(2024, 0, 15, 14, 30);
      const result = formatDateTime(date);
      expect(result).toMatch(/15\/01\/2024,?\s+14:30/);
    });

    it('should format string date with time', () => {
      const dateString = '2024-01-15T14:30:00';
      const result = formatDateTime(dateString);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4},?\s+\d{2}:\d{2}/);
    });

    it('should handle null input', () => {
      const result = formatDateTime(null);
      expect(result).toBe('-');
    });

    it('should include time in format', () => {
      const date = new Date(2024, 0, 15, 9, 5);
      const result = formatDateTime(date);
      expect(result).toContain('09:05');
    });
  });

  describe('isOverdue', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should return true for past date with OPEN status', () => {
      const pastDate = new Date('2024-01-10');
      const result = isOverdue(pastDate, 'OPEN');
      expect(result).toBe(true);
    });

    it('should return true for past date with IN_PROGRESS status', () => {
      const pastDate = new Date('2024-01-10');
      const result = isOverdue(pastDate, 'IN_PROGRESS');
      expect(result).toBe(true);
    });

    it('should return false for past date with COMPLETED status', () => {
      const pastDate = new Date('2024-01-10');
      const result = isOverdue(pastDate, 'COMPLETED');
      expect(result).toBe(false);
    });

    it('should return false for past date with CANCELLED status', () => {
      const pastDate = new Date('2024-01-10');
      const result = isOverdue(pastDate, 'CANCELLED');
      expect(result).toBe(false);
    });

    it('should return false for future date', () => {
      const futureDate = new Date('2024-01-20');
      const result = isOverdue(futureDate, 'OPEN');
      expect(result).toBe(false);
    });

    it('should handle string date input', () => {
      const pastDateString = '2024-01-10';
      const result = isOverdue(pastDateString, 'OPEN');
      expect(result).toBe(true);
    });

    it('should return false for today with COMPLETED', () => {
      const today = new Date('2024-01-15');
      const result = isOverdue(today, 'COMPLETED');
      expect(result).toBe(false);
    });
  });
});
