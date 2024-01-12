import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppwriteService } from '../../../services/appwrite.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  userName?: string;

  constructor (private router: Router, private appwriteService: AppwriteService) {
    this.getGreeting();
  }

  async ngOnInit() {
    this.userName = await this.appwriteService.getUserName();
  }

  goToBoard() {
    this.router.navigate(['/home/board']);
  }

  getGreeting() {
    const time = new Date().getHours();
    if (time > 0 && time < 12) {
      return 'Good morning';
    } else if (time > 12 && time < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }

}
