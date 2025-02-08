const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  watchForFileChanges: false,
  chromeWebSecurity: false,
  defaultCommandTimeout: 40000,
  retries: 0,
  env: {
    app_name: "ASAPP Challenge",
    stage: "local",
    baseApi: "http://localhost:5000",
    grepFilterSpec: true,
    grepOmitSpec: true,
    video: true,
    
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return require("./plugins")(on, config);
    },
    baseUrl: "http://localhost:3000",
    specPatterns: ["**/*.cy.ts"],
  },
});
