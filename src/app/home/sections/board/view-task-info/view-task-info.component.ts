import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../modules/task';

@Component({
  selector: 'app-view-task-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-task-info.component.html',
  styleUrl: './view-task-info.component.scss'
})
export class ViewTaskInfoComponent implements OnInit {
  @Input() task?: Task;
  subtaskdone: boolean = false;

  ngOnInit(): void {
    console.log(this.task?.category);
  }

}
