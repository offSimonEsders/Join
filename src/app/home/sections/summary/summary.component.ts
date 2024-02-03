import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppwriteService} from '../../../services/appwrite.service';
import {Task} from '../../models/task';

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

  async ngOnInit(): Promise<void> {
    this.tasks = await this.appwriteService.getTasks() as unknown as Task[];
    this.userName = await this.appwriteService.getUserName();
  }

  /**
   * Navigates client to board section
   * */
  goToBoard(): void {
    this.router.navigate(['/home/board']);
  }

  /**
   * Returns the Greeting depending on time
   * */
  getGreeting(): {} {
    const time: number = new Date().getHours();
    if (time > 0 && time < 12) {
      return 'Good morning';
    } else if (time > 12 && time < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }

  /**
   * Returns number of tasks with given state
   *
   * @param state
   * */
  getTasksInState(state: string): number {
    let count: number = 0;
    this.tasks?.forEach((t: Task): void => {
      if (t.state == state) {
        count++;
      }
    });
    return count;
  }

  /**
   * Returns amount of tasks with prio urgent
   * */
  getUrgentTasks(): number {
    let count: number = 0;
    this.tasks?.forEach((t: Task): void => {
      if (t.prio == 'Urgent') {
        count++;
      }
    });
    return count;
  }

  /**
   * Returns the nearest date to today
   * */
  getNearestUrgentTask(): string {
    let dates: number[] = [];
    this.tasks?.forEach((task: Task): void => {
      if (task.prio == 'Urgent') {
        dates.push(parseInt(task.duedate.replace("-", "").replace("-", "")));
      }
    });
    return this.dateToString(dates);
  }

  /**
   * Returns the date converted to a string
   *
   * @param dates
   * */
  dateToString(dates: number[]): string {
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
