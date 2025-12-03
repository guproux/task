import {Component, inject, OnInit, signal} from '@angular/core';
import {Task} from '../../models/task';
import {TasksService} from '../../services/tasks.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, finalize, first, of} from 'rxjs';
import {ErrorCardComponent} from '../error-card/error-card.component';

@Component({
  selector: 'app-task.component',
  imports: [
    MatIconButton,
    MatIcon,
    ReactiveFormsModule,
    ErrorCardComponent,
    MatButton
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {

  private router: Router = inject(Router)
  private tasksService: TasksService = inject(TasksService)
  private route: ActivatedRoute = inject(ActivatedRoute)

  protected loading = signal(false)
  protected error = signal('')
  protected creationMode = signal(true)

  protected taskForm = new FormGroup({
    label: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  ngOnInit() {
    const id = this.route.snapshot.params['id']
    if (!!id) {
      this.findTaskById(id).subscribe(task => {
        this.taskForm.patchValue({
          label: task.label,
          description: task.description,
        })

        this.taskForm.disable()
        this.creationMode.set(false)
      })
    }
  }

  private findTaskById(id: number) {
    this.loading.set(true)
    return this.tasksService.findTask(id)
      .pipe(
        catchError((err) => {
          this.error.set('Error when retrieving task.')
          return of()
        }),
        finalize(() => {
          this.loading.set(false)
        })
      )
  }

  protected submit() {
    if (this.taskForm.valid) {
      const task = this.taskForm.getRawValue() as Task
      this.createTask(task).subscribe(task => {
        this.back()
      })
    } else {
      this.error.set('The task is not valid.')
    }
  }

  protected back() {
    this.router.navigate(['/tasks'])
  }

  private createTask(task: Task) {
    this.loading.set(true)
    return this.tasksService.createTask(task)
      .pipe(
        catchError((err) => {
          this.error.set('Error when task creation.')
          return of()
        }),
        finalize(() => {
          this.loading.set(false)
        })
      )
  }
}
