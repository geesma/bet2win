import { Component, OnInit } from '@angular/core';
//import { moveIn, fallIn, moveInLeft } from '../../router.animations';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss'],
  // animations: [moveIn(), fallIn(), moveInLeft()],
  // host: {'[@moveIn]': ''}
})
export class UserHomePageComponent implements OnInit {

  constructor() {

  }

  // logout() {
  //   this.auth.logout();
  // }



  ngOnInit() {
  }

}
