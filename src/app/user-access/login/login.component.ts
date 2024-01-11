import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppwriteService } from '../../services/appwrite.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('loginform') loginform?: any;

  constructor(public router: Router, private appwriteService: AppwriteService) {
    
  }

  async loginEmailPassword(email: string, password: string) {
    if (!await this.appwriteService.appwriteLoginEmailPassword(email, password)) {
      this.loginform?.nativeElement.classList.add('wrong-input');
      return;
    }
    this.router.navigate(['home/summary']);
  }

  async guestLogin() {
    await this.appwriteService.appwriteSignInAnonymsly();
    this.router.navigate(['home/summary']);
  }

  removeWrongInput() {
    this.loginform?.nativeElement.classList.remove('wrong-input');
  }

  getRememberMe(): boolean {
    return localStorage.getItem('remember') == 'true' ? true : false;
  }

  setRememberMe(checkbox: HTMLInputElement) {
    if(checkbox.checked) {
      localStorage.setItem('remember', 'true');
    } else {
      localStorage.setItem('remember', 'false');
    }
  }

}
