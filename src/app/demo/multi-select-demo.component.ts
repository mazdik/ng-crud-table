import {Component, OnInit, ViewChild, TemplateRef, OnDestroy, ViewEncapsulation, HostListener, ElementRef} from '@angular/core';
import {Column, CdtSettings, DataManager, CellEventType, SelectItem, EventHelper, findAncestor} from 'ng-mazdik-lib';
import {DemoService} from './demo.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-multi-select-demo',
  template: `
  <div class="multi-select-demo-block">
    <div class="dt-dropdown-select-list" [ngStyle]="getSelectListStyles()">
      <app-select-list
          [options]="options"
          [selected]="selectedOptions"
          [multiple]="true"
          [isOpen]="isOpen"
          [selectAllMessage]="'select all'"
          [cancelMessage]="'cancel'"
          [clearMessage]="'clear'"
          [searchMessage]="'search'"
          (selectionChange)="onSelectionChange($event)"
          (selectionCancel)="onSelectionCancel()">
      </app-select-list>
    </div>
    <app-crud-table class="multi-select-demo" [dataManager]="dataManager"></app-crud-table>
  </div>
    <ng-template #cellTemplate let-rowIndex="rowIndex" let-value="value" let-column="column">
      <span class="view-data" *ngIf="!editing[rowIndex]">
        {{value}}
      </span>
      <div class="dt-dropdown-select">
        <div class="dt-input-group" *ngIf="editing[rowIndex]" (click)="open($event, value)">
          <input class="dt-input dt-select-input"
            readonly="readonly"
            value="{{selectedName}}"
            placeholder="Select">
          <button class="dt-button dt-white">
            <i class="dt-icon asc" *ngIf="isOpen"></i>
            <i class="dt-icon desc" *ngIf="!isOpen"></i>
          </button>
        </div>
      </div>
    </ng-template>
    <ng-template #formTemplate let-value="value" let-column="column">
      <app-dropdown-select
        class="dt-dropdown-select-fixed"
        [multiple]="true"
        [options]="options"
        [value]="value"
        (valueChange)="onFormValueChange(column, $event)">
      </app-dropdown-select>
    </ng-template>
  `,
  styles: [
    `.multi-select-demo {width: 600px;}
    .multi-select-demo .datatable-body-cell {padding: 0; margin: 0;}
    .multi-select-demo .datatable-body-cell > .cell-data,
    .multi-select-demo .datatable-body-cell > span:first-child {padding: 4px 3px;}
    .multi-select-demo-block {position: relative;}
    .multi-select-demo-block .dt-dropdown-select-list {width: 250px;}
    .dt-dropdown-select {
      display: block;
      position: relative;
      width: 100%;
    }
    .dt-dropdown-select-list {
      position: absolute;
      width: 100%;
      z-index: 2;
      padding: 5px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 2px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    }
    .dt-dropdown-select .dt-input-group input:not([disabled]) {
      cursor: pointer;
    }
    input.dt-select-input[readonly]:not([disabled]) {
      background-color: white;
    }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})

export class MultiSelectDemoComponent implements OnInit, OnDestroy {

  @ViewChild('cellTemplate', {static: true}) cellTemplate: TemplateRef<any>;
  @ViewChild('formTemplate', {static: true}) formTemplate: TemplateRef<any>;

  columns: Column[] = [
    { title: 'Id', name: 'id' },
    { title: 'Name', name: 'name' },
    { title: 'Test', name: 'test', width: 250 }
  ];
  dataManager: DataManager;
  settings: CdtSettings = new CdtSettings({
    crud: true,
  });

  options: SelectItem[] = [
    {id: 1, name: 'Select 1'},
    {id: 2, name: 'Select 2'},
    {id: 3, name: 'Select 3'},
    {id: 4, name: 'Select 4'},
  ];
  column: Column;
  editing = {};
  left: number;
  top: number;
  isOpen = false;
  selectedRowIndex: number;
  selectedColumnIndex: number;
  selectedOptions: SelectItem[] = [];
  selectedName: string;

  private subscriptions: Subscription[] = [];

  constructor(private service: DemoService, private element: ElementRef) {
    this.dataManager = new DataManager(this.columns, this.settings, this.service);
  }

  ngOnInit() {
    this.column = this.dataManager.columns.find(x => x.name === 'test');
    this.column.cellTemplate = this.cellTemplate;
    this.column.formTemplate = this.formTemplate;

    const subCell = this.dataManager.events.cellSource$.subscribe((data) => {
      if (data.type === CellEventType.Click && data.columnIndex === 3) {
        Object.keys(this.editing).forEach(x => this.editing[x] = false);
        this.editing[data.rowIndex] = true;
        this.selectedRowIndex = data.rowIndex;
        this.selectedColumnIndex = data.columnIndex;
        this.isOpen = false;
        this.selectedName = this.getName(this.dataManager.rows[this.selectedRowIndex][this.column.name]);
      }
    });
    this.subscriptions.push(subCell);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('document:click', ['$event'])
  onWindowResize(event: MouseEvent): void {
    const cellElement = findAncestor(event.target, '.datatable-body-cell');
    const rowIndex = cellElement ? parseInt(cellElement.dataset.rowIndex, 10) : -1;
    const colIndex = cellElement ? parseInt(cellElement.dataset.columnIndex, 10) : -1;
    if (rowIndex !== this.selectedRowIndex || colIndex !== this.selectedColumnIndex) {
      const listElement = findAncestor(event.target, '.dt-dropdown-select-list');
      if (!listElement) {
        this.isOpen = false;
        this.editing = {};
        this.dataManager.events.onSelectionChange();
      }
    }
  }

  onFormValueChange(column: Column, value: any) {
    this.dataManager.item[column.name] = value;
  }

  getSelectListStyles() {
    return {
      display: (this.isOpen) ? 'block' : 'none',
      left: this.left + 'px',
      top: this.top + 'px',
    };
  }

  open(event: MouseEvent, value: any) {
    const pos = EventHelper.getRowPosition(event, this.dataManager.settings.virtualScroll);
    this.left = pos.left;
    this.top = pos.top;

    this.selectedOptions = value || [];
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  onSelectionChange(event) {
    this.selectedName = this.getName(event);
    this.dataManager.rows[this.selectedRowIndex][this.column.name] = event;
    this.isOpen = false;
  }

  onSelectionCancel() {
    this.isOpen = false;
  }

  getName(items: any) {
    if (items && items.length && this.options && this.options.length) {
      if (items.length > 1) {
        return items.length + ' items selected';
      } else {
        const option = this.options.find((x) => x.id === items[0]);
        return (option) ? option.name : '';
      }
    }
  }

}
