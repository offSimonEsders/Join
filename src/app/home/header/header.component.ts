import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppwriteService} from '../../services/appwrite.service';
import {Router} from '@angular/router';

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

  constructor(private appwriteService: AppwriteService, public router: Router) {
    window.addEventListener('click', (event) => {
      this.closePopup(event);
    });
  }

  ngOnInit(): void {
    this.getInitials();
  }

  /**
   * Inverts the value of changeShowPopup which is connected with *ngif
   * */
  changeShowPopup(): void {
    this.showPopup = !this.showPopup;
  }

  /**
   * Sets showPopup to false when element without the class popup is clicked.
   * The Popup closes because it is connected with *ngif
   *
   * @param event
   * */
  closePopup(event: Event): void {
    const targetElement: HTMLElement = event.target as HTMLElement;
    if (!targetElement.classList.contains('popup')) {
      this.showPopup = false;
    }
  }

  /**
   * Calls appwriteLogout, sets localstorage remember to false and reloads the page
   * */
  async logOut(): Promise<void> {
    await this.appwriteService.appwriteLogOut();
    localStorage.setItem('remember', 'false');
    this.router.navigate(['']);
  }

  /**
   * Gets the username from the database and splits it to get the initials
   * */
  async getInitials(): Promise<void> {
    let userName: string = await this.appwriteService.getUserName();
    let userNameSplit: string[] = userName.split(' ');
    if (userNameSplit.length == 1) {
      this.initials = userNameSplit[0][0];
    } else {
      this.initials = userNameSplit[0][0] + userNameSplit[1][0];
    }
  }

}
