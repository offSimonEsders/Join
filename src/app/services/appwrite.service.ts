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
      })
      .catch((error) => {
      });
  }

  async appwriteLoginEmailPassword(email: string, password: string) {
    try {
      this.loggedInUser = await this.account.createEmailSession(email, password);
      return this.loggedInUser;
    }
    catch {
      return false;
    }
  }

  async appwriteSignInAnonymsly() {
    this.loggedInUser = await this.account.createAnonymousSession();
  }

  async appwriteGetCurrentUser() {
    try {
      this.loggedInUser = await this.account.get();
      return this.loggedInUser;
    }
    catch {
      return false;
    }

  }

  async appwriteLogOut() {
    try {
      await this.account.deleteSession('current');
      this.loggedInUser = null;
    }
    catch (error) {

    }
  }

}
