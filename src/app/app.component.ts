import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angularquotation';
  totalPrice: number = 0;
  @Input('totalPriceUpdated') totalPriceUpdated: number = 0;
  transmitTotalPrice(event: number) {
    this.totalPrice = event;
  }
}
