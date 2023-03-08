import { Component, Input, OnInit } from '@angular/core';
import { Item, Header } from 'src/app/app-interfaces';

@Component({
  selector: 'app-displayed-line',
  templateUrl: './displayed-line.component.html',
  styleUrls: ['./displayed-line.component.css'],
})
export class DisplayedLineComponent {
  @Input() line!: Item;
  @Input() headers: Header[] = [];
  @Input() totalPrice: number = 0;

  // Allows to read parametrically the property of an Item
  getPropertyValue(item: Item, header: Header): any {
    type ObjectKey = keyof typeof item;
    return item[header.name as ObjectKey];
  }
}
