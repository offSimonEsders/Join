import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SingleTaskComponent} from "./single-task/single-task.component";
import {AppwriteService} from '../../../services/appwrite.service';
import {Task} from '../../models/task';
import {ViewTaskInfoComponent} from "./view-task-info/view-task-info.component";
import {AddTaskComponent} from "../add-task/add-task.component";
import {Contact} from '../../models/contact';

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

  /**
   * Calls some functions to load and sort the data
   * */
  async init(): Promise<void> {
    this.tasks = await this.appwriteService.getTasks() as unknown as Task[];
    this.tasksForList = this.tasks;
    this.filterForAllStates();
  }

  /**
   * Sorts the tasks after their state
   * */
  filterForAllStates(): void {
    this.tasksToDO = this.filterForState('ToDo');
    this.tasksInProgress = this.filterForState('InProgress');
    this.tasksAwaitFeedback = this.filterForState('AwaitFeedback');
    this.tasksDone = this.filterForState('Done');
  }

  /**
   * Returns an array of tasks depending on their state
   *
   * @param statefilter
   * */
  filterForState(statefilter: string): Task[] | undefined {
    return this.tasksForList?.filter((task: Task): Task[] | undefined => {
      if (task.state == statefilter) {
        return Object.values(task);
      }
      return;
    });
  }

  /**
   * Allows the drop event
   *
   * @param event
   * */
  allowDropEvent(event: any): void {
    event.preventDefault()
  }

  /**
   * Saves the task with it new state after the drop
   *
   * @param event
   * @param newState
   * */
  dropTask(event: any, newState: string): void {
    const task = JSON.parse(event.dataTransfer.getData('task'));
    this.saveNewTaskState(newState, task);
  }

  /**
   * Returns the index of a task in the taskslist
   *
   * @param task
   * */
  getTaskIndex(task: Task): number {
    return this.tasksForList ? this.tasksForList?.findIndex((t: Task): boolean => {
      return t.$id === task.$id
    }) : 0;
  }

  /**
   * Returns Task with the new State
   *
   * @param task
   * @param newState
   * */
  changeTaskState(task: Task, newState: string): Task {
    task.state = newState;
    return task;
  }

  /**
   * Saves the task and loads it up
   * */
  saveNewTaskState(newState: string, task: Task): void {
    const taskWithNewState: Task = this.changeTaskState(task, newState);
    this.changeTasksIndex(taskWithNewState);
    this.filterForAllStates();
    this.prepareAndUploadTasks();
  }

  /**
   * Sets the index of the task to the last of its array
   *
   * @param task
   * */
  changeTasksIndex(task: Task): void {
    if (this.tasksForList) {
      const index: number = this.getTaskIndex(task);
      this.tasksForList.splice(index, 1);
      this.tasksForList.push(task);
      for (let i: number = 0; i < this.tasksForList.length; i++) {
        this.tasksForList[i].index = i;
      }
    }
  }

  /**
   * Sends all tasks with new data to the backend
   * */
  prepareAndUploadTasks(): void {
    this.tasksForList?.forEach((t: Task): void => {
      delete t.$databaseId;
      delete t.$collectionId;
      this.appwriteService.updateTask(String(t.$id), t);
    });
  }

  /**
   * Sends a single Task to the backend
   *
   * @param task
   * */
  prepareAndUploadSingleTask(task: Task): void {
    delete task.$databaseId;
    delete task.$collectionId;
    this.appwriteService.updateTask(String(task.$id), task);
  }

  /**
   * Deletes a task from the frontend and sends a delete request to the backend
   *
   * @param task
   * */
  deleteTask(task: Task): void {
    this.tasksForList?.splice(this.getTaskIndex(task), 1);
    this.infoTask = undefined;
    this.filterForAllStates();
    if (task.$id) {
      this.appwriteService.deleteTask(task.$id);
    }
  }

  /**
   * Saves the subtasks state and closes the popup
   * */
  closeViewTaskInfo(): void {
    this.saveSubtaskDone();
    this.infoTask = undefined;
  }

  /**
   * Gets the array where is the info which subtask is done
   *
   * @param data
   * */
  getSubtaskDone(data: boolean[]): void {
    if (this.infoTask && this.tasksForList) {
      const index: number = this.getTaskIndex(this.infoTask);
      this.tasksForList[index].subtasksdone = data;
    }
  }

  /**
   * Saves the subtask state and send it to the backend
   * */
  saveSubtaskDone(): void {
    if (this.infoTask && this.tasksForList) {
      const index: number = this.getTaskIndex(this.infoTask);
      this.prepareAndUploadSingleTask(this.tasksForList[index]);
    }
  }

  /**
   * Inverts the open status from the addtask popup
   * */
  openCloseAddTaskPopup(): void {
    this.openAddTaskPopup = !this.openAddTaskPopup;
    if (!this.openAddTaskPopup) {
      this.infoTask = undefined;
    }
  }

  /**
   * Closes the popup and updates the data
   *
   * @param task
   * */
  closePopupAndUpdateData(task: Task): void {
    const index: number = this.getTaskIndex(task);
    if (index == -1) {
      setTimeout((): void => {
        this.init();
      }, 500);
    } else {
      if (this.tasksForList) {
        this.tasksForList[index] = task;
        this.filterForAllStates();
      }
    }
    setTimeout((): void => {
      this.openCloseAddTaskPopup();
    }, 1000);
  }

  /**
   * Returns if a task matches the searched parameter
   *
   * @param searchParameter
   * */
  searchTaskInBoard(searchParameter: string): void {
    this.tasksForList = this.tasks?.filter((t: Task): boolean => {
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

  /**
   * Returns if the mainvalue contains the value
   * */
  checkIfValueIsContained(containingValue: string | undefined, value: string): boolean {
    if (containingValue) {
      return containingValue.toLocaleLowerCase().includes(value.toLocaleLowerCase());
    }
    return false;
  }

  /**
   * Returns an array of the contactnames from the contacts assigned to the task
   *
   * @param task
   * */
  getContactNames(task: Task): string[] {
    let contactNames: string[] = [];
    if (task.assignedContacts) {
      const contacts: any[] = task.assignedContacts.map((c: string) => JSON.parse(c));
      contacts.forEach((contact): void => {
        contactNames.push(contact.name);
      });
    }
    return contactNames;
  }

  /**
   * Checks if any name is matches to the searched parameter
   *
   * @param names
   * @param searchParameter
   * */
  checkValueInContactNames(names: string[], searchParameter: string): boolean {
    return names.some((n: string) => {
      return this.checkIfValueIsContained(n, searchParameter);
    })
  }

  /**
   * Sets the info task to the given task when the target does not contain the change-state class
   *
   * @param event
   * @param task
   * */
  openTaskInfo(event: Event, task: Task): void {
    const targetElement: HTMLElement = event.target as HTMLElement;
    if(!targetElement.classList.contains('change-state')) {
      this.infoTask = task;
    }
  }
}
