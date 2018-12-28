import {Component, HostListener, Inject, Input, OnInit} from '@angular/core';
import {User} from '../../../../Interfaces/user';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  @Input() user: User;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {}

  onHovering(eventObject: MouseEvent) {
    if (!('ontouchstart' in this.document.documentElement)) {
      if (this.document.body.classList.contains('sidebar-icon-only')) {
        const target = <Element>eventObject.target;
        for (let i = 0; i < target.childElementCount; i++) {
          if (target.children[i].classList.contains('nav-link')) {
            for (let y = 0; y < target.children[i].childElementCount; y++) {
              if (target.children[i].children[y].classList.contains('menu-title')) {
                target.children[i].children[y].classList.add('show');
              }
            }
          }
          if (target.children[i].classList.contains('collapse')) {
            target.children[i].classList.add('show');
          }
        }
      }
    }
  }

  onUnovering(eventObject: MouseEvent) {
    if (!('ontouchstart' in this.document.documentElement)) {
      if (this.document.body.classList.contains('sidebar-icon-only')) {
        const target = <Element>eventObject.target;
        for (let i = 0; i < target.childElementCount; i++) {
          if (target.children[i].classList.contains('nav-link')) {
            for (let y = 0; y < target.children[i].childElementCount; y++) {
              if (target.children[i].children[y].classList.contains('menu-title')) {
                target.children[i].children[y].classList.remove('show');
              }
            }
          }
          if (target.children[i].classList.contains('collapse')) {
            target.children[i].classList.remove('show');
          }
        }
      }
    }
  }
}
