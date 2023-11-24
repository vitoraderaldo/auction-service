import IsoStringDate from './iso-string-data.vo';

describe('IsoStringDate', () => {
  describe('Create', () => {
    it('should create an IsoStringDate instance with a valid ISO string date', () => {
      const isoDateString = '2023-11-20T22:55:47.430Z';
      const isoDate = new IsoStringDate(isoDateString);
      expect(isoDate).toBeInstanceOf(IsoStringDate);
      expect(isoDate.value).toEqual(isoDateString);
    });

    it('should throw an error if initialized with an invalid ISO string date', () => {
      const invalidIsoDateString = 'invalid-date';
      expect(() => new IsoStringDate(invalidIsoDateString)).toThrow(
        'Invalid ISO string date',
      );
    });
  });

  describe('isEqualTo', () => {
    it('should return true when comparing two IsoStringDate instances with the same value', () => {
      const isoDateString = '2023-11-20T22:55:47.430Z';
      const isoDate1 = new IsoStringDate(isoDateString);
      const isoDate2 = new IsoStringDate(isoDateString);
      expect(isoDate1.isEqualTo(isoDate2)).toBeTruthy();
    });

    it('should return false when comparing two IsoStringDate instances with different values', () => {
      const isoDate1 = new IsoStringDate('2023-11-20T22:55:47.430Z');
      const isoDate2 = new IsoStringDate('2023-11-20T22:55:47.431Z');
      expect(isoDate1.isEqualTo(isoDate2)).toBeFalsy();
    });
  });

  describe('isBefore', () => {
    it('should return true when the current IsoStringDate is before the other IsoStringDate', () => {
      const isoDate1 = new IsoStringDate('2023-11-19T00:00:00.000Z');
      const isoDate2 = new IsoStringDate('2023-11-20T00:00:00.000Z');
      expect(isoDate1.isBefore(isoDate2)).toBeTruthy();
    });

    it('should return false when the current IsoStringDate is after or equal to the other IsoStringDate', () => {
      const isoDate1 = new IsoStringDate('2023-11-19T00:00:00.000Z');
      const isoDate2 = new IsoStringDate('2023-11-20T00:00:00.000Z');
      expect(isoDate2.isBefore(isoDate1)).toBeFalsy();
    });
  });
});
