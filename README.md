# A webapp for boardcasting netlify deploy status

Using netlify functions and github API.
This webapp notifies GitHub for the netlify deploy status of your repo.

- Deploy this repo as a new netlify site
- In the deploy settings on the new site, put an environment variable.
    - `JWS_SECRET`: a custom secret used to verify the identity of the trigger
