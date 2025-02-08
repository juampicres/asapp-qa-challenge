// cypress/plugins/index.js o cypress.config.js (dependiendo de tu versión de Cypress)
import { exec } from "child_process";

module.exports = (on, config) => {
  on("task", {
    resetDB({stage}) {
        console.log(stage)
        if(stage === "local"){
            console.log("se entra")
            return new Promise((resolve, reject) => {
                exec("docker exec qa_auto_challenge_prj-api-1 python api.py", (err, stdout, stderr) => {
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
  });
  return config;
};
