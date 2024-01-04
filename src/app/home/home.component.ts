import { Component } from '@angular/core';
import { SidebarComponent } from "./sidebar/sidebar.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [SidebarComponent]
})
export class HomeComponent {

}
