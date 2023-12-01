import InvalidNameError from '../../error/invalid-name';
import PersonName from './person-name.vo';

describe('Person Name - Value Object', () => {
  it('should create a valid PersonName instance', () => {
    const name = { firstName: 'John', lastName: 'Doe' };
    const personName = new PersonName(name);
    expect(personName).toBeInstanceOf(PersonName);
    expect(personName.value).toEqual(name);
  });

  it('should throw an error for a first name less than 3 characters long', () => {
    const shortName = { firstName: 'Jo', lastName: 'Doe' };

    try {
      new PersonName(shortName);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidNameError);
      expect(err.details).toEqual({
        firstName: shortName.firstName,
        reason: 'First name must be at least 3 characters long',
      });
    }
  });

  it('should throw an error for a last name less than 3 characters long', () => {
    const shortName = { firstName: 'John', lastName: 'Do' };

    try {
      new PersonName(shortName);
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidNameError);
      expect(err.details).toEqual({
        lastName: shortName.lastName,
        reason: 'Last name must be at least 3 characters long',
      });
    }
  });

  it('should be equal when first name and last name are the same', () => {
    const name = { firstName: 'John', lastName: 'Doe' };
    const name1 = new PersonName(name);
    const name2 = new PersonName(name);
    expect(name1.isEqualTo(name2)).toBe(true);
  });

  it('should not be equal when first name is not the same', () => {
    const name1 = new PersonName({ firstName: 'John', lastName: 'Doe' });
    const name2 = new PersonName({ firstName: 'Jane', lastName: 'Doe' });
    expect(name1.isEqualTo(name2)).toBe(false);
  });

  it('should not be equal when last name is not the same', () => {
    const name1 = new PersonName({ firstName: 'John', lastName: 'Wild' });
    const name2 = new PersonName({ firstName: 'John', lastName: 'Doe' });
    expect(name1.isEqualTo(name2)).toBe(false);
  });
});
