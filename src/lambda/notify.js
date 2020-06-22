import fetch from "node-fetch";

const { GITHUB_PAT } = process.env;

exports.handler = async (event, context) => {
  var data = JSON.parse(event.body);
  var ref = data["commit_ref"];
  var url = data["commit_url"];

  var urlrx = /^https:\/\/github.com\/(.*?)\/(.*?)\//;
  var matches = urlrx.exec(url);
  var owner = matches[1];
  var repo = matches[2];

  var endpoint = `https://api.github.com/repos/${owner}/${repo}/statuses/${ref}`;

  return fetch(endpoint, {
    headers: {
      "content-type": "application/json",
      "Authentication": `Bearer ${GITHUB_PAT}`
    },
  })
    .then(res => {
      statusCode: 200,
      body: res.text()
    })
    .catch(error => ({
      statusCode: 422,
      body: `Oops! Something went wrong. ${error}`
    }));
}
