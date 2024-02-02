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
  @Output() newState = new EventEmitter<string>();
  contacts?: Contact[];
  states = ['ToDo', 'InProgress', 'AwaitFeedback', 'Done'];

  ngOnInit(): void {
    if (this.task?.assignedContacts) {
      this.contacts = this.task?.assignedContacts.map((c) => JSON.parse(c));
    }
  }

  getDoneTasks() {
    if (this.task?.subtasksdone) {
      return this.task.subtasksdone.filter((value: any) => {
        if (value == true) {
          return value;
        }
      }).length;
    }
    return 0;
  }

  checkSubtasks() {
    if (this.task?.subtasks) {
      return this.task.subtasks.length > 0
    }
    return false;
  }

  getProgress() {
    if (this.task?.subtasks) {
      return (this.getDoneTasks() / this.task?.subtasks.length) * 100;
    }
    return;
  }

  getContactsLength() {
    if (this.contacts) {
      return this.contacts.length;
    }
    return 0;
  }

  setDragData(event: DragEvent, data: any) {
    event.dataTransfer?.setData('task', JSON.stringify(data));
  }

  changeStateUp() {
    const index = this.getIndexOfState();
    if (index > 0 && this.task) {
      this.newState.emit(this.states[index - 1]);
    }
    console.log(this.task?.state)
  }

  changeStateDown() {
    const index = this.getIndexOfState();
    if (index < this.states.length - 1 && this.task) {
      this.newState.emit(this.states[index + 1]);
    }
    console.log(this.task?.state)
  }

  getIndexOfState() {
    return this.states.findIndex((state: string) => {
      return this.task?.state == state;
    });
  }

}
