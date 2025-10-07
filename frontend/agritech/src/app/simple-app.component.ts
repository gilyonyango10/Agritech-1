import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-simple-header></app-simple-header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 80px);
    }
  `]
})
export class SimpleAppComponent {
  title = 'AgriTech Kenya';
}
