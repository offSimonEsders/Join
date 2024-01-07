import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  openCategory: boolean = false;
  click = false;

  changeOpenCategoryState(event: Event, categoryinput: HTMLInputElement) {
    event.preventDefault();
    this.openCategory = !this.openCategory;
    this.openCategory ? categoryinput.focus() : categoryinput.blur();
  }

  changeOpenCategoryStateOnId(event: Event, categoryinput: HTMLInputElement) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.id != 'category') {
      this.closeCategoryList(categoryinput);
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
