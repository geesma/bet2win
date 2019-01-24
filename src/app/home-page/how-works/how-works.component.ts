import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-how-works',
  templateUrl: './how-works.component.html',
  styleUrls: ['./how-works.component.scss']
})
export class HowWorksComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('.accordion-control').click(function() {
      const closest = $(this).closest('.accordion');
      if (!closest.hasClass('open')) {
        $('.accordion.open').removeClass('open');
        setTimeout(function() {
          closest.addClass('open');
        }, 300);
      }
    });
  }

}
