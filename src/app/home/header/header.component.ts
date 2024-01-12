import { Component, OnInit } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  showPopup: boolean = false;
  initials?: string;

  constructor(private appwriteService: AppwriteService, private router: Router) {
    window.addEventListener('click', (event) => {
      this.closePopup(event);
    });
  }

  ngOnInit(): void {
    this.getInitials()
  }

  changeShowPopup() {
    this.showPopup = !this.showPopup;
  }

  closePopup(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.classList.contains('popup')) {
      this.showPopup = false;
    }
  }

  logOut() {
    this.appwriteService.appwriteLogOut();
    this.router.navigate(['/']);
  }

  async getInitials() {
    let userName: string = await this.appwriteService.getUserName();
    let userNameSplit = userName.split(' ');
    if(userNameSplit.length == 1) {
      this.initials = userNameSplit[0][0];
    } else {
      this.initials = userNameSplit[0][0] + userNameSplit[1][0];
    }
  }

}
