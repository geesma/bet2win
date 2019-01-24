import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pricing-card',
  templateUrl: './pricing-card.component.html',
  styleUrls: ['./pricing-card.component.scss']
})
export class PricingCardComponent implements OnInit {

  @Input() name: string;
  @Input() price: string;
  @Input() time: string;
  @Input() values: {
    value: string,
    disabled: boolean,
    advantage: boolean,
  }[];

  constructor() { }

  ngOnInit() {
  }

}
