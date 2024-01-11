import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AppwriteService } from './services/appwrite.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Join';

  constructor(private appwriteService: AppwriteService, private router: Router) {

  }

  async ngOnInit() {
    await this.autoLogIn();
  }

  async autoLogIn() {
    if (await this.appwriteService.account.getSession('current')) {
      if (this.router.url == '/' || this.router.url == '/registration') {
        this.router.navigate(['home/summary']);
      }
    }
  }

}
