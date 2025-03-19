declare namespace Cypress {
  interface Chainable<Subject = any> {
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    login(email: string, password: string): void;
  }
}