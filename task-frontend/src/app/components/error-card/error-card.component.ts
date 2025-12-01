import {Component, Input} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
  selector: 'app-error-card',
  imports: [
    MatCard,
    MatCardContent
  ],
  templateUrl: './error-card.component.html',
  styleUrl: './error-card.component.scss',
})
export class ErrorCardComponent {

  @Input() error: string | null = null;

}
