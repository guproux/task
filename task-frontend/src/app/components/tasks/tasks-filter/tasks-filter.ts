import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-tasks-filter',
  imports: [
    MatCheckbox,
    MatButton
  ],
  templateUrl: './tasks-filter.html',
  styleUrl: './tasks-filter.scss',
})
export class TasksFilter {

  @Output() onModelChange: EventEmitter<boolean|null> = new EventEmitter()

  completed: boolean = false

  completedCheck(checked: boolean) {
    this.onModelChange.emit(checked)
  }

  resetFilter() {
    this.completed = false
    this.onModelChange.emit(null)
  }
}
