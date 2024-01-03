import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";

@Component({
    selector: 'app-user-access',
    standalone: true,
    templateUrl: './user-access.component.html',
    styleUrl: './user-access.component.scss',
    imports: [RouterOutlet, LoginComponent]
})
export class UserAccessComponent implements AfterViewInit {
    @ViewChild('bigLogo') bigLogo?: ElementRef;
    @ViewChild('logoContainer') logoContainer?: ElementRef
    @ViewChild('disappearingcontainer') disappearingcontainer?: ElementRef;

    constructor(private router: Router) {

    }
    ngAfterViewInit(): void {
        const bigLogoElement = this.bigLogo?.nativeElement;
        const logoContainer = this.logoContainer?.nativeElement;
        const disappearingcontainer = this.disappearingcontainer?.nativeElement;
        if (bigLogoElement && window.innerWidth <= 800) {
            bigLogoElement.style.left = ((window.innerWidth - logoContainer.offsetWidth) / 2) + 'px';
            bigLogoElement.style.top = '37px';
            if(this.router.url == '/registration') {
                bigLogoElement.classList.remove('animate-join-logo');
                disappearingcontainer.style.display = 'none';
                return;
            }
            bigLogoElement.classList.add('animate-join-logo');
            disappearingcontainer.style.display = 'flex';
            bigLogoElement.style.backgroundImage = "url('../../assets/Logos/Join_Logo_Light.svg')";
        }
        window.addEventListener('resize', () => {
            if (bigLogoElement && window.innerWidth <= 800) {
                bigLogoElement.style.left = ((window.innerWidth - logoContainer.offsetWidth) / 2) + 'px';
                bigLogoElement.style.top = '37px';
            }
        })
        bigLogoElement.addEventListener('animationend', () => {
            if (bigLogoElement && window.innerWidth <= 800) {
                bigLogoElement.style.left = ((window.innerWidth - logoContainer.offsetWidth) / 2) + 'px';
                bigLogoElement.style.top = '37px';
                bigLogoElement.style.backgroundImage = "url('../../assets/Logos/Join_Logo_Dark.svg')";
                bigLogoElement.classList.remove('animate-join-logo');
                disappearingcontainer.style.display = 'none';
            }
        })
    }

}
