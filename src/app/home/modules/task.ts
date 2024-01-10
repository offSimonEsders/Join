export class Task {
    title: string;
    description?: string;
    assignedConacts?: string[];
    duedate: string;
    prio: string;
    category: string;
    subtasks?: string[];
    subtasksdone?: boolean[];
    state: string;

    constructor(title: string, description: string, assignedConacts: string[], duedate: string, prio: string, category: string, subtasks: string[], state: string) {
        this.title = title;
        this.description = description;
        this.assignedConacts = assignedConacts;
        this.duedate = duedate;
        this.prio = prio;
        this.category = category;
        this.subtasks = subtasks;
        this.subtasksdone = subtasks.map(() => false);
        this.state = state;
    }

}