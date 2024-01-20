import {Component} from '@angular/core';
import {RouterOutlet, Router} from "@angular/router";

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss'
})
export class FrameComponent {
  constructor(public router: Router) {
  }
}
