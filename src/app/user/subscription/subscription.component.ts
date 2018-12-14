import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseFunctionsService } from 'src/app/core/services/firebase-functions.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  step: number = 1;
  stepOld: number;
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
  string_1: string;
  string_2: string;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private functions: FirebaseFunctionsService) {
  }

  ngOnInit() {
  }

  freePlan() {
    this.router.navigate(['dashboard']);
  }

  premiumPacks() {
    this.stepOld = this.step;
    this.step = 2
    this.generateSubscriptionForm()
    this.setOneMonthValues()
  }

  stepBack() {
    this.step = this.stepOld
    this.stepOld -= 1
  }

  payWithPaypal() {
    alert("paypal")
  }

  payWithCard() {
    alert("card")
  }

  get paymentMethod() {return this.subscriptionForm.get('paymentMethod').value}
  get paymentFrequency() {return this.subscriptionForm.get('paymentFrequency').value}
  get paymentTime() {return this.subscriptionForm.get('paymentTime').value}

  updatePrice() {
    switch(this.paymentFrequency) {
      case "oneMonth":
        this.setOneMonthValues()
        break;
      case 'threeMonth':
        this.cart.product = {
          title: "Bet2win premium",
          subtitle: "Servicio premium tres meses",
          price: 29,
          class: "default",
          monthly: true
        }
        this.cart.totalDefault = this.cart.product.price;
        this.cart.total = this.cart.totalDefault;
        break;
      case 'sixMonth':
        this.cart.product = {
          title: "Bet2win premium",
          subtitle: "Servicio premium seis meses",
          price: 28,
          class: "default",
          monthly: true
        }
        this.cart.totalDefault = this.cart.product.price;
        this.cart.total = this.cart.totalDefault;
        break;
      case 'twelveMonth':
        this.cart.product = {
          title: "Bet2win premium",
          subtitle: "Servicio premium 12 meses",
          price: 27,
          class: "default",
          monthly: true
        }
        this.cart.totalDefault = this.cart.product.price;
        this.cart.total = this.cart.totalDefault;
        break;
      default:
        break;
    }
    switch(this.paymentMethod) {
      case "paypal":
        if(this.cart.extras) {
          for (var i = 0; i < this.cart.extras.length; i++ ) {
            if(this.cart.extras[i].category === "card") {
              this.cart.extras.splice(i, 1)
            }
          }
        }
        break;
      case "card":
        this.cart.extras = [
          {
            title: "Cargo tarjeta",
            subtitle: "Importe extra al pagar con tarjeta",
            price: 1.5,
            class: "danger",
            category: "card"
          }
        ]
        break;
      default:
        break;
    }
    switch(this.paymentTime) {
      case "monthly":
        if(this.paymentFrequency == "oneMonth") {
          this.setOneMonthValues(30)
        } else {
          this.string_1 = "Mensualmente";
          this.string_2 = "Todo a la vez";
        }
        break;
      case "allNow":
        if(this.paymentFrequency == "oneMonth") {
          this.setOneMonthValues()
        }
        else {
          this.string_1 = "Mensualmente";
          this.string_2 = "Todo a la vez";
          switch(this.paymentFrequency) {
            case "threeMonth":
              this.cart.total = (this.cart.totalDefault-2)*3
              break;
            case "sixMonth":
              this.cart.total = (this.cart.totalDefault-2)*6
              break;
            case 'twelveMonth':
              this.cart.total = (this.cart.totalDefault-2)*12
              break;
          }
          this.cart.product.monthly = false;
          this.cart.product.price = this.cart.total
          this.cart.totalDefault = this.cart.total
        }
        break;
      default:
        break;
    }
    if(this.cart.extras) {
      for (var i = 0; i < this.cart.extras.length; i++ ) {
        this.cart.total = this.cart.totalDefault + this.cart.extras[i].price
      }
    }
  }

  private generateSubscriptionForm() {
    this.cart = {};
    this.subscriptionForm = this.fb.group({
      'paymentMethod': ['paypal', [Validators.required]],
      'paymentFrequency': ['oneMonth', [Validators.required]],
      'paymentTime': ['allNow', [Validators.required]]
    });
  }

  private setOneMonthValues(_price = null) {
    this.cart.product = {
      title: "Bet2win premium",
      subtitle: "Servicio premium para un mes",
      price: _price || 35,
      class: "default",
      monthly: false
    }
    this.cart.totalDefault = this.cart.product.price;
    this.cart.total = this.cart.totalDefault;
    this.string_1 = "Mensualmente";
    this.string_2 = "Solo un mes";
  }

}
