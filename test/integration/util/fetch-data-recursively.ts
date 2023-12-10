import { isEmpty } from 'lodash';
import delay from './delay';

const runWithRetries = async<T> (
  handler: () => Promise<T>,
  delayMs: number = 1000,
): Promise<T> => {
  const data = await handler();
  if (!isEmpty(data)) {
    return data;
  }

  await delay(delayMs);
  return runWithRetries(handler, delayMs);
};

export default runWithRetries;
