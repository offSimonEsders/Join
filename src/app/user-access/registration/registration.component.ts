import { Component } from '@angular/core';
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

  constructor(public router: Router, private appwriteService: AppwriteService) {
    
  }

}
