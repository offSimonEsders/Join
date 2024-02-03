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

  closeCreateEditWindow(event: Event) {
    event.preventDefault();
    this.closeWindowEvent.emit('change');
  }

  replaceLetters(element: HTMLInputElement) {
    element.value = element.value.replace(/[^+0-9 ]/g, "");
  }

  checkInputs(name: string, email: string, phone: string, namecontainer: HTMLDivElement, emailcontainer: HTMLDivElement, phonecontainer: HTMLDivElement) {
    let stop = false;
    stop = this.checkName(name, namecontainer, stop);
    stop = this.checkEmail(email, emailcontainer, stop);
    stop = this.checkPhone(phone, phonecontainer, stop)
    if (stop) {
      return true;
    }
    return false;
  }

  checkName(name: string, namecontainer: HTMLDivElement, stop: boolean) {
    if (name.length <= 0) {
      namecontainer.classList.add('name-wrong-input');
      return true;
    }
    return stop;
  }

  checkEmail(email: string, emailcontainer: HTMLDivElement, stop: boolean) {
    if (!this.mailregex.test(email)) {
      emailcontainer.classList.add('email-wrong-input');
      return true;
    }
    return stop;
  }

  checkPhone(phone: string, phonecontainer: HTMLDivElement, stop: boolean) {
    if (phone.length <= 0) {
      phonecontainer.classList.add('phone-wrong-input');
      return true;
    }
    return stop;
  }

  resetContainer(container: HTMLDivElement, classToRemove: string) {
    container.classList.remove(classToRemove);
  }

  async createNewContact(event: Event, name: string, email: string, phone: string, namecontainer: HTMLDivElement, mailcontainer: HTMLDivElement, phonecontainer: HTMLDivElement) {
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

  showUserFeedback() {
    if (this.userfeedback) {
      this.userfeedback.nativeElement.style.display = 'flex';
    }
  }

  getInitials(name: string) {
    let nameSplitted = name.split(' ');
    let initials;
    if (nameSplitted.length > 1) {
      initials = nameSplitted[0][0] + nameSplitted[1][0];
    } else {
      initials = nameSplitted[0][0]
    }
    return initials;
  }

  getVariant() {
    let randInt = Math.random();
    let variantNumber = Math.round(randInt * 15);
    while (variantNumber <= 0) {
      this.getVariant();
    }
    return 'variant' + variantNumber;
  }

  updateContact(event: Event, name: string, email: string, phone: string, namecontainer: HTMLDivElement, mailcontainer: HTMLDivElement, phonecontainer: HTMLDivElement) {
    event.preventDefault();
    if (this.checkInputs(name, email, phone, namecontainer, mailcontainer, phonecontainer)) {
      return;
    }
    this.changeConactData(name, email, phone);
    this.contactEdited.emit(this.editcontact);
    this.appwriteService.updateContact(this.editcontact);
    this.closeCreateEditWindow(event);
  }

  changeConactData(name: string, email: string, phone: string) {
    this.editcontact.name = name;
    this.editcontact.email = email;
    this.editcontact.phone = phone;
    delete this.editcontact.$databaseId;
    delete this.editcontact.$collectionId;
  }

  deleteContact(event: Event) {
    this.deleteContactEvent.emit('delete');
    this.closeCreateEditWindow(event);
  }
}
