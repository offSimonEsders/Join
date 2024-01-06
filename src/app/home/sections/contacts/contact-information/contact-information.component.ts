import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../../modules/contact';

@Component({
  selector: 'app-contact-information',
  standalone: true,
  imports: [],
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.scss', '../../../extra-styles/contact-icon-color.scss']
})
export class ContactInformationComponent {
  @Input() contact?: Contact;
  @Output() openEdit = new EventEmitter();
  @Output() deleteContact = new EventEmitter();
}
