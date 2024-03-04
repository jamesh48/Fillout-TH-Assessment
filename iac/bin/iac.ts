#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
//
import * as cdk from 'aws-cdk-lib';
import { FilloutStack } from '../lib/fillout-stack';

const app = new cdk.App();
const {
  API_BASE_URL,
  DEMO_FORM_ID,
  FILLOUT_API_KEY,
  AWS_ALB_LISTENER_ARN,
  AWS_CLUSTER_ARN,
  AWS_DEFAULT_SG,
  AWS_VPC_ID,
  PORT,
} = process.env;

if (!AWS_ALB_LISTENER_ARN) {
  throw new Error('AWS_ALB_LISTENER_ARN env is undefined!');
}

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL env is undefined!');
}

if (!DEMO_FORM_ID) {
  throw new Error('DEMO_FORM_ID env is undefined!');
}

if (!FILLOUT_API_KEY) {
  throw new Error('FILLOUT_API_KEY env is undefined!');
}

if (!PORT) {
  throw new Error('PORT env is undefined!');
}

if (!AWS_CLUSTER_ARN) {
  throw new Error('AWS_CLUSTER_ARN env is undefined!');
}

if (!AWS_DEFAULT_SG) {
  throw new Error('AWS_DEFAULT_SG env is undefined!');
}

if (!AWS_VPC_ID) {
  throw new Error('AWS_VPC_ID env is undefined!');
}

new FilloutStack(app, 'FilloutStack', {
  aws_env: {
    AWS_CLUSTER_ARN,
    AWS_DEFAULT_SG,
    AWS_VPC_ID,
    AWS_ALB_LISTENER_ARN,
  },
  svc_env: {
    API_BASE_URL,
    DEMO_FORM_ID,
    FILLOUT_API_KEY,
    PORT,
  },
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
