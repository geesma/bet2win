import {Component, HostListener, OnInit} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  lastId: string;

  constructor() { }

  ngOnInit() {
    const hamburger = document.querySelector('.hamburger');
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('is-active');
    });
    this.menuButtons();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    const element = document.getElementById('navbar');
    if (window.pageYOffset > 50) {
      element.classList.remove('navbar-custom');
      element.classList.add('navbar-white');
      element.classList.add('box-shadow');
      element.classList.add('bg-light');
    } else {
      element.classList.add('navbar-custom');
      element.classList.remove('navbar-white');
      element.classList.remove('box-shadow');
      element.classList.remove('bg-light');
    }
  }

  private menuButtons() {
    $(document).ready(function() {
      const topMenu = $('#mainNavbarToggler'),
            topMenuHeight = topMenu.outerHeight() + 70,
            menuItems = topMenu.find('a'),
            scrollItems = menuItems.map(function() {
              const name = $(this).attr('href');
              if (name.length > 2 && name.substr(1, name.length) === '#') {
                const item = $(name);
                if (item.length) { return item; }
              }
            });

      menuItems.click(function(e) {
        const href = $(this).attr('href'),
          offsetTop = href === '#' ? 0 : $(href).offset().top - topMenuHeight;
        window.scroll({top: offsetTop, left: 0, behavior: 'smooth' });
        e.preventDefault();
      });

      $(document).on('scroll', onScroll);

      function onScroll(event) {
        const scrollPos = $(document).scrollTop() + 70;
        $('#mainNavbarToggler a').each(function () {
          const currLink = $(this);
          const currentLink = currLink.attr('href');
          const refElement = currentLink.length > 2 && currentLink.substr(0, 1) === '#' ? $(currentLink) : null;
          if (refElement) {
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > (scrollPos - 48) ) {
              $('#mainNavbarToggler ul li a').removeClass('active');
              currLink.addClass('active');
            } else {
              currLink.removeClass('active');
            }
          }
        });
      }
    });
  }
}
