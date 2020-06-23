import fetch from "node-fetch";

const { GITHUB_TOKEN } = process.env;

exports.handler = async (event, context) => {
  var data = JSON.parse(event.body);
  console.log(data)

  var ref = data["commit_ref"];
  var url = data["commit_url"];
  var state = data["state"];

  if (ref == null) {
    return({
      statusCode: 200,
      body: "skipped"
    })
  }

  var urlrx = /^https:\/\/github.com\/(.*?)\/(.*?)\//;
  var matches = urlrx.exec(url);
  var owner = matches[1];
  var repo = matches[2];

  var endpoint = `https://api.github.com/repos/${owner}/${repo}/statuses/${ref}`;

  var payload;

  switch(state) {
    case "ready":
      payload = {
        state: "success",
        description: "successful",
        context: "deploy to netlify"
      };
      break;
    case "building":
      payload = {
        state: "pending",
        description: "pending",
        context: "deploy to netlify"
      };
      break;
    case "error":
      payload = {
        state: "failure",
        description: "failed",
        context: "deploy to netlify"
      };
      break;
    default:
      payload = {
        state: "error",
        description: "error",
        context: "deploy to netlify"
      };
  }

  return fetch(endpoint, {
    headers: {
      "content-type": "application/json",
      "Authorization": `token ${GITHUB_TOKEN}`
    },
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(res => res.text())
    .then(data => {
      return({
        statusCode: 200,
        body: data
      })
    })
    .catch(error => ({
      statusCode: 422,
      body: `Oops! Something went wrong. ${error}`
    }));
}
