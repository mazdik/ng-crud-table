import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-scroller-demo',
  template: `
  <app-scroller
    #scroller
    [items]="items"
    [virtualScroll]="true"
    [rowHeight]="40"
    [scrollHeight]="500"
    [itemsPerRow]="20"
    (scrollChange)=onScroll($event)>
    <div class="sc-row" *ngFor="let row of scroller.viewRows">{{row}}</div>
  </app-scroller>
  `,
  styles: [`.sc-row {height: 40px;}
  .dt-scroller{width: 200px;}
  `]
})
export class ScrollerDemoComponent {

  items = Array.from({length: 100000}).map((val, i) => `Item #${i}`);

  constructor(private cd: ChangeDetectorRef) {}

  onScroll(event) {
    this.cd.detectChanges();
  }

}
