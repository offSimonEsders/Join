import { Injectable } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private appwriteService: AppwriteService, private router: Router) {

  }

  async authGuestLogin() {
    await this.appwriteService.appwriteSignInAnonymsly();
    this.router.navigate(['home']);
  }

  authAutoLogOut() {
    if (localStorage.getItem('rememberme') == 'false' || localStorage.getItem('rememberme') == undefined) {
      if (localStorage.getItem('cookieFallback') != '[]') {
        this.appwriteService.appwriteLogOut();
      }
    }
  }

}
