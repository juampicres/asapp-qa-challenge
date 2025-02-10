# ASAPP - QA Automation Challenge

## Testing Steps

## [Link 👈🏻](https://github.com/juampicres/asapp-qa-challenge/blob/main/tests/README.md)

![Screenshot 2025-02-10 at 12 06 26 AM](https://github.com/user-attachments/assets/bff49fa2-37c0-4408-9d89-824f850189e0)

---------
## Pre-requisites

*Docker*

If you haven't used it before, [this quickstart guide](https://docs.docker.com/get-started/) should help.


## How to run

- Build the Images for API and UI:

    `docker build ./src/api -t asapp-qa-challenge-api`
    
    `docker build ./src/ui -t asapp-qa-challenge-ui`

- Start them through docker-compose:

    `docker-compose up -d`

- Browse to `localhost:3000` to access the challenge UI.
- Browse to `localhost:5000/api/docs/` for the API spec.
- Command above will run the containers in background, but you can always follow logs with `docker-compose logs -f`.
- To stop containers you can run `docker-compose stop`.

Note that currently data such as users and stock will not persist after the containers are stopped.
