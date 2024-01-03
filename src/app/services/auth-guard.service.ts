import { Injectable } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private appwriteService: AppwriteService, private router: Router) { }

  async canActivate() {
    if (await this.appwriteService.appwriteGetCurrentUser()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }

}
