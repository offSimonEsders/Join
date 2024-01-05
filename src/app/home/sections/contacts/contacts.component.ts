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

    letters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    constructor(private appwriteService: AppwriteService) {

    }

    async ngOnInit() {
        this.contacts = (await this.appwriteService.getContacts());
        console.log(this.contacts)
    }

    returnIfNameWithLetterexist(letter: string) {
        try {
            for (let c of this.contacts) {
                if (c.name[0].toUpperCase() == letter) {
                    return true;
                }
            }
            return false;
        }
        catch {
            return;
        }
    }

}
