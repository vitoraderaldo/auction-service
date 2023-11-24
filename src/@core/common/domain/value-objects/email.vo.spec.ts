import Email from './email.vo';

describe('Email', () => {
  it('should create a valid Email instance', () => {
    const validEmail = 'john.doe@example.com';
    const email = new Email(validEmail);
    expect(email).toBeInstanceOf(Email);
    expect(email.value).toBe(validEmail);
  });

  it('should throw an error for an invalid email format', () => {
    const invalidEmail = 'invalid-email';
    expect(() => new Email(invalidEmail)).toThrow(
      'Email is not in a valid format',
    );
  });

  it('should be equal to another Email with the same value', () => {
    const email1 = new Email('john.doe@example.com');
    const email2 = new Email('john.doe@example.com');
    expect(email1.isEqualTo(email2)).toBe(true);
  });

  it('should not be equal to another Email with a different value', () => {
    const email1 = new Email('john.doe@example.com');
    const email2 = new Email('jane.smith@example.com');
    expect(email1.isEqualTo(email2)).toBe(false);
  });
});
