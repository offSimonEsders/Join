import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";

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

    ngOnInit(): void {
        this.autoLogIn();
    }

    autoLogIn() {
        if (localStorage.getItem('remember') == 'true') {
            this.router.navigate(['home/summary']);
        }
    }

    ngAfterViewInit(): void {
        const bigLogoElement = this.bigLogo?.nativeElement;
        const logoContainer = this.logoContainer?.nativeElement;
        const disappearingcontainer = this.disappearingcontainer?.nativeElement;
        this.changeLogoStyleOnResize(bigLogoElement, logoContainer);
        this.changeLogoStyleOnAnimationEnd(bigLogoElement, logoContainer, disappearingcontainer);
        this.changeLogoAnimationOnRoute(bigLogoElement, disappearingcontainer)
        this.changeLogoAnimationOnWindowWidth(bigLogoElement, logoContainer, disappearingcontainer);
    }

    changeLogoStyleOnResize(bigLogoElement: any, logoContainer: any) {
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

    changeLogoStyleOnAnimationEnd(bigLogoElement: any, logoContainer: any, disappearingcontainer: any) {
        bigLogoElement.addEventListener('animationend', () => {
            if (bigLogoElement && window.innerWidth <= 1000) {
                bigLogoElement.style.left = ((window.innerWidth - logoContainer.offsetWidth) / 2) + 'px';
                bigLogoElement.style.top = '37px';
                bigLogoElement.style.backgroundImage = "url('../../assets/Logos/Join_Logo_Dark.svg')";
                bigLogoElement.classList.remove('animate-join-logo');
                disappearingcontainer.style.display = 'none';
            }
        });
    }

    changeLogoAnimationOnRoute(bigLogoElement: any, disappearingcontainer: any) {
        if (this.router.url === '/registration') {
            bigLogoElement.classList.remove('animate-join-logo');
            disappearingcontainer.style.display = 'none';
            return;
        }
    }

    changeLogoAnimationOnWindowWidth(bigLogoElement: any, logoContainer: any, disappearingcontainer: any) {
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
