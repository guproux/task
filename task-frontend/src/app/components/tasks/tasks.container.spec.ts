import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksContainer } from './tasks.container';
import { TasksService } from '../../services/tasks.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

const tasksMock = [
  { id: 1, label: 'A', description: 'D1', completed: false },
  { id: 2, label: 'B', description: 'D2', completed: true },
];

class MockTasksService {
  findTasks = vi.fn().mockReturnValue(of(tasksMock))
  completeTask = vi.fn().mockReturnValue(of({ id: 1, completed: true }))
}

class MockRouter {
  navigate = vi.fn();
}

describe('TasksContainer', () => {

  let fixture: ComponentFixture<TasksContainer>;
  let component: TasksContainer;
  let tasksService: MockTasksService;
  let router: MockRouter;

  beforeEach(async () => {
    tasksService = new MockTasksService();
    router = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [TasksContainer],
      providers: [
        { provide: TasksService, useValue: tasksService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call refreshData(null) on init', () => {
    expect(tasksService.findTasks).toHaveBeenCalledWith(null);
    expect(component['tasks']()).toEqual(tasksMock);
  });

  it('should display spinner when loading = true', () => {
    component['loading'].set(true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should show error card when error is set', () => {
    component['error'].set('Error message');
    component['loading'].set(false);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('app-error-card');
    expect(card).toBeTruthy();
  });

  it('should show tasks list when neither loading nor error', () => {
    component['loading'].set(false);
    component['error'].set('');
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('app-tasks-list');
    expect(list).toBeTruthy();
  });

  it('should refresh data when filter emits a value', () => {
    const spy = vi.spyOn<any, any>(component, 'refreshData');

    component['updateTasksList'](true);

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should call completeTask() and refreshData(null)', () => {
    const refreshSpy = vi.spyOn<any, any>(component, 'refreshData');
    const completeSpy = vi.spyOn<any, any>(component, 'completeTask');

    const form = { id: 3, completed: true };

    component['updateTask'](form);

    expect(completeSpy).toHaveBeenCalledWith(form);
    expect(refreshSpy).toHaveBeenCalledWith(null);
  });

  it('should set error and stop loading if getTasks() fails', () => {
    tasksService.findTasks.mockReturnValueOnce(throwError(() => new Error('fail')));

    component['getTasks'](null).subscribe();

    expect(component['error']()).toBe('Error when tasks search.');
    expect(component['loading']()).toBe(false);
  });

  it('should set error and stop loading if completeTask() fails', () => {
    tasksService.completeTask.mockReturnValueOnce(throwError(() => new Error('fail')));

    component['completeTask']({ id: 1, completed: true }).subscribe();

    expect(component['error']()).toBe('Error when task update.');
    expect(component['loading']()).toBe(false);
  });

});
