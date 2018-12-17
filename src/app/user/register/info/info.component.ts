import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../../Interfaces/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseFunctionsService } from 'src/app/core/services/firebase-functions.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  detailForm: FormGroup;
  referalStringUrl: string;
  hasReferalUrl: boolean = false;
  loaded: boolean = false;
  showSpiner: boolean = false;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private functions: FirebaseFunctionsService) {
    if(this.route.snapshot.params.referalString) {
      this.referalStringUrl = this.route.snapshot.params.referalString
      this.hasReferalUrl = true;
    }

  }

  ngOnInit() {
    this.auth.user.subscribe((user) => {
      if(user) {
        this.buidDetailForm(user)
        this.loaded = true
        if(user.name && user.surname && user.phone && user.nationality && user.birthDate) {
          this.router.navigate(['register/confirmation'])
        }
      } else {
        this.router.navigate(['register'])
      }
    })
  }

  isDetailFormValid(): boolean {
    return (
      this.detailForm.controls.name.valid &&
      this.detailForm.controls.surname.valid &&
      this.detailForm.controls.phone.valid &&
      this.detailForm.controls.prefix.valid &&
      this.detailForm.controls.nationality.valid &&
      this.detailForm.controls.birthDate.valid
    )
  }

  get name() {return this.detailForm.get('name').value}
  get surname() {return this.detailForm.get('surname').value}
  get prefix() {return this.detailForm.get('prefix').value}
  get phone() {return this.detailForm.get('phone').value}
  get nationality() {return this.detailForm.get('nationality').value}
  get idCard() {return this.detailForm.get('idCard').value}
  get birthDate(){return this.detailForm.get('birthDate').value}
  private setPhoneNumber() {return '+'+this.prefix + this.phone}

  setDetailsToUser(user: User) {
    this.showSpiner = true
    if(this.hasReferalUrl) {
      this.auth.updateUser(user, {
        referal: this.referalStringUrl || null,
        isReferal: this.hasReferalUrl
      })
    }
    return this.auth.updateUser(user, {
      name: this.name,
      surname: this.surname,
      phone: this.setPhoneNumber(),
      phoneNumber: this.phone,
      prefix: this.prefix,
      nationality: this.nationality,
      idCard: this.idCard || null,
      birthDate: this.birthDate
    }).then(() => {
      this.showSpiner = false
    })
  }

  private buidDetailForm(data: User = null) {
    this.detailForm = this.fb.group({
      'name': [data.name || '', [Validators.required]],
      'surname': [data.surname || '', [Validators.required]],
      'phone': [data.phoneNumber || '', [Validators.required]],
      'prefix': [data.prefix || '', [Validators.required]],
      'nationality': [data.nationality || '', [Validators.required]],
      'idCard': [data.idCard || '',[]],
      'birthDate': [data.birthDate || '', [Validators.required]]
    });
  }

}
