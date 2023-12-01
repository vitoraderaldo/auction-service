import { faker } from '@faker-js/faker';

const doWhileLengthIsNotReached = (
  callBack: () => string,
  minLength: number,
): string => {
  let result: string;
  do {
    result = callBack();
  } while (result.length < minLength);

  return result;
};

export const generateFirstName = (): string => (
  doWhileLengthIsNotReached(faker.person.firstName, 3)
);

export const generateLastName = (): string => (
  doWhileLengthIsNotReached(faker.person.lastName, 3)
);
