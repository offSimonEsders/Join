import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common'
import {Contact} from '../../../models/contact';

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
  @Output() selectSignal: EventEmitter<Contact> = new EventEmitter<Contact>();
  @Output() unselectSignal: EventEmitter<Contact> = new EventEmitter<Contact>();

  /**
   * Inverts this.selected and emits the signal
   * */
  selectContact(): void {
    this.selected = !this.selected;
    if (this.selected) {
      this.selectSignal.emit(this.contact);
      return;
    }
    this.unselectSignal.emit(this.contact);
  }

}
