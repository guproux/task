import {Component, inject, OnInit} from '@angular/core';
import {Task} from '../../models/task';
import {TasksService} from '../../services/tasks.service';
import {catchError, finalize, of} from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
  selector: 'app-tasks.container',
  imports: [MatTableModule, MatProgressSpinner, MatCard, MatCardContent],
  providers: [TasksService],
  templateUrl: './tasks.container.html',
  styleUrl: './tasks.container.scss',
})
export class TasksContainer implements OnInit {

  tasks: Task[] = []
  loading: boolean = false
  error: string = ''

  columns: string[] = ['id', 'label', 'completed'];

  private tasksService: TasksService = inject(TasksService)

  ngOnInit() {
    this.refreshData()
  }

  private refreshData() {
    this.getTasks().subscribe(tasks => {
      this.tasks = tasks
    });
  }

  private getTasks() {
    this.loading = true
    return this.tasksService.findTasks()
      .pipe(
        catchError((err) => {
          this.error = 'Error during tasks search.'
          return of()
        }),
        finalize(() => {
          this.loading = false
        })
      )
  }

}
