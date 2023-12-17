/* eslint-disable no-console */
import { createCoverageMap } from 'istanbul-lib-coverage';
import { createReporter } from 'istanbul-api';
import { readJsonSync } from 'fs-extra';

const unitTestPath = 'coverage/unit/coverage-final.json';
const integrationTestPath = 'coverage/integration/coverage-final.json';

const normalizeJestCoverage = (obj: any) => {
  const result = obj;
  Object.entries(result).forEach(([k, v]: [k: string, v: any]) => {
    if (v.data) result[k] = v.data;
  });
  return result;
};

const map = createCoverageMap();
map.merge(normalizeJestCoverage(readJsonSync(integrationTestPath)));
map.merge(normalizeJestCoverage(readJsonSync(unitTestPath)));

const reporter = createReporter();
reporter.dir = 'coverage/merged';
reporter.addAll(['json', 'lcov', 'text']);
reporter.write(map);

console.log('Created a merged coverage report in ./coverage');
