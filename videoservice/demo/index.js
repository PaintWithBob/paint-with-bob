import './style';
import { Component } from 'preact';
const flvjs = require('flv.js').default;
console.log(flvjs);

export default class App extends Component {

	componentDidMount() {
		console.log('Component mounted!')
		if (flvjs.isSupported()) {

				// Initialize flvJs
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: 'http://localhost:8000/live/paintwithbob-1.flv',
						isLive: true
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();

				// On end, reload the video
				// https://github.com/Bilibili/flv.js/blob/master/docs/api.md#flvjsevents
				flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
					console.log('Re loading the stream');
					// Magic number for how long to wait before re-loading the stream
					const reloadPauseInMill = 3000;
					flvPlayer.unload();
					setTimeout(() => {
						flvPlayer.attachMediaElement(videoElement);
						flvPlayer.load();
						flvPlayer.play();
					}, reloadPauseInMill);
				});
    }
	}

	render() {
		return (
			<div>
				<h1>Paint With Bob Video Demo</h1>
				<p>
					Check the console. Video will load below after a slight delay.
					Edit the index.js, and `.seekInput('27:00.000')`, to test reloading
				</p>
				<video id="videoElement"></video>
			</div>
		);
	}
}
