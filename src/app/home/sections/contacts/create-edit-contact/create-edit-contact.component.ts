import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../modules/contact';
import { AppwriteService } from '../../../../services/appwrite.service';

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

  constructor(private appwriteService: AppwriteService) {

  }

  closeCreateEditWindow(event: Event) {
    event.preventDefault();
    this.closeWindowEvent.emit('change');
  }

  replaceLetters(element: HTMLInputElement) {
    element.value = element.value.replace(/[^+0-9 ]/g, "");
  }

  async createNewContact(event: Event, name: string, mail: string, phone: string) {
    event.preventDefault();
    const newContact = new Contact(name, mail, phone, this.getInitials(name), this.getVariant());
    this.closeCreateEditWindow(event);
    await this.appwriteService.createContact(newContact);
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
    while (randInt <= 0) {
      randInt = Math.random();
    }
    return 'variant' + Math.round(randInt * 15);
  }

  updateContact(event: Event, name: string, email: string, phone: string) {
    event.preventDefault();
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
