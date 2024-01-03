import { Routes } from '@angular/router';
import { UserAccessComponent } from './user-access/user-access.component';
import { RegistrationComponent } from './user-access/registration/registration.component';
import { LoginComponent } from './user-access/login/login.component';

export const routes: Routes = [
    {
        path: '', component: UserAccessComponent, children: [
            { path: '', component: LoginComponent },
            { path: 'registration', component: RegistrationComponent } // Fügen Sie die neue Kindroute hinzu
        ]
    }
];
