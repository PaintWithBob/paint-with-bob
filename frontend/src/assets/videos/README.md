Converting Gifs: https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/replace-animated-gifs-with-video/

Scaling: https://trac.ffmpeg.org/wiki/Scaling

`ffmpeg -i input.gif -vf scale=-1:250  -b:v 0 -crf 25 output.mp4`
