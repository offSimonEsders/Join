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
export class ContactInformationComponent implements OnInit{
  @Input() contact?: Contact;
  @Input() showToggleBtn: boolean = true;
  @Output() openEdit = new EventEmitter();
  @Output() deleteContact = new EventEmitter();
  showAction: boolean = false;

  ngOnInit() {
    window.addEventListener('click', (event: MouseEvent) => {
      this.closeAction(event);
    });
  }

  toggleAction(): void {
    this.showAction = !this.showAction;
  }

  closeAction(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if(!targetElement.classList.contains('action')) {{
      this.showAction = false;
    }}
  }



}
