import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

const flvjs = require('flv.js').default;

// How long to wait before re-loading the stream
const STREAM_RELOAD_INTERVAL_IN_MILLI = 3000;

@Component({
  selector: 'app-stream-embed',
  templateUrl: './stream-embed.component.html',
  styleUrls: ['./stream-embed.component.scss',]
})
export class StreamEmbedComponent implements OnInit {

  streamURL: string;
  flvjsIsSupported: boolean = flvjs.isSupported();

  constructor() {
    this.streamURL = environment.streamUrl;
  }

  ngOnInit() {
    if (this.flvjsIsSupported) {

				// Initialize flvJs
        var videoElement = document.getElementById('lobbyStreamElement');
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: this.streamURL,
						isLive: true
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();

				// On end, reload the video
				// https://github.com/Bilibili/flv.js/blob/master/docs/api.md#flvjsevents
				flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {

					flvPlayer.unload();

					setTimeout(() => {
						flvPlayer.attachMediaElement(videoElement);
						flvPlayer.load();
						flvPlayer.play();
					}, STREAM_RELOAD_INTERVAL_IN_MILLI);
				});
    }
  }
}
