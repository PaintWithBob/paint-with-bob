import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stream-embed',
  templateUrl: './stream-embed.component.html',
  styleUrls: ['./stream-embed.component.scss',]
})
export class StreamEmbedComponent implements OnInit {

  streamURL: string

  constructor() {
    this.streamURL = 'http://localhost:9000/stream.ogg';
  }

  ngOnInit() {
  }

}
