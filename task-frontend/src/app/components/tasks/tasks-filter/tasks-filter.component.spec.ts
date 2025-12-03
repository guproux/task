import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksFilterComponent } from './tasks-filter.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';

describe('TasksFilterComponent', () => {

  let fixture: ComponentFixture<TasksFilterComponent>;
  let component: TasksFilterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TasksFilterComponent,  // standalone
        MatCheckbox,
        MatButton,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true when completedCheck(true) is called', () => {
    const spy = vi.spyOn(component.onModelChange, 'emit');

    component.completedCheck(true);

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit false when completedCheck(false) is called', () => {
    const spy = vi.spyOn(component.onModelChange, 'emit');

    component.completedCheck(false);

    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should reset completed to false and emit null', () => {
    component.completed = true;

    const spy = vi.spyOn(component.onModelChange, 'emit');

    component.resetFilter();

    expect(component.completed).toBe(false);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('should emit true when checkbox is checked in the template', () => {
    const spy = vi.spyOn(component.onModelChange, 'emit');

    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');

    checkbox.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit null when clicking Reset button', () => {
    const spy = vi.spyOn(component.onModelChange, 'emit');

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(null);
  });

});
