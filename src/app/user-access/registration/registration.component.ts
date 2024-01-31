import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Router} from '@angular/router';
import {AppwriteService} from '../../services/appwrite.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  @ViewChild('nameinputcontainer') nameinputcontainer?: ElementRef<HTMLDivElement>;
  @ViewChild('emailinputcontainer') emailinputcontainer?: ElementRef<HTMLDivElement>;
  @ViewChildren('passwordinputcontainer') passwordinputcontainer?: QueryList<ElementRef>;
  mailregex: RegExp = /[a-z0-9]+@[a-z]+\.[a-z]/;
  checked: boolean = false;

  constructor(public router: Router, private appwriteService: AppwriteService) {

  }

  /**
   * Inverts the value of checked
   * */
  changeChecked(): void {
    this.checked = !this.checked;
  }

  /**
   * Removes user feedback
   *
   * @param inputcontainer
   * */
  removeWrongInputClass(inputcontainer: HTMLDivElement): void {
    inputcontainer.classList.remove('wrong-input');
  }

  /**
   * Removes user feedback
   **/
  removeWrongInputClassPassword(): void {
    this.passwordinputcontainer?.forEach((element) => {
      element.nativeElement.classList.remove('wrong-input');
    });
  }

  /**
   * Checks if given name is valid and returns the boolean
   *
   * @param name -
   *
   * @return boolean
   * */
  validateName(name: string): boolean {
    if (name.length <= 0) {
      this.nameinputcontainer?.nativeElement.classList.add('wrong-input');
      return true;
    }
    return false;
  }

  /**
   * Checks if given email is valid and returns the boolean
   *
   * @param email
   * */
  validateEmail(email: string): boolean {
    if (!this.mailregex.test(email)) {
      this.emailinputcontainer?.nativeElement.classList.add('wrong-input');
      return true;
    }
    return false;
  }

  /**
   * Checks if given passwords are equal and are valid and returns the boolean
   *
   * @param password1
   * @param password2
   * */
  validatePassword(password1: string, password2: string): boolean {
    if (password1.length < 8 || password1 !== password2) {
      this.passwordinputcontainer?.forEach((element) => {
        element.nativeElement.classList.add('wrong-input');
      });
      return true;
    }
    return false;
  }

  /**
   * Calls the data validation functions and checks if they are all true
   *
   * @param name
   * @param email
   * @param password1
   * @param password2
   * */
  validateData(name: string, email: string, password1: string, password2: string): boolean {
    let stop: boolean = false;
    if (this.validateName(name)) {
      stop = true;
    }
    if (this.validateEmail(email)) {
      stop = true;
    }
    if (this.validatePassword(password1, password2)) {
      stop = true;
    }
    return stop;
  }

  /**
   * If data is valid the function register the client and if this is succeeded the client gets to the home
   *
   * @param event
   * @param name
   * @param email
   * @param password1
   * @param password2
   * @param accpp
   * */
  async register(event: Event, name: string, email: string, password1: string, password2: string, accpp: boolean): Promise<void> {
    event.preventDefault();
    if (this.validateData(name, email, password1, password2) || !accpp) {
      return;
    }
    if (await this.appwriteService.appwriteSignUp(email, password1, name)) {
      await this.logIn(email, password1);
    }
  }

  /**
   * Creates a session and sends the client to home
   *
   * @param email
   * @param password
   * */
  async logIn(email: string, password: string) {
    await this.appwriteService.appwriteLoginEmailPassword(email, password);
    this.router.navigate(['home']);
  }

}
