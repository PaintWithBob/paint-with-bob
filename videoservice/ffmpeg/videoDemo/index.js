import './style';
import { Component } from 'preact';
const flvjs = require('flv.js').default;
console.log(flvjs);

export default class App extends Component {

	componentDidMount() {
		console.log('Component mounted!')
		if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: 'http://localhost:8000/live/STREAM_NAME.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
	}

	render() {
		return (
			<div>
				<h1>Hello, World!</h1>
				<video id="videoElement"></video>
			</div>
		);
	}
}
