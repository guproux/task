import {Component, Input} from '@angular/core';
import {Task} from '../../../models/task';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-tasks-list',
  imports: [
    MatTableModule
  ],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.scss',
})
export class TasksList {

  @Input() tasks: Task[] = []

  columns: string[] = ['id', 'label', 'completed'];

}
