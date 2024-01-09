import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'
import { Contact } from '../../../modules/contact';

@Component({
  selector: 'app-selectable-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selectable-contact.component.html',
  styleUrls: ['./selectable-contact.component.scss', '../../../extra-styles/contact-icon-color.scss']
})
export class SelectableContactComponent {
  @Input() contact?: Contact;
  @Input() selected!: boolean;
  @Output() selectSignal = new EventEmitter<Contact>();
  @Output() unselectSignal = new EventEmitter<Contact>();

  selectContact() {
    this.selected = !this.selected;
    if(this.selected) {
      this.selectSignal.emit(this.contact);
      return;
    }
    this.unselectSignal.emit(this.contact);
  }

}
