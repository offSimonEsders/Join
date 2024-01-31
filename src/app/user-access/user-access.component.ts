import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {LoginComponent} from "./login/login.component";

@Component({
  selector: 'app-user-access',
  standalone: true,
  templateUrl: './user-access.component.html',
  styleUrl: './user-access.component.scss',
  imports: [RouterOutlet, LoginComponent]
})
export class UserAccessComponent implements AfterViewInit, OnInit {
  @ViewChild('bigLogo') bigLogo?: ElementRef;
  @ViewChild('logoContainer') logoContainer?: ElementRef
  @ViewChild('disappearingcontainer') disappearingcontainer?: ElementRef;

  constructor(public router: Router) {

  }

  /**
   * Calls autoLogIn on start
   * */
  ngOnInit(): void {
    this.autoLogIn();
  }

  /**
   * If key remember == true it sends the client to home/summary
   * */
  autoLogIn(): void {
    if (localStorage.getItem('remember') == 'true') {
      this.router.navigate(['home/summary']);
    }
  }

  /**
   * Calls functions for animation nad style
   * */
  ngAfterViewInit(): void {
    const bigLogoElement: HTMLElement = this.bigLogo?.nativeElement;
    const logoContainer: HTMLElement = this.logoContainer?.nativeElement;
    const disappearingcontainer: HTMLElement = this.disappearingcontainer?.nativeElement;
    this.changeLogoStyleOnResize(bigLogoElement, logoContainer);
    this.changeLogoStyleOnAnimationEnd(bigLogoElement, logoContainer, disappearingcontainer);
    this.changeLogoAnimationOnRoute(bigLogoElement, disappearingcontainer)
    this.changeLogoAnimationOnWindowWidth(bigLogoElement, logoContainer, disappearingcontainer);
  }

  /**
   * Changes the position of the big logo on resize for better style
   * @param bigLogoElement
   * @param logoContainer
   * */
  changeLogoStyleOnResize(bigLogoElement: HTMLElement, logoContainer: HTMLElement): void {
    window.addEventListener('resize', () => {
      if (bigLogoElement && window.innerWidth <= 1000) {
        bigLogoElement.style.left = ((window.innerWidth - logoContainer.offsetWidth) / 2) + 'px';
        bigLogoElement.style.top = '37px';
      } else {
        bigLogoElement.style.left = '77px';
        bigLogoElement.style.top = '80px';
      }
    });
  }

  /**
   * Changes the style of the logo to the dark theme after animation with the light theme logo for mobile
   *
   * @param bigLogoElement
   * @param logoContainer
   * @param disappearingcontainer
   * */
  changeLogoStyleOnAnimationEnd(bigLogoElement: HTMLElement, logoContainer: HTMLElement, disappearingcontainer: HTMLElement): void {
    bigLogoElement.addEventListener('animationend', (): void => {
      if (bigLogoElement && window.innerWidth <= 1000) {
        bigLogoElement.style.left = ((window.innerWidth - logoContainer.offsetWidth) / 2) + 'px';
        bigLogoElement.style.top = '37px';
        bigLogoElement.style.backgroundImage = "url('../../assets/Logos/Join_Logo_Dark.svg')";
        bigLogoElement.classList.remove('animate-join-logo');
        disappearingcontainer.style.display = 'none';
      }
    });
  }

  /**
   * Removes the animation if site is load with url/registration
   *
   * @param bigLogoElement
   * @param disappearingcontainer
   * */
  changeLogoAnimationOnRoute(bigLogoElement: HTMLElement, disappearingcontainer: HTMLElement): void {
    if (this.router.url === '/registration') {
      bigLogoElement.classList.remove('animate-join-logo');
      disappearingcontainer.style.display = 'none';
      return;
    }
  }

  /**
   * Logo to dark theme
   * Changes position of the logo
   *
   * @param bigLogoElement
   * @param logoContainer
   * @param disappearingcontainer
   * */
  changeLogoAnimationOnWindowWidth(bigLogoElement: HTMLElement, logoContainer: HTMLElement, disappearingcontainer: HTMLElement) {
    if (bigLogoElement && window.innerWidth <= 1000) {
      bigLogoElement.style.left = ((window.innerWidth - logoContainer.offsetWidth) / 2) + 'px';
      bigLogoElement.style.top = '37px';
      this.changeLogoAnimationOnRoute(bigLogoElement, disappearingcontainer);
      bigLogoElement.classList.add('animate-join-logo');
      disappearingcontainer.style.display = 'flex';
      bigLogoElement.style.backgroundImage = "url('../../assets/Logos/Join_Logo_Light.svg')";
    }
  }
}
