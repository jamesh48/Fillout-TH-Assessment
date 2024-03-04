import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

enum NodeEnv {
  TEST = 'test',
  DEV = 'development',
}

interface Env {
  env: NodeEnv;
  port: number;
  apiBaseUrl: string;
  demoFormId: string;
  filloutApiKey: string;
}

if (!process.env.DEMO_FORM_ID) {
  throw new Error('DEMO_FORM_ID is undefined!');
}

if (!process.env.FILLOUT_API_KEY) {
  throw new Error('FILLOUT_API_KEY is undefined!');
}

export const config: Env = {
  env: (process.env.NODE_ENV as NodeEnv) || NodeEnv.DEV,
  port: Number(process.env.PORT) || 3500,
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.fillout.com',
  demoFormId: process.env.DEMO_FORM_ID,
  filloutApiKey: process.env.FILLOUT_API_KEY,
};
