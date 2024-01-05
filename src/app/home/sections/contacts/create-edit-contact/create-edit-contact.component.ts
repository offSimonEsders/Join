import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-create-edit-contact',
  standalone: true,
  imports: [],
  templateUrl: './create-edit-contact.component.html',
  styleUrl: './create-edit-contact.component.scss'
})
export class CreateEditContactComponent {
  @Output() valueChange = new EventEmitter<any>();
}
