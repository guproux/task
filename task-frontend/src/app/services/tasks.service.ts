import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Task} from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TasksService {

  private readonly tasksApiUrl: string

  constructor(private http: HttpClient) {
    this.tasksApiUrl = '/api/v1/tasks'
  }

  public findTasks(completed: boolean | null): Observable<Task[]> {
    let httpParams = new HttpParams()
    if (completed != null) {
      httpParams = httpParams.set('completed', completed)
    }

    return this.http.get<Task[]>(this.tasksApiUrl, { params: httpParams})
  }
}
