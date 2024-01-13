import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleTaskComponent } from "./single-task/single-task.component";
import { AppwriteService } from '../../../services/appwrite.service';
import { Task } from '../../modules/task';
import { ViewTaskInfoComponent } from "./view-task-info/view-task-info.component";
import { AddTaskComponent } from "../add-task/add-task.component";

@Component({
    selector: 'app-board',
    standalone: true,
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    imports: [CommonModule, SingleTaskComponent, ViewTaskInfoComponent, AddTaskComponent]
})
export class BoardComponent implements OnInit {

    tasks: any;
    tasksToDO?: Array<Task>;
    tasksInProgress?: Array<Task>;
    tasksAwaitFeedback?: Array<Task>;
    tasksDone?: Array<Task>;
    infoTask?: Task = undefined;
    editTask?: Task;

    constructor(public appwriteService: AppwriteService) {

    }

    async ngOnInit() {
        this.tasks = await this.appwriteService.getTasks();
        this.filterForAllStates();
    }

    filterForAllStates() {
        this.tasksToDO = this.filterForState('ToDo');
        this.tasksInProgress = this.filterForState('InProgress');
        this.tasksAwaitFeedback = this.filterForState('AwaitFeedback');
        this.tasksDone = this.filterForState('Done');
    }

    filterForState(statefilter: string) {
        return this.tasks.filter((task: any) => {
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
        const taskWithNewState = this.changeTaskState(task, newState);
        this.changeTasksIndex(taskWithNewState);
        this.filterForAllStates();
        this.prepareAndUploadTasks();
    }

    getTaskIndex(task: Task) {
        return this.tasks.findIndex((t: Task) => { return t.$id === task.$id });
    }

    changeTaskState(task: Task, newState: string) {
        task.state = newState;
        return task;
    }

    changeTasksIndex(task: Task) {
        const index = this.getTaskIndex(task);
        this.tasks.splice(index, 1);
        this.tasks.push(task);
        for (let i = 0; i < this.tasks.length; i++) {
            this.tasks[i].index = i;
        }
    }

    prepareAndUploadTasks() {
        this.tasks.forEach((t: Task) => {
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
        this.tasks.splice(this.getTaskIndex(task), 1);
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
        if (this.infoTask) {
            const index = this.getTaskIndex(this.infoTask);
            this.tasks[index].subtasksdone = data;
        }
    }

    saveSubtaskDone() {
        if (this.infoTask) {
            const index = this.getTaskIndex(this.infoTask);
            this.prepareAndUploadSingleTask(this.tasks[index]);
        }
    }

}
