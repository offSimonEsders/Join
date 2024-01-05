import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { AppwriteService } from '../../../services/appwrite.service';
import { ContactsListElementComponent } from "./contacts-list-element/contacts-list-element.component";

@Component({
    selector: 'app-contacts',
    standalone: true,
    templateUrl: './contacts.component.html',
    styleUrl: './contacts.component.scss',
    imports: [ContactsListElementComponent, CommonModule]
})
export class ContactsComponent implements OnInit {
    contacts: any;

    constructor(private appwriteService: AppwriteService) {

    }

    async ngOnInit() {
        this.contacts = (await this.appwriteService.getContacts());
        console.log(this.contacts)
    }

}
