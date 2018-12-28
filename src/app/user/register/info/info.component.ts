import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {User, UserInformation} from '../../../Interfaces/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {AngularFireFunctions} from '@angular/fire/functions';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  detailForm: FormGroup;
  referalStringUrl: string;
  hasReferalUrl = false;
  loaded = false;
  showSpiner = false;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private fun: AngularFireFunctions,
              private fbs: AngularFirestore) {
    if (this.route.snapshot.params.referalString) {
      this.referalStringUrl = this.route.snapshot.params.referalString;
      this.hasReferalUrl = true;
    }

  }

  ngOnInit() {
    this.auth.user.subscribe((user) => {
      if (user && user.uid) {
        this.fbs.doc(`usersInformation/${user.uid}`).valueChanges().subscribe((usersInformation: UserInformation) => {
          this.buidDetailForm(user, usersInformation);
          this.loaded = true;
          if (user.name && user.surname && user.phone && usersInformation.nationality && usersInformation.birthDate) {
            this.router.navigate(['register/confirmation']);
          }
        });
      } else {
        this.router.navigate(['register']);
      }
    });
  }

  isDetailFormValid(): boolean {
    return (
      this.detailForm.controls.name.valid &&
      this.detailForm.controls.surname.valid &&
      this.detailForm.controls.phone.valid &&
      this.detailForm.controls.prefix.valid &&
      this.detailForm.controls.nationality.valid &&
      this.detailForm.controls.birthDate.valid
    );
  }

  get name() {return this.detailForm.get('name').value; }
  get surname() {return this.detailForm.get('surname').value; }
  get prefix() {return this.detailForm.get('prefix').value; }
  get phone() {return this.detailForm.get('phone').value; }
  get nationality() {return this.detailForm.get('nationality').value; }
  get idCard() {return this.detailForm.get('idCard').value; }
  get birthDate() {return this.detailForm.get('birthDate').value; }
  private setPhoneNumber() {return '+' + this.prefix + this.phone; }

  async setDetailsToUser(user: User) {
    try {
      this.showSpiner = true;
      if (this.hasReferalUrl) {
        await this.fun.httpsCallable('addReferal')({
          referal: this.hasReferalUrl,
          referalUid: this.referalStringUrl,
        });
      }
      await this.auth.updateUser(user, {
        name: this.name,
        surname: this.surname,
        phone: this.setPhoneNumber(),
      });
      await this.auth.updateUserInformation(user, {
        phoneNumber: this.phone,
        prefix: this.prefix,
        nationality: this.nationality,
        idCard: this.idCard || null,
        birthDate: this.birthDate
      });
      this.showSpiner = false;
    } catch (e) {
      this.showSpiner = false;
    }
  }

  private buidDetailForm(data: User = null, usersInformation = null) {
    this.detailForm = this.fb.group({
      'name': [data.name || '', [Validators.required]],
      'surname': [data.surname || '', [Validators.required]],
      'phone': [usersInformation.phoneNumber || '', [Validators.required]],
      'prefix': [usersInformation.prefix || '', [Validators.required]],
      'nationality': [usersInformation.nationality || '', [Validators.required]],
      'idCard': [usersInformation.idCard || '', []],
      'birthDate': [usersInformation.birthDate || '', [Validators.required]]
    });
  }

}
