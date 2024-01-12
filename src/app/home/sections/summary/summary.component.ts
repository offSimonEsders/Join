import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppwriteService } from '../../../services/appwrite.service';
import { Task } from '../../modules/task';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  userName?: string;
  tasks?: Task[];
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private router: Router, private appwriteService: AppwriteService) {

  }

  async ngOnInit() {
    this.tasks = await this.appwriteService.getTasks() as unknown as Task[];
    this.userName = await this.appwriteService.getUserName();
    console.log(this.tasks)
  }

  goToBoard() {
    this.router.navigate(['/home/board']);
  }

  getGreeting() {
    const time = new Date().getHours();
    if (time > 0 && time < 12) {
      return 'Good morning';
    } else if (time > 12 && time < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }

  getTasksInState(state: string) {
    let count = 0;
    this.tasks?.forEach((t: Task) => {
      if (t.state == state) {
        count++;
      }
    });
    return count;
  }

  getUrgentTasks() {
    let count = 0;
    this.tasks?.forEach((t: Task) => {
      if (t.prio == 'Urgent') {
        count++;
      }
    });
    return count;
  }

  getNearestUrgentTask() {
    let dates: number[] = [];
    this.tasks?.forEach(task => {
      if (task.prio == 'Urgent') {
        dates.push(parseInt(task.duedate.replace("-", "").replace("-", "")));
      }
    });
    return this.dateToString(dates);
  }

  dateToString (dates: number[]) {
    if (dates.length > 0) {
      let nearestDate = Math.min(...dates).toString();
      let year = parseInt(nearestDate.substr(0, 4));
      let month = parseInt(nearestDate.substr(4, 2)) - 1;
      let day = parseInt(nearestDate.substr(6, 2));
      if (year == undefined || day == undefined || month == undefined) {
        return 'MM,DD,YYYY';
      }
      return `${this.monthNames[month]} ${day}, ${year}`;
    }
    return 'MM,DD,YYYY';
  }

}
