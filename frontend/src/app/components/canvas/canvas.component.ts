import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  canvas: any;
  brushColor: any;
  tools: any[];

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

    this.tools = [ //array of tools, add here to add new tools
      {
        name: 'pencil',
        tool: new (<any>window).LC.tools.Pencil(this.canvas)
      },
      {
        name: 'eraser',
        tool: new (<any>window).LC.tools.Eraser(this.canvas)
      }
    ];

    this.activateTool(this.tools[0]); //default tool is pencil


  }

  activateTool(t) { //what happens when you select a tool
      this.canvas.setTool(t.tool);
  }


  brushColorChange(event) { //change color of brush
    this.brushColor = event;
    this.canvas.setColor('primary', event);
  }

}
