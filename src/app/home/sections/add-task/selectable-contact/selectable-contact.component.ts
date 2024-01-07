import { Component, Input } from '@angular/core';
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
  selected: boolean = false;

  selectContact() {
    this.selected = !this.selected;
  }

}
