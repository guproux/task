import {Routes} from '@angular/router';
import {TasksContainer} from './components/tasks/tasks.container';
import {TaskComponent} from './components/task/task.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    component: TasksContainer
  },
  {
    path: 'task',
    component: TaskComponent
  },
  {
    path: 'task/:id',
    component: TaskComponent
  }
];
