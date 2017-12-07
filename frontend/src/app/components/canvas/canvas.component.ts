import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  canvas: any;
  brushColor: any;

  constructor() { }

  ngOnInit() {
    this.brushColor = '#222';
    let options = {
      primaryColor: this.brushColor,
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

  brushColorChange(event) {
    this.brushColor = event;
    this.canvas.setColor('primary', event);
  }

}
