import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectableContactComponent } from "./selectable-contact/selectable-contact.component";
import { AppwriteService } from '../../../services/appwrite.service';
import { Contact } from '../../modules/contact';

@Component({
    selector: 'app-add-task',
    standalone: true,
    templateUrl: './add-task.component.html',
    styleUrl: './add-task.component.scss',
    imports: [CommonModule, SelectableContactComponent]
})
export class AddTaskComponent implements OnInit {
  contacts?: Contact[];
  openCategory: boolean = false;
  openContacts: boolean = false;
  click = false;
  [key: string]: any;

  constructor(private appwriteService: AppwriteService) {

  }

  async ngOnInit() {
    this.contacts = await this.appwriteService.getContacts() as unknown as Contact[];
  }

  changeOpenState(event: Event, input: HTMLInputElement, value: string) {
    event.preventDefault();
    this[value] = !this[value];
    this[value] ? input.focus() : input.blur();
  }

  changeOpenCategoryStateOnId(event: Event, categoryinput: HTMLInputElement, contactsinput: HTMLInputElement) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.id != 'category') {
      this.closeCategoryList(categoryinput);
    }
    if (targetElement.id != 'contact') {
      this.closeContactList(contactsinput);
    }

  }

  closeCategoryList(categoryinput: HTMLInputElement) {
    this.openCategory = false;
    categoryinput.blur();
  }

  closeContactList(contactsinput: HTMLInputElement) {
    this.openContacts = false;
    contactsinput.blur()
  }

  setCategoryValue(value: string, categoryinput: HTMLInputElement) {
    categoryinput.value = value;
    this.closeCategoryList(categoryinput);
  }

}
