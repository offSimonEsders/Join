import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Contact} from "../../../modules/contact";

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
}
