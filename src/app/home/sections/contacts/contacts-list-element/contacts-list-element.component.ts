import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contacts-list-element',
  standalone: true,
  imports: [],
  templateUrl: './contacts-list-element.component.html',
  styleUrls: ['./contacts-list-element.component.scss', '../../../extra-styles/contact-icon-color.scss']
})
export class ContactsListElementComponent {
  @Input() contact: any;

}
