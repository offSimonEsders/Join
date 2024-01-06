import { Injectable } from '@angular/core';
import { Client, Account, ID, Databases, Query } from 'appwrite';

const dataBaseID = '6594cb434043ac3121d8';
const tasksID = '6596e8b9f0bcc7400acc';
const contactsID = '659848432eef04745aa2';

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {

  client = new Client();
  account!: Account;
  dataBase!: Databases;

  loggedInUser: any = null;

  constructor() {
    this.client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('65949b66b5d7b911fa48');
    this.account = new Account(this.client);
    this.dataBase = new Databases(this.client);
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

  async getTasks() {
    try {
      return (await this.dataBase.listDocuments(dataBaseID, tasksID, [ Query.orderAsc('index') ])).documents;
    }
    catch {
      return false;
    }
  }

  async updateTask(taskID: string, task: any) {
    await this.dataBase.updateDocument(dataBaseID, tasksID, taskID, task);
  }

  async getContacts() {
    return (await this.dataBase.listDocuments(dataBaseID, contactsID, [ Query.orderAsc('name') ])).documents;
  }

  async createContact(data: object) {
    await this.dataBase.createDocument(dataBaseID, contactsID, ID.unique(), data);
  }

}
