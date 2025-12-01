import {Component, inject, OnInit} from '@angular/core';
import {Task} from '../../models/task';
import {TasksService} from '../../services/tasks.service';
import {BehaviorSubject, catchError, finalize, first, of} from 'rxjs';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TasksFilterComponent} from './tasks-filter/tasks-filter.component';
import {TasksListComponent} from './tasks-list/tasks-list.component';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {ErrorCardComponent} from '../error-card/error-card.component';

@Component({
  selector: 'app-tasks.container',
  imports: [MatProgressSpinner, TasksFilterComponent, TasksListComponent, AsyncPipe, MatButton, ErrorCardComponent],
  templateUrl: './tasks.container.html',
  styleUrl: './tasks.container.scss',
})
export class TasksContainer implements OnInit {

  protected tasks: Task[] = []
  protected loading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  protected error: BehaviorSubject<string> = new BehaviorSubject('')

  private router: Router = inject(Router)
  private tasksService: TasksService = inject(TasksService)

  ngOnInit() {
    this.refreshData(null)
  }

  private refreshData(completed: boolean | null) {
    this.getTasks(completed).pipe(first()).subscribe(tasks => {
      this.tasks = tasks
    })
  }

  private getTasks(completed: boolean | null) {
    this.loading.next(true)
    return this.tasksService.findTasks(completed)
      .pipe(
        catchError((err) => {
          this.error.next('Error when tasks search.')
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

  protected createNewTask() {
    this.router.navigate(['/task'])
  }
}
