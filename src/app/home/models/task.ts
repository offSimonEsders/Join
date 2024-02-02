export class Task {
    $collectionId?: string;
    $createdAt?: string;
    $databaseId?: string;
    $id?: string;
    title: string;
    description?: string;
    assignedContacts?: string[];
    duedate: string;
    prio: string;
    category: string;
    subtasks?: string[];
    subtasksdone?: boolean[];
    state: string;
    index: Number;

    constructor(title: string, description: string, assignedContacts: string[], duedate: string, prio: string, category: string, subtasks: string[], state: string, index: Number) {
        this.title = title;
        this.description = description;
        this.assignedContacts = assignedContacts;
        this.duedate = duedate;
        this.prio = prio;
        this.category = category;
        this.subtasks = subtasks;
        this.subtasksdone = subtasks.map(() => false);
        this.state = state;
        this.index = index;
    }

}