import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../core/notifiers/notify.service';

@Component({
  selector: 'app-notification-message',
  templateUrl: './notification-message.component.html',
  styleUrls: ['./notification-message.component.scss']
})
export class NotificationMessageComponent implements OnInit {

  constructor(public notify: NotifyService) { }

  ngOnInit() {
  }

}
