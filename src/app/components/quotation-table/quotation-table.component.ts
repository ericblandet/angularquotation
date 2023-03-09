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
  displayedColumns: string[] = this.headers.map((el) => {
    return el.name;
  });
  //test :
  plop = JSON.parse(
    JSON.stringify([
      {
        id: '2',
        description: 'BlackCrows Mirus Cor 173',
        quantity: '1',
        unit: 'pcs',
        unitPrice: '950',
        totalPrice: '950',
        type: 'quotationLine',
        parentId: '7',
      },
      {
        id: '3',
        description: 'Marker Griffon, dark blue',
        quantity: '1',
        unit: 'pcs',
        unitPrice: '350',
        totalPrice: '350',
        type: 'quotationLine',
        parentId: '7',
      },
      {
        id: '4',
        description: 'Montage des fixations',
        quantity: '1',
        unit: 'forfait',
        unitPrice: '80',
        totalPrice: '80',
        type: 'quotationLine',
        parentId: '8',
      },
      {
        id: '5',
        description: 'Déplacement',
        quantity: '2',
        unit: 'forfait',
        unitPrice: '100',
        totalPrice: '100',
        type: 'quotationLine',
        parentId: '9',
      },
      {
        id: '6',
        description: 'Cours de ski',
        quantity: '6',
        unit: 'h',
        unitPrice: '120',
        totalPrice: '720',
        type: 'quotationLine',
        parentId: '9',
      },
      {
        id: '7',
        description: 'Matériel',
        childrenIds: ['12', '2', '3'],
        type: 'subGroup',
        parentId: '10',
      },
      {
        id: '8',
        description: "Main d'oeuvre",
        childrenIds: ['4'],
        type: 'subGroup',
        parentId: '10',
      },
      {
        id: '9',
        description: "Main d'oeuvre",
        childrenIds: ['5', '6'],
        type: 'subGroup',
        parentId: '11',
      },
      {
        id: '10',
        description: 'Matériel',
        childrenIds: ['7', '8'],
        type: 'mainGroup',
      },
      {
        id: '11',
        description: 'Accompagnement',
        childrenIds: ['5', '6'],
        type: 'mainGroup',
      },
      {
        id: '12',
        description: 'Nordica unlimited Dyn 130, 25.5',
        quantity: '1',
        unit: 'pcs',
        unitPrice: '700',
        totalPrice: '700',
        type: 'quotationLine',
        parentId: '7',
      },
    ])
  );

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

  // Allows to read parametrically the property of an Item
  getPropertyValue(item: Item, header: Header): any {
    type ObjectKey = keyof typeof item;
    return item[header.name as ObjectKey];
  }
  getPropertyValue2(item: Item, column: string): any {
    type ObjectKey = keyof typeof item;
    return item[column as ObjectKey];
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
