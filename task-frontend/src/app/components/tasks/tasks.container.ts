import {Component, inject, OnInit} from '@angular/core';
import {Task} from '../../models/task';
import {TasksService} from '../../services/tasks.service';
import {BehaviorSubject, catchError, finalize, of} from 'rxjs';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatCard, MatCardContent} from '@angular/material/card';
import {TasksFilter} from './tasks-filter/tasks-filter';
import {TasksList} from './tasks-list/tasks-list';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-tasks.container',
  imports: [MatProgressSpinner, MatCard, MatCardContent, TasksFilter, TasksList, AsyncPipe],
  templateUrl: './tasks.container.html',
  styleUrl: './tasks.container.scss',
})
export class TasksContainer implements OnInit {

  tasks: Task[] = []
  loading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  error: string | null = null

  private tasksService: TasksService = inject(TasksService)

  ngOnInit() {
    this.refreshData(null)
  }

  private refreshData(completed: boolean | null) {
    this.getTasks(completed).subscribe(tasks => {
      this.tasks = tasks
    })
  }

  private getTasks(completed: boolean | null) {
    this.loading.next(true)
    this.error = null
    return this.tasksService.findTasks(completed)
      .pipe(
        catchError((err) => {
          this.error = 'Error during tasks search.'
          return of([])
        }),
        finalize(() => {
          this.loading.next(false)
        })
      )
  }

  protected updateTasksList(completed: boolean | null) {
    this.refreshData(completed)
  }
}
