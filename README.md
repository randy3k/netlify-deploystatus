# A webapp for boardcasting netlify deploy status

Using netlify functions and github API.
This webapp notifies GitHub for the netlify deploy status of your repo.

- Deploy this repo as a new netlify site, say `https://<NAME>.netlify.app`
- In the deploy settings on the new site, put an environment variable `JWS_SECRET`: a custom secret used to verify the identity of the trigger.
- Then go to [GitHub](https://github.com/settings/tokens) to generate a personal access token. 
    Check out scope `repo:status`.
- Then, go the your own site's deploy notifiction settings, add three outgoing webhooks for
    "Deploy started", "Deploy succeeded" and "Deploy failed". Put 
    `https://<NAME>.netlify.app.netlify/functions/notify?token=<TOKEN>` in "URL to notify",
    Put the value of `JWS_SECRET` in "JWS secret token". `<TOKEN>` should be replaced by the token that you generated from GitHub earlier.
