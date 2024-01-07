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
  openContacts: boolean = true;
  click = false;

  constructor(private appwriteService: AppwriteService) {

  }

  async ngOnInit() {
    this.contacts = await this.appwriteService.getContacts() as unknown as Contact[];
  }

  changeOpenCategoryState(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    this.openCategory = !this.openCategory;
    this.openCategory ? input.focus() : input.blur();
  }

  changeOpenCategoryStateOnId(event: Event, input: HTMLInputElement) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.id != 'category') {
      this.closeCategoryList(input);
    }
  }

  closeCategoryList(categoryinput: HTMLInputElement) {
    this.openCategory = false;
    categoryinput.blur();
  }

  setCategoryValue(value: string, categoryinput: HTMLInputElement) {
    categoryinput.value = value;
    this.closeCategoryList(categoryinput);
  }

}
