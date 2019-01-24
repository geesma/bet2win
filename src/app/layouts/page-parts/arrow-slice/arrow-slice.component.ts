import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-arrow-slice',
  templateUrl: './arrow-slice.component.html',
  styleUrls: ['./arrow-slice.component.scss']
})
export class ArrowSliceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    const text = document.getElementById('arrow-text');
    const icon = document.getElementById('arrow-icon');
    const pack = document.getElementById('arrow-pack');
    if (window.pageYOffset > 5) {
      pack.classList.remove('justify-content-center');
      pack.classList.add('justify-content-end');
      pack.classList.remove('text-center');
      pack.classList.remove('align-items-center');
      pack.classList.add('align-items-end');
      pack.classList.add('text-right');
      text.classList.add('d-none');
      icon.classList.add('fa-flip-vertical');
      icon.classList.remove('animateBackward');
      icon.classList.add('animate');
    } else {
      pack.classList.add('justify-content-center');
      pack.classList.remove('justify-content-end');
      pack.classList.add('text-center');
      pack.classList.remove('text-right');
      pack.classList.remove('align-items-end');
      pack.classList.add('align-items-center');
      text.classList.remove('d-none');
      icon.classList.remove('fa-flip-vertical');
      icon.classList.remove('animate');
      icon.classList.add('animateBackward');
    }
  }

  action() {
    if (window.pageYOffset > 5) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      window.scroll({ top: document.getElementById('stats').getBoundingClientRect().top - 150, left: 0, behavior: 'smooth' });
    }
  }
}
