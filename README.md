# A webapp for broadcasting netlify deploy status

By using netlify functions and github API, this webapp notifies GitHub for the netlify deploy status of your site.


<img width="741" alt="Screen Shot 2020-06-22 at 8 30 21 PM" src="https://user-images.githubusercontent.com/1690993/85357900-3b9f2b00-b4c7-11ea-82d6-23cb042083ea.png">


1. Deploy this repo as a new netlify site, say `https://<NAME>.netlify.app`
1. In the deploy settings of the new site, create an environment variable `JWS_SECRET` and put  
    some random text in it. It is a custom secret used to verify the identity of the triggerer.
1. Go to [GitHub](https://github.com/settings/tokens) to generate a personal access token. 
    Check out scope `repo:status`.
1. Then go to the deploy notifiction settings of the your own site, add outgoing webhooks for
    "Deploy started", "Deploy succeeded" and "Deploy failed" by putting
    `https://<NAME>.netlify.app/.netlify/functions/notify?token=<TOKEN>` in "URL to notify" and the value of `JWS_SECRET` in "JWS secret token". `<TOKEN>` should be replaced by the token that you generated from GitHub earlier.

