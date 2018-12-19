import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { User } from 'src/app/Interfaces/user';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var Stripe: any;

const stripe = Stripe('pk_test_9pbre2HE0vLNLD39bDttlXPP');
const elements = stripe.elements({locale: "es"});

const card = elements.create('card');

card.addEventListener('change', function(event) {
  let displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements AfterViewInit, OnInit {

  @Input() user: User;
  @ViewChild('cardForm') cardForm: ElementRef;
  cardNameForm: FormGroup;

  constructor(public auth: AuthService,
              private fun: AngularFireFunctions,
              public fb: FormBuilder) {}

  ngOnInit(): void {
    this.cardNameForm = this.fb.group({
      'cardName': [this.user.name + " " + this.user.surname || "", [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    card.mount(this.cardForm.nativeElement)
  }

  validateForm():boolean {
    let error = document.getElementById('card-errors').textContent != '';
    let name = this.cardNameForm.invalid;
    return error || name
  }

  async handleForm() {
    const {token,error} = await stripe.createToken(card)
    await this.fun.httpsCallable('startSubscriptionStripe')({user: this.user, source: token.id}).toPromise()
  }

}
