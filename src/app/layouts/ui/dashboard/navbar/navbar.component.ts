import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {User} from '../../../../Interfaces/user';
import {AngularFireAuth} from '@angular/fire/auth';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() user: User;

  constructor(private afAuth: AngularFireAuth, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit() {
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  sidebarMinimize() {
    const body = this.document.body;
    const isMinimized: boolean = body.classList.contains('sidebar-icon-only');
    if (isMinimized) { body.classList.remove('sidebar-icon-only'); }
    else { body.classList.add('sidebar-icon-only'); }
  }

  sidebarOpen() {
    const element = this.document.getElementsByClassName('row row-offcanvas row-offcanvas-right').item(0);
    const isActive: boolean = element.classList.contains('active');
    if (isActive) {
      element.classList.remove('active');
    } else { element.classList.add('active'); }
  }

}
