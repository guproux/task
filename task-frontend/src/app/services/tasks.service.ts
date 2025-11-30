import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Task} from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TasksService {

  private readonly tasksApiUrl: string;

  constructor(private http: HttpClient) {
    this.tasksApiUrl = '/api/v1/tasks';
  }

  public findTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksApiUrl);
  }
}
