'use strict';
const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-1' });

exports.handler = async(event, context, callback) => {
    let random = Math.floor(Math.random() * 10);
    var eventbridge = new AWS.EventBridge();
    let jsonEvent = {
        Entries: [
            {
                // Evento 1
                Source: "lambda.start",
                EventBusName: "EventBusTestMiddleware",
                DetailType: "ping",
                Time: new Date(),
                // Main event body
                Detail: JSON.stringify({
                    ping: "ok",
                    custom:"test-ok"
                }),
            },
            {
                // Evento 1
                Source: "lambda.start",
                EventBusName: "EventBusTestMiddleware",
                DetailType: "ping",
                Time: new Date(),
                // Main event body
                Detail: JSON.stringify({
                    ping: "ko",
                    custom: "test-ko"
                }),
            }
        ]
    };
    let result = await eventbridge.putEvents(jsonEvent).promise();
    console.log('call eventBus');
    console.log(result);
}