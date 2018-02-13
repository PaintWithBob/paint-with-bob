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

    /**NEW CODE TEST**/
    var tools = [
      {
        name: 'pencil',
        el: document.getElementById('tool-pencil'),
        //tool: new LC.tools.Pencil(lc)
        tool: new (<any>window).LC.tools.Pencil(this.canvas)
      },
      {
        name: 'eraser',
        el: document.getElementById('tool-eraser'),
        tool: new (<any>window).LC.tools.Eraser(this.canvas)
      }
    ];

    //Also new code (delete if no work)
    var activateTool = function(t) {
        this.canvas.setTool(t.tool);

        tools.forEach(function(t2) {
          if (t == t2) {
            t2.el.style.backgroundColor = 'yellow';
          } else {
            t2.el.style.backgroundColor = 'transparent';
          }
        });


    }


    //New code (continued)
    tools.forEach(function(t) {
    t.el.style.cursor = "pointer";
    t.el.onclick = function(e) {
      e.preventDefault();
      activateTool(t);
    };
    });
    activateTool(tools[0]);


  }

  brushColorChange(event) {
    this.brushColor = event;
    this.canvas.setColor('primary', event);
  }

}
