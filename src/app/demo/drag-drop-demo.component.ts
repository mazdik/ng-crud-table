import {Component} from '@angular/core';
import {arrayMove, arrayTransfer, DragElementEvent, DropElementEvent} from 'ng-mazdik-lib';

class Item {
  name: string;
  text: string;
}

@Component({
  selector: 'app-drag-drop-demo',
  template: `
  <div class="dd-row">
    <div class="dd-column"
      *ngFor="let item of items"
      appDroppable [dragElementEvent]="dragElementEvent" (dropElement)="onDrop($event, item)">
      <div class="dd-issue"
        *ngFor="let option of item; index as i"
        [draggable]="true"
        (dragstart)="onDragStart($event, i, item)">
          <div class="dd-title">{{option.name}}</div>
          <div class="dd-text">{{option.text}}</div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .dd-row { display: flex; }
    .dd-column { width: 20%; height: 100%; min-height: 500px; }
    .dd-column + .dd-column { margin-left: 10px; }
    .dd-column:nth-child(1) { background: rgb(255, 255, 219); }
    .dd-column:nth-child(2) { background: rgb(236, 236, 191); }
    .dd-column:nth-child(3) { background: rgb(253, 214, 162); }
    .dd-column:nth-child(4) { background: rgb(162, 226, 253); }
    .dd-column:nth-child(5) { background: rgb(162, 253, 200); }
    .dd-issue {
      background: rgba(0, 0, 0, .1);
      border-radius: 4px;
      margin-bottom: 4px;
      cursor: move;
      position: relative;
      color: #000;
      overflow: hidden;
    }
    .dd-issue:hover { background: rgba(0, 0, 0, .15); }
    .dd-title { background: rgba(0, 0, 0, .1); padding: 2px 4px; }
    .dd-text { padding: 3px 4px 1px; line-height: 120%; }
  `]
})

export class DragDropDemoComponent {

  items: Item[][] = [
    [
      {name: 'Task 1', text: 'Write a program that prints ‘Hello World’ to the screen'},
      {name: 'Task 2', text: 'Write a program that asks the user for their name and greets them with their name'},
      {name: 'Task 3', text: 'Modify the previous program such that only the users Alice and Bob are greeted with their names'},
    ],
    [
      {name: 'Task 4', text: 'Write a program that asks the user for a number n and prints the sum of the numbers 1 to n'},
      {name: 'Task 5', text: 'Modify the previous program such that only multiples of three or five are considered in the sum'},
      {name: 'Task 6', text: 'Write a program that prints a multiplication table for numbers up to 12'},
    ],
    [
      {name: 'Task 7', text: 'Write a function that returns the largest element in a list'},
      {name: 'Task 8', text: 'Write function that reverses a list, preferably in place'},
      {name: 'Task 9', text: 'Write a function that checks whether an element occurs in a list'},
    ],
    [
      {name: 'Task 10', text: 'Write a function that returns the elements on odd positions in a list'},
      {name: 'Task 11', text: 'Write a function that computes the running total of a list'},
      {name: 'Task 12', text: 'Write a function that tests whether a string is a palindrome'},
    ],
    [
      {name: 'Task 13', text: 'Write a program that prints all prime numbers'},
      {name: 'Task 14', text: 'Write a guessing game where the user has to guess a secret number'},
      {name: 'Task 15', text: 'Write a program that prints the next 20 leap years'},
    ]
  ];
  source: Item[];
  dragElementEvent: DragElementEvent;

  constructor() {}

  onDragStart(event: DragEvent, index: number, source: Item[]) {
    event.dataTransfer.setData('text', index.toString());
    event.dataTransfer.effectAllowed = 'move';
    this.dragElementEvent = { event, index };
    this.source = source;
  }

  onDrop(event: DropElementEvent, target: Item[]) {
    if (event.type === 'reorder') {
      arrayMove(target, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.source, target, event.previousIndex, event.currentIndex);
    }
  }

}
