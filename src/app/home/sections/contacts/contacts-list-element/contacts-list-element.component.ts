import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Contact} from "../../../models/contact";

@Component({
  selector: 'app-contacts-list-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts-list-element.component.html',
  styleUrls: ['./contacts-list-element.component.scss', '../../../extra-styles/contact-icon-color.scss']
})
export class ContactsListElementComponent {
  @Input() contact?: Contact;
  @Input() letter?: string;
  @Input() infoContact?: Contact;

  letters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];

  checkLetter() {
    if (this.letter && this.letter === '#' && this.checkName()) {
      return true;
    } else if (this.letter) {
      return this.contact?.name[0].toUpperCase() === this.letter;
    } else {
      return false;
    }
  }

  checkName() {
    const letter = this.contact?.name[0].toUpperCase();
    if (letter === '#') {
      return true;
    } else if (letter) {
      return !this.letters.includes(letter);
    }
    return false;
  }

}
