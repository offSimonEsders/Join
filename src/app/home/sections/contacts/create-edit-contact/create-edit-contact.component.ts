import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Contact} from '../../../models/contact';
import {AppwriteService} from '../../../../services/appwrite.service';
import {ContactsComponent} from "../contacts.component";

@Component({
  selector: 'app-create-edit-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-edit-contact.component.html',
  styleUrls: ['./create-edit-contact.component.scss', '../../../extra-styles/contact-icon-color.scss']
})
export class CreateEditContactComponent {
  @Input() editcontact: any;
  @Output() closeWindowEvent = new EventEmitter<any>();
  @Output() contactEdited = new EventEmitter<Contact>();
  @Output() deleteContactEvent = new EventEmitter<string>();
  @Output() contactCreated = new EventEmitter<Contact>();
  @ViewChild('userfeedback') userfeedback?: ElementRef;
  mailregex: RegExp = /[a-z0-9]+@[a-z]+\.[a-z]/;

  constructor(private appwriteService: AppwriteService) {

  }

  /**
   * Emits a close event
   *
   * @param event
   * */
  closeCreateEditWindow(event: Event): void {
    event.preventDefault();
    this.closeWindowEvent.emit('change');
  }

  /**
   * Replaces all letters with ''
   *
   * @param element
   * */
  replaceLetters(element: HTMLInputElement): void {
    element.value = element.value.replace(/[^+0-9 ]/g, "");
  }

  /**
   * Validates all input values and returns if it is valid
   *
   * @param name
   * @param email
   * @param phone
   * @param namecontainer
   * @param emailcontainer
   * @param phonecontainer
   * */
  checkInputs(name: string, email: string, phone: string, namecontainer: HTMLDivElement, emailcontainer: HTMLDivElement, phonecontainer: HTMLDivElement): boolean {
    let stop: boolean = false;
    stop = this.checkName(name, namecontainer, stop);
    stop = this.checkEmail(email, emailcontainer, stop);
    stop = this.checkPhone(phone, phonecontainer, stop)
    if (stop) {
      return true;
    }
    return false;
  }

  /**
   * Checks if name is valid else it shows user feedback
   *
   * @param name
   * @param namecontainer
   * @param stop
   * */
  checkName(name: string, namecontainer: HTMLDivElement, stop: boolean): boolean {
    if (name.length <= 0) {
      namecontainer.classList.add('name-wrong-input');
      return true;
    }
    return stop;
  }

  /**
   * Checks if email is valid else it shows user feedback
   *
   * @param email
   * @param emailcontainer
   * @param stop
   * */
  checkEmail(email: string, emailcontainer: HTMLDivElement, stop: boolean): boolean {
    if (!this.mailregex.test(email)) {
      emailcontainer.classList.add('email-wrong-input');
      return true;
    }
    return stop;
  }

  /**
   * Checks if phone number is valid else it shows user feedback
   * */
  checkPhone(phone: string, phonecontainer: HTMLDivElement, stop: boolean): boolean {
    if (phone.length <= 0) {
      phonecontainer.classList.add('phone-wrong-input');
      return true;
    }
    return stop;
  }

  /**
   * Removes the given class from the given container
   *
   * @param container
   * @param classToRemove
   * */
  resetContainer(container: HTMLDivElement, classToRemove: string): void {
    container.classList.remove(classToRemove);
  }

  /**
   * Creates a new contact, sends it to the backend and updates the data
   *
   * @param event
   * @param name
   * @param email
   * @param phone
   * @param namecontainer
   * @param mailcontainer
   * @param phonecontainer
   * */
  async createNewContact(event: Event, name: string, email: string, phone: string, namecontainer: HTMLDivElement, mailcontainer: HTMLDivElement, phonecontainer: HTMLDivElement): Promise<void> {
    event.preventDefault();
    if (this.checkInputs(name, email, phone, namecontainer, mailcontainer, phonecontainer)) {
      return;
    }
    const newContact = new Contact(name, email, phone, this.getInitials(name), this.getVariant());
    this.showUserFeedback();
    setTimeout(() => {
      this.closeCreateEditWindow(event);
    }, 1000);
    const returnedContact: Contact | any = await this.appwriteService.createContact(newContact);
    if (returnedContact) {
      this.contactCreated.emit(returnedContact);
    }
  }

  /**
   * Sets the user feedback to the display
   * */
  showUserFeedback(): void {
    if (this.userfeedback) {
      this.userfeedback.nativeElement.style.display = 'flex';
    }
  }

  /**
   * Returns the initials form the name
   *
   * @param name
   * */
  getInitials(name: string): string {
    let nameSplitted = name.split(' ');
    let initials;
    if (nameSplitted.length > 1) {
      initials = nameSplitted[0][0] + nameSplitted[1][0];
    } else {
      initials = nameSplitted[0][0]
    }
    return initials;
  }

  /**
   * Gets random color variant for a new contact and returns it
   * */
  getVariant(): string {
    let randInt: number = Math.random();
    let variantNumber: number = Math.round(randInt * 15);
    while (variantNumber <= 0) {
      this.getVariant();
    }
    return 'variant' + variantNumber;
  }

  /**
   * Updates the data from a existing contact and sends it to the backend an updates the local data
   *
   * @param event
   * @param name
   * @param email
   * @param phone
   * @param namecontainer
   * @param mailcontainer
   * @param phonecontainer
   * */
  updateContact(event: Event, name: string, email: string, phone: string, namecontainer: HTMLDivElement, mailcontainer: HTMLDivElement, phonecontainer: HTMLDivElement): void {
    event.preventDefault();
    if (this.checkInputs(name, email, phone, namecontainer, mailcontainer, phonecontainer)) {
      return;
    }
    this.changeConactData(name, email, phone);
    this.contactEdited.emit(this.editcontact);
    this.appwriteService.updateContact(this.editcontact);
    this.closeCreateEditWindow(event);
  }

  /**
   * Sets the contact data to the new data
   *
   * @param name
   * @param email
   * @param phone
   * */
  changeConactData(name: string, email: string, phone: string): void {
    this.editcontact.name = name;
    this.editcontact.email = email;
    this.editcontact.phone = phone;
    delete this.editcontact.$databaseId;
    delete this.editcontact.$collectionId;
  }

  /**
   * Deletes a delete event for the actual contact
   *
   * @param event
   * */
  deleteContact(event: Event): void {
    this.deleteContactEvent.emit('delete');
    this.closeCreateEditWindow(event);
  }
}
