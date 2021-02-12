const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const PocAwsMiddleware = require('../lib/poc_aws_middleware-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new PocAwsMiddleware.PocAwsMiddlewareStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
