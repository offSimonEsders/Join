import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppwriteService } from '../../services/appwrite.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(public router: Router, public appwriteService: AppwriteService) {

  }

  async ngOnInit() {
    this.appwriteService.appwriteAutoLogOut();
  }

}
