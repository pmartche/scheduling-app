import type { Config } from 'jest';
import { getJestProjectsAsync } from '@nx/jest';

export default async (): Promise<Config> => ({
  setupFiles: ['dotenv/config'],
  projects: await getJestProjectsAsync(),
});
