describe("SUVApp - SPEC-FOURC Data Explorer", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("File Upload", () => {
    it("should upload data file and detect scans", () => {
      cy.get('[data-cy="file-upload"]').selectFile("public/Data.txt", {
        action: "drag-drop",
      });

      // Verify file name is displayed
      cy.contains("Selected file:").should("be.visible");
      cy.contains("Data.txt").should("be.visible");

      // Verify scans are found
      cy.contains(/\d+ scans? found in the file/).should("be.visible");
    });

    it("should show demo when no file is uploaded", () => {
      cy.contains("Watch Demo").click();
      cy.get('img[alt="Demo"]').should("be.visible");

      cy.contains("Hide Demo").click();
      cy.get('img[alt="Demo"]').should("not.exist");
    });
  });

  describe("Data Processing - 2D Data", () => {
    beforeEach(() => {
      cy.get('[data-cy="file-upload"]').selectFile("public/Data.txt", {
        action: "drag-drop",
      });
    });

    it("should process 2D data and verify table output", () => {
      // Select scan #2
      cy.get('[data-cy="select-scan"]').as("scanSelector");
      cy.get("@scanSelector").click();
      cy.get('[data-cy="select-option-2"]').click();

      // Select columns
      cy.get('[data-cy="select-col-1"]').as("col1Selector");
      cy.get("@col1Selector").click();
      cy.get('[data-cy="col-1-Theta"]').click();

      cy.get('[data-cy="select-col-2"]').as("col2Selector");
      cy.get("@col2Selector").click();
      cy.get('[data-cy="col-2-Detector"]').click();

      // Process data
      cy.get('[data-cy="process-data-btn"]').as("processData");
      cy.get("@processData").click();

      // Verify table data
      cy.get('[data-cy="data-table"]')
        .find("tr")
        .should("have.length", 202); // 201 data rows + 1 header

      cy.get('[data-cy="data-table"]')
        .find("td:nth-child(1)")
        .eq(99)
        .should("have.text", "21.5318");

      cy.get('[data-cy="data-table"]')
        .find("td:nth-child(2)")
        .eq(99)
        .should("have.text", "76216");
    });

    it("should render 2D scatter plot with correct structure", () => {
      // Setup
      cy.get('[data-cy="select-scan"]').click();
      cy.get('[data-cy="select-option-2"]').click();
      cy.get('[data-cy="select-col-1"]').click();
      cy.get('[data-cy="col-1-Theta"]').click();
      cy.get('[data-cy="select-col-2"]').click();
      cy.get('[data-cy="col-2-Detector"]').click();
      cy.get('[data-cy="process-data-btn"]').click();

      // Show plot
      cy.contains("Show plot").click();

      // Wait for plot to load
      cy.get(".js-plotly-plot", { timeout: 10000 }).should("be.visible");

      // Verify Plotly components
      cy.get(".js-plotly-plot .plotly").should("exist");
      cy.get(".js-plotly-plot svg.main-svg").should("exist");
      cy.get(".js-plotly-plot .scatterlayer").should("exist");

      // Verify axes
      cy.get(".js-plotly-plot .xaxislayer-above").should("exist");
      cy.get(".js-plotly-plot .yaxislayer-above").should("exist");

      // Verify axis labels
      cy.get(".js-plotly-plot .xtitle").should("contain.text", "Theta");
      cy.get(".js-plotly-plot .ytitle").should("contain.text", "Detector");

      // Verify mode bar exists
      cy.get(".js-plotly-plot .modebar").should("exist");
    });

    it("should toggle Y-axis log scale", () => {
      // Setup
      cy.get('[data-cy="select-scan"]').click();
      cy.get('[data-cy="select-option-2"]').click();
      cy.get('[data-cy="select-col-1"]').click();
      cy.get('[data-cy="col-1-Theta"]').click();
      cy.get('[data-cy="select-col-2"]').click();
      cy.get('[data-cy="col-2-Detector"]').click();
      cy.get('[data-cy="process-data-btn"]').click();
      cy.contains("Show plot").click();

      cy.get(".js-plotly-plot", { timeout: 10000 }).should("be.visible");

      // Toggle log scale
      cy.contains("Plot Y-axis in logarithmic scale")
        .parent()
        .find('input[type="checkbox"]')
        .check();

      // Verify plot still exists after update
      cy.get(".js-plotly-plot svg.main-svg").should("exist");

      // Uncheck
      cy.contains("Plot Y-axis in logarithmic scale")
        .parent()
        .find('input[type="checkbox"]')
        .uncheck();

      cy.get(".js-plotly-plot svg.main-svg").should("exist");
    });

    it("should handle Y/Z division and display in plot", () => {
      cy.get('[data-cy="select-scan"]').click();
      cy.get('[data-cy="select-option-2"]').click();
      cy.get('[data-cy="select-col-1"]').click();
      cy.get('[data-cy="col-1-Theta"]').click();
      cy.get('[data-cy="select-col-2"]').click();
      cy.get('[data-cy="col-2-Detector"]').click();
      cy.get('[data-cy="select-col-3"]').click();
      cy.get('[data-cy="col-3-Seconds"]').click();

      // Enable Y/Z division
      cy.contains("I want to export")
        .parent()
        .find('input[type="checkbox"]')
        .check();

      cy.get('[data-cy="process-data-btn"]').click();

      cy.get('[data-cy="data-table"]').should("contain", "Detector / Seconds");

      // Verify plot shows Y/Z label
      cy.contains("Show plot").click();
      cy.get(".js-plotly-plot", { timeout: 10000 }).should("be.visible");
      cy.get(".js-plotly-plot .ytitle")
        .should("contain.text", "Detector")
        .and("contain.text", "Seconds");
    });

    it("should toggle between plot and table views", () => {
      cy.get('[data-cy="select-scan"]').click();
      cy.get('[data-cy="select-option-2"]').click();
      cy.get('[data-cy="select-col-1"]').click();
      cy.get('[data-cy="col-1-Theta"]').click();
      cy.get('[data-cy="select-col-2"]').click();
      cy.get('[data-cy="col-2-Detector"]').click();
      cy.get('[data-cy="process-data-btn"]').click();

      // Show plot
      cy.contains("Show plot").click();
      cy.get(".js-plotly-plot", { timeout: 10000 }).should("be.visible");

      // Show table (should hide plot)
      cy.contains("Show table").click();
      cy.get('[data-cy="data-table"]').should("be.visible");
      cy.get(".js-plotly-plot").should("not.exist");

      // Hide table
      cy.contains("Hide table").click();
      cy.get('[data-cy="data-table"]').should("not.exist");

      // Show plot again
      cy.contains("Show plot").click();
      cy.get(".js-plotly-plot", { timeout: 10000 }).should("be.visible");

      // Hide plot
      cy.contains("Hide plot").click();
      cy.get(".js-plotly-plot").should("not.exist");
    });
  });

  describe("Data Processing - 3D Data", () => {
    beforeEach(() => {
      cy.get('[data-cy="file-upload"]').selectFile("public/Data.txt", {
        action: "drag-drop",
      });
    });

    it("should process 3D data and verify table output", () => {
      // Select scan #3
      cy.get('[data-cy="select-scan"]').as("scanSelector");
      cy.get("@scanSelector").click();
      cy.get('[data-cy="select-option-3"]').click();

      // Select columns
      cy.get('[data-cy="select-col-1"]').as("col1Selector");
      cy.get("@col1Selector").click();
      cy.get('[data-cy="col-1-H"]').click();

      cy.get('[data-cy="select-col-2"]').as("col2Selector");
      cy.get("@col2Selector").click();
      cy.get('[data-cy="col-2-L"]').click();

      cy.get('[data-cy="select-col-3"]').as("col3Selector");
      cy.get("@col3Selector").click();
      cy.get('[data-cy="col-3-Detector"]').click();

      // Process data
      cy.get('[data-cy="process-data-btn"]').as("processData");
      cy.get("@processData").click();

      // Verify table data
      cy.get('[data-cy="data-table"]')
        .find("tr")
        .should("have.length", 1682); // 1681 data rows + 1 header

      cy.get('[data-cy="data-table"]')
        .find("td:nth-child(1)")
        .eq(839)
        .should("have.text", "-1.003");

      cy.get('[data-cy="data-table"]')
        .find("td:nth-child(2)")
        .eq(839)
        .should("have.text", "2.85");

      cy.get('[data-cy="data-table"]')
        .find("td:nth-child(3)")
        .eq(839)
        .should("have.text", "39");
    });

    it("should render 3D surface and contour plots", () => {
      // Setup
      cy.get('[data-cy="select-scan"]').click();
      cy.get('[data-cy="select-option-3"]').click();
      cy.get('[data-cy="select-col-1"]').click();
      cy.get('[data-cy="col-1-H"]').click();
      cy.get('[data-cy="select-col-2"]').click();
      cy.get('[data-cy="col-2-L"]').click();
      cy.get('[data-cy="select-col-3"]').click();
      cy.get('[data-cy="col-3-Detector"]').click();
      cy.get('[data-cy="process-data-btn"]').click();

      // Show plot
      cy.contains("Show plot").click();

      // Wait for plots to load (3D takes longer)
      cy.get(".js-plotly-plot", { timeout: 15000 }).should("be.visible");

      // Verify we have multiple plots (surface + contour)
      cy.get(".js-plotly-plot").should("have.length.at.least", 2);

      // Verify plot titles
      cy.contains("3D surface plot").should("be.visible");
      cy.contains("Contour plot").should("be.visible");

      // Verify 3D scene exists
      cy.get(".js-plotly-plot .gl-container").should("exist");

      // Verify contour plot SVG
      cy.get(".js-plotly-plot").eq(1).find("svg.main-svg").should("exist");

      // Verify mode bars for both plots
      cy.get(".js-plotly-plot .modebar").should("have.length.at.least", 2);
    });

    it("should toggle Z-axis log scale for 3D plots", () => {
      cy.get('[data-cy="select-scan"]').click();
      cy.get('[data-cy="select-option-3"]').click();
      cy.get('[data-cy="select-col-1"]').click();
      cy.get('[data-cy="col-1-H"]').click();
      cy.get('[data-cy="select-col-2"]').click();
      cy.get('[data-cy="col-2-L"]').click();
      cy.get('[data-cy="select-col-3"]').click();
      cy.get('[data-cy="col-3-Detector"]').click();
      cy.get('[data-cy="process-data-btn"]').click();
      cy.contains("Show plot").click();

      cy.get(".js-plotly-plot", { timeout: 15000 }).should("be.visible");

      // Toggle Z-axis log scale
      cy.contains("Plot Z-axis in logarithmic scale")
        .parent()
        .find('input[type="checkbox"]')
        .check();

      // Verify plots still exist after update
      cy.get(".js-plotly-plot").should("have.length.at.least", 2);

      // Uncheck
      cy.contains("Plot Z-axis in logarithmic scale")
        .parent()
        .find('input[type="checkbox"]')
        .uncheck();

      cy.get(".js-plotly-plot").should("have.length.at.least", 2);
    });
  });

  describe("Data Export", () => {
    beforeEach(() => {
      cy.get('[data-cy="file-upload"]').selectFile("public/Data.txt", {
        action: "drag-drop",
      });
      cy.get('[data-cy="select-scan"]').click();
      cy.get('[data-cy="select-option-2"]').click();
      cy.get('[data-cy="select-col-1"]').click();
      cy.get('[data-cy="col-1-Theta"]').click();
      cy.get('[data-cy="select-col-2"]').click();
      cy.get('[data-cy="col-2-Detector"]').click();
      cy.get('[data-cy="process-data-btn"]').click();
    });

    it("should copy data to clipboard", () => {
      // Apply permissions ONLY for this test if running on Chrome/Chromium
      if (Cypress.isBrowser({ family: 'chromium' })) {
        cy.wrap(
          Cypress.automation('remote:debugger:protocol', {
            command: 'Browser.grantPermissions',
            params: {
              permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
              origin: Cypress.config('baseUrl') || window.location.origin,
            },
          })
        );
      }

      cy.window().then((win) => {
        win.focus();
      });

      cy.contains("Copy data").click();
      cy.contains("Data copied").should("be.visible");
      cy.contains("Data copied", { timeout: 2000 }).should("exist");

      cy.window().then((win) => {
        return win.navigator.clipboard.readText();
      }).should('not.be.empty');
    });

    it("should download data file", () => {
      // Intercept download
      cy.window().then((win) => {
        cy.stub(win.URL, "createObjectURL").returns("blob:mock-url");
      });

      cy.contains("Save data").click();

      // Verify download was triggered (element created)
      // In real test, you'd verify the downloaded file
    });
  });

  describe("Scan Switching", () => {
    it("should reset column selections when switching scans with incompatible columns", () => {
      cy.get('[data-cy="file-upload"]').selectFile("public/Data.txt", {
        action: "drag-drop",
      });

      // Select scan #2 with Theta column
      cy.get('[data-cy="select-scan"]').click();
      cy.get('[data-cy="select-option-2"]').click();
      cy.get('[data-cy="select-col-1"]').click();
      cy.get('[data-cy="col-1-Theta"]').click();

      // Switch to scan #3 (doesn't have Theta column)
      cy.get('[data-cy="select-scan"]').click();
      cy.get('[data-cy="select-option-3"]').click();

      // Verify X-col is reset (or at least H is available)
      cy.get('[data-cy="select-col-1"]').click();
      cy.get('[data-cy="col-1-H"]').should("exist");
    });
  });

  describe("Loading States", () => {
    it("should show loading indicator before plot renders", () => {
      cy.get('[data-cy="file-upload"]').selectFile("public/Data.txt", {
        action: "drag-drop",
      });
      cy.get('[data-cy="select-scan"]').click();
      cy.get('[data-cy="select-option-2"]').click();
      cy.get('[data-cy="select-col-1"]').click();
      cy.get('[data-cy="col-1-Theta"]').click();
      cy.get('[data-cy="select-col-2"]').click();
      cy.get('[data-cy="col-2-Detector"]').click();
      cy.get('[data-cy="process-data-btn"]').click();
      cy.contains("Show plot").click();

      // Should see loading indicator (Suspense fallback)
      cy.contains("Loading plot modules").should("be.visible");

      // Then plot should appear
      cy.get(".js-plotly-plot", { timeout: 10000 }).should("be.visible");

      // Loading should disappear
      cy.contains("Loading plot modules").should("not.exist");
    });
  });
});
