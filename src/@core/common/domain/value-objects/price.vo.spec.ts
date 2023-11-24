import Price from './price.vo';

describe('Price', () => {
  describe('Create', () => {
    it('should create a Price instance with a valid number', () => {
      const priceValue = 50;
      const price = new Price(priceValue);
      expect(price).toBeInstanceOf(Price);
      expect(price.value).toEqual(priceValue);
    });

    it('should throw an error if initialized with a non-number value', () => {
      const invalidValue = 'invalid' as unknown as number;
      expect(() => new Price(invalidValue)).toThrow('Price must be a number');
    });

    it('should throw an error if initialized with a value less than or equal to 0', () => {
      const invalidValue = 0;
      expect(() => new Price(invalidValue)).toThrow(
        'Price must be greater than 0',
      );
    });
  });

  describe('isEqualTo', () => {
    it('should return true when comparing two Price instances with the same value', () => {
      const priceValue = 50;
      const price1 = new Price(priceValue);
      const price2 = new Price(priceValue);
      expect(price1.isEqualTo(price2)).toBeTruthy();
    });

    it('should return false when comparing two Price instances with different values', () => {
      const price1 = new Price(50);
      const price2 = new Price(75);
      expect(price1.isEqualTo(price2)).toBeFalsy();
    });
  });
});
