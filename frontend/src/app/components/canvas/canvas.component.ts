import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { AuthService } from '../../providers';

declare var require: any;

const CANVAS_UPDATE_EVENT_ID = 'CANVAS_UPDATE';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnChanges, OnDestroy {

    @Input() socket: any;
    // User can either be our current user that was logged in (will be assumed on not isReadOnly)
    // Or, a user to watch for changes to update
    @Input() user: any;
    @Input() isReadOnly: boolean = false;

    authUser: any;
    canvas: any;
    canvasElementId: string;
    canvasElement: Element;
    brushColor: any = '#222';
    secondaryColor: any = '#444';
    backgroundColor: any = '#fff';
    tools: any[];
    activeTool: any;
    socketInitialized: boolean = false;
    lcDrawingChangeListener: any;
    canvasUpdateEvent: any;

    constructor(private authService: AuthService) {
        this.canvasElementId = `literally-canvas-${Math.floor(Math.random() * 100000).toString(36)}`;
    }

    ngOnInit() {
        // Initialize our canvas
        this.initializeLiterallyCanvas();
    }

    initializeLiterallyCanvas() {

        // Wrap in a timeout to fire off change detection
        setTimeout(() => {

            // Get our canvas element
            this.canvasElement = document.querySelector(`#${this.canvasElementId}`);

            // Read only canvases will simply embed svgs
            if(!this.isReadOnly) {
                const options = {
                    primaryColor: this.brushColor,
                    secondaryColor: this.secondaryColor,
                    backgroundColor: this.backgroundColor,
                    strokeWidths: [1, 2, 5, 10, 20, 30],
                    defaultStrokeWidth: 10,
                    watermarkImage: '',
                    imageSize: {
                        width: 600,
                        height: 600
                    },
                    keyboardShortcuts: false
                };
                this.canvas = (<any>window).LC.init(this.canvasElement, options);

                // Array of tools, add here to add new tools
                this.tools = [
                    { name: 'pencil', icon: 'pencil', tool: new (<any>window).LC.tools.Pencil(this.canvas) },
                    { name: 'eraser', icon: 'eraser', tool: new (<any>window).LC.tools.Eraser(this.canvas) },
                    { name: 'line', icon: 'minus', tool: new (<any>window).LC.tools.Line(this.canvas) },
                    { name: 'rectangle', icon: 'stop', tool: new (<any>window).LC.tools.Rectangle(this.canvas) },
                    { name: 'polygon', icon: 'play', tool: new (<any>window).LC.tools.Polygon(this.canvas) },
                    { name: 'ellipse', icon: 'circle', tool: new (<any>window).LC.tools.Ellipse(this.canvas) },
                    { name: 'text', icon: 'font', tool: new (<any>window).LC.tools.Text(this.canvas) },
                    { name: 'eyedropper', icon: 'magic', tool: new (<any>window).LC.tools.Eyedropper(this.canvas) }
                ];

                // Default tool is pencil
                this.activateTool(this.tools[0]);

                this.lcDrawingChangeListener = this.canvas.on('drawingChange', () => {
                    if (this.socket) {
                        // Emit to the server, which will then bounce to the approprite users
                        if(this.user) {
                            this.socket.emit(CANVAS_UPDATE_EVENT_ID, {
                                user: this.user,
                                svg: this.canvas.getSVGString()
                            });
                        }
                    }
                });
                this.canvas.on('primaryColorChange', (response) => {
                    function componentToHex(c) {
                        var hex = c.toString(16);
                        return hex.length == 1 ? "0" + hex : hex;
                    }

                    function rgbToHex(r, g, b) {
                        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
                    }
                    console.log(response.split("(")[1].split(")")[0]);
                    this.canvas.setColor('primary', response);
                });
            }
        });
    }

    ngOnChanges() {
        // Wait to get a socket
        if(this.socket) {
            this.socketInitialized = true;

            // Add the canvas update event
            if (this.isReadOnly) {
                this.socket.on(CANVAS_UPDATE_EVENT_ID, (data) => {

                    // check if this canvas has a user associated
                    if (this.user._id === data.user._id) {

                        // Check if we had a pending request
                        if (this.canvasUpdateEvent) {
                            cancelAnimationFrame(this.canvasUpdateEvent);
                        }

                        // Wrap in a requestIdleCallback
                        this.canvasUpdateEvent = requestAnimationFrame(() => {
                            this.canvasUpdateEvent = false;
                            // Set the inner HTML of our canvas target
                            this.canvasElement.innerHTML = data.svg;
                        });
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

    // Change secondary color
    secondaryColorChange(event) {
        this.secondaryColor = event;
        this.canvas.setColor('secondary', event);
    }

    // Change color of brush
    backgroundColorChange(event) {
        this.backgroundColor = event;
        this.canvas.setColor('background', event);
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

    clearButton(){
        this.canvas.clear();
    }

    ngOnDestroy() {
        if (this.lcDrawingChangeListener) {
            this.lcDrawingChangeListener();
        }
    }

}
