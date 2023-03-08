import { Component, OnInit } from '@angular/core';

import { Item, Header } from '../../app-interfaces';

import { ItemService } from '../../services/item.service';

import { headers } from './headers';

@Component({
  selector: 'app-quotation-table',
  templateUrl: './quotation-table.component.html',
  styleUrls: ['./quotation-table.component.css'],
})
export class QuotationTableComponent implements OnInit {
  // Headers we want to display
  headers: Header[] = headers;
  // raw Items served from the DB
  rawItems: Item[] = [];
  // Lines that we will display
  lines: Item[] = [];
  idCounter: number = 0;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getItems().subscribe((res) => {
      this.rawItems = res;
      this.createLines(this.rawItems[0]);
    });
  }

  // Recursively create the lines we want to display
  createLines(node: Item): void {
    if (node.type !== 'root') {
      this.lines.push(node);
    }

    if (node.childrenIds) {
      node.childrenIds.forEach((childNodeId) => {
        const childNode = this.rawItems.find((item) => {
          return item.id === childNodeId;
        });

        if (childNode) {
          this.idCounter = Math.max(this.idCounter, parseInt(childNode.id));
          this.createLines(childNode);
        }
      });
    }
  }

  getSubGroupParentId(clickedLine: Item): any {
    if (clickedLine.type === 'mainGroup') {
      return clickedLine.id;
    } else if (clickedLine.type === 'subGroup') {
      return clickedLine.parentId;
    } else {
      const parent = this.lines.find((line) => {
        return line.id === clickedLine.parentId;
      });
      // TODO : deal with this error !
      if (!parent) {
        return 'ERROR';
      }
      return parent.parentId;
    }
  }

  getQuotationLineParentId(clickedLine: Item): any {
    if (clickedLine.type === 'quotationLine') {
      return clickedLine.parentId;
    }
    return clickedLine.id;
  }

  addLine(clickedLine: Item, type: string): void {
    this.idCounter += 1;

    let parentId =
      type == 'quotationLine'
        ? this.getQuotationLineParentId(clickedLine)
        : type == 'subGroup'
        ? this.getSubGroupParentId(clickedLine)
        : '1';

    const newLine: Item = {
      id: this.idCounter.toString(),
      description: '',
      type: type,
      quantity: type === 'quotationLine' ? 0 : undefined,
      unit: type === 'quotationLine' ? '' : undefined,
      unitPrice: type === 'quotationLine' ? 0 : undefined,
      totalPrice: 0,
      childrenIds: type === 'quotationLine' ? undefined : [],
      parentId: parentId,
    };
    this.addItemToParent(newLine);
    this.rawItems.push(newLine);
    this.lines = [];
    this.createLines(this.rawItems[0]);
    console.log(this.lines);
  }

  addItemToParent(newLine: Item) {
    const parentIdx = this.rawItems.findIndex((line) => {
      return line.id === newLine.parentId;
    });
    this.rawItems[parentIdx].childrenIds?.push(newLine.id);
  }

  //recursive method to compute the total price on each line
  getTotalPrice(line: Item) {
    if (line.quantity && line.unitPrice) {
      return line.quantity * line.unitPrice;
    }
    if (line.childrenIds) {
      let sum = 0;
      line.childrenIds.forEach((childId) => {
        const child = this.lines.find((line) => {
          return line.id === childId;
        });
        if (child) {
          sum += this.getTotalPrice(child);
        }
      });
      return sum;
    } else {
      return 0;
    }
  }
}
