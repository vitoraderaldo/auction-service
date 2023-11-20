import { Uuid } from './uuid.vo';

describe('Uuid - Value Object', () => {
  it.each`
    value
    ${null}
    ${undefined}
  `('should create a valid UUID without providing a value', ({ value }) => {
    const uuid = new Uuid(value);
    expect(uuid).toBeInstanceOf(Uuid);
    expect(uuid.value).toMatch(
      /^([a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12})|([a-f\d]{32})$/i,
    );
  });

  it('should create a valid UUID when providing a value', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    const uuid = new Uuid(validUuid);
    expect(uuid).toBeInstanceOf(Uuid);
    expect(uuid.value).toBe(validUuid);
  });

  it('should throw an error for an invalid UUID', () => {
    const invalidUuid = 'invalid-uuid';
    expect(() => new Uuid(invalidUuid)).toThrow('Invalid UUID');
  });

  it('should be equal to another uuid with the same value', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    const uuid1 = new Uuid(validUuid);
    const uuid2 = new Uuid(validUuid);
    expect(uuid1.isEqualTo(uuid2)).toBe(true);
  });

  it('should not be equal to another uuid with a different value', () => {
    const uuid1 = new Uuid();
    const uuid2 = new Uuid();
    expect(uuid1.isEqualTo(uuid2)).toBe(false);
  });
});
