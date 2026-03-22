import { ok, err, type Result } from './result';

describe('Result', () => {
  describe('ok', () => {
    it('should create a success result with value', () => {
      const result = ok(42);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    it('should work with objects', () => {
      const result = ok({ name: 'test' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.name).toBe('test');
      }
    });

    it('should work with arrays', () => {
      const result = ok([1, 2, 3]);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(3);
      }
    });
  });

  describe('err', () => {
    it('should create an error result with message', () => {
      const result: Result<never, string> = err('Something failed');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('Something failed');
      }
    });

    it('should work with custom error types', () => {
      const result = err({ code: 404, message: 'Not found' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual({ code: 404, message: 'Not found' });
      }
    });
  });
});
