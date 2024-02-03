import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectableContactComponent} from "./selectable-contact/selectable-contact.component";
import {AppwriteService} from '../../../services/appwrite.service';
import {Contact} from '../../models/contact';
import {SubtaskComponent} from "./subtask/subtask.component";
import {Subtask} from '../../models/subtask';
import {Task} from '../../models/task';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss', '../../extra-styles/contact-icon-color.scss'],
  imports: [CommonModule, SelectableContactComponent, SubtaskComponent]
})
export class AddTaskComponent implements OnInit {
  @Input() taskToEdit: Task | undefined;
  @Input() isPopUp: boolean = false;
  @Input() taskState: string = 'ToDo';
  @Output() closePopup: EventEmitter<Task> = new EventEmitter<Task>();
  @ViewChild('titlecontainer') titlecontainer?: ElementRef<HTMLInputElement>;
  @ViewChild('datecontainer') datecontainer?: ElementRef<HTMLInputElement>;
  @ViewChild('categorycontainer') categorycontainer?: ElementRef<HTMLInputElement>;
  @ViewChild('userfeedback') userfeedback?: ElementRef<HTMLDivElement>;

  contacts?: Contact[];
  contactsForList?: Contact[];
  tasks?: Task[];
  selectedContacts: Contact[] = [];
  subtasks: Subtask[] = [];
  prio: string = 'Medium';
  openCategory: boolean = false;
  openContacts: boolean = false;
  click = false;
  minDate?: string;

  [key: string]: any;

  focusSubtaskInput: boolean = false;

  constructor(private appwriteService: AppwriteService, private router: Router) {
    this.getMinDate();
  }

  async ngOnInit() {
    this.loadDataEditMode();
    this.contacts = await this.appwriteService.getContacts() as unknown as Contact[];
    this.contactsForList = this.contacts;
    this.tasks = await this.appwriteService.getTasks() as unknown as Task[];
  }

  /**
   * Returns if taskToEdit is valid
   *
   * @returns {boolean} - editMode is active when this.taskToEdit === Task;
   */
  editMode(): boolean {
    return this.taskToEdit === undefined;
  }

  /**
   * Loads the data from the task into addtask component for edit
   * */
  loadDataEditMode(): void {
    if (!this.editMode() && this.taskToEdit) {
      if (this.taskToEdit?.assignedContacts) {
        this.selectedContacts = this.getDataAsObject(this.taskToEdit?.assignedContacts);
      }
      if (this.taskToEdit?.subtasks) {
        this.subtasks = this.getDataAsObject(this.taskToEdit.subtasks);
      }
      this.prio = this.taskToEdit?.prio;
    }
  }

  /**
   * Returns data as usable array
   *
   * @param data
   * */
  getDataAsObject(data: string[]): any[] {
    return data.map((d: string) => {
      return JSON.parse(d);
    })
  }

  /**
   * Sets the date of today to minDate to set the minimum of the datepicker
   * */
  getMinDate(): void {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    this.minDate = yyyy + '-' + mm + '-' + dd;
  }

  /**
   * Inverts the given value.
   * Focus or blurs an inputelement depending on the value of the invertet value
   *
   * @param event
   * @param input
   * @param value
   * */
  changeOpenState(event: Event, input: HTMLInputElement, value: string): void {
    event.preventDefault();
    this[value] = !this[value];
    this[value] ? input.focus() : input.blur();
  }

  /**
   * Closes or opens the lists of category and contacts
   *
   * @param event
   * @param categoryinput
   * @param contactsinput
   * */
  changeOpenCategoryStateOnId(event: Event, categoryinput: HTMLInputElement, contactsinput: HTMLInputElement): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.classList.contains('category')) {
      this.closeCategoryList(categoryinput);
    }
    if (!targetElement.classList.contains('contact')) {
      this.closeContactList(contactsinput);
    }

  }

  /**
   * Closes the categorylist
   *
   * @param categoryinput
   * */
  closeCategoryList(categoryinput: HTMLInputElement): void {
    this.openCategory = false;
    categoryinput.blur();
  }

  /**
   * Closes the cotactslist
   *
   * @param contactsinput
   * */
  closeContactList(contactsinput: HTMLInputElement): void {
    this.openContacts = false;
    contactsinput.blur()
  }

  /**
   * Sets the value of the categoryinput element
   *
   * @param value
   * @param categoryinput
   * */
  setCategoryValue(value: string, categoryinput: HTMLInputElement): void {
    categoryinput.value = value;
    this.closeCategoryList(categoryinput);
  }

  /**
   * Adds a contact to the selectedContacts array
   *
   * @param event
   * */
  selectContacts(event: Contact): void {
    this.selectedContacts.push(event);
  }

  /**
   * Removes a contact form the selectedContacts array
   *
   * @param event
   * */
  unselectContacts(event: Contact): void {
    const index: number = this.selectedContacts.findIndex((c: Contact): boolean => {
      return c.$id == event.$id;
    });
    this.selectedContacts.splice(index, 1);
  }

  /**
   * Checks if any contact is selected and returns if it is true or false
   *
   * @param contact
   * */
  checkIfContactIsSelected(contact: Contact): boolean {
    return this.selectedContacts.some((selectedContact: Contact): boolean => {
      return selectedContact.$id === contact.$id;
    });
  }

  /**
   * Focuses the given inputelement and sets focusSubtaskInput to true
   *
   * @param event
   * @param input
   * */
  focusInput(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    input.focus();
    this.focusSubtaskInput = true;
  }

  /**
   * Blurs the given inputelement and sets focusSubtaskInput to false
   *
   * @param event
   * @param subtaskinput
   * */
  unfocusSubtaskInput(event: Event, subtaskinput: HTMLInputElement): void {
    const targetElement: HTMLElement = event.target as HTMLElement;
    if (!targetElement.classList.contains('subtaskelement')) {
      this.focusSubtaskInput = false;
      subtaskinput.classList.remove('no-input');
    }
  }

  /**
   * Creates a new index for a subtask
   * */
  getSubtaskIndex(): string | 0 {
    if (this.subtasks.length == 0) {
      return 0;
    }
    return this.subtasks[this.subtasks.length - 1].index + 1;
  }

  /**
   * Creates a new Subtask and adds it to the subtasks array
   *
   * @param event
   * @param subtaskinput
   * */
  addNewSubtask(event: Event, subtaskinput: HTMLInputElement): void {
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


  /**
   * Clears the Subtasksinput and blurs it
   *
   * @param event
   * @param subtaskinput
   * */
  clearSubtaskinput(event: Event, subtaskinput: HTMLInputElement): void {
    event.preventDefault();
    subtaskinput.focus();
    subtaskinput.value = '';
  }

  /**
   * Removes a subtask from the subtasks array
   *
   * @param subtask
   * */
  deleteSubtask(subtask: Subtask): void {
    const index: number = this.subtasks.findIndex((s: Subtask): boolean => {
      return s == subtask;
    });
    this.subtasks.splice(index, 1);
  }

  /**
   * Replaces the value of an existing subtask with a new value
   *
   * @param newsubtask
   * @param subtask
   * */
  editSubtask(newsubtask: Subtask, subtask: Subtask): void {
    const index: number = this.subtasks.findIndex((s: Subtask): boolean => {
      return s === subtask;
    });
    this.subtasks[index] = newsubtask;
  }

  /**
   * Changes the actual prio to the new prio
   *
   * @param event
   * @param newPrio
   * */
  changePrio(event: Event, newPrio: string): void {
    event.preventDefault();
    this.prio = newPrio;
  }

  /**
   * Resets the add task form
   *
   * @param event
   * @param titleinput
   * @param descriptioninput
   * @param dateinput
   * @param categoryinput
   * */
  clearAddTask(event: Event, titleinput: HTMLInputElement, descriptioninput: HTMLTextAreaElement, dateinput: HTMLInputElement, categoryinput: HTMLInputElement): void {
    event.preventDefault();
    titleinput.value = '';
    descriptioninput.value = '';
    dateinput.value = '';
    categoryinput.value = '';
    this.prio = 'Medium';
    this.selectedContacts = [];
    this.subtasks = [];
    this.removeWrongInputClass(titleinput, dateinput, categoryinput, true);
  }

  /**
   *
   *
   * @param event
   * @param titleinput
   * @param descriptioninput
   * @param dateinput
   * @param categoryinput
   * */
  async createAndUploadNewTask(event: Event, titleinput: HTMLInputElement, descriptioninput: HTMLTextAreaElement, dateinput: HTMLInputElement, categoryinput: HTMLInputElement): Promise<void> {
    event.preventDefault();
    if (this.addWrongInputClass(titleinput, dateinput, categoryinput)) {
      return;
    }
    const task: Task | undefined = this.createTask(event, titleinput, descriptioninput, dateinput, categoryinput);
    if (task) {
      this.clearAddTask(event, titleinput, descriptioninput, dateinput, categoryinput);
      this.activateUserFeedback();
      const resp: undefined | Task = await this.appwriteService.createTask(task) as unknown as Task;
      if (resp) {
        this.closePopup.emit(resp);
      }
      this.urlToBoard();
    }
  }

  /**
   * Creates a new Task and returns it
   *
   * @param event
   * @param titleinput
   * @param descriptioninput
   * @param dateinput
   * @param categoryinput
   * */
  createTask(event: Event, titleinput: HTMLInputElement, descriptioninput: HTMLTextAreaElement, dateinput: HTMLInputElement, categoryinput: HTMLInputElement): Task | undefined {
    const preparedData: void | [string[], string[], Number] = this.prepareDataForTask();
    if (this.tasks && preparedData) {
      const [selectedContacts, subtasks, index]: [string[], string[], Number] = preparedData;
      const task: Task = new Task(titleinput.value, descriptioninput.value, selectedContacts, dateinput.value, this.prio, categoryinput.value, subtasks, this.taskState, index);
      return task;
    }
    return undefined;
  }

  /**
   * Changes old values from the task through new the values and send the edited task to the backend
   *
   * @param event
   * @param titleinput
   * @param descriptioninput
   * @param dateinput
   * @param categoryinput
   * */
  updateTask(event: Event, titleinput: HTMLInputElement, descriptioninput: HTMLTextAreaElement, dateinput: HTMLInputElement, categoryinput: HTMLInputElement): void {
    event.preventDefault();
    if (this.addWrongInputClass(titleinput, dateinput, categoryinput)) {
      return;
    }
    let task: Task | undefined = this.createTask(event, titleinput, descriptioninput, dateinput, categoryinput);
    if (task && this.taskToEdit?.$id) {
      task.$id = this.taskToEdit.$id;
      task.state = this.taskToEdit.state;
      task.subtasksdone = this.taskToEdit.subtasksdone;
      this.clearAddTask(event, titleinput, descriptioninput, dateinput, categoryinput);
      this.activateUserFeedback();
      this.closePopup.emit(task);
      this.appwriteService.updateTask(task.$id, task);
    }
  }

  /**
   * Shows user feedback to the display
   * */
  activateUserFeedback(): void {
    if (this.userfeedback) {
      this.userfeedback.nativeElement.style.display = 'flex';
    }
  }

  /**
   * Navigate to board
   * */
  urlToBoard(): void {
    setTimeout((): void => {
      this.router.navigate(['home/board']);
    }, 1000);
  }

  /**
   * Creates an index for a new task
   * */
  getTaskIndex(): number {
    if (this.tasks?.length == 0) {
      return 0;
    } else if (this.tasks) {
      return Number(this.tasks[this.tasks.length - 1].index) + 1;
    }
    return 0;
  }

  /**
   * Creates data which can be uploaded
   * */
  prepareDataForTask(): [string[], string[], Number] | void {
    if (this.tasks) {
      const selectedContacts: string[] = this.selectedContacts.map((c: Contact) => JSON.stringify(c));
      const subtasks: string[] = this.subtasks.map((s: Subtask) => JSON.stringify(s));
      const index: Number = this.getTaskIndex();
      return [selectedContacts, subtasks, index];
    }
    return;
  }

  /**
   * Shows user feedback through adding a style class
   *
   * @param titleinput
   * @param dateinput
   * @param categoryinput
   * */
  addWrongInputClass(titleinput: HTMLInputElement, dateinput: HTMLInputElement, categoryinput: HTMLInputElement): boolean {
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

  /**
   * Removes the user feedback style class
   *
   * @param titleinput
   * @param dateinput
   * @param categoryinput
   * @param clear
   * */
  removeWrongInputClass(titleinput: HTMLInputElement, dateinput: HTMLInputElement, categoryinput: HTMLInputElement, clear: boolean | undefined = undefined): void {
    if (titleinput.value.length > 0 || clear) {
      this.titlecontainer?.nativeElement.classList.remove('wrong-input');
    }
    if (dateinput.value.length > 0 || clear) {
      this.datecontainer?.nativeElement.classList.remove('wrong-input');
    }
    if (categoryinput.value.length > 0 || clear) {
      this.categorycontainer?.nativeElement.classList.remove('wrong-input');
    }
  }

  /**
   * Returns a new list of contacts which will be displayed.
   * The added contacts depend on the searched value.
   *
   * @param name
   * */
  searchContact(name: string): void {
    this.contactsForList = this.contacts?.filter((c: Contact) => {
      return c.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    });
  }

}
