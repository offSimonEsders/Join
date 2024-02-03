import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Task} from '../../../models/task';
import {Contact} from '../../../models/contact';
import {Subtask} from '../../../models/subtask';
import {AppwriteService} from '../../../../services/appwrite.service';

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
    window.addEventListener('resize', (): void => {
      this.checkHeight();
    });
  }

  ngAfterViewInit(): void {
    this.checkHeight();
  }

  /**
   * Downloads the contacts from the backend and set it to this.contacts
   * */
  getContacts(): void {
    this.contacts = this.task?.assignedContacts?.map((c: string) => {
      return JSON.parse(c)
    });
  }

  /**
   * Gets the Subtasks from the given task
   * */
  getSubtasks(): void {
    this.subtasks = this.task?.subtasks?.map((s: string) => {
      return JSON.parse(s)
    });
  }

  /**
   * Returns the index from the giv en subtask
   *
   * @param subtask
   * */
  getIndexOfSubtask(subtask: Subtask): number {
    if (this.subtasks) {
      return this.subtasks?.findIndex((s: Subtask): boolean => {
        return s == subtask
      });
    }
    return 0;
  }

  /**
   * Returns if a subtask is done
   *
   * @param subtask
   * */
  getIfSubtaskIsDone(subtask: Subtask): boolean {
    if (this.subtaskdone) {
      return this.subtaskdone[this.getIndexOfSubtask(subtask)];
    }
    return false;
  }


  /**
   * Inverts the done state of a subtask
   *
   * @param subtask
   * */
  changeSubtaskIsDone(subtask: Subtask): void {
    if (this.subtaskdone) {
      const index: number = this.getIndexOfSubtask(subtask)
      this.subtaskdone[index] = !this.subtaskdone[index];
    }
    this.subtaskDone.emit(this.subtaskdone);
  }


  /**
   * Returns the length of the contacts array
   * */
  getContactsLength(): number {
    if (this.contacts) {
      return this.contacts.length;
    }
    return 0;
  }

  /**
   * Returns the length of the subtasks array
   * */
  getSubtasksLength(): number {
    if (this.subtasks) {
      return this.subtasks.length;
    }
    return 0;
  }

  /**
   * Emits the close event
   * */
  closeTaskInfo(): void {
    this.closeViewInfo.emit(undefined);
  }

  /**
   * Checks the height of the window and changes the style
   * */
  checkHeight(): void {
    if (this.taskinfo && this.taskinfoframe) {
      console.log(this.taskinfo.nativeElement.offsetHeight, this.taskinfoframe.nativeElement.offsetHeight)
      if (this.taskinfo.nativeElement.offsetHeight >= this.taskinfoframe.nativeElement.offsetHeight) {
        this.taskinfoframe.nativeElement.classList.add('use-max-height');
      } else {
        this.taskinfoframe.nativeElement.classList.remove('use-max-height');
      }
    }
  }

}
