exports.handler = function(event, context, callback) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    callback(null, {
    statusCode: 200,
    body: context.logStreamName
    });
}
