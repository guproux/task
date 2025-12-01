import {Component, inject} from '@angular/core';
import {Task} from '../../models/task';
import {TasksService} from '../../services/tasks.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BehaviorSubject, catchError, finalize, first, of} from 'rxjs';
import {ErrorCardComponent} from '../error-card/error-card.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-task.component',
  imports: [
    MatIconButton,
    MatIcon,
    ReactiveFormsModule,
    ErrorCardComponent,
    MatButton,
    AsyncPipe
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {

  private router: Router = inject(Router)
  private tasksService: TasksService = inject(TasksService)

  protected task: Task = {} as Task
  protected loading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  protected error: BehaviorSubject<string> = new BehaviorSubject('')

  taskForm = new FormGroup({
    label: new FormControl(this.task.label, Validators.required),
    description: new FormControl(this.task.description, Validators.required),
  });

  protected submit() {
    if (this.taskForm.valid) {
      const task = this.taskForm.getRawValue() as Task
      this.createTask(task).pipe(first()).subscribe(task => {
        this.back()
      })
    } else {
      this.error.next('The task is not valid.')
    }
  }

  protected back() {
    this.router.navigate(['/tasks'])
  }

  private createTask(task: Task) {
    this.loading.next(true)
    return this.tasksService.createTask(task)
      .pipe(
        catchError((err) => {
          this.error.next('Error during task creation.')
          console.log(this.error)
          return of()
        }),
        finalize(() => {
          this.loading.next(false)
        })
      )
  }
}
