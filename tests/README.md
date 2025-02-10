# ASAPP - Test Automation Challenge

## How to run against a local environment

- Build the Images for API and UI and spin up the containers by following the readme on the root of the project.

- once the local app is up grab local secret required by some tests and export them as environment variables. For example, if you have a local.env file with the following content:
- 
```bash
$ cd tests
$ source cypress/config/local.env
```

- Install the dependencies by running:
```bash
$ npm i
```

- Run both integration and api tests on headless mode with the following command:
### Run the whole suite on chrome without test tags
```bash
$ npm run cy:run:local
```
(after ending execution checkout a basic html report on `cypress/reports`)

or on UI mode by running:

```bash
$ npm run cy:open:local
```
