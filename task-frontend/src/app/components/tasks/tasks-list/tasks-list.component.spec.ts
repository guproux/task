import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksListComponent } from './tasks-list.component';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { vi } from 'vitest';

describe('TasksListComponent', () => {

  let fixture: ComponentFixture<TasksListComponent>;
  let component: TasksListComponent;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  const mockTasks = [
    { id: 1, label: 'Task A', description: 'Desc A', completed: false },
    { id: 2, label: 'Task B', description: 'Desc B', completed: true },
  ];

  beforeEach(async () => {
    routerSpy = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [
        TasksListComponent,
        MatTableModule,
        MatCheckboxModule,
        MatButtonModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksListComponent);
    component = fixture.componentInstance;
    component.tasks = mockTasks;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onComplete with the correct form', () => {
    const spy = vi.spyOn(component.onComplete, 'emit');

    component['updateTask'](1, true);

    expect(spy).toHaveBeenCalledWith({
      id: 1,
      completed: true
    });
  });

  it('should emit onComplete when checkbox is clicked', () => {
    const spy = vi.spyOn(component.onComplete, 'emit');

    const checkboxInput: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="checkbox"]');

    checkboxInput.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      id: 1,
      completed: true
    });
  });

  it('should navigate to /task/:id when clicking button', () => {
    const button = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/task', 1]);
  });

  it('should navigate correctly when calling goToDescription()', () => {
    component['goToDescription'](2);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/task', 2]);
  });

});
