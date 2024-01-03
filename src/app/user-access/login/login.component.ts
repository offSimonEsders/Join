import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('loginform') loginform?: any;

  constructor(public router: Router, private appwriteService: AppwriteService) {

  }

  async ngOnInit() {
    this.autoLogOut();
  }

  async loginEmailPassword(email: string, password: string) {
    if (!await this.appwriteService.appwriteLoginEmailPassword(email, password)) {
      this.loginform?.nativeElement.classList.add('wrong-input');
    }
  }

  async guestLogin() {
    await this.appwriteService.appwriteSignInAnonymsly();
    this.router.navigate(['home']);
  }

  async autoLogOut() {
    if (localStorage.getItem('rememberme') == 'false' || localStorage.getItem('rememberme') == undefined) {
      if (localStorage.getItem('cookieFallback') != '[]') {
        await this.appwriteService.appwriteLogOut();
      }
    }
  }

  removeWrongInput() {
    this.loginform?.nativeElement.classList.remove('wrong-input');
  }

}
