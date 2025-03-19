// Cypress custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): void;
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

// Import commands.js using ES2015 syntax:
import './commands';