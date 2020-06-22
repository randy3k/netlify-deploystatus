// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
    console.log(event.body)
    console.log(event.queryStringParameters)
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: event.body || event.queryStringParameters
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
