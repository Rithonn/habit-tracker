import { Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  template: `
    <section class="page">
      <h1>Login</h1>
      <p>Sign in to access your habit history.</p>
    </section>
  `,
  styles: [
    `
      .page {
        max-width: 680px;
      }
    `,
  ],
})
export class LoginPageComponent {}
