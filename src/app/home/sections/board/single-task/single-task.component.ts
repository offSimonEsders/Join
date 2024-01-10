import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../modules/task';
import { Contact } from '../../../modules/contact';

@Component({
  selector: 'app-single-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-task.component.html',
  styleUrls: ['./single-task.component.scss', '../../../extra-styles/contact-icon-color.scss']
})
export class SingleTaskComponent implements OnInit {
  @Input() task?: Task;
  contacts?: Contact[];

  ngOnInit(): void {
    if(this.task?.assignedContacts) {
      this.contacts = this.task?.assignedContacts.map((c) => JSON.parse(c));
    }
  }

  getDoneTasks() {
    if(this.task?.subtasksdone) {
      return this.task.subtasksdone.filter((value: any) => { if (value == 'true') { return value; } }).length;
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
      return (this.getDoneTasks() / this.task?.subtasks.length) * 100
    }
    return;
  }

  getContactsLength() {
    if(this.contacts) {
      return this.contacts.length;
    }
    return 0;
  }

  setDragData(event: DragEvent, data: any) {
    event.dataTransfer?.setData('task', JSON.stringify(data));
  }

}
