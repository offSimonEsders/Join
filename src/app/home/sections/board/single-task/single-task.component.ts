import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-task.component.html',
  styleUrl: './single-task.component.scss'
})
export class SingleTaskComponent {
  @Input() task: any;

  getDoneTasks() {
    return this.task.subtasksdone.filter((value: any) => { if (value == 'true') { return value; } }).length;
  }

  setDragData(event: DragEvent, data: any) {
    event.dataTransfer?.setData('task', JSON.stringify(data));
  }

}
