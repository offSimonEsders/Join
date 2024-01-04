import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  constructor (private router: Router) {

  }

  goToBoard() {
    this.router.navigate(['/home/board']);
  }

}
