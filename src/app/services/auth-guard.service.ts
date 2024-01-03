import { Injectable } from '@angular/core';
import { AppwriteService } from './appwrite.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private appwriteService: AppwriteService) { }

  async canActivate() {
    return await this.appwriteService.appwriteGetCurrentUser();
  }

}
