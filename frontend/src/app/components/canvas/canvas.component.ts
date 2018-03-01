import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { AuthService } from '../../providers';

const CANVAS_UPDATE_EVENT_ID = 'CANVAS_UPDATE';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnChanges, OnDestroy {

  @Input() socket: any;
  @Input() user: any;

  authUser: any;
  canvasElementId: string;
  canvas: any;
  brushColor: any = '#222';
  tools: any[];
  activeTool: any;
  socketInitialized: boolean = false;
  lcDrawingChangeListener: any;
  isReadOnly: boolean = false;

  constructor(private authService: AuthService) {
    this.canvasElementId = `literally-canvas-${Math.floor(Math.random() * 100000).toString(36)}`;
    console.log(this.canvasElementId);
  }

  ngOnInit() {
    // Check if we have a user
   if(this.user) {
    // If so, this is a canvas meant for simply listening and rendering events
    this.isReadOnly = true;
   }

   // Get the current logged in user
   this.authService.getUser().subscribe((user) => {
      this.authUser = user;
   });

   // Initialize our canvas
   this.initializeLiterallyCanvas();
  }

  initializeLiterallyCanvas() {

    // Wrap in a timeout to fire off change detection
    setTimeout(() => {
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
      this.canvas = (<any>window).LC.init(document.querySelector(`#${this.canvasElementId}`), options);

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

      if(!this.isReadOnly) {
        this.lcDrawingChangeListener = this.canvas.on('drawingChange', () => {
          if (this.socket) {
            // Get our canvasSnapshot
            const canvasSnapshot = JSON.stringify(this.canvas.getSnapshot());

            // Emit to the server, which will then bounce to the approprite users
            if(this.authUser) {
              this.socket.emit(CANVAS_UPDATE_EVENT_ID, {
                user: this.authUser,
                snapshot: canvasSnapshot
              });
            }
          }
        });
      }
    });
  }

  ngOnChanges() {
    // Wait to get a socket
    if(this.socket) {
      this.socketInitialized = true;

      // Add the canvas update event
      if(this.user) {
        this.socket.on(CANVAS_UPDATE_EVENT_ID, (data) => {
          // check if this canvas has a user associated
          if(this.user && this.user._id === data.user._id) {
            // Get the snapshot, and set it to our canvas
            const snapshot = JSON.parse(data.snapshot);
            this.canvas.loadSnapshot(snapshot);
          }
        });
      }
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
