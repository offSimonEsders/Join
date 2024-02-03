import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subtask } from '../../../models/subtask';

@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.scss'
})
export class SubtaskComponent {
  @Input() subtask?: Subtask;
  @Output() editsubtaskevent: EventEmitter<Subtask> = new EventEmitter<Subtask>();
  @Output() deletesubtaskevent: EventEmitter<boolean> = new EventEmitter<boolean>();
  editMode: boolean = false;

  /**
   * Emits that the subtasks has to be deleted
   * */
  deleteSubtask(): void {
    this.deletesubtaskevent.emit(true);
  }

  /**
   * Activates the edit mode for this subtask
   * */
  editSubtask(): void {
    this.editMode = true;
  }

  /**
   * Saves the Subtak except the value is invalid
   *
   * @param subtaskinput
   * @param subtaskframe
   * */
  saveSubtask(subtaskinput: HTMLInputElement, subtaskframe: HTMLElement): void {
    if(this.subtask && subtaskinput.value.length > 0) {
      this.editMode = false;
      this.subtask.subtask = subtaskinput.value;
      this.editsubtaskevent.emit(this.subtask);
      return;
    }
    subtaskframe.classList.add('wrong-input');
  }

  /**
   * Removes wrong-input class
   * */
  removeWrongInput(subtaskframe: HTMLElement): void {
    subtaskframe.classList.remove('wrong-input');
  }

}
