// cypress/plugins/index.js o cypress.config.js (dependiendo de tu versión de Cypress)
import { exec } from "child_process";
const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");

module.exports = (on, config) => {
    on("before:browser:launch", (browser = {}, launchOptions) => {
        // Enable lighthouse audits
        prepareAudit(launchOptions);
        // Disable security features to allow the use of iframes
        launchOptions.args.push("--disable-web-security");
        launchOptions.args.push("--allow-running-insecure-content");
        // Enable video recording using a fake video
        launchOptions.args.push("--use-fake-ui-for-media-stream");
        launchOptions.args.push("--use-fake-device-for-media-stream");
        launchOptions.args.push(
            "--use-file-for-fake-video-capture=cypress/fixtures/video.y4m"
        );
        return launchOptions;
    });
    require('cypress-mochawesome-reporter/plugin')(on);
    on("task", {
        resetDB({stage}) {
            console.log(stage)
            if(stage === "local"){
                return new Promise((resolve, reject) => {
                    exec("docker exec backend python api.py", (err, stdout, stderr) => {
                        if (err) {
                            if (stderr && stderr.includes("Address already in use")) {
                                console.warn("Warning: Port 5000 is already in use. Skipping resetDB command.");
                                return resolve("Port 5000 already in use. Skipped resetDB.");
                            }
                            return reject(err);
                        }
                        resolve(stdout);
                    });
                });
            }else{
                // here I can implement the remote connection if needed 😊
                console.log("remote testing environments not implemented yet");
                return -1
            }
        },
        lighthouse: lighthouse(),
    });
  return config;
};
