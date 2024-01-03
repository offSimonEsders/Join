import { Routes } from '@angular/router';
import { UserAccessComponent } from './user-access/user-access.component';
import { RegistrationComponent } from './user-access/registration/registration.component';
import { LoginComponent } from './user-access/login/login.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '', component: UserAccessComponent, children: [
            { path: '', component: LoginComponent },
            { path: 'registration', component: RegistrationComponent } // Fügen Sie die neue Kindroute hinzu
        ]
    },
    { path: 'privacypolicy', component: PrivacyPolicyComponent },
    { path: 'legalnotice', component: LegalNoticeComponent },
    { path: 'home', component: HomeComponent }
];
