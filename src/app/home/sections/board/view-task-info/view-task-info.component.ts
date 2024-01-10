import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-task-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-task-info.component.html',
  styleUrl: './view-task-info.component.scss'
})
export class ViewTaskInfoComponent {
  subtaskdone: boolean = false;
  prio = 'Urgent';
}
