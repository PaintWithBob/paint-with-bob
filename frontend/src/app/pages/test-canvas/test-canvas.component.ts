import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-canvas',
  templateUrl: './test-canvas.component.html',
  styleUrls: ['./test-canvas.component.scss']
})
export class TestCanvasComponent implements OnInit {

  constructor() {
    // console.log(window.lc.init('.my-canvas', {}));
  }

  ngOnInit() {
  }

}
