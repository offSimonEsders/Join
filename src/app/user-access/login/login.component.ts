import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { AppwriteService } from '../../services/appwrite.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  @ViewChild('loginform') loginform?: any;
  checked: boolean = false;

  constructor(public router: Router, private appwriteService: AppwriteService) {

  }

  ngOnInit() {
    this.checked = this.getRememberMe();
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
      this.checked = true;
      localStorage.setItem('remember', 'true');
    } else {
      this.checked = false;
      localStorage.setItem('remember', 'false');
    }
  }

}
