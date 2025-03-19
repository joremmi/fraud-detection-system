describe('Fraud Detection System', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should login successfully', () => {
    cy.get('[data-testid="email-input"]').type('admin@example.com');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should detect high-risk transaction', () => {
    cy.login('admin@example.com', 'password');
    cy.visit('/transactions');
    
    cy.get('[data-testid="amount-input"]').type('5000');
    cy.get('[data-testid="location-input"]').type('Unknown Location');
    cy.get('[data-testid="submit-transaction"]').click();
    
    cy.get('[data-testid="risk-score"]').should('have.text', 'High Risk');
  });
});