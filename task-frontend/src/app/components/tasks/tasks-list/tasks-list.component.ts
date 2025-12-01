import {Component, inject, Input} from '@angular/core';
import {Task} from '../../../models/task';
import {MatTableModule} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tasks-list',
  imports: [
    MatTableModule,
    MatButton
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent {

  @Input() tasks: Task[] = []

  private router: Router = inject(Router)

  columns: string[] = ['id', 'label', 'completed', 'actions'];

  protected goToDescription(elementId: number) {
    this.router.navigate(['/task', elementId])
  }
}
