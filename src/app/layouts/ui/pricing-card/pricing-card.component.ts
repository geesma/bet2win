import {Component, Input, OnInit} from '@angular/core';
import {NguCarouselConfig} from '@ngu/carousel';

@Component({
  selector: 'app-pricing-card',
  templateUrl: './pricing-card.component.html',
  styleUrls: ['./pricing-card.component.scss']
})
export class PricingCardComponent implements OnInit {

  @Input() name: string;
  @Input() price: string;
  @Input() time = '';
  @Input() values: {
    atributes: {
      value: string,
      disabled: boolean,
      advantage: boolean,
    }[],
    table: {
      name: string,
      price: string,
      time: string
    }[]
  }[];
  @Input() sameAtributes = false;

  public carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 2, md: 3, lg: 3, all: 0 },
    slide: 1,
    speed: 300,
    point: {
      visible: false
    },
    load: 2,
    velocity: 0,
    touch: true,
    loop: true,
    animation: 'lazy',
    easing: 'ease'
  };

  constructor() { }

  ngOnInit() {
  }

}
