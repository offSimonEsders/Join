import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SingleTaskComponent} from "./single-task/single-task.component";
import {AppwriteService} from '../../../services/appwrite.service';
import {Task} from '../../modules/task';
import {ViewTaskInfoComponent} from "./view-task-info/view-task-info.component";
import {AddTaskComponent} from "../add-task/add-task.component";
import {Contact} from '../../modules/contact';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  imports: [CommonModule, SingleTaskComponent, ViewTaskInfoComponent, AddTaskComponent]
})
export class BoardComponent implements OnInit {

  tasks?: Task[];
  tasksForList?: Task[];
  tasksToDO?: Array<Task>;
  tasksInProgress?: Array<Task>;
  tasksAwaitFeedback?: Array<Task>;
  tasksDone?: Array<Task>;
  infoTask?: Task = undefined;
  editTask?: Task;
  openAddTaskPopup: boolean = false;
  createTaskWithState: string = 'ToDo';

  constructor(public appwriteService: AppwriteService) {

  }

  ngOnInit() : void {
    this.init();
  }

  async init() {
    this.tasks = await this.appwriteService.getTasks() as unknown as Task[];
    this.tasksForList = this.tasks;
    this.filterForAllStates();
  }

  filterForAllStates() {
    this.tasksToDO = this.filterForState('ToDo');
    this.tasksInProgress = this.filterForState('InProgress');
    this.tasksAwaitFeedback = this.filterForState('AwaitFeedback');
    this.tasksDone = this.filterForState('Done');
  }

  filterForState(statefilter: string) {
    return this.tasksForList?.filter((task: Task) => {
      if (task.state == statefilter) {
        return Object.values(task);
      }
      return;
    });
  }

  allowDropEvent(event: any) {
    event.preventDefault()
  }

  dropTask(event: any, newState: string) {
    const task = JSON.parse(event.dataTransfer.getData('task'));
    this.saveNewTaskState(newState, task);
  }

  getTaskIndex(task: Task) {
    return this.tasksForList ? this.tasksForList?.findIndex((t: Task) => {
      return t.$id === task.$id
    }) : 0;
  }

  changeTaskState(task: Task, newState: string) {
    task.state = newState;
    return task;
  }

  saveNewTaskState(newState: string, task: Task) {
    const taskWithNewState = this.changeTaskState(task, newState);
    this.changeTasksIndex(taskWithNewState);
    this.filterForAllStates();
    this.prepareAndUploadTasks();
  }

  changeTasksIndex(task: Task) {
    if (this.tasksForList) {
      const index = this.getTaskIndex(task);
      this.tasksForList.splice(index, 1);
      this.tasksForList.push(task);
      for (let i = 0; i < this.tasksForList.length; i++) {
        this.tasksForList[i].index = i;
      }
    }
  }

  prepareAndUploadTasks() {
    this.tasksForList?.forEach((t: Task) => {
      delete t.$databaseId;
      delete t.$collectionId;
      this.appwriteService.updateTask(String(t.$id), t);
    });
  }

  prepareAndUploadSingleTask(task: Task) {
    delete task.$databaseId;
    delete task.$collectionId;
    this.appwriteService.updateTask(String(task.$id), task);
  }

  deleteTask(task: Task) {
    this.tasksForList?.splice(this.getTaskIndex(task), 1);
    this.infoTask = undefined;
    this.filterForAllStates();
    if (task.$id) {
      this.appwriteService.deleteTask(task.$id);
    }
  }

  closeViewTaskInfo() {
    this.saveSubtaskDone();
    this.infoTask = undefined;
  }

  getSubtaskDone(data: boolean[]) {
    if (this.infoTask && this.tasksForList) {
      const index = this.getTaskIndex(this.infoTask);
      this.tasksForList[index].subtasksdone = data;
    }
  }

  saveSubtaskDone() {
    if (this.infoTask && this.tasksForList) {
      const index = this.getTaskIndex(this.infoTask);
      this.prepareAndUploadSingleTask(this.tasksForList[index]);
    }
  }

  openCloseAddTaskPopup() {
    this.openAddTaskPopup = !this.openAddTaskPopup;
    if (!this.openAddTaskPopup) {
      this.infoTask = undefined;
    }
  }

  closePopupAndUpdateData(task: Task) {
    const index: number = this.getTaskIndex(task);
    if (index == -1) {
      setTimeout(() => {
        this.init();
      }, 500);
    } else {
      if (this.tasksForList) {
        this.tasksForList[index] = task;
        this.filterForAllStates();
      }
    }
    setTimeout(() => {
      this.openCloseAddTaskPopup();
    }, 1000);
  }

  searchTaskInBoard(searchParameter: string) {
    this.tasksForList = this.tasks?.filter((t: Task) => {
      if (this.checkIfValueIsContained(t.title, searchParameter)) {
        return true;
      } else if (this.checkIfValueIsContained(t.description, searchParameter)) {
        return true;
      } else if (this.checkIfValueIsContained(t.category, searchParameter)) {
        return true;
      } else if (this.checkValueInContactNames(this.getContactNames(t), searchParameter)) {
        return true;
      }
      return false;
    });
    this.filterForAllStates();
  }

  checkIfValueIsContained(containingValue: string | undefined, value: string) {
    if (containingValue) {
      return containingValue.toLocaleLowerCase().includes(value.toLocaleLowerCase());
    }
    return false;
  }

  getContactNames(task: Task): string[] {
    let contactNames: string[] = [];
    if (task.assignedContacts) {
      const contacts = task.assignedContacts.map((c) => JSON.parse(c));
      contacts.forEach((contact) => {
        contactNames.push(contact.name);
      });
    }
    return contactNames;
  }

  checkValueInContactNames(names: string[], searchParameter: string) {
    return names.some((n) => {
      return this.checkIfValueIsContained(n, searchParameter);
    })
  }

  openTaskInfo(event: Event, task: Task) {
    const targetElement = event.target as HTMLElement;
    if(!targetElement.classList.contains('change-state')) {
      this.infoTask = task;
    }
  }

}
