import fetch from "node-fetch";

const { GITHUB_PAT } = process.env;

exports.handler = async (event, context) => {
  var data = JSON.parse(event.body);
  console.log(data)

  var ref = data["commit_ref"];
  var url = data["commit_url"];

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

  console.log(GITHUB_PAT);

  return fetch(endpoint, {
    headers: {
      "content-type": "application/json",
      "Authorization": `token ${GITHUB_PAT}`
    },
    method: "POST",
    body: JSON.stringify({
      state: "success",
      description: "netlify deploy successful",
      context: "deploy to netlify"
    })
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
