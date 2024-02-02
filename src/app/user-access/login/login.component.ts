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
  showPassword: boolean = false;

  constructor(public router: Router, private appwriteService: AppwriteService) {

  }

  /**
   * Checks status of rememberme
   * */
  ngOnInit(): void {
    this.checked = this.getRememberMe();
  }

  togglePasswordView(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Logs the client in
   * If it is successfull it sends him to home/summary
   * else it gives the client feedback
   *
   * @param email
   * @param password
   * */
  async loginEmailPassword(email: string, password: string): Promise<void> {
    if (!await this.appwriteService.appwriteLoginEmailPassword(email, password)) {
      this.loginform?.nativeElement.classList.add('wrong-input');
      return;
    }
    this.router.navigate(['home/summary']);
  }

  /**
   * Creates an anonymous session
   * */
  async guestLogin(): Promise<void> {
    await this.appwriteService.appwriteSignInAnonymsly();
    this.router.navigate(['home/summary']);
  }

  /**
   * Removes user feedback
   * */
  removeWrongInput(): void {
    this.loginform?.nativeElement.classList.remove('wrong-input');
  }

  /**
   * Checks and gives back value of localstorage key remember
   *
   * @returns boolean
   * */
  getRememberMe(): boolean {
    return localStorage.getItem('remember') == 'true' ? true : false;
  }

  /**
   * Changes the value of localstorage remember on state of the checkbox
   *
   * @param checkbox
   * */
  setRememberMe(checkbox: HTMLInputElement): void {
    if(checkbox.checked) {
      this.checked = true;
      localStorage.setItem('remember', 'true');
    } else {
      this.checked = false;
      localStorage.setItem('remember', 'false');
    }
  }

}
