import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskComponent } from './task.component';
import { TasksService } from '../../services/tasks.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../../models/task';
import {of, throwError} from 'rxjs';

class MockRouter {
  navigate = vi.fn();
}

class MockTasksService {
  findTask = vi.fn();
  createTask = vi.fn();
}

class MockActivatedRoute {
  snapshot = { params: {} };
}

describe('TaskComponent (TestBed)', () => {
  let fixture: ComponentFixture<TaskComponent>;
  let component: TaskComponent;
  let tasksService: MockTasksService;
  let router: MockRouter;
  let activatedRoute: MockActivatedRoute;

  beforeEach(async () => {
    tasksService = new MockTasksService();
    router = new MockRouter();
    activatedRoute = new MockActivatedRoute();

    await TestBed.configureTestingModule({
      imports: [TaskComponent],
      providers: [
        { provide: TasksService, useValue: tasksService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load a task on init when an id is present', () => {
    const task: Task = {
      id: 1,
      label: 'Test task',
      description: 'Desc'
    } as Task;

    activatedRoute.snapshot.params = { id: 1 };
    tasksService.findTask.mockReturnValue(of(task));

    fixture.detectChanges();

    expect(tasksService.findTask).toHaveBeenCalledWith(1);

    expect(component['taskForm'].get('label')?.value).toBe('Test task');
    expect(component['taskForm'].get('description')?.value).toBe('Desc');

    expect(component['taskForm'].disabled).toBe(true);
    expect(component['creationMode']()).toBe(false);
  });

  it('should set error when findTask fails', () => {
    activatedRoute.snapshot.params = { id: 123 };
    tasksService.findTask.mockReturnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();

    expect(component['error']()).toBe('Error when retrieving task.');
    expect(component['loading']()).toBe(false);
  });

  it('should set error if form is invalid on submit', () => {
    component['taskForm'].setValue({ label: '', description: '' });

    component['submit']();

    expect(component['error']()).toBe('The task is not valid.');
    expect(tasksService.createTask).not.toHaveBeenCalled();
  });

  it('should create a task and navigate back', () => {
    const task = {
      label: 'Task1',
      description: 'Desc'
    };

    component['taskForm'].setValue(task);

    tasksService.createTask.mockReturnValue(of(task));

    component['submit']();

    expect(tasksService.createTask).toHaveBeenCalledWith(task);
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should set error on task creation error', () => {
    const task = {
      label: 'a',
      description: 'b'
    };

    component['taskForm'].setValue(task);

    tasksService.createTask.mockReturnValue(
      throwError(() => new Error('fail'))
    );

    component['submit']();

    expect(component['error']()).toBe('Error when task creation.');
  });

  it('should navigate back when back() is called', () => {
    component['back']();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
