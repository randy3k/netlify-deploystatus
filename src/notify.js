const fetch = require("node-fetch");
const crypto = require('crypto');

const GITHUB_TOKEN  = process.env;
const WEBHOOK_SIGNATURE = process.env;

exports.handler = async (event, context) => {
  const payload = JSON.parse(event.body);
  console.log(payload)

  const ref = payload["commit_ref"];
  const url = payload["commit_url"];
  const state = payload["state"];

  const sign = event.headers["X-Webhook-Signature"];

  if (sign == null) {
    console.log("no signature");
    return({statusCode: 402, body: "no signature"})
  }

  const hmac = crypto.createHmac("sha1", WEBHOOK_SIGNATURE)
  const digest = Buffer.from("sha1=" + hmac.update(payload).digest("hex"), "utf8")
  const checksum = Buffer.from(sig, "utf8")
  if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
    console.log("invalid signature");
    return({statusCode: 403, body: "invalid signature"})
  }

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
