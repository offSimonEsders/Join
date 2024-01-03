import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";

@Component({
    selector: 'app-user-access',
    standalone: true,
    templateUrl: './user-access.component.html',
    styleUrl: './user-access.component.scss',
    imports: [RouterOutlet, LoginComponent]
})
export class UserAccessComponent {

}
