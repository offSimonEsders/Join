import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Contact} from '../../../models/contact';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-contact-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.scss', '../../../extra-styles/contact-icon-color.scss']
})
export class ContactInformationComponent implements OnInit {
  @Input() contact?: Contact;
  @Input() showToggleBtn: boolean = true;
  @Output() openEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteContact: EventEmitter<any> = new EventEmitter<any>();
  showAction: boolean = false;

  ngOnInit(): void {
    window.addEventListener('click', (event: MouseEvent): void => {
      this.closeAction(event);
    });
  }

  /**
   * Inverts the showAction which shows or hides the action buttons
   * */
  toggleAction(): void {
    this.showAction = !this.showAction;
  }

  /**
   * Hides the action buttons
   *
   * @param event
   * */
  closeAction(event: MouseEvent): void {
    const targetElement: HTMLElement = event.target as HTMLElement;
    if (!targetElement.classList.contains('action')) {
      {
        this.showAction = false;
      }
    }
  }
}
