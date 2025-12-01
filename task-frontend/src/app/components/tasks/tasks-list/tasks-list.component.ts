import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Task} from '../../../models/task';
import {MatTableModule} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {MatCheckbox} from '@angular/material/checkbox';
import {TaskUpdateForm} from '../../../models/task-update-form';

@Component({
  selector: 'app-tasks-list',
  imports: [
    MatTableModule,
    MatButton,
    MatCheckbox
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent {

  @Input() tasks: Task[] = []

  @Output() onComplete: EventEmitter<TaskUpdateForm> = new EventEmitter()

  private router: Router = inject(Router)

  protected columns: string[] = ['id', 'label', 'completed', 'actions'];

  protected goToDescription(elementId: number) {
    this.router.navigate(['/task', elementId])
  }

  protected updateTask(id: number, completed: boolean) {
    const form = {
      id: id,
      completed: completed
    }
    this.onComplete.emit(form)
  }
}
