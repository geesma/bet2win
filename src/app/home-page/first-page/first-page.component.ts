import { Component, OnInit } from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.scss']
})
export class FirstPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const options = {
      strings: ['rentabilidad', 'ganancias', 'efectividad'],
      typeSpeed: 60,
      backSpeed: 25,
      backDelay: 1500,
      loop: true
    };

    const typed = new Typed('.element', options);
  }

}
