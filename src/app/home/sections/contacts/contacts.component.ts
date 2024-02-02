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

  letters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  showCreateEditContact: boolean = false;

  constructor(private appwriteService: AppwriteService) {

  }

  async ngOnInit() {
    window.addEventListener('resize', () => {
      this.checkWindowWidth();
    });
    this.checkWindowWidth();
    this.contacts = (await this.appwriteService.getContacts());
  }

  checkWindowWidth() {
    if (window.innerWidth > 1350) {
      this.showInfoResp = true;
      this.changed = false;
    } else if (!this.changed) {
      this.showInfoResp = false;
      this.changed = true;
    }
  }

  changeCreateEditContact() {
    this.showCreateEditContact = !this.showCreateEditContact;
    !this.showCreateEditContact ? this.resetEditContact() : undefined;
  }

  setEditContact(contact: object) {
    this.editcontact = contact;
    this.changeCreateEditContact();
  }

  resetEditContact() {
    this.editcontact = undefined;
  }

  returnIfNameWithLetterexist(letter: string) {
    try {
      for (let c of this.contacts) {
        if (c.name[0].toUpperCase() == letter) {
          return true;
        }
      }
      return false;
    } catch {
      return;
    }
  }

  setInformationContact(contact: Contact) {
    this.informationContact = undefined;
    setTimeout(() => {
      this.informationContact = contact;
    }, 1);
  }

  getConactIndex(contact: Contact) {
    return this.contacts.findIndex((c: Contact) => {
      return c.$id == contact.$id;
    })
  }

  deleteContact(contact: Contact) {
    if (contact.$id) {
      this.informationContact = undefined;
      this.contacts.splice(this.getConactIndex(contact), 1);
      this.appwriteService.deleteContact(contact.$id);
      this.showInfoResp = false;
    }
  }

  async addNewContact(contact: Contact) {
    this.contacts.push(contact);
  }

  checkContainerHeight(conactlist: HTMLUListElement, addbuttoncontainer: HTMLDivElement, conactslistcontainer: HTMLDivElement): void {
    if (conactlist.offsetHeight + addbuttoncontainer.offsetHeight < conactslistcontainer.offsetHeight) {
      conactlist.style.padding = '0 20px 25px 25px';
      return;
    }
    conactlist.style.padding = '0 20px 25px 20px';
  }

  showContactInfoResponsive() {
    if (window.innerWidth <= 1350) {
      this.showInfoResp = !this.showInfoResp;
      if (!this.showInfoResp) {
        this.informationContact = undefined;
      }
    }
  }

  showContactInfoResp() {
    if (window.innerWidth < 1350) {
      return this.showInfoResp;
    }
    return true;
  }

  protected readonly window = window;
}
