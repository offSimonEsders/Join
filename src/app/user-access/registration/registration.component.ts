import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AppwriteService } from '../../services/appwrite.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  @ViewChild('nameinputcontainer') nameinputcontainer?: ElementRef<HTMLDivElement>;
  @ViewChild('emailinputcontainer') emailinputcontainer?: ElementRef<HTMLDivElement>;
  @ViewChildren('passwordinputcontainer') passwordinputcontainer?: QueryList<ElementRef>;
  mailregex: RegExp = /[a-z0-9]+@[a-z]+\.[a-z]/;

  constructor(public router: Router, private appwriteService: AppwriteService) {
    
  }

  removeWrongInputClass(inputcontainer: HTMLDivElement) {
    inputcontainer.classList.remove('wrong-input');
  }

  removeWrongInputClassPassword() {
    this.passwordinputcontainer?.forEach((element) => {
      element.nativeElement.classList.remove('wrong-input');
    });
  }

  validateName(name: string) {
    if(name.length <= 0) {
      this.nameinputcontainer?.nativeElement.classList.add('wrong-input');
      return true;
    }
    return false;
  }

  validateEmail(email: string) {
    if(!this.mailregex.test(email)) {
      this.emailinputcontainer?.nativeElement.classList.add('wrong-input');
      return true;
    }
    return false;
  }

  validatePassword(password1: string, password2: string) {
    if(password1.length < 8 || password1 !== password2) {
      this.passwordinputcontainer?.forEach((element) => {
        element.nativeElement.classList.add('wrong-input');
      });
      return true;
    }
    return false;
  }

  validateData(name: string, email: string, password1: string, password2: string) {
    let stop: boolean = false;
    if(this.validateName(name)) {
      stop = true;
    }
    if(this.validateEmail(email)) {
      stop = true;
    }
    if(this.validatePassword(password1, password2)) {
      stop = true;
    }
    return stop;
  }

  async register(event: Event, name: string, email: string, password1: string, password2: string, accpp: boolean) {
    event.preventDefault();
    if(this.validateData(name, email, password1, password2) || !accpp) {
      return;
    }
    if(await this.appwriteService.appwriteSignUp(email, password1, name)) {
      await this.logIn(email, password1);
    }
  }

  async logIn(email: string, password: string) {
    await this.appwriteService.appwriteLoginEmailPassword(email, password);
    this.router.navigate(['home']);
  }

}
