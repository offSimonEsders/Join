import { Injectable } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private appwriteService: AppwriteService, private router: Router) { }

  /**
   * Checks if the user is valid and returns
   *
   * @return boolean
   * */
  async canActivate(): Promise<boolean> {
    if (await this.appwriteService.appwriteGetCurrentUser()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }

}
