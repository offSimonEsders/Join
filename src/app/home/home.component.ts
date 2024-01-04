import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [SidebarComponent, RouterOutlet, HeaderComponent]
})
export class HomeComponent implements OnInit {

    constructor (private router: Router) {
        
    }

    ngOnInit() {
        if (this.router.url == '/home') {
            this.router.navigate(['/home/summary']);
        }
    }

}
