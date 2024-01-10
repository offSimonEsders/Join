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

    data: any;
    tasksToDO?: Array<Task>;
    tasksInProgress?: Array<Task>;
    tasksAwaitFeedback?: Array<Task>;
    tasksDone?: Array<Task>;


    constructor(public appwriteService: AppwriteService) {

    }

    async ngOnInit() {
        this.data = await this.appwriteService.getTasks();
        this.filterForAllStates();
    }

    filterForAllStates() {
        this.tasksToDO = this.filterForState('ToDo');
        this.tasksInProgress = this.filterForState('InProgress');
        this.tasksAwaitFeedback = this.filterForState('AwaitFeedback');
        this.tasksDone = this.filterForState('Done');
    }

    filterForState(statefilter: string) {
        return this.data.filter((task: any) => {
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

    changeTaskState(task: any, newState: string) {
        const index = this.data.findIndex((t: any) => { if (t.$id === task.$id) { return t.$id } });
        task.state = newState;
        this.data.splice(index, 1);
        this.data.push(task);
        return task;
    }

    async prepareAndUploadTask(task: any) {
        delete task.$databaseId;
        delete task.$collectionId;
        await this.appwriteService.updateTask(String(task.$id), task);
    }

    async changeTasksorder() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].index = i;
            await this.prepareAndUploadTask(this.data[i]);
        }
    }

}
