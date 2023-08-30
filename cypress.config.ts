import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "firefox") {
          // launchOptions.preferences is a map of preference names to values
          // crypto-hash is not working in firefox when
          // testing_localhost_is_secure_when_hijacked is false
          // https://github.com/cypress-io/cypress/issues/14600
          launchOptions.preferences[
            "network.proxy.testing_localhost_is_secure_when_hijacked"
          ] = true;
        }

        return launchOptions;
      });
    },
    baseUrl: "http://localhost:3000",
  },
});
