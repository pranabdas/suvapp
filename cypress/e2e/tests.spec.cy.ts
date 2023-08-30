describe("Process 2D data", () => {
  it("passes", () => {
    cy.visit("/");

    cy.get('[data-cy="file-upload"]').selectFile("public/Data.txt", {
      action: "drag-drop",
    });

    cy.get('[data-cy="select-scan"]').as("scanSelector");
    cy.get("@scanSelector").click();
    cy.get('[data-cy="select-option-2"]').click();

    cy.get('[data-cy="select-col-1"]').as("col1Selector");
    cy.get("@col1Selector").click();

    cy.get('[data-cy="col-1-Theta"]').click();

    cy.get('[data-cy="select-col-2"]').as("col2Selector");
    cy.get("@col2Selector").click();

    cy.get('[data-cy="select-col-3"]').as("col3Selector");

    cy.get('[data-cy="col-2-Detector"]').click();

    cy.get('[data-cy="process-data-btn"]').as("processData");
    cy.get("@processData").click();

    cy.get('[data-cy="data-table"]')
      .find("tr")
      .then((row) => {
        expect(row.length).to.equal(202);
      });

    cy.get('[data-cy="data-table"]')
      .find("td:nth-child(1)")
      .eq(99)
      .should("have.text", "21.5318");

    cy.get('[data-cy="data-table"]')
      .find("td:nth-child(2)")
      .eq(99)
      .should("have.text", "76216");

    cy.get("@scanSelector").click();
    cy.get('[data-cy="select-option-3"]').click();
    cy.get("@col1Selector").click();
    cy.get('[data-cy="col-1-H"]').click();

    cy.get("@col2Selector").click();
    cy.get('[data-cy="col-2-L"]').click();

    cy.get("@col3Selector").click();
    cy.get('[data-cy="col-3-Detector"]').click();

    cy.get("@processData").click();

    cy.get('[data-cy="data-table"]')
      .find("tr")
      .then((row) => {
        expect(row.length).to.equal(1682);
      });

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
});
