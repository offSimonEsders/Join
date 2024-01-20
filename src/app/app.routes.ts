import {Routes} from '@angular/router';
import {UserAccessComponent} from './user-access/user-access.component';
import {RegistrationComponent} from './user-access/registration/registration.component';
import {LoginComponent} from './user-access/login/login.component';
import {PrivacyPolicyComponent} from './legalhelp/privacy-policy/privacy-policy.component';
import {LegalNoticeComponent} from './legalhelp/legal-notice/legal-notice.component';
import {HomeComponent} from './home/home.component';
import {FrameComponent} from "./legalhelp/frame/frame.component";
import {AuthGuardService} from './services/auth-guard.service';
import {SummaryComponent} from './home/sections/summary/summary.component';
import {AddTaskComponent} from './home/sections/add-task/add-task.component';
import {BoardComponent} from './home/sections/board/board.component';
import {ContactsComponent} from './home/sections/contacts/contacts.component';
import { HelpComponent } from "./legalhelp/help/help.component";

export const routes: Routes = [
  {
    path: '', component: UserAccessComponent, children: [
      {path: '', component: LoginComponent},
      {path: 'registration', component: RegistrationComponent} // Fügen Sie die neue Kindroute hinzu
    ]
  },
  {
    path: 'legal', component: FrameComponent, children: [
      {path: 'privacypolicy', component: PrivacyPolicyComponent},
      {path: 'legalnotice', component: LegalNoticeComponent},
    ]
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuardService], children: [
      {path: 'summary', component: SummaryComponent, canActivate: [AuthGuardService]},
      {path: 'addtask', component: AddTaskComponent, canActivate: [AuthGuardService]},
      {path: 'board', component: BoardComponent, canActivate: [AuthGuardService]},
      {path: 'contacts', component: ContactsComponent, canActivate: [AuthGuardService]},
      {path: 'privacypolicy', component: PrivacyPolicyComponent, canActivate: [AuthGuardService]},
      {path: 'legalnotice', component: LegalNoticeComponent, canActivate: [AuthGuardService]},
      {path: 'help', component: HelpComponent, canActivate: [AuthGuardService]},
    ]
  }
];
