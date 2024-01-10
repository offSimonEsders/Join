import { Component, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectableContactComponent } from "./selectable-contact/selectable-contact.component";
import { AppwriteService } from '../../../services/appwrite.service';
import { Contact } from '../../modules/contact';
import { SubtaskComponent } from "./subtask/subtask.component";

@Component({
    selector: 'app-add-task',
    standalone: true,
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss', '../../extra-styles/contact-icon-color.scss'],
    imports: [CommonModule, SelectableContactComponent, SubtaskComponent]
})
export class AddTaskComponent implements OnInit {
  contacts?: Contact[];
  selectedContacts: Contact[] = [];
  subtasks: string[] = ['test'];
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
    if (!targetElement.classList.contains('category')) {
      this.closeCategoryList(categoryinput);
    }
    if (!targetElement.classList.contains('contact')) {
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

  selectContacts(event: Contact) {
    this.selectedContacts.push(event);
    console.log(this.selectedContacts)
  }

  unselectContacts(event: Contact) {
    const index = this.selectedContacts.findIndex((c) => {
      return c == event;
    });
    this.selectedContacts.splice(index, 1);
    console.log(this.selectedContacts)
  }

  checkIfContactIsSelected(contact: Contact) {
    return this.selectedContacts.includes(contact);
  }

  addNewSubtask(event: Event, subtaskinput: HTMLInputElement) {
    event.preventDefault();
    this.subtasks.push(subtaskinput.value);
    subtaskinput.value = '';
    console.log(this.subtasks)
  }

}
