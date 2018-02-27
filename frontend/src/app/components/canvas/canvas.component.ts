import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnChanges, OnDestroy {

  canvas: any;
  brushColor: any = '#222';
  tools: any[];
  activeTool: any;
  @Input() socket: any;
  socketInitialized: boolean = false;
  lcDrawingChangeListener: any;

  constructor() {}

  ngOnInit() {
    const options = {
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
    };
    this.canvas = (<any>window).LC.init(document.querySelector('#my-canvas'), options);

    // Array of tools, add here to add new tools
    this.tools = [
      {
        name: 'pencil',
        icon: 'pencil',
        tool: new (<any>window).LC.tools.Pencil(this.canvas)
      },
      {
        name: 'eraser',
        icon: 'eraser',
        tool: new (<any>window).LC.tools.Eraser(this.canvas)
      }
    ];

    // Default tool is pencil
    this.activateTool(this.tools[0]);

    this.lcDrawingChangeListener = this.canvas.on('drawingChange', () => {
      if (this.socket) {
        // Get our canvasSnapshot
        const canvasSnapshot = JSON.stringify(this.canvas.getSnapshot());

        // Emit to the server, which will then bounce to the approprite users
        // TODO: Pass the actual user
        this.socket.emit('CANVAS_UPDATE', {
          user: 'testing',
          snapshot: canvasSnapshot
        });
      }
    });
  }

  ngOnChanges() {
    // Wait to get a socket
    if(this.socket) {
      this.socketInitialized = true;

      // Add the canvas update event
      this.socket.on('CANVAS_UPDATE', (data) => {
        console.log('CANVAS_UPDATE', data);
      });
    }
  }

  // What happens when you select a tool
  activateTool(t) {
      this.canvas.setTool(t.tool);
      this.activeTool = t;
  }

  // Change color of brush
  brushColorChange(event) {
    this.brushColor = event;
    this.canvas.setColor('primary', event);
  }

  //bad code, pls edit
  decBrush(){
    if (this.activeTool.tool.strokeWidth - 5 > 0)
      this.activeTool.tool.strokeWidth = this.activeTool.tool.strokeWidth - 5;
  }

  incBrush(){
    this.activeTool.tool.strokeWidth = this.activeTool.tool.strokeWidth + 5;
  }
  undoButton(){
    this.canvas.undo();
  }

  redoButton(){
    this.canvas.redo();
  }

  ngOnDestroy() {
    if (this.lcDrawingChangeListener) {
      this.lcDrawingChangeListener();
    }
  }

}
