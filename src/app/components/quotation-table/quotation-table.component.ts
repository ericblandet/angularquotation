import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Item, Quote } from '../../app-interfaces';
import { ItemService } from '../../services/item.service';
import { headers } from './headers';

import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Subscription, filter, fromEvent, take } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { defaultQuote } from './default-quote';

@Component({
  selector: 'app-quotation-table',
  templateUrl: './quotation-table.component.html',
  styleUrls: ['./quotation-table.component.css'],
})
export class QuotationTableComponent implements OnInit {
  quoteId: string = '1';
  rawItems: Item[] = []; // raw Items served from the DB

  dataToDisplay: Item[] = []; // Lines that we will display
  dataSource: any;
  formArray!: FormArray;

  idCounter: number = 0;
  displayedColumns: string[] = headers.map((el) => {
    return el.name;
  });

  // Context Menu variables
  overlayRef: OverlayRef | null | undefined;
  sub!: Subscription;

  @Output() totalPriceUpdated = new EventEmitter<number>();

  @ViewChild('rowMenu') rowMenu!: TemplateRef<any>;

  constructor(
    private itemService: ItemService,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.itemService.getQuote(this.quoteId).subscribe((res: Quote) => {
      let rootElement = this.getRootElement(res?.items);

      if (!rootElement || !res.items[0].childrenIds.length) {
        this.rawItems = defaultQuote(this.quoteId).items;
        rootElement = this.getRootElement(this.rawItems);
      } else {
        this.rawItems = res.items;
      }
      this.populateLines(rootElement, this.rawItems);
      this.prepareDataSource(this.dataToDisplay);
    });
  }

  // * ------------------------------------------------
  // * Retrieving data from DB
  // * ------------------------------------------------

  // return root element of a quote.
  // it should always have type= root and be unique
  getRootElement(items: Item[] | null): Item | null {
    if (items) {
      const roots = items.filter((x) => {
        return x.type === 'root';
      });

      if (roots.length === 1) {
        return roots[0];
      }
    }
    return null;
  }

  //recursively sort items
  populateLines(node: any, tree: Item[]) {
    this.dataToDisplay.push(node);
    if (node?.childrenIds?.length) {
      node.childrenIds.forEach((childNodeId: any) => {
        const childNode = tree.find((item) => {
          return item.id === childNodeId;
        });

        if (childNode) {
          this.idCounter = Math.max(this.idCounter, parseInt(childNode.id));
          this.populateLines(childNode, tree);
        }
      });
    }
  }
  // Recursively create the lines we want to display
  prepareDataSource(source: any): void {
    this.formArray = new FormArray(
      source.map((x: any) => this.createFormGroup(x))
    );
    this.dataSource = new MatTableDataSource(this.formArray.controls);
  }

  createFormGroup(data: Item) {
    return new FormGroup({
      id: new FormControl(data.id),
      type: new FormControl(data.type),
      description: new FormControl(data.description),
      quantity: new FormControl(data.quantity),
      unit: new FormControl(data.unit),
      unitPrice: new FormControl(data.unitPrice),
      totalPrice: new FormControl(data.totalPrice),
      childrenIds: new FormControl(data.childrenIds),
      parentId: new FormControl(data.parentId),
    });
  }

  // * ------------------------------------------------
  // * Dynamic styling
  // * ------------------------------------------------

  getPrependIcon(formGroup: FormGroup): string {
    switch (formGroup.value.type) {
      case 'mainGroup':
        return 'home';
      case 'subGroup':
        return 'east';
      case 'quotationLine':
        return 'south_east';
      default:
        return '';
    }
  }

  getRowClass(formGroup: FormGroup): string {
    return `row-${formGroup.value.type} row-items`;
  }

  // * ------------------------------------------------
  // * Computing the prices
  // * ------------------------------------------------

  getTotalPriceForLine(element: Item, idx: number) {
    const totalForLine = this.computeTotalPrice(element);
    if (this.formArray.at(idx)?.value?.totalPrice) {
      this.formArray.at(idx).value.totalPrice = totalForLine;
    }

    if (element.type === 'root') {
      this.totalPriceUpdated.emit(totalForLine);
    }
    return totalForLine;
  }

  //recursive method to compute the total price on each line
  computeTotalPrice(element: Item) {
    if (element.quantity && element.unitPrice) {
      return element.quantity * element.unitPrice;
    }
    if (element.childrenIds.length > 0) {
      let sum = 0;
      element.childrenIds.forEach((childId: string) => {
        const child = this.formArray.value.find((el: Item) => {
          return el.id === childId;
        });
        if (child) {
          sum += this.computeTotalPrice(child);
        }
      });
      return sum;
    } else {
      return 0;
    }
  }

  // * ------------------------------------------------
  // * INSERT AND REMOVE LINES
  // * ------------------------------------------------

  addLine(clickedLine: Item, type: string): void {
    this.idCounter += 1;

    let parentId =
      type == 'quotationLine'
        ? this.getQuotationLineParentId(clickedLine)
        : type == 'subGroup'
        ? this.getSubGroupParentId(clickedLine)
        : '1';

    const newFormGroup = new FormGroup({
      id: new FormControl(this.idCounter.toString()),
      type: new FormControl(type),
      description: new FormControl(''),
      quantity: new FormControl(type === 'quotationLine' ? 0 : null),
      unit: new FormControl(type === 'quotationLine' ? '' : null),
      unitPrice: new FormControl(type === 'quotationLine' ? 0 : null),
      totalPrice: new FormControl(0),
      childrenIds: new FormControl([]),
      parentId: new FormControl(parentId),
    });

    this.addItemToParent(newFormGroup);
    this.formArray.push(newFormGroup);

    this.resetDataSource();
  }

  resetDataSource(): void {
    this.idCounter = 0;
    this.dataToDisplay = [];
    this.populateLines(
      this.getRootElement(this.formArray.value),
      this.formArray.value
    );
    this.prepareDataSource(this.dataToDisplay);
    this.dataSource = new MatTableDataSource(this.formArray.controls);
  }

  getParentIdx(newFormGroup: FormGroup): number {
    return this.formArray.value.findIndex((formGroup: Item) => {
      return formGroup.id === newFormGroup.value.parentId;
    });
  }

  addItemToParent(newFormGroup: FormGroup) {
    const parentIdx = this.getParentIdx(newFormGroup);
    const parent = this.formArray.at(parentIdx);
    parent.value.childrenIds.push(newFormGroup.value.id);
    this.formArray.setControl(parentIdx, parent, { emitEvent: false });
  }

  getSubGroupParentId(clickedLine: Item): any {
    if (clickedLine.type === 'mainGroup') {
      return clickedLine.id;
    } else if (clickedLine.type === 'subGroup') {
      return clickedLine.parentId;
    } else {
      const parent = this.formArray.value.find((line: Item) => {
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

  // remove line from parent-childrenIds array
  // remove from FormArray
  deleteLine(clickedLine: Item) {
    if (clickedLine.childrenIds.length) {
      alert(
        "Vous ne pouvez supprimer cette ligne, car elle a des lignes dépendantes. Supprimez d'abord les lignes qui en dépendent."
      );
      return;
    }

    const parentIdx = this.formArray.value.findIndex((el: Item) => {
      return el.id === clickedLine.parentId;
    });
    const lineIdxInChildrenArray = this.formArray
      .at(parentIdx)
      .value.childrenIds.indexOf(clickedLine.id);
    this.formArray
      .at(parentIdx)
      .value.childrenIds.splice(lineIdxInChildrenArray, 1);

    const toDeleteIdx = this.formArray.value.findIndex((x: Item) => {
      return x.id === clickedLine.id;
    });
    this.formArray.removeAt(toDeleteIdx);

    this.resetDataSource();
  }
  saveQuotation() {
    this.itemService
      .updateQuote(this.quoteId, this.formArray.value)
      .subscribe((res) => {
        alert(
          `Votre Devis a bien été sauvegardé en base de données, sous l'id=${res.id}`
        );
      });
  }

  // * ------------------------------------------------
  // * CONTEXT MENU
  // * ------------------------------------------------

  open({ x, y }: MouseEvent, row: any) {
    this.close();
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.overlayRef.attach(
      new TemplatePortal(this.rowMenu, this.viewContainerRef, {
        $implicit: row,
      })
    );

    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter((event) => {
          const clickTarget = event.target as HTMLElement;
          return (
            !!this.overlayRef &&
            !this.overlayRef.overlayElement.contains(clickTarget)
          );
        }),
        take(1)
      )
      .subscribe(() => this.close());
  }

  close() {
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
