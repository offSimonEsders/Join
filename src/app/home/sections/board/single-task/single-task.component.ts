import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Task} from '../../../models/task';
import {Contact} from '../../../models/contact';

@Component({
  selector: 'app-single-task',
  standalone: true,
  templateUrl: './single-task.component.html',
  styleUrls: ['./single-task.component.scss', '../../../extra-styles/contact-icon-color.scss'],
  imports: [CommonModule]
})
export class SingleTaskComponent implements OnInit {
  @Input() task?: Task;
  @Output() newState: EventEmitter<string> = new EventEmitter<string>();
  contacts?: Contact[];
  states: string[] = ['ToDo', 'InProgress', 'AwaitFeedback', 'Done'];

  ngOnInit(): void {
    if (this.task?.assignedContacts) {
      this.contacts = this.task?.assignedContacts.map((c: string) => JSON.parse(c));
    }
  }

  /**
   * Returns if a subtask is done
   * */
  getDoneSubtasks(): number {
    if (this.task?.subtasksdone) {
      return this.task.subtasksdone.filter((value: any) => {
        if (value == true) {
          return value;
        }
      }).length;
    }
    return 0;
  }

  /**
   * Checks if there are subtasks
   * */
  checkSubtasks(): boolean {
    if (this.task?.subtasks) {
      return this.task.subtasks.length > 0
    }
    return false;
  }

  /**
   * Returns how many subtasks are done in percent to set the progressbar
   * */
  getProgress(): number | undefined {
    if (this.task?.subtasks) {
      return (this.getDoneSubtasks() / this.task?.subtasks.length) * 100;
    }
    return;
  }

  /**
   * Returns how many contacts there are
   * */
  getContactsLength(): number {
    if (this.contacts) {
      return this.contacts.length;
    }
    return 0;
  }

  /**
   * Sets the actual task to dragdata for drag and drop
   * */
  setDragData(event: DragEvent, data: Task | undefined): void {
    event.dataTransfer?.setData('task', JSON.stringify(data));
  }


  /**
   * Sets the state from ['ToDo', 'InProgress', 'AwaitFeedback', 'Done'] one up form where the task is
   * */
  changeStateUp(): void {
    const index: number = this.getIndexOfState();
    if (index > 0 && this.task) {
      this.newState.emit(this.states[index - 1]);
    }
  }

  /**
   * Sets the state from ['ToDo', 'InProgress', 'AwaitFeedback', 'Done'] one down form where the task is
   * */
  changeStateDown(): void {
    const index: number = this.getIndexOfState();
    if (index < this.states.length - 1 && this.task) {
      this.newState.emit(this.states[index + 1]);
    }
  }

  /**
   * Returns the index from the task state from states array
   * */
  getIndexOfState(): number {
    return this.states.findIndex((state: string): boolean => {
      return this.task?.state === state;
    });
  }

}
