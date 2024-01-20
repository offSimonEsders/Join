import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  scrollTo(id: string) {
    const element = document.getElementById(id);
    element?.scrollIntoView();
  }
}
