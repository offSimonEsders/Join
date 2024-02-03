import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common'
import {AppwriteService} from '../../../services/appwrite.service';
import {ContactsListElementComponent} from "./contacts-list-element/contacts-list-element.component";
import {CreateEditContactComponent} from "./create-edit-contact/create-edit-contact.component";
import {ContactInformationComponent} from "./contact-information/contact-information.component";
import {Contact} from '../../models/contact';

@Component({
  selector: 'app-contacts',
  standalone: true,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  imports: [ContactsListElementComponent, CommonModule, CreateEditContactComponent, ContactInformationComponent]
})
export class ContactsComponent implements OnInit {
  contacts: any;
  editcontact: any;
  informationContact?: Contact;
  edited: any;
  showInfoResp: boolean = true;
  changed: boolean = false;

  letters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];

  showCreateEditContact: boolean = false;

  constructor(private appwriteService: AppwriteService) {

  }

  async ngOnInit(): Promise<void> {
    window.addEventListener('resize', () => {
      this.checkWindowWidth();
    });
    this.checkWindowWidth();
    this.contacts = (await this.appwriteService.getContacts());
  }

  /**
   * Changes the style depending on the window width
   * */
  checkWindowWidth(): void {
    if (window.innerWidth > 1350) {
      this.showInfoResp = true;
      this.changed = false;
    } else if (!this.changed) {
      this.showInfoResp = false;
      this.changed = true;
    }
  }

  /**
   * Shows or hides CreateEditContact
   * */
  changeCreateEditContact(): void {
    this.showCreateEditContact = !this.showCreateEditContact;
    !this.showCreateEditContact ? this.resetEditContact() : undefined;
  }

  /**
   * Sets the edit contact and calls changeCreateEditContact
   *
   * @param contact
   * */
  setEditContact(contact: object): void {
    this.editcontact = contact;
    this.changeCreateEditContact();
  }

  /**
   * Sets editcontact to undefined
   * */
  resetEditContact(): void {
    this.editcontact = undefined;
  }

  /**
   * Calls checkName
   *
   * @param letter
   * */
  returnIfNameWithLetterexist(letter: string): boolean | undefined {
    try {
      return this.checkName(letter);
    } catch {
      return;
    }
  }

  /**
   * Checks if letter matches to name and returns it
   *
   * @param letter
   * */
  checkName(letter: string) {
    for (let c of this.contacts) {
      const firstLetter = c.name[0].toUpperCase();
      if (firstLetter === letter) {
        return true;
      }
      if (letter === '#' && (!this.letters.includes(firstLetter) || firstLetter === '#')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Sets informationcontact to contact or undefined
   *
   * @param contact
   * */
  setInformationContact(contact: Contact): void {
    if (this.informationContact?.$id !== contact.$id) {
      this.informationContact = undefined;
      setTimeout((): void => {
        this.informationContact = contact;
      }, 1);
    }
  }

  /**
   * Returns the index in contacts array from the given contact
   *
   * @param contact
   * */
  getConactIndex(contact: Contact) {
    return this.contacts.findIndex((c: Contact): boolean => {
      return c.$id == contact.$id;
    })
  }

  /**
   * Deletes given contact from frontend and backend and closes the contact info
   *
   * @param contact
   * */
  deleteContact(contact: Contact): void {
    if (contact.$id) {
      this.informationContact = undefined;
      this.contacts.splice(this.getConactIndex(contact), 1);
      this.appwriteService.deleteContact(contact.$id);
      this.showInfoResp = false;
    }
  }

  /**
   * Adds new contact from create edit contact to contacts array
   *
   * @param contact
   * */
  async addNewContact(contact: Contact): Promise<void> {
    this.contacts.push(contact);
  }

  /**
   * Changes the padding of the contactlist when it has a scrollbar
   *
   * @param conactlist
   * @param addbuttoncontainer
   * @param conactslistcontainer
   * */
  checkContainerHeight(conactlist: HTMLUListElement, addbuttoncontainer: HTMLDivElement, conactslistcontainer: HTMLDivElement): void {
    if (conactlist.offsetHeight + addbuttoncontainer.offsetHeight < conactslistcontainer.offsetHeight) {
      conactlist.style.padding = '0 20px 25px 25px';
      return;
    }
    conactlist.style.padding = '0 20px 25px 20px';
  }

  /**
   * Closes the contact info on scaling
   * */
  showContactInfoResponsive(): void {
    if (window.innerWidth <= 1350) {
      this.showInfoResp = !this.showInfoResp;
      if (!this.showInfoResp) {
        this.informationContact = undefined;
      }
    }
  }

  /**
   * Turns Contacts info into Overlay
   * */
  showContactInfoResp(): boolean {
    if (window.innerWidth < 1350) {
      return this.showInfoResp;
    }
    return true;
  }

  protected readonly window = window;
}
