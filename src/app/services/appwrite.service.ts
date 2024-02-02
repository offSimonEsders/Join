import {Injectable} from '@angular/core';
import {Client, Account, ID, Databases, Query, Models} from 'appwrite';
import {Contact} from '../home/models/contact';
import {Task} from '../home/models/task';

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

  /**
   * Initials the database
   * */
  constructor() {
    this.client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('65949b66b5d7b911fa48');
    this.account = new Account(this.client);
    this.dataBase = new Databases(this.client);
  }

  /**
   * Creates a new user
   *
   * @param newUserEmail
   * @param newUserPassword
   * @param newUserName
   */
  async appwriteSignUp(newUserEmail: string, newUserPassword: string, newUserName: string): Promise<boolean> {
    try {
      await this.account.create(ID.unique(), newUserEmail, newUserPassword, newUserName);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Creates a session for a user
   *
   * @param email
   * @param password
   * */
  async appwriteLoginEmailPassword(email: string, password: string): Promise<any> {
    try {
      this.loggedInUser = await this.account.createEmailSession(email, password);
      return this.loggedInUser;
    } catch {
      return false;
    }
  }

  /**
   * Creates an anonymously session
   * */
  async appwriteSignInAnonymsly(): Promise<any> {
    try {
      await this.appwriteLogOut();
    } catch {
    }
    this.loggedInUser = await this.account.createAnonymousSession();
  }

  /**
   * Get the logged in user
   * */
  async appwriteGetCurrentUser(): Promise<any> {
    try {
      this.loggedInUser = await this.account.get();
      return this.loggedInUser;
    } catch {
      return false;
    }

  }

  /**
   * Destroys the actual session
   * */
  async appwriteLogOut(): Promise<any> {
    try {
      await this.account.deleteSession('current');
      this.loggedInUser = null;
    } catch (error) {

    }
  }

  /**
   * Creates a task on given data
   *
   * @param data
   * */
  async createTask(data: Task): Promise<false | Models.Document> {
    return await this.dataBase.createDocument(dataBaseID, tasksID, ID.unique(), data);
  }

  /**
   * Gets all tasks from database
   * */
  async getTasks(): Promise<Models.Document[] | false> {
    try {
      return (await this.dataBase.listDocuments(dataBaseID, tasksID, [Query.orderAsc('index')])).documents;
    } catch {
      return false;
    }
  }

  /**
   * Updates the tasks data with the new data
   *
   * @param taskID
   * @param task
   * */
  async updateTask(taskID: string, task: any): Promise<void> {
    await this.dataBase.updateDocument(dataBaseID, tasksID, taskID, task);
  }

  /**
   * Deletes the complete task
   * */
  deleteTask(taskID: string): void {
    this.dataBase.deleteDocument(dataBaseID, tasksID, taskID);
  }

  /**
   * Gets all contacts from the database
   * */
  async getContacts(): Promise<Models.Document[]> {
    return (await this.dataBase.listDocuments(dataBaseID, contactsID, [Query.orderAsc('name')])).documents;
  }

  /**
   * Creates a contact on the database
   *
   * @param data
   * */
  async createContact(data: object): Promise<Models.Document> {
    return await this.dataBase.createDocument(dataBaseID, contactsID, ID.unique(), data);
  }

  /**
   * Deletes a contact from the database
   *
   * @param contactID
   * */
  deleteContact(contactID: string): void {
    this.dataBase.deleteDocument(dataBaseID, contactsID, contactID);
  }

  /**
   * Replaces the old contact data with the new
   *
   * @param contact
   * */
  async updateContact(contact: Contact): Promise<void> {
    if (contact.$id) {
      await (this.dataBase.updateDocument(dataBaseID, contactsID, contact.$id, contact))
    }
  }

  /**
   * Gets username or guest
   * */
  async getUserName(): Promise<any> {
    let user = await this.appwriteGetCurrentUser();
    if (user.name == '') {
      return 'Guest';
    }
    return user.name;
  }

}
