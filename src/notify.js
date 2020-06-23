const fetch = require("node-fetch");
const crypto = require('crypto');

const { GITHUB_TOKEN, WEBHOOK_SIGNATURE } = process.env;

// from https://github.com/imorente/netlify-form-functions-integration
function signed(event) {
  const signature = event.headers["x-webhook-signature"];
  if (!signature) {
    console.log("Missing x-webhook-signature");
    return false;
  }

  const { iss, sha256 } = jwt.verify(signature, process.env.JWS_SECRET);
  const hash = crypto
    .createHash("sha256")
    .update(event.body)
    .digest("hex");

  return iss === "netlify" && sha256 === hash;
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  if (!signed(event)) {
    return {
      statusCode: 403,
      body: "Invalid signature"
    };
  }

  const payload = JSON.parse(event.body);
  console.log(payload)

  const ref = payload["commit_ref"];
  const url = payload["commit_url"];
  const state = payload["state"];

  if (ref == null) {
    console.log("not from github");
    return({statusCode: 200, body: "skipped"})
  }

  const urlrx = /^https:\/\/github.com\/(.*?)\/(.*?)\//;
  const matches = urlrx.exec(url);
  const owner = matches[1];
  const repo = matches[2];

  const endpoint = `https://api.github.com/repos/${owner}/${repo}/statuses/${ref}`;

  var reply;

  switch(state) {
    case "ready":
      reply = {state: "success", context: "deploy to netlify"};
      break;
    case "building":
      reply = {state: "pending", context: "deploy to netlify"};
      break;
    case "error":
      reply = {state: "failure", context: "deploy to netlify"};
      break;
    default:
      reply = {state: "error", context: "deploy to netlify"};
  }

  return fetch(endpoint, {
    headers: {
      "content-type": "application/json",
      "Authorization": `token ${GITHUB_TOKEN}`
    },
    method: "POST",
    body: JSON.stringify(reply)
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
