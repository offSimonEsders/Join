import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts-list-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts-list-element.component.html',
  styleUrls: ['./contacts-list-element.component.scss', '../../../extra-styles/contact-icon-color.scss']
})
export class ContactsListElementComponent implements OnInit {
  @Input() contact: any;
  @Input() letter?: string;

  ngOnInit(): void {
    console.log(this.contact.name[0].toUpperCase())
  }

}
