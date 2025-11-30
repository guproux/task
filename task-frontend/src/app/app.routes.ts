import {Routes} from '@angular/router';
import {TasksContainer} from './components/tasks/tasks.container';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    component: TasksContainer
  }
];
