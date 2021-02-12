#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { PocAwsMiddlewareStack } = require('../lib/poc_aws_middleware-stack');

const app = new cdk.App();
new PocAwsMiddlewareStack(app, 'PocAwsMiddlewareStack');



/*

{
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
}


*/