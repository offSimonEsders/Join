import { Component } from '@angular/core';
import { SingleTaskComponent } from "./single-task/single-task.component";

@Component({
    selector: 'app-board',
    standalone: true,
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    imports: [SingleTaskComponent]
})
export class BoardComponent {

}
