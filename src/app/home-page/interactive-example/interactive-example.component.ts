import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interactive-example',
  templateUrl: './interactive-example.component.html',
  styleUrls: ['./interactive-example.component.scss']
})
export class InteractiveExampleComponent implements OnInit {

  teamA:number;
  teamB:number;
  percentage:number;
  winQty:number;
  qtyToBet:number;

  constructor() {
    this.teamA = 2.5;
    this.teamB = 1.9;
    this.qtyToBet = 100;
  }

  ngOnInit() {
    this.percentageCalculator();
    this.wins();
  }

  valueChangedTeamA(e) {
    this.teamA = e;
    this.percentageCalculator();
    this.wins();
  }

  valueChangedTeamB(e) {
    this.teamB = e;
    this.percentageCalculator();
    this.wins();
  }

  valueChangedQtyToBet(e) {
    this.qtyToBet = e;
    this.wins();
  }

  valueChangeQtyToBet(e) {
    this.qtyToBet += e;
    this.wins();
  }

  private percentageCalculator() {
    var temp = ((1 - ((1/this.teamA)+(1/this.teamB)))/((1/this.teamA) + (1/this.teamB))) * 100;
    this.percentage = +temp.toFixed(2);
  }

  private wins() {
    var temp = this.qtyToBet * this.percentage/100;
    this.winQty = +temp.toFixed(2);
  }

}
