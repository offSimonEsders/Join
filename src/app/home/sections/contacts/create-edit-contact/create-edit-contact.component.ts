import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  changeValue() {
    this.valueChange.emit('change');
  }

}
