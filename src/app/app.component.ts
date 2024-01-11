import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Join';

  constructor(private router: Router) {

  }

  ngOnInit() {
    this.autoLogIn();
  }

  autoLogIn() {
    if (localStorage.getItem('remember') == 'true') {
      if (this.router.url == '/' || this.router.url == '/registration') {
        this.router.navigate(['home/summary']);
      }
    }
  }

}
