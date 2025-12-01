import {Component, Input} from '@angular/core';
import {Task} from '../../../models/task';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-tasks-list',
  imports: [
    MatTableModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent {

  @Input() tasks: Task[] = []

  columns: string[] = ['id', 'label', 'completed'];

}
