describe('Fraud Detection System', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'password');
  });

  it('should detect suspicious transaction', () => {
    cy.intercept('POST', '/api/transactions/validate').as('validateTx');
    
    cy.get('[data-testid="amount-input"]').type('1000');
    cy.get('[data-testid="submit-transaction"]').click();
    
    cy.wait('@validateTx').then((interception) => {
      expect(interception.response.body.riskScore).to.be.above(0.7);
    });
  });
});