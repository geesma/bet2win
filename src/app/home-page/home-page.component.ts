import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(function() {
      const logoButton = $('a.navbar-brand');
      logoButton.click(function(e) {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });
        e.preventDefault();
      });
    });
  }

}
