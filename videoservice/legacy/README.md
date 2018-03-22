# Paint with Bob Video Service

## Table Of Contents

* [Getting Started (Installation)](#getting-started-installation)
* [LICENSE](#license)

# Getting Started (Installation)

First things first, install [VLC](https://www.videolan.org/vlc/index.html). On major platforms (OSX), you can use the link above, otherwise, for ubuntu servers you would do something like:

```
sudo apt-get update
sudo apt-get install vlc browser-plugin-vlc
```

Then, ensure that there are some videos in the `videos/` directory.

After that, run `./index.sh`, and then a process should start randomly playing all videos in the `videos/` directory, and loop this random playlist. The current file is meant to host the stream on [localhost:9000/stream.ogg](http://localhost:9000/stream.ogg). **Please note:** Vlc has some weirdness with stopping once run. Therefore, when trying to exit the script, do not press CTRL+C more than once, as it could quit the cleanup phase.

**(OPTIONAL):** To install the test web server, run `npm install` in the project directory, and then run `npm run start`, to bring up a static file server to test the stream using the index.html file.

# LICENSE

LICENSE under [MIT](https://choosealicense.com/licenses/mit/)
