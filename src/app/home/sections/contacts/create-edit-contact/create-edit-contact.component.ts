import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() valueChange = new EventEmitter<any>();

  constructor(private appwriteService: AppwriteService) {

  }

  changeValue() {
    this.valueChange.emit('change');
  }

  async createNewContact(event: Event, name: string, mail: string, phone: string) {
    event.preventDefault();
    const newContact = new Contact(name, mail, phone, this.getInitials(name), this.getVariant());
    this.changeValue();
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
    while(randInt <= 0) {
      randInt = Math.random();
    }
    return 'variant' + Math.round(randInt * 17);
  }

}
