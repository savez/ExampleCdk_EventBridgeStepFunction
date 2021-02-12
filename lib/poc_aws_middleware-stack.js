const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const events = require('@aws-cdk/aws-events');
const eventsTargets = require('@aws-cdk/aws-events-targets');
const sfn = require('@aws-cdk/aws-stepfunctions');
const tasks = require('@aws-cdk/aws-stepfunctions-tasks');


class PocAwsMiddlewareStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const pingOk = new lambda.Function(this, 'PingOk', {
      code: lambda.Code.fromAsset('src'),
      handler: 'pingok.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: "PingOkFunction"
    });

    const pingKo = new lambda.Function(this, 'PingKo', {
      code: lambda.Code.fromAsset('src'),
      handler: 'pingko.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: "PingKoFunction"
    });

    const exePing = new lambda.Function(this, 'ExePing', {
      code: lambda.Code.fromAsset('src'),
      handler: 'exeping.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: "ExePingFunction"
    });

    new lambda.Function(this, 'TestMiddlewareStart', {
      code: lambda.Code.fromAsset('src'),
      handler: 'start.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: "TestMiddlewareStartFunction"
    });

   

    // Step functions
    const pingKOT = new sfn.Task(this, "PingKOTask", {
      task: new tasks.InvokeFunction(pingOk),
    });
    const pingOKT = new sfn.Task(this, "PingOKTask", {
      task: new tasks.InvokeFunction(pingKo),
    });

    const startStateFxT = new sfn.Task(this, "StartStateFxTask", {
      task: new tasks.InvokeFunction(exePing),
    });
    let choice = new sfn.Choice(this, 'PingOkChoice');
    choice.when(sfn.Condition.stringEquals('$.status', 'ok'), pingOKT);
    choice.when(sfn.Condition.stringEquals('$.status', 'ko'), pingKOT);
    choice.otherwise(pingKOT);

    const workflow = sfn.Chain
      .start(startStateFxT)
      .next(choice);
    let sfnPing = new sfn.StateMachine(this, 'StateMachine', {
      definition: workflow
    });


    // Event bus
    new events.EventBus(this,'EventBusTest',{
      eventBusName: "EventBusTestMiddleware"
    });

    const pingOkRule = new events.Rule(
      this,
      "pingRuleOk",
      {
        ruleName: "pingRuleOkTestMiddleware",
        description: "ping",
        eventBus: { eventBusName: "EventBusTestMiddleware" },
        eventPattern: {
          detail: {
            ping: ["ok"],
          },
        },
      }
    );
    const pingKoRule = new events.Rule(
      this,
      "pingRuleKo",
      {
        ruleName: "pingRuleKoTestMiddleware",
        description: "ping",
        eventBus: { eventBusName: "EventBusTestMiddleware" },
        eventPattern: {
          detail: {
            ping: ["ko"],
          },
        },
      }
    );

    const checkPing = new events.Rule(
      this,
      "checkPing",
      {
        ruleName: "checkPingTestMiddleware",
        description: "ping",
        eventBus: { eventBusName: "EventBusTestMiddleware" },
        eventPattern: {
          detail:{
            ping:["ok"]
          }
        },
      }
    );

    checkPing.addTarget(
      new eventsTargets.SfnStateMachine(sfnPing)
    );

    /*pingKoRule.addTarget(
      new eventsTargets.LambdaFunction(pingKo)
    );

    pingOkRule.addTarget(
      new eventsTargets.LambdaFunction(pingOk)
    );
    */

    
      
  }
}

module.exports = { PocAwsMiddlewareStack }
