import { Injectable } from '@angular/core';
import { Client, Account, ID } from 'appwrite';

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {

  client = new Client();
  account!: Account;

  loggedInUser: any = null;

  constructor() {
    this.client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('65949b66b5d7b911fa48');
    this.account = new Account(this.client);
  }

  /**
   * @param {string} newUserEmail - Email of new user
   * @param {string} newUserPassword - Password for email of new user
   * @param {string} newUserName - Name of new user
   */
  appwriteSignUp(newUserEmail: string, newUserPassword: string, newUserName: string): void {
    this.account.create(ID.unique(), newUserEmail, newUserPassword, newUserName)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async appwriteSignInAnonymsly() {
    this.loggedInUser = await this.account.createAnonymousSession();
    console.log("login:", this.loggedInUser)
  }

  async appwriteGetCurrentUser() {
    try {
      this.loggedInUser = await this.account.get();
      console.log(this.loggedInUser)
      return true;
    }
    catch {

    }

    return false;
    
  }

  async appwriteLogOut() {
    try {
      await this.account.deleteSession('current');
      this.loggedInUser = null;
    }
    catch {

    }
  }

  appwriteAutoLogOut() {
    if (localStorage.getItem('rememberme') == 'false' || localStorage.getItem('rememberme') == undefined) {
      if (localStorage.getItem('cookieFallback') != '[]') {
        this.appwriteLogOut();
      }
    }
  }

}
