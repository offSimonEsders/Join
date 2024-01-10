import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.scss'
})
export class SubtaskComponent {
  @Input() subtask?: string;
  @Output() editsubtask = new EventEmitter<string>();
  @Output() deletesubtaskevent = new EventEmitter<boolean>();
  editmode: boolean = false;

  deleteSubtask() {
    this.deletesubtaskevent.emit(true);
  }

}
