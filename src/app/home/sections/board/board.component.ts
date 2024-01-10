import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleTaskComponent } from "./single-task/single-task.component";
import { AppwriteService } from '../../../services/appwrite.service';
import { Task } from '../../modules/task';
import { ViewTaskInfoComponent } from "./view-task-info/view-task-info.component";

@Component({
    selector: 'app-board',
    standalone: true,
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    imports: [CommonModule, SingleTaskComponent, ViewTaskInfoComponent]
})
export class BoardComponent implements OnInit {

    tasks: any;
    tasksToDO?: Array<Task>;
    tasksInProgress?: Array<Task>;
    tasksAwaitFeedback?: Array<Task>;
    tasksDone?: Array<Task>;
    infoTask: Task | undefined = undefined;


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
        const changedTask = this.changeTaskState(task, newState);
        this.filterForAllStates();
        this.changeTasksorder();
    }

    getTaskIndex(task: Task) {
        return this.tasks.findIndex((t: Task) => { return t === task });
    }

    changeTaskState(task: Task, newState: string) {
        const index = this.getTaskIndex(task);
        task.state = newState;
        this.tasks.splice(index, 1);
        this.tasks.push(task);
        return task;
    }

    async prepareAndUploadTask(task: Task) {
        delete task.$databaseId;
        delete task.$collectionId;
        await this.appwriteService.updateTask(String(task.$id), task);
    }

    async changeTasksorder() {
        for (let i = 0; i < this.tasks.length; i++) {
            this.tasks[i].index = i;
            await this.prepareAndUploadTask(this.tasks[i]);
        }
    }

    deleteTask(task: Task) {
        this.tasks.splice(this.getTaskIndex(task), 1);
        this.infoTask = undefined;
        this.filterForAllStates();
        if (task.$id) {
            this.appwriteService.deleteTask(task.$id);
        }
    }

}
