import {
  Component, OnInit, Input, HostBinding, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import {DataTable, ColumnResizeMode, Row} from '../../base';
import {Subscription} from 'rxjs';
import {RowGroupTemplateDirective} from '../../directives/row-group-template.directive';

@Component({
  selector: 'dt-body-group-row',
  templateUrl: './body-group-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyGroupRowComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() row: Row;
  @Input() rowGroupTemplate: RowGroupTemplateDirective;

  private subscriptions: Subscription[] = [];

  @HostBinding('class') cssClass = 'datatable-body-row datatable-group-header';

  @HostBinding('attr.role') role = 'row';

  @HostBinding('style.height.px')
  get rowHeight(): number {
    return this.table.dimensions.rowHeight;
  }

  @HostBinding('style.width.px')
  get rowWidth(): number {
    return this.table.dimensions.columnsTotalWidth;
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.table.settings.columnResizeMode === ColumnResizeMode.Aminated) {
      const subColumnResize = this.table.events.resizeSource$.subscribe(() => {
        this.cd.markForCheck();
      });
      this.subscriptions.push(subColumnResize);
    }
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subRows = this.table.events.rowsChanged$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subRows);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
