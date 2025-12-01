import {Component, inject, OnInit} from '@angular/core';
import {Task} from '../../models/task';
import {TasksService} from '../../services/tasks.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
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
class TaskComponent implements OnInit {

  private router: Router = inject(Router)
  private tasksService: TasksService = inject(TasksService)
  private route: ActivatedRoute = inject(ActivatedRoute)

  protected loading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  protected error: BehaviorSubject<string> = new BehaviorSubject('')
  protected creationMode: BehaviorSubject<boolean> = new BehaviorSubject(true)

  protected taskForm = new FormGroup({
    label: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  ngOnInit() {
    const id = this.route.snapshot.params['id']
    if (!!id) {
      this.findTaskById(id).pipe(first()).subscribe(task => {
        this.taskForm.patchValue({
          label: task.label,
          description: task.description,
        })

        this.taskForm.disable()
        this.creationMode.next(false)
      })
    }
  }

  private findTaskById(id: number) {
    this.loading.next(true)
    return this.tasksService.findTask(id)
      .pipe(
        catchError((err) => {
          this.error.next('Error when retrieving task.')
          return of()
        }),
        finalize(() => {
          this.loading.next(false)
        })
      )
  }

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
          this.error.next('Error when task creation.')
          return of()
        }),
        finalize(() => {
          this.loading.next(false)
        })
      )
  }
}

export default TaskComponent
