import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from 'ng-mazdik-lib';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-summary-row-demo',
  template: `
    <app-data-table [table]="table"></app-data-table>
  `
})

export class SummaryRowDemoComponent implements OnInit {

  table: DataTable;
  columns: Column[];
  settings: Settings = new Settings({});

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    this.columns.splice(17);

    this.columns[1].title += ' (count)';
    this.columns[5].title += ' (sum)';
    this.columns[14].title += ' (min)';
    this.columns[15].title += ' (max)';
    this.columns[16].title += ' (average)';

    this.columns[1].aggregation = 'count';
    this.columns[5].aggregation = 'sum';
    this.columns[14].aggregation = 'min';
    this.columns[15].aggregation = 'max';
    this.columns[16].aggregation = 'average';

    this.columns.splice(6, 8);
    this.table = new DataTable(this.columns, this.settings);
    this.table.pager.perPage = 50;
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get<any[]>('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

}
