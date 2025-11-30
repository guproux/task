import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksFilter } from './tasks-filter';

describe('TasksFilter', () => {
  let component: TasksFilter;
  let fixture: ComponentFixture<TasksFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
