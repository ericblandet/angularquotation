import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-card-total',
  templateUrl: './card-total.component.html',
  styleUrls: ['./card-total.component.css'],
})
export class CardTotalComponent {
  @Input() totalPrice: number = 0;

  VATrate = 0.077;
  computeTotalPrice() {
    return this.totalPrice.toFixed(2);
  }
  computeVAT() {
    return (this.totalPrice * this.VATrate).toFixed(2);
  }
  computeTotalPriceVATIncluded() {
    return Math.round(this.totalPrice * (this.VATrate + 1)).toFixed(2);
  }
}
