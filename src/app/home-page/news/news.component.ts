import { Component, OnInit } from '@angular/core';
import {NguCarouselConfig} from '@ngu/carousel';
import {Author, News} from '../../Interfaces/news';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  author: Author[] = [
    {
      uid: '1',
      name: 'Gerard Escolies',
      role: 'Developer',
      imageUrl: 'https://source.unsplash.com/o4UhdLv5jbQ/70x70',
    },
    {
      uid: '2',
      name: 'Page Admin',
      role: 'Admin',
      imageUrl: 'https://source.unsplash.com/_9HWqhmaSQE/70x70',
    },
    {
      uid: '3',
      name: 'Page Promotor',
      role: 'Promotor',
      imageUrl: 'https://source.unsplash.com/vLXdetEcB40/70x70',
    }
  ];

  public news: News[] = [
    {
      title: 'Nueva página web',
      text: 'Con esta pagina web tambien cambiamos la manera en la que funcionamos, y automatizamos los servicios',
      imageUrl: '',
      date: new Date(),
      author: this.author[1],
      preview: {
        thumbnailUrl: 'https://source.unsplash.com/OQwjN32hAqw/400x500',
        title: 'Nueva página web',
        author: this.author[1],
        comentsNum: 0,
        previewStyle: 'image',
      }
    },
    {
      title: 'Estrenamos web',
      text: 'Estamos de estrena de nuestra página web, y por ese motivo os regalamos 15 días gratis de nuestro servicio premium',
      imageUrl: '',
      date: new Date(),
      author: this.author[0],
      preview: {
        title: 'Estrenamos web',
        text: 'Estamos de estrena de nuestra página web, y por ese motivo os regalamos 15 días gratis de nuestro servicio premium',
        author: this.author[0],
        comentsNum: 0,
        previewStyle: 'text',
      }
    },
    {
      title: 'Nueva página web',
      text: 'Con esta pagina web tambien cambiamos la manera en la que funcionamos, y automatizamos los servicios',
      imageUrl: '',
      date: new Date(),
      author: this.author[0],
      preview: {
        thumbnailUrl: 'https://source.unsplash.com/Bd7gNnWJBkU/400x500',
        title: 'Estrenamos página web',
        author: this.author[0],
        comentsNum: 0,
        previewStyle: 'image',
      }
    },
    {
      title: 'Estrenamos web',
      text: 'Estamos de estrena de nuestra página web, y por ese motivo os regalamos 15 días gratis de nuestro servicio premium',
      imageUrl: '',
      date: new Date(),
      author: this.author[1],
      preview: {
        title: 'Nueva página web',
        text: 'Estamos de estrena de nuestra página web, y por ese motivo os regalamos 15 días gratis de nuestro servicio premium',
        author: this.author[1],
        comentsNum: 0,
        previewStyle: 'text',
      }
    },
    {
      title: 'Nueva página web',
      text: 'Con esta pagina web tambien cambiamos la manera en la que funcionamos, y automatizamos los servicios',
      imageUrl: '',
      date: new Date(),
      author: this.author[2],
      preview: {
        thumbnailUrl: 'https://source.unsplash.com/TwuRCf9DLDg/400x500',
        title: 'Manager de la pagina web',
        author: this.author[2],
        comentsNum: 0,
        previewStyle: 'image',
      }
    }
  ];

  public carouselTileItems: Array<any> = [0, 1, 2, 3, 4];

  public carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 2, md: 3, lg: 3, all: 0 },
    slide: 1,
    speed: 300,
    point: {
      visible: true,
      hideOnSingleSlide: true
    },
    load: 2,
    velocity: 0,
    touch: true,
    loop: true,
    animation: 'lazy',
    easing: 'ease'
  };

  constructor() { }

  ngOnInit() { }

  public goTo(url: string) {
    alert(url);
  }
}
