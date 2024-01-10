import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../modules/task';
import { Contact } from '../../../modules/contact';
import { Subtask } from '../../../modules/subtask';

@Component({
  selector: 'app-view-task-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-task-info.component.html',
  styleUrls: ['./view-task-info.component.scss', '../../../extra-styles/contact-icon-color.scss']
})
export class ViewTaskInfoComponent implements OnInit {
  @Input() task?: Task;
  contacts?: Contact[];
  subtasks?: Subtask[];
  subtaskdone?: boolean[];

  ngOnInit(): void {
    this.getContacts();
    this.getSubtasks();
    this.subtaskdone = this.task?.subtasksdone;
  }

  getContacts() {
    this.contacts = this.task?.assignedContacts?.map((c) => {return JSON.parse(c)});
  }

  getSubtasks() {
    this.subtasks = this.task?.subtasks?.map((s) => {return JSON.parse(s)});
  }
  
  getIndexOfSubtask(subtask: Subtask) {
    if(this.subtasks) {
      return this.subtasks?.findIndex((s) => {return s == subtask});
    }
    return 0;
  }

  getIfSubtaskIsDone(subtask: Subtask) {
    if(this.subtaskdone) {
      return this.subtaskdone[this.getIndexOfSubtask(subtask)];
    }
    return false;
  }

  changeSubtaskIsDone(subtask: Subtask) {
    if(this.subtaskdone) {
      this.subtaskdone[this.getIndexOfSubtask(subtask)] = !this.subtaskdone[this.getIndexOfSubtask(subtask)];
    }
  }

}
