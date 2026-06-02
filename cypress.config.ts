import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        // Handle Firefox
        if (browser.family === "firefox") {
          // launchOptions.preferences is a map of preference names to values
          // crypto-hash is not working in firefox when
          // testing_localhost_is_secure_when_hijacked is false
          // https://github.com/cypress-io/cypress/issues/14600
          launchOptions.preferences[
            "network.proxy.testing_localhost_is_secure_when_hijacked"
          ] = true;

          // Clipboard automation flags
          launchOptions.preferences["dom.events.asyncClipboard.readHTML"] = true;
          launchOptions.preferences["dom.events.testing.asyncClipboard"] = true;
        }

        return launchOptions;
      });

      return config;
    },
    baseUrl: "http://localhost:3000",
  },
});
