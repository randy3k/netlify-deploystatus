# A webapp for boardcasting netlify deploy status

By using netlify functions and github API, this webapp notifies GitHub for the netlify deploy status of your site.

1. Deploy this repo as a new netlify site, say `https://<NAME>.netlify.app`
1. In the deploy settings on the new site, create an environment variable `JWS_SECRET` and put  
    some random text in it. It is a custom secret used to verify the identity of the trigger.
1. Go to [GitHub](https://github.com/settings/tokens) to generate a personal access token. 
    Check out scope `repo:status`.
1. Then go the your own site's deploy notifiction settings, add three outgoing webhooks for
    "Deploy started", "Deploy succeeded" and "Deploy failed". Put 
    `https://<NAME>.netlify.app.netlify/functions/notify?token=<TOKEN>` in "URL to notify",
    Put the value of `JWS_SECRET` in "JWS secret token". `<TOKEN>` should be replaced by the token that you generated from GitHub earlier.
