import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
