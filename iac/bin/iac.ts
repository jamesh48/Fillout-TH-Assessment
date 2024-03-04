#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FilloutStack } from '../lib/iac-stack';

const app = new cdk.App();
new FilloutStack(app, 'FilloutStack', {});
