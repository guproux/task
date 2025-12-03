import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {

  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterOutlet
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title inside <h1>', () => {
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1');

    expect(h1).toBeTruthy();
    expect(h1.textContent).toContain(component['title']());
  });

  it('should contain a <router-outlet>', () => {
    fixture.detectChanges();

    const outlet = fixture.nativeElement.querySelector('router-outlet');

    expect(outlet).toBeTruthy();
  });
});
