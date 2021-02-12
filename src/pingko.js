'use strict';
exports.handler = async (event, context, callback) => {
    console.log('ko');
    callback(null, 'ok');
}