import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import {User, UserAddress, UserInformation} from 'src/app/Interfaces/user';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  joinString = '||//||';
  step = 1;
  cart: {
    product?: {
      title: string,
      subtitle: string,
      price: number,
      class: string,
      monthly: boolean
    },
    extras?: {
      title: string,
      subtitle: string,
      price: number,
      class: string,
      category?: string
    }[],
    total?: number
    totalDefault?: number
  };
  subscriptionForm: FormGroup;
  idCardForm: FormGroup;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private router: Router,
              private fbs: AngularFirestore) {
  }

  ngOnInit() {
    this.auth.user.subscribe((user) => {
      if (user && user.uid) {
        if (user.subscription && user.subscription.status && user.roles.premium) {
          this.router.navigate(['user']);
        }
        this.fbs.doc(`usersInformation/${user.uid}`).valueChanges().subscribe((usersInformation: UserInformation) => {
          this.fbs.doc(`usersInformation/${user.uid}`).valueChanges().subscribe((usersAddress: UserAddress) => {
            this.generateIdCardForm(user, usersInformation, usersAddress);
          });
        });
      }
    });
  }

  freePlan() {
    this.router.navigate(['dashboard']);
  }

  premiumPacks() {
    this.step += 1;
    this.generateSubscriptionForm();
    this.setOneMonthValues();
  }

  stepBack() {
    this.step -= 1;
  }

  generatePayment() {
    this.step++;
  }

  get paymentMethod() {return this.subscriptionForm.get('paymentMethod').value; }
  get paymentFrequency() {return this.subscriptionForm.get('paymentFrequency').value; }
  get paymentTime() {return this.subscriptionForm.get('paymentTime').value; }

  updatePrice() {
    switch (this.paymentFrequency) {
      case 'oneMonth':
        this.setOneMonthValues();
        break;
      case 'threeMonth':
        this.cart.product = {
          title: 'Bet2win premium',
          subtitle: 'Servicio premium tres meses',
          price: (85 / 3),
          class: 'default',
          monthly: true
        };
        this.subscriptionForm.get('paymentTime').setValue('allNow');
        this.cart.totalDefault = this.cart.product.price;
        this.cart.total = this.cart.totalDefault;
        break;
      case 'sixMonth':
        this.cart.product = {
          title: 'Bet2win premium',
          subtitle: 'Servicio premium seis meses',
          price: (160 / 6),
          class: 'default',
          monthly: true
        };
        this.subscriptionForm.get('paymentTime').setValue('allNow');
        this.cart.totalDefault = this.cart.product.price;
        this.cart.total = this.cart.totalDefault;
        break;
      case 'twelveMonth':
        this.cart.product = {
          title: 'Bet2win premium',
          subtitle: 'Servicio premium 12 meses',
          price: 25,
          class: 'default',
          monthly: true
        };
        this.subscriptionForm.get('paymentTime').setValue('allNow');
        this.cart.totalDefault = this.cart.product.price;
        this.cart.total = this.cart.totalDefault;
        break;
      default:
        break;
    }
    switch (this.paymentMethod) {
      case 'paypal':
        if (this.cart.extras) {
          for (let i = 0; i < this.cart.extras.length; i++ ) {
            if (this.cart.extras[i].category === 'card') {
              this.cart.extras.splice(i, 1);
            }
          }
        }
        break;
      case 'stripe':
        this.cart.extras = [
          {
            title: 'Cargo tarjeta',
            subtitle: 'Importe extra al pagar con tarjeta',
            price: 0.9,
            class: 'danger',
            category: 'stripe'
          }
        ];
        break;
      default:
        break;
    }
    switch (this.paymentTime) {
      case 'monthly':
        if (this.paymentFrequency === 'oneMonth') {
          this.setOneMonthValues(30);
        } else {
        }
        break;
      case 'allNow':
        if (this.paymentFrequency === 'oneMonth') {
          this.setOneMonthValues();
        } else {
          switch (this.paymentFrequency) {
            case 'threeMonth':
              this.cart.total = (this.cart.totalDefault) * 3;
              break;
            case 'sixMonth':
              this.cart.total = (this.cart.totalDefault) * 6;
              break;
            case 'twelveMonth':
              this.cart.total = (this.cart.totalDefault) * 12;
              break;
          }
          this.cart.product.monthly = false;
          this.cart.product.price = this.cart.total;
          this.cart.totalDefault = this.cart.total;
        }
        break;
      default:
        break;
    }
    if (this.cart.extras) {
      for (let i = 0; i < this.cart.extras.length; i++ ) {
        this.cart.total = this.cart.totalDefault + this.cart.extras[i].price;
      }
    }
  }

  get idCard() {return this.idCardForm.get('idCard').value; }
  get name() {return this.idCardForm.get('name').value; }
  get surname() {return this.idCardForm.get('surname').value; }
  get currentCity() {return this.idCardForm.get('currentCity').value; }
  get currentAddress() {return this.idCardForm.get('currentAddress').value; }
  get currentAddressNumber() {return this.idCardForm.get('currentAddressNumber').value; }
  get currentAddressDoor() {return this.idCardForm.get('currentAddressDoor').value; }
  get currentCountry() {return this.idCardForm.get('currentCountry').value; }
  get currentZipcode() {return this.idCardForm.get('currentZipcode').value; }

  goToPayment(user: User) {
    this.auth.updateUser(user, {name: this.name, surname: this.surname});
    this.auth.updateUserInformation(user, {
      idCard: this.idCard
    });
    this.auth.updateUserAddress(user, {
      currentCity: this.currentCity,
      currentAddress: this.joinDirection(this.currentAddress, this.currentAddressNumber, this.currentAddressDoor),
      currentCountry: this.currentCountry,
      currentZipcode: this.currentZipcode
    });
    this.step += 1;
  }

  private generateSubscriptionForm() {
    this.cart = {};
    this.subscriptionForm = this.fb.group({
      'paymentMethod': ['paypal', [Validators.required]],
      'paymentFrequency': ['oneMonth', []],
      'paymentTime': ['allNow', [Validators.required]]
    });
  }

  private generateIdCardForm(data: User = null, dataInformation: UserInformation = null, dataAddress: UserAddress = null) {
    if (dataAddress.uid) {
      this.idCardForm = this.fb.group({
        'idCard': [dataInformation.idCard || '', [Validators.required]],
        'name': [data.name || '', [Validators.required]],
        'surname': [data.surname || '', [Validators.required]],
        'currentCity': [dataAddress.currentCity || '', [Validators.required]],
        'currentAddress': [this.splitDirection(dataAddress.currentAddress)[0] || '', [Validators.required]],
        'currentAddressNumber': [this.splitDirection(dataAddress.currentAddress)[1] || '', [Validators.required]],
        'currentAddressDoor': [this.splitDirection(dataAddress.currentAddress)[2] || '', []],
        'currentCountry': [dataAddress.currentCountry || dataInformation.nationality || '', [Validators.required]],
        'currentZipcode': [dataAddress.currentZipcode || '', [Validators.required]],
        'conditions': [false, [Validators.requiredTrue]]
      });
    } else {
      this.idCardForm = this.fb.group({
        'idCard': [dataInformation.idCard || '', [Validators.required]],
        'name': [data.name || '', [Validators.required]],
        'surname': [data.surname || '', [Validators.required]],
        'currentCity': ['', [Validators.required]],
        'currentAddress': ['', [Validators.required]],
        'currentAddressNumber': ['', [Validators.required]],
        'currentAddressDoor': ['', []],
        'currentCountry': ['', [Validators.required]],
        'currentZipcode': ['', [Validators.required]],
        'conditions': [false, [Validators.requiredTrue]]
      });
    }
  }

  private splitDirection(direction: string): string[] {
    if (direction) {
      return direction.split(this.joinString);
    } else { return ['', '', '']; }
  }

  private joinDirection(direction1: string, direction2: string, direction3: string): string {
    return direction1 + this.joinString + direction2 + this.joinString + direction3;
  }

  private setOneMonthValues(_price = null) {
    this.cart.product = {
      title: 'Bet2win premium',
      subtitle: 'Servicio premium para un mes',
      price: _price || 35,
      class: 'default',
      monthly: false
    };
    this.cart.totalDefault = this.cart.product.price;
    this.cart.total = this.cart.totalDefault;
  }

}
