import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-stream-embed',
  templateUrl: './stream-embed.component.html',
  styleUrls: ['./stream-embed.component.scss',]
})
export class StreamEmbedComponent implements OnInit {
  
  streamURL: string
  
  constructor() {
    this.streamURL = environment.streamUrl;
  }
  
  ngOnInit() {
  }
  
}
