import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subtask } from '../../../modules/subtask';

@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.scss'
})
export class SubtaskComponent {
  @Input() subtask?: Subtask;
  @Output() editsubtaskevent = new EventEmitter<Subtask>();
  @Output() deletesubtaskevent = new EventEmitter<boolean>();
  editmode: boolean = false;

  deleteSubtask() {
    this.deletesubtaskevent.emit(true);
  }

  editSubtask() {
    this.editmode = true;
  }

  saveSubtask(subtaskinput: HTMLInputElement, subtaskframe: HTMLElement) {
    if(this.subtask && subtaskinput.value.length > 0) {
      this.editmode = false;
      this.subtask.subtask = subtaskinput.value;
      this.editsubtaskevent.emit(this.subtask);
      return;
    }
    subtaskframe.classList.add('wrong-input');
  }

  removeWrongInput(subtaskframe: HTMLElement) {
    subtaskframe.classList.remove('wrong-input');
  }

}
