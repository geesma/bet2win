import { Component, OnInit } from '@angular/core';

interface Values {
  atributes: {
    value: string,
    disabled: boolean,
    advantage: boolean,
  }[];
  table: {
    name: string,
    price: string,
    time: string
  }[];
}

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})

export class PricingComponent implements OnInit {

  public month = true;
  public pack = false;

  public valuesMonth: Values[];
  public valuesPack: Values[];

  constructor() {
    this.valuesMonth = [
      {
        table: [
          {
            name: 'Pago mensual',
            price: '30',
            time: 'mes'
          }
        ],
        atributes: [
          {value: 'Rentabilidad ilimitada', disabled: false, advantage: true},
          {value: 'Pago automatico', disabled: false, advantage: true},
          {value: 'Ventajas de fidelidad', disabled: false, advantage: true},
          {value: 'Precio fijo asegurado *', disabled: true, advantage: true}
        ]
      },
      {
        table: [
          {
            name: 'Un solo mes',
            price: '35',
            time: ''
          }
        ],
        atributes: [
          {value: 'Rentabilidad ilimitada', disabled: false, advantage: true},
          {value: 'Pagas por solo un mes', disabled: true, advantage: true},
          {value: 'Precio fijo asegurado', disabled: true, advantage: false},
          {value: 'Pago automatico', disabled: true, advantage: false},
          {value: 'Ventajas de fidelidad', disabled: true, advantage: false}
        ]
      }
    ];
    this.valuesPack =
    [
      {
        table: [
          {name: '3 mesos', price: '85', time: ''},
          {name: '6 mesos', price: '160', time: ''},
          {name: '12 mesos', price: '300', time: ''}
        ],
        atributes: [
          {value: 'Rentabilidad ilimitada', disabled: false, advantage: true},
          {value: 'Descuento sobre la cuota mensual', disabled: false, advantage: true},
          {value: 'Pagas solo una vez', disabled: true, advantage: true},
          {value: 'Pago automatico', disabled: true, advantage: false},
          {value: 'Ventajas de fidelidad', disabled: true, advantage: false}
        ]
      }
    ];
  }

  ngOnInit() {
  }

  changeToMonth() {
    this.pack = false;
    this.month = true;
  }

  changeToPack() {
    this.month = false;
    this.pack = true;
  }

}
