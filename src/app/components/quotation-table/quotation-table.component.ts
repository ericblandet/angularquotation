import { Component, OnInit } from '@angular/core';

import { Line, Item, SubGroup, MainGroup } from '../../app-interfaces';

import { MainGroupService } from '../../services/main-group.service';
import { SubGroupService } from '../../services/sub-group.service';
import { ItemService } from '../../services/item.service';

import { headers } from './headers';

@Component({
  selector: 'app-quotation-table',
  templateUrl: './quotation-table.component.html',
  styleUrls: ['./quotation-table.component.css'],
})
export class QuotationTableComponent implements OnInit {
  items: Item[] = [];
  subGroups: SubGroup[] = [];
  mainGroups: MainGroup[] = [];
  lines: Line[] = [];
  id_counter = 0;

  headers = headers;
  constructor(
    private itemService: ItemService,
    private subGroupService: SubGroupService,
    private MainGroupService: MainGroupService
  ) {}

  ngOnInit(): void {
    this.MainGroupService.getMainGroups().subscribe((res) => {
      this.mainGroups = res;
      this.subGroupService.getSubGroups().subscribe((res) => {
        this.subGroups = res;
        this.itemService.getItems().subscribe((res) => {
          this.items = res;
          this.createData();
        });
      });
    });
    console.log(this.mainGroups, this.subGroups, this.items);
  }

  getSubGroups(mainGroup: MainGroup) {
    const filteredSubgroups = this.subGroups.filter((el) => {
      return mainGroup['subGroupIds'].includes(el.id);
    });
    return filteredSubgroups;
  }
  getItems(subGroup: SubGroup) {
    return this.items.filter((el) => {
      subGroup['itemIds'].includes(el.id);
    });
  }

  createData() {
    this.mainGroups.forEach((mainGroup) => {
      this.lines.push(this.serializeToLine(mainGroup));
      const subGroups = this.subGroups.filter((subGroup) => {
        return mainGroup['subGroupIds'].includes(subGroup.id);
      });
      subGroups.forEach((subGroup) => {
        this.lines.push(this.serializeToLine(subGroup));
        const items = this.items.filter((item) => {
          return subGroup['itemIds'].includes(item.id);
        });

        items.forEach((item) => {
          this.lines.push(this.serializeToLine(item));
        });
      });
    });
    console.log(this.lines);
  }

  serializeToLine(obj: any): Line {
    this.id_counter += 1;

    return {
      id: this.id_counter.toString(),
      description: obj.description ?? null,
      quantity: obj.quantity ?? null,
      unit: obj.unit ?? null,
      unitPrice: obj.unitPrice ?? null,
      totalPrice: obj.totalPrice ?? null,
      type: obj.type,
      sort: this.id_counter.toString(),
    };
  }
}
