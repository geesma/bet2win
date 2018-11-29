import { Component, OnInit } from '@angular/core';
//import { moveIn, fallIn, moveInLeft } from '../../router.animations';

import { Store } from '@ngrx/store';
import * as fromAuth from '../../core/reducers/reducers';
import * as userActions from '../../core/auth/actions/auth.action';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss'],
  // animations: [moveIn(), fallIn(), moveInLeft()],
  // host: {'[@moveIn]': ''}
})
export class UserHomePageComponent implements OnInit {

  constructor(private store: Store<fromAuth.State>) {

  }

  logout() {
    this.store.dispatch(new userActions.Logout())
  }



  ngOnInit() {
  }

}
