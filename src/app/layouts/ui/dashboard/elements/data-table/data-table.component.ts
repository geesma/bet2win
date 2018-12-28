import { Component, OnInit } from '@angular/core';
import {User} from '../../../../../Interfaces/user';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import {map} from 'rxjs/operators';



@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  users;
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  // dtTrigger: Subject = new Subject();
  usersCollection: AngularFirestoreCollection<User>;
  dtTrigger: Subject<any> = new Subject();

  constructor(private fs: AngularFirestore) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.usersCollection = this.fs.collection('users');
    this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as User;
          data.uid = a.payload.doc.id;
          return data;
        });
      }
    )).subscribe((users) => {
      this.users = users;
      this.dtTrigger.next();
    });
  }
}
