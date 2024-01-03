import { Injectable } from '@angular/core';
import { Client, Account, ID } from 'appwrite';

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {

  client = new Client();
  account!: Account;

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

}
