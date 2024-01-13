import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectableContactComponent } from "./selectable-contact/selectable-contact.component";
import { AppwriteService } from '../../../services/appwrite.service';
import { Contact } from '../../modules/contact';
import { SubtaskComponent } from "./subtask/subtask.component";
import { Subtask } from '../../modules/subtask';
import { Task } from '../../modules/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss', '../../extra-styles/contact-icon-color.scss'],
  imports: [CommonModule, SelectableContactComponent, SubtaskComponent]
})
export class AddTaskComponent implements OnInit {
  @ViewChild('titlecontainer') titlecontainer?: ElementRef<HTMLInputElement>;
  @ViewChild('datecontainer') datecontainer?: ElementRef<HTMLInputElement>;
  @ViewChild('categorycontainer') categorycontainer?: ElementRef<HTMLInputElement>;
  @ViewChild('userfeedback') userfeedback?: ElementRef<HTMLDivElement>;

  contacts?: Contact[];
  tasks?: Task[];
  selectedContacts: Contact[] = [];
  subtasks: Subtask[] = [];
  prio: string = 'Medium';
  openCategory: boolean = false;
  openContacts: boolean = false;
  click = false;
  taskState: string = 'ToDo';
  minDate?: string;
  [key: string]: any;

  focusSubtaskInput: boolean = false;

  constructor(private appwriteService: AppwriteService, private router: Router) {
    this.getMinDate();
  }

  async ngOnInit() {
    this.contacts = await this.appwriteService.getContacts() as unknown as Contact[];
    this.tasks = await this.appwriteService.getTasks() as unknown as Task[];
  }

  getMinDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    this.minDate = yyyy + '-' + mm + '-' + dd;
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

  focusInput(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    input.focus();
    this.focusSubtaskInput = true;
  }

  unfocusSubtaskInput(event: Event, subtaskinput: HTMLInputElement) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.classList.contains('subtaskelement')) {
      this.focusSubtaskInput = false;
      subtaskinput.classList.remove('no-input');
    }
  }

  getSubtaskIndex() {
    if (this.subtasks.length == 0) {
      return 0;
    }
    return this.subtasks[this.subtasks.length - 1].index + 1;
  }

  addNewSubtask(event: Event, subtaskinput: HTMLInputElement) {
    event.preventDefault();
    if (subtaskinput.value != '') {
      const newSubtask = new Subtask(subtaskinput.value, this.getSubtaskIndex().toString())
      this.subtasks.push(newSubtask);
      subtaskinput.value = '';
      this.focusSubtaskInput = false;
      return;
    }
    subtaskinput.classList.add('no-input');
  }

  clearSubtaskinput(event: Event, subtaskinput: HTMLInputElement) {
    event.preventDefault();
    subtaskinput.focus();
    subtaskinput.value = '';
  }

  deleteSubtask(subtask: Subtask) {
    const index = this.subtasks.findIndex((s) => {
      return s == subtask;
    });
    this.subtasks.splice(index, 1);
  }

  editSubtask(newsubtask: Subtask, subtask: Subtask) {
    const index = this.subtasks.findIndex((s) => {
      return s == subtask;
    });
    this.subtasks[index] = newsubtask;
    console.log(this.subtasks)
  }

  changePrio(event: Event, newPrio: string) {
    event.preventDefault();
    this.prio = newPrio;
  }

  clearAddTask(event: Event, titleinput: HTMLInputElement, descriptioninput: HTMLTextAreaElement, dateinput: HTMLInputElement, categoryinput: HTMLInputElement) {
    event.preventDefault();
    titleinput.value = '';
    descriptioninput.value = '';
    dateinput.value = '';
    categoryinput.value = '';
    this.prio = 'Medium';
    this.selectedContacts = [];
    this.subtasks = [];
  }

  async createNewTask(event: Event, titleinput: HTMLInputElement, descriptioninput: HTMLTextAreaElement, dateinput: HTMLInputElement, categoryinput: HTMLInputElement) {
    event.preventDefault();
    if (this.addWrongInputClass(titleinput, dateinput, categoryinput)) {
      return;
    }
    const preparedData = this.prepareDataForTask();
    if (this.tasks && preparedData) {
      const [selectedContacts, subtasks, index] = preparedData;
      const task = new Task(titleinput.value, descriptioninput.value, selectedContacts, dateinput.value, this.prio, categoryinput.value, subtasks, this.taskState, index);
      this.clearAddTask(event, titleinput, descriptioninput, dateinput, categoryinput);
      this.activateUserFeedback();
      await this.appwriteService.createTask(task);
      this.urlToBoard();
    }
  }

  activateUserFeedback() {
    if (this.userfeedback) {
      this.userfeedback.nativeElement.style.display = 'flex';
    }
  }

  urlToBoard() {
    setTimeout(() => {
      this.router.navigate(['home/board']);
    }, 1000);
  }

  getTaskIndex() {
    if (this.tasks?.length == 0) {
      return 0;
    } else if (this.tasks) {
      return Number(this.tasks[this.tasks.length - 1].index) + 1;
    }
    return 0;
  }

  prepareDataForTask(): [string[], string[], Number] | void {
    if (this.tasks) {
      const selectedContacts: string[] = this.selectedContacts.map((c) => JSON.stringify(c));
      const subtasks: string[] = this.subtasks.map((s) => JSON.stringify(s));
      const index: Number = this.getTaskIndex();
      return [selectedContacts, subtasks, index];
    }
    return;
  }

  addWrongInputClass(titleinput: HTMLInputElement, dateinput: HTMLInputElement, categoryinput: HTMLInputElement) {
    let okay: boolean = false;
    if (titleinput.value.length <= 0) {
      this.titlecontainer?.nativeElement.classList.add('wrong-input');
      okay = true;
    }
    if (dateinput.value.length <= 0) {
      this.datecontainer?.nativeElement.classList.add('wrong-input');
      okay = true;
    }
    if (categoryinput.value.length <= 0) {
      this.categorycontainer?.nativeElement.classList.add('wrong-input');
      okay = true;
    }
    return okay;
  }

  removeWrongInputClass(titleinput: HTMLInputElement, dateinput: HTMLInputElement, categoryinput: HTMLInputElement) {
    if (titleinput.value.length > 0) {
      this.titlecontainer?.nativeElement.classList.remove('wrong-input');
    }
    if (dateinput.value.length > 0) {
      this.datecontainer?.nativeElement.classList.remove('wrong-input');
    }
    if (categoryinput.value.length > 0) {
      this.categorycontainer?.nativeElement.classList.remove('wrong-input');
    }
  }

}
