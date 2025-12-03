import {Component, inject, OnInit, signal} from '@angular/core';
import {Task} from '../../models/task';
import {TasksService} from '../../services/tasks.service';
import {catchError, finalize, first, of} from 'rxjs';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TasksFilterComponent} from './tasks-filter/tasks-filter.component';
import {TasksListComponent} from './tasks-list/tasks-list.component';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {ErrorCardComponent} from '../error-card/error-card.component';
import {TaskUpdateForm} from '../../models/task-update-form';

@Component({
  selector: 'app-tasks.container',
  imports: [MatProgressSpinner, TasksFilterComponent, TasksListComponent, MatButton, ErrorCardComponent],
  templateUrl: './tasks.container.html',
  styleUrl: './tasks.container.scss',
})
export class TasksContainer implements OnInit {

  protected tasks = signal([] as Task[])
  protected loading = signal(false)
  protected error = signal('')

  private router: Router = inject(Router)
  private tasksService: TasksService = inject(TasksService)

  ngOnInit() {
    this.refreshData(null)
  }

  private refreshData(completed: boolean | null) {
    this.getTasks(completed).pipe(first()).subscribe(tasks => {
      this.tasks.set(tasks)
    })
  }

  private getTasks(completed: boolean | null) {
    this.loading.set(true)
    return this.tasksService.findTasks(completed)
      .pipe(
        catchError((err) => {
          this.error.set('Error when tasks search.')
          return of([])
        }),
        finalize(() => {
          this.loading.set(false)
        })
      )
  }

  protected updateTasksList(completed: boolean | null) {
    this.refreshData(completed)
  }

  protected createNewTask() {
    this.router.navigate(['/task'])
  }

  protected updateTask(form: TaskUpdateForm) {
    this.completeTask(form).pipe(first()).subscribe(task => {
      this.refreshData(null)
    })
  }

  private completeTask(form: TaskUpdateForm) {
    this.loading.set(true)
    return this.tasksService.completeTask(form.id, {completed: form.completed} as Task)
      .pipe(
        catchError((err) => {
          this.error.set('Error when task update.')
          return of()
        }),
        finalize(() => {
          this.loading.set(false)
        })
      )
  }
}
