import { Injectable } from '@angular/core';
import { User } from '../../Interfaces/user';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userFake: User = {
    email: 'gerard.em.94@me.com',
    password: "Escolies94"
  }

  constructor() { }

  login(user: User): Observable<any> {
    let toSend = false;
    if (JSON.stringify(user) === JSON.stringify(this.userFake)) {
      toSend = true;
    }
    return of(toSend).pipe(delay(5000));
  }
}
