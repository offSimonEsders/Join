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

  }

  async ngOnInit() {
    this.userName = await this.appwriteService.getUserName();
  }

  goToBoard() {
    this.router.navigate(['/home/board']);
  }

}
