import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppwriteService } from '../../services/appwrite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showPopup: boolean = false;

  constructor(private appwriteService: AppwriteService, private router: Router) {
    window.addEventListener('click', (event) => {
      this.closePopup(event);
    });
  }

  changeShowPopup() {
    this.showPopup = !this.showPopup;
  }

  closePopup(event: Event) {
    const targetElement = event.target as HTMLElement;
    if(!targetElement.classList.contains('popup')) {
      this.showPopup = false;
    }
  }

  logOut() {
    this.appwriteService.appwriteLogOut();
    this.router.navigate(['/']);
  }

}
