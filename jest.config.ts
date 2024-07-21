import type {Config} from 'jest';

const config: Config = {
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'jest-puppeteer',
  testMatch: ['**/*.test.ts'],
  transform: {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- disabling due to necessary quotes
    '^.+.tsx?$': 'ts-jest',
  },
};

export default config;
