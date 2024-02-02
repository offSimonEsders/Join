export class Contact {
    $collectionId?: string;
    $createdAt?: string;
    $databaseId?: string;
    $id?: string;
    name: string;
    email: string;
    phone: string;
    initials: string;
    color: string;

    constructor(name: string, email: string, phone: string, initials: string, color: string) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.initials = initials;
        this.color = color;
    }

}
