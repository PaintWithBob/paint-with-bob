import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  canvas: any;

  constructor() { }

  ngOnInit() {
    let options = {
      primaryColor: '#222',
      secondaryColor: '#444',
      backgroundColor: 'transparent',
      strokeWidths: [1, 2, 5, 10, 20, 30],
      defaultStrokeWidth: 10,
      watermarkImage: '',
      imageSize: {
        width: 500,
        height: 500
      },
      keyboardShortcuts: false,
    }
    this.canvas = (<any>window).LC.init(document.querySelector('#my-canvas'), options);
  }

}
