import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseFunctionsService } from 'src/app/core/services/firebase-functions.service';
import { User } from 'src/app/Interfaces/user';

@Component({
  selector: 'app-referal',
  templateUrl: './referal.component.html',
  styleUrls: ['./referal.component.scss']
})
export class ReferalComponent implements OnInit {

  referalForm: FormGroup;
  loading: boolean = false;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private functions: FirebaseFunctionsService) {

  }

  ngOnInit() {
    this.referalForm = this.fb.group({
      'referalCode': ['', [
        Validators.required
      ]]
    })
  }

  get referal() {return this.referalForm.get('referalCode').value}

  sendReferal(uid: string) {
    let referal: boolean = false;
    if(this.referal) {
      referal = true
    }
    this.loading = true
    let user: User = {
      uid: uid,
      email: '',
      referal: this.referal,
      isReferal: referal
    }
    this.functions.sendReferal(user)
  }

}
