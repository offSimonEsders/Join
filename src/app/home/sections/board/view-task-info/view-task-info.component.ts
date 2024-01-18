import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../modules/task';
import { Contact } from '../../../modules/contact';
import { Subtask } from '../../../modules/subtask';
import { AppwriteService } from '../../../../services/appwrite.service';

@Component({
  selector: 'app-view-task-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-task-info.component.html',
  styleUrls: ['./view-task-info.component.scss', '../../../extra-styles/contact-icon-color.scss']
})
export class ViewTaskInfoComponent implements OnInit, AfterViewInit {
  @Input() task?: Task;
  @Output() closeViewInfo = new EventEmitter<undefined>();
  @Output() deleteTask = new EventEmitter<boolean>();
  @Output() subtaskDone = new EventEmitter<boolean[]>();
  @Output() editTaskInPopup = new EventEmitter<boolean>();
  @ViewChild('taskinfoframe') taskinfoframe?: ElementRef<HTMLElement>;
  @ViewChild('taskinfo') taskinfo?: ElementRef;
  contacts?: Contact[];
  subtasks?: Subtask[];
  subtaskdone?: boolean[];

  constructor(private appwriteService: AppwriteService) {

  }

  ngOnInit(): void {
    this.getContacts();
    this.getSubtasks();
    this.subtaskdone = this.task?.subtasksdone;
    window.addEventListener('resize', () => {
      this.checkHeight();
    });
  }

  ngAfterViewInit() {
    this.checkHeight();
  }

  getContacts() {
    this.contacts = this.task?.assignedContacts?.map((c) => { return JSON.parse(c) });
  }

  getSubtasks() {
    this.subtasks = this.task?.subtasks?.map((s) => { return JSON.parse(s) });
  }

  getIndexOfSubtask(subtask: Subtask) {
    if (this.subtasks) {
      return this.subtasks?.findIndex((s) => { return s == subtask });
    }
    return 0;
  }

  getIfSubtaskIsDone(subtask: Subtask) {
    if (this.subtaskdone) {
      return this.subtaskdone[this.getIndexOfSubtask(subtask)];
    }
    return false;
  }

  changeSubtaskIsDone(subtask: Subtask) {
    if (this.subtaskdone) {
      const index = this.getIndexOfSubtask(subtask)
      this.subtaskdone[index] = !this.subtaskdone[index];
    }
    this.subtaskDone.emit(this.subtaskdone);
  }

  getContactsLength() {
    if (this.contacts) {
      return this.contacts.length;
    }
    return 0;
  }

  getSubtasksLength() {
    if (this.subtasks) {
      return this.subtasks.length;
    }
    return 0;
  }

  closeTaskInfo() {
    this.closeViewInfo.emit(undefined);
  }

  checkHeight() {
    if(this.taskinfo && this.taskinfoframe) {
      console.log(this.taskinfo.nativeElement.offsetHeight, this.taskinfoframe.nativeElement.offsetHeight)
      if(this.taskinfo.nativeElement.offsetHeight >= this.taskinfoframe.nativeElement.offsetHeight) {
        this.taskinfoframe.nativeElement.classList.add('use-max-height');
      } else {
        this.taskinfoframe.nativeElement.classList.remove('use-max-height');
      }
    }
  }

}
