import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleTaskComponent } from "./single-task/single-task.component";
import { AppwriteService } from '../../../services/appwrite.service';

@Component({
    selector: 'app-board',
    standalone: true,
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    imports: [CommonModule, SingleTaskComponent]
})
export class BoardComponent implements OnInit {

    data: any;
    tasksToDO?: Array<string>;
    tasksInProgress?: Array<string>;
    tasksAwaitFeedback?: Array<string>;
    tasksDone?: Array<string>;


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
        this.prepareAndUploadTask(changedTask);
    }

    changeTaskState(task: any, newState: string) {
        const index = this.data.findIndex((t: any) => { if (t.$id === task.$id) { return t.$id } });
        task.state = newState;
        this.data.splice(index, 1);
        this.data.push(task);
        console.log(this.data)
        return task;
    }

    async prepareAndUploadTask(task: any) {
        delete task.$databaseId;
        delete task.$collectionId;
        await this.appwriteService.updateTask(String(task.$id), task);
    }

}
