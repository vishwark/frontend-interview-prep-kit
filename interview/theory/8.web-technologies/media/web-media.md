# Web Media - Video, Audio, Streaming & Recording

## 1. VIDEO

### 1.1 Playing Static Video Files

#### Basic HTML5 Video Tag
```html
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.ogg" type="video/ogg">
  Your browser does not support the video tag.
</video>
```

#### Video Tag Attributes
- `controls` - Display play/pause buttons and volume control
- `autoplay` - Start playing automatically (requires muted attribute in most browsers)
- `muted` - Mute audio by default
- `loop` - Restart video when it ends
- `width` / `height` - Set video dimensions
- `poster` - Show thumbnail image before video plays
- `preload` - Specify preload behavior (none, metadata, auto)

#### JavaScript API - HTMLVideoElement
```javascript
const video = document.querySelector('video');

// Play and pause
video.play();
video.pause();

// Properties
console.log(video.currentTime);      // Current playback position (seconds)
console.log(video.duration);         // Total video duration
console.log(video.volume);           // Volume (0-1)
console.log(video.muted);            // Is muted
console.log(video.paused);           // Is paused
console.log(video.ended);            // Has ended

// Set properties
video.currentTime = 10;              // Jump to 10 seconds
video.volume = 0.5;                  // Set volume to 50%
video.playbackRate = 1.5;            // Play at 1.5x speed
```

#### Events
```javascript
video.addEventListener('play', () => console.log('Playing'));
video.addEventListener('pause', () => console.log('Paused'));
video.addEventListener('ended', () => console.log('Ended'));
video.addEventListener('timeupdate', () => console.log('Time:', video.currentTime));
video.addEventListener('loadedmetadata', () => console.log('Duration:', video.duration));
video.addEventListener('error', (e) => console.log('Error:', e));
video.addEventListener('progress', () => console.log('Loading...'));
```

### 1.2 Playing Video by Link

#### CORS Considerations
When playing video from a different domain, ensure CORS headers are set:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
```

#### Playing from URL
```html
<video width="320" height="240" controls>
  <source src="https://example.com/video.mp4" type="video/mp4">
</video>
```

#### Whitelist Domains (Backend)
```javascript
// Backend should whitelist domains that can access the video
const allowedDomains = ['example.com', 'app.example.com'];
const origin = req.headers.origin;

if (allowedDomains.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}
```

### 1.3 Video Download

#### Enable Download Link
```html
<a href="/assets/video.mp4" download="my-video.mp4">Download Video</a>
```

#### Programmatic Download
```javascript
function downloadVideo(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

downloadVideo('/assets/video.mp4', 'my-video.mp4');
```

### 1.4 Custom Video Controls

#### HTML Structure
```html
<div class="video-player">
  <video id="myVideo" width="100%">
    <source src="video.mp4" type="video/mp4">
  </video>
  
  <div class="controls">
    <button id="playBtn">Play</button>
    <button id="pauseBtn">Pause</button>
    <input type="range" id="progressBar" min="0" max="100" value="0">
    <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
    <input type="range" id="volumeControl" min="0" max="100" value="100">
    <button id="fullscreenBtn">Fullscreen</button>
  </div>
</div>
```

#### JavaScript Implementation
```javascript
const video = document.getElementById('myVideo');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');
const volumeControl = document.getElementById('volumeControl');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// Play/Pause
playBtn.addEventListener('click', () => video.play());
pauseBtn.addEventListener('click', () => video.pause());

// Update progress bar
video.addEventListener('timeupdate', () => {
  progressBar.value = (video.currentTime / video.duration) * 100;
  currentTimeSpan.textContent = formatTime(video.currentTime);
});

// Set duration
video.addEventListener('loadedmetadata', () => {
  durationSpan.textContent = formatTime(video.duration);
});

// Seek
progressBar.addEventListener('input', () => {
  video.currentTime = (progressBar.value / 100) * video.duration;
});

// Volume
volumeControl.addEventListener('input', () => {
  video.volume = volumeControl.value / 100;
});

// Fullscreen
fullscreenBtn.addEventListener('click', () => {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault();
    video.paused ? video.play() : video.pause();
  }
  if (e.key === 'ArrowRight') video.currentTime += 5;
  if (e.key === 'ArrowLeft') video.currentTime -= 5;
  if (e.key === 'f') video.requestFullscreen();
  if (e.key === 'm') video.muted = !video.muted;
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

### 1.5 Video Streaming (HLS & DASH)

#### HLS (HTTP Live Streaming)

**Format:** `.m3u8` playlist file

**Playlist Structure:**
```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXTINF:9.9,
segment1.ts
#EXTINF:9.9,
segment2.ts
#EXT-X-ENDLIST
```

**Implementation with hls.js:**
```html
<video id="video" width="100%" height="auto"></video>

<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script>
  const video = document.getElementById('video');
  const hlsUrl = 'https://example.com/stream.m3u8';

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });

    // Quality change
    hls.on(Hls.Events.hlsLevelSwitching, (data) => {
      console.log('Quality changed to:', data.level);
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari native HLS support
    video.src = hlsUrl;
  }
</script>
```

#### DASH (Dynamic Adaptive Streaming over HTTP)

**Format:** `.mpd` manifest file

**Manifest Structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<MPD>
  <Period>
    <AdaptationSet>
      <Representation bandwidth="500000">
        <BaseURL>segment1.m4s</BaseURL>
      </Representation>
      <Representation bandwidth="1000000">
        <BaseURL>segment2.m4s</BaseURL>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
```

**Implementation with dash.js:**
```html
<video id="videoPlayer" width="100%" height="auto"></video>

<script src="https://cdn.dashjs.org/latest/dash.all.min.js"></script>
<script>
  const video = document.getElementById('videoPlayer');
  const dashUrl = 'https://example.com/stream.mpd';
  
  const player = dashjs.MediaPlayer().create();
  player.initialize(video, dashUrl, true);
  
  // Bitrate change
  player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, (data) => {
    console.log('Bitrate changed to:', data.newQuality);
  });
</script>
```

#### Quality Control in Streaming
```javascript
// hls.js - Get available qualities
hls.on(Hls.Events.MANIFEST_PARSED, () => {
  const levels = hls.levels;
  levels.forEach((level, index) => {
    console.log(`Quality ${index}: ${level.height}p - ${level.bitrate} bps`);
  });
});

// Set specific quality
hls.currentLevel = 2; // Switch to quality index 2

// Auto quality (adaptive bitrate)
hls.currentLevel = -1; // -1 means auto

// dash.js - Get available bitrates
const bitrateList = player.getBitrateList();
bitrateList.forEach((bitrate) => {
  console.log(`Bitrate: ${bitrate.bitrate} bps`);
});

// Set specific bitrate
player.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
player.setQualityFor('video', 1); // Set to bitrate index 1
```

### 1.6 Multiple Audio Tracks

#### HTML5 Audio Tracks
```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="en.vtt" srclang="en" label="English">
  <track kind="captions" src="es.vtt" srclang="es" label="Spanish">
</video>
```

#### Accessing Audio Tracks (MP4, MKV)
```javascript
const video = document.querySelector('video');

// Get audio tracks
const audioTracks = video.audioTracks;

console.log('Available audio tracks:');
for (let i = 0; i < audioTracks.length; i++) {
  console.log(`${i}: ${audioTracks[i].label} (${audioTracks[i].language})`);
}

// Switch audio track
audioTracks[1].enabled = true;  // Enable second audio track
audioTracks[0].enabled = false; // Disable first audio track

// Listen for track changes
audioTracks.addEventListener('change', () => {
  for (let i = 0; i < audioTracks.length; i++) {
    if (audioTracks[i].enabled) {
      console.log('Current audio track:', audioTracks[i].label);
    }
  }
});
```

### 1.7 Subtitles & Captions

#### VTT Format (WebVTT)
```
WEBVTT

00:00:00.000 --> 00:00:02.000
Hello, this is the first subtitle

00:00:02.500 --> 00:00:05.000
This is the second subtitle

00:00:05.500 --> 00:00:08.000
And this is the third one
```

#### Adding Subtitles
```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="subtitles" src="en.vtt" srclang="en" label="English">
  <track kind="subtitles" src="es.vtt" srclang="es" label="Spanish">
  <track kind="captions" src="en-cc.vtt" srclang="en" label="English (CC)">
</video>
```

#### Accessing Text Tracks
```javascript
const video = document.querySelector('video');
const textTracks = video.textTracks;

// Get all tracks
for (let i = 0; i < textTracks.length; i++) {
  console.log(`${i}: ${textTracks[i].label} (${textTracks[i].kind})`);
}

// Show/hide specific track
textTracks[0].mode = 'showing';   // Show
textTracks[1].mode = 'hidden';    // Hide
textTracks[2].mode = 'disabled';  // Disabled

// Listen for cue changes
textTracks[0].addEventListener('cuechange', () => {
  const activeCues = textTracks[0].activeCues;
  if (activeCues.length > 0) {
    console.log('Current subtitle:', activeCues[0].text);
  }
});
```

### 1.8 Poster Image

```html
<video width="320" height="240" poster="image.jpg" controls>
  <source src="movie.mp4" type="video/mp4">
</video>
```

### 1.9 Lazy Loading & Preload

```html
<!-- Lazy load - don't preload anything -->
<video controls preload="none">
  <source src="video.mp4" type="video/mp4">
</video>

<!-- Preload metadata only -->
<video controls preload="metadata">
  <source src="video.mp4" type="video/mp4">
</video>

<!-- Preload entire video -->
<video controls preload="auto">
  <source src="video.mp4" type="video/mp4">
</video>
```

#### Intersection Observer for Lazy Loading
```javascript
const videos = document.querySelectorAll('video[data-src]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const video = entry.target;
      const source = document.createElement('source');
      source.src = video.dataset.src;
      source.type = 'video/mp4';
      video.appendChild(source);
      video.load();
      observer.unobserve(video);
    }
  });
});

videos.forEach(video => observer.observe(video));
```

### 1.10 Video Formats & Codecs

#### Common Video Formats
| Format | Container | Video Codec | Audio Codec | Browser Support |
|--------|-----------|------------|------------|-----------------|
| MP4 | .mp4 | H.264 | AAC | All modern browsers |
| WebM | .webm | VP8/VP9 | Vorbis/Opus | Chrome, Firefox, Opera |
| Ogg | .ogv | Theora | Vorbis | Firefox, Chrome, Opera |
| MOV | .mov | H.264 | AAC | Safari, Chrome |

#### Codec Detection
```javascript
const video = document.createElement('video');

// Check codec support
const canPlayMP4 = video.canPlayType('video/mp4; codecs="avc1.42E01E"');
const canPlayWebM = video.canPlayType('video/webm; codecs="vp8, vorbis"');
const canPlayOgg = video.canPlayType('video/ogg; codecs="theora"');

console.log('MP4 support:', canPlayMP4);      // "probably", "maybe", or ""
console.log('WebM support:', canPlayWebM);
console.log('Ogg support:', canPlayOgg);
```

#### Multiple Format Fallback
```html
<video controls width="640" height="360">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <source src="video.ogv" type="video/ogg">
  Your browser does not support HTML5 video.
</video>
```

---

## 2. AUDIO

### 2.1 Playing Static Audio

#### Basic HTML5 Audio Tag
```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>
```

#### Audio Tag Attributes
- `controls` - Show play/pause and volume controls
- `autoplay` - Start playing automatically
- `muted` - Mute by default
- `loop` - Repeat when finished
- `preload` - Preload behavior (none, metadata, auto)

### 2.2 Playing Audio by Link

```html
<audio controls>
  <source src="https://example.com/audio.mp3" type="audio/mpeg">
</audio>
```

### 2.3 Audio Controls & Download

#### Enable Download
```html
<a href="/assets/audio.mp3" download="my-audio.mp3">Download Audio</a>
```

#### JavaScript Audio API
```javascript
const audio = document.querySelector('audio');

// Play/Pause
audio.play();
audio.pause();

// Properties
console.log(audio.currentTime);
console.log(audio.duration);
console.log(audio.volume);
console.log(audio.muted);

// Events
audio.addEventListener('play', () => console.log('Playing'));
audio.addEventListener('pause', () => console.log('Paused'));
audio.addEventListener('ended', () => console.log('Ended'));
audio.addEventListener('timeupdate', () => console.log('Time:', audio.currentTime));
```

### 2.4 Custom Audio Controls

```html
<div class="audio-player">
  <audio id="myAudio">
    <source src="audio.mp3" type="audio/mpeg">
  </audio>
  
  <div class="controls">
    <button id="playBtn">Play</button>
    <button id="pauseBtn">Pause</button>
    <input type="range" id="progressBar" min="0" max="100" value="0">
    <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
    <input type="range" id="volumeControl" min="0" max="100" value="100">
  </div>
</div>
```

```javascript
const audio = document.getElementById('myAudio');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const progressBar = document.getElementById('progressBar');
const volumeControl = document.getElementById('volumeControl');

playBtn.addEventListener('click', () => audio.play());
pauseBtn.addEventListener('click', () => audio.pause());

audio.addEventListener('timeupdate', () => {
  progressBar.value = (audio.currentTime / audio.duration) * 100;
});

progressBar.addEventListener('input', () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value / 100;
});
```

### 2.5 Audio Streaming

#### HLS Audio Streaming
```javascript
const audio = document.getElementById('audio');
const hlsUrl = 'https://example.com/audio-stream.m3u8';

if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource(hlsUrl);
  hls.attachMedia(audio);
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    audio.play();
  });
}
```

### 2.6 Audio Formats

| Format | Codec | Browser Support | Use Case |
|--------|-------|-----------------|----------|
| MP3 | MPEG-3 | All browsers | Most compatible |
| WAV | PCM | All browsers | High quality, large file |
| OGG | Vorbis | Firefox, Chrome, Opera | Open source |
| AAC | AAC | All browsers | Good quality, smaller file |
| FLAC | FLAC | Chrome, Firefox | Lossless compression |

#### Audio Format Detection
```javascript
const audio = document.createElement('audio');

const canPlayMP3 = audio.canPlayType('audio/mpeg');
const canPlayOgg = audio.canPlayType('audio/ogg');
const canPlayWav = audio.canPlayType('audio/wav');
const canPlayAAC = audio.canPlayType('audio/aac');

console.log('MP3:', canPlayMP3);
console.log('OGG:', canPlayOgg);
console.log('WAV:', canPlayWav);
console.log('AAC:', canPlayAAC);
```

### 2.7 Audio Subtitles/Captions

```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <track kind="captions" src="en.vtt" srclang="en" label="English">
  <track kind="captions" src="es.vtt" srclang="es" label="Spanish">
</audio>
```

---

## 3. STREAMING

### 3.1 Streaming Fundamentals

**Streaming** is the continuous delivery of media content over the internet without requiring the entire file to be downloaded first.

#### Advantages
- Reduced initial buffering time
- Lower bandwidth usage
- Adaptive quality based on connection
- Better user experience

### 3.2 Adaptive Bitrate Streaming

#### How It Works
1. Backend encodes video/audio in multiple bitrates (500kbps, 1Mbps, 2Mbps, etc.)
2. Manifest file lists all available bitrates
3. Client measures available bandwidth
4. Client downloads segments at appropriate bitrate
5. Quality adjusts dynamically based on network conditions

#### Bitrate Selection Algorithm
```javascript
function selectBitrate(availableBandwidth, availableBitrates) {
  // Select bitrate that uses ~80% of available bandwidth
  const targetBitrate = availableBandwidth * 0.8;
  
  let selectedBitrate = availableBitrates[0];
  for (let bitrate of availableBitrates) {
    if (bitrate <= targetBitrate) {
      selectedBitrate = bitrate;
    } else {
      break;
    }
  }
  
  return selectedBitrate;
}

const availableBitrates = [500000, 1000000, 2000000, 4000000]; // bps
const bandwidth = 2500000; // 2.5 Mbps
const selected = selectBitrate(bandwidth, availableBitrates);
console.log('Selected bitrate:', selected); // 2000000
```

### 3.3 HLS (HTTP Live Streaming)

#### Master Playlist (.m3u8)
```
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=640x360
stream-500k.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=1280x720
stream-1m.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1920x1080
stream-2m.m3u8
```

#### Media Playlist (.m3u8)
```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10.0,
segment-0.ts
#EXTINF:10.0,
segment-1.ts
#EXTINF:10.0,
segment-2.ts
```

#### Implementation
```javascript
const video = document.getElementById('video');
const hlsUrl = 'https://example.com/master.m3u8';

const hls = new Hls({
  debug: false,
  enableWorker: true,
  lowLatencyMode: true,
});

hls.loadSource(hlsUrl);
hls.attachMedia(video);

hls.on(Hls.Events.MANIFEST_PARSED, () => {
  console.log('Manifest loaded');
  video.play();
});

// Monitor quality changes
hls.on(Hls.Events.hlsLevelSwitching, (data) => {
  const level = hls.levels[data.level];
  console.log(`Switched to ${level.height}p (${level.bitrate} bps)`);
});

// Handle errors
hls.on(Hls.Events.ERROR, (event, data) => {
  if (data.fatal) {
    console.error('Fatal error:', data.type);
  }
});
```

### 3.4 DASH (Dynamic Adaptive Streaming over HTTP)

#### MPD Manifest
```xml
<?xml version="1.0" encoding="UTF-8"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" minBufferTime="PT1.5S" type="dynamic" profiles="urn:mpeg:dash:profile:isoff-live:2011">
  <Period>
    <AdaptationSet mimeType="video/mp4" segmentAlignment="true">
      <Representation id="1" bandwidth="500000" width="640" height="360">
        <BaseURL>video-500k.mp4</BaseURL>
      </Representation>
      <Representation id="2" bandwidth="1000000" width="1280" height="720">
        <BaseURL>video-1m.mp4</BaseURL>
      </Representation>
      <Representation id="3" bandwidth="2000000" width="1920" height="1080">
        <BaseURL>video-2m.mp4</BaseURL>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
```

#### Implementation
```javascript
const video = document.getElementById('video');
const dashUrl = 'https://example.com/stream.mpd';

const player = dashjs.MediaPlayer().create();
player.initialize(video, dashUrl, true);

// Get available bitrates
const bitrateList = player.getBitrateList('video');
console.log('Available bitrates:', bitrateList);

// Set specific bitrate
player.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
player.setQualityFor('video', 1);

// Monitor quality changes
player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, (data) => {
  console.log('Quality changed to:', data.newQuality);
});
```

### 3.5 Multiple Audio & Subtitle Tracks in Streaming

#### HLS with Multiple Tracks
```
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=2000000,AUDIO="audio-group-1",SUBTITLES="subtitle-group-1"
stream.m3u8
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio-group-1",NAME="English",DEFAULT=YES,LANGUAGE="en",URI="audio-en.m3u8"
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio-group-1",NAME="Spanish",LANGUAGE="es",URI="audio-es.m3u8"
#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subtitle-group-1",NAME="English",DEFAULT=YES,LANGUAGE="en",URI="subs-en.vtt"
#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subtitle-group-1",NAME="Spanish",LANGUAGE="es",URI="subs-es.vtt"
```

#### Accessing Tracks
```javascript
const hls = new Hls();
hls.loadSource(hlsUrl);
hls.attachMedia(video);

hls.on(Hls.Events.MANIFEST_PARSED, () => {
  // Get audio tracks
  const audioTracks = hls.audioTracks;
  console.log('Audio tracks:', audioTracks);
  
  // Switch audio track
  hls.audioTrack = 1; // Switch to second audio track
  
  // Get subtitle tracks
  const subtitleTracks = hls.subtitleTracks;
  console.log('Subtitle tracks:', subtitleTracks);
  
  // Switch subtitle track
  hls.subtitleTrack = 0; // Switch to first subtitle track
});
```

---

## 4. RECORDING & CAPTURING

### 4.1 Capturing Photos

#### Using getUserMedia API
```javascript
async function capturePhoto() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    // Convert to image
    const imageUrl = canvas.toDataURL('image/png');
    console.log('Photo captured:', imageUrl);
    
    // Stop stream
    stream.getTracks().forEach(track => track.stop());
    
    return imageUrl;
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
}
```

### 4.2 Capturing Video/Audio

#### Using MediaRecorder API
```javascript
async function captureVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    });
    
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      document.body.appendChild(video);
      
      // Download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recording.webm';
      a.click();
    };
    
    mediaRecorder.start();
    
    // Stop after 10 seconds
    setTimeout(() => mediaRecorder.stop(), 10000);
    
  } catch (error) {
    console.error('Error accessing media:', error);
  }
}
```

### 4.3 Capturing Screen/Tab

#### Using getDisplayMedia API
```javascript
async function captureScreen() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ 
      video: { cursor: 'always' },
      audio: false 
    });
    
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'screen-recording.webm';
      a.click();
    };
    
    mediaRecorder.start();
    
    // Stop when user stops sharing
    stream.getTracks()[0].onended = () => {
      mediaRecorder.stop();
    };
    
  } catch (error) {
    console.error('Error capturing screen:', error);
  }
}
```

### 4.4 Recording from Stream

#### Recording from MediaStream
```javascript
async function recordStream(streamUrl) {
  try {
    // Fetch stream
    const response = await fetch(streamUrl);
    const blob = await response.blob();
    
    // Create media element
    const audio = new Audio();
    audio.src = URL.createObjectURL(blob);
    
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementAudioSource(audio);
    
    // Create recorder
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);
    
    const mediaRecorder = new MediaRecorder(destination.stream);
    const chunks = [];
    
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recording.webm';
      a.click();
    };
    
    audio.play();
    mediaRecorder.start();
    
    // Stop after stream ends
    audio.onended = () => mediaRecorder.stop();
    
  } catch (error) {
    console.error('Error recording stream:', error);
  }
}
```

### 4.5 Combining Screen Sharing with Video

```javascript
async function recordScreenWithWebcam() {
  try {
    // Get screen
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
      video: true,
      audio: true 
    });
    
    // Get webcam
    const webcamStream = await navigator.mediaDevices.getUserMedia({ 
      video: true,
      audio: false 
    });
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    // Create video elements
    const screenVideo = document.createElement('video');
    screenVideo.srcObject = screenStream;
    screenVideo.play();
    
    const webcamVideo = document.createElement('video');
    webcamVideo.srcObject = webcamStream;
    webcamVideo.play();
    
    // Draw on canvas
    function drawFrame() {
      // Draw screen
      ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
      
      // Draw webcam in corner (picture-in-picture)
      const webcamWidth = 320;
      const webcamHeight = 240;
      ctx.drawImage(
        webcamVideo, 
        canvas.width - webcamWidth - 10, 
        canvas.height - webcamHeight - 10, 
        webcamWidth, 
        webcamHeight
      );
      
      requestAnimationFrame(drawFrame);
    }
    
    drawFrame();
    
    // Get canvas stream
    const canvasStream = canvas.captureStream(30);
    
    // Add audio from screen
    const audioTrack = screenStream.getAudioTracks()[0];
    if (audioTrack) {
      canvasStream.addTrack(audioTrack);
    }
    
    // Record
    const mediaRecorder = new MediaRecorder(canvasStream);
    const chunks = [];
    
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'combined-recording.webm';
      a.click();
    };
    
    mediaRecorder.start();
    
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 4.6 Sending as Stream vs Full File

#### Send as Stream (Chunked Upload)
```javascript
async function uploadAsStream(mediaRecorder) {
  const chunks = [];
  
  mediaRecorder.ondataavailable = async (e) => {
    chunks.push(e.data);
    
    // Send chunk immediately
    const formData = new FormData();
    formData.append('chunk', e.data);
    
    await fetch('/upload-chunk', {
      method: 'POST',
      body: formData
    });
  };
  
  mediaRecorder.start(1000); // Emit data every 1 second
}
```

#### Send as Full File
```javascript
async function uploadAsFile(mediaRecorder) {
  const chunks = [];
  
  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };
  
  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');
    
    await fetch('/upload', {
      method: 'POST',
      body: formData
    });
  };
  
  mediaRecorder.start();
}
```

---

## REVISION QUESTIONS

### Video Questions
1. What are the main attributes of the `<video>` tag?
2. How do you implement custom video controls?
3. What is the difference between HLS and DASH streaming?
4. How do you handle CORS when playing video from a different domain?
5. What is adaptive bitrate streaming and how does it work?
6. How do you add multiple audio tracks to a video?
7. How do you implement subtitles in HTML5 video?
8. What are the common video formats and their use cases?
9. How do you implement lazy loading for videos?
10. What keyboard shortcuts should a custom video player support?
11. How do you detect supported video codecs?
12. What is the purpose of the poster attribute?
13. How do you implement fullscreen video playback?
14. What are the main events of the HTMLVideoElement?
15. How do you control video playback speed?

### Audio Questions
1. What are the main attributes of the `<audio>` tag?
2. How do you implement custom audio controls?
3. What are the common audio formats and their use cases?
4. How do you detect supported audio codecs?
5. How do you add captions to audio?
6. What is the difference between audio streaming and static audio?
7. How do you implement audio visualization?
8. What are the main events of the HTMLAudioElement?
9. How do you control audio volume programmatically?
10. How do you implement audio equalizer?

### Streaming Questions
1. What is streaming and why is it preferred over downloading?
2. How does adaptive bitrate streaming work?
3. What is a manifest file in HLS/DASH?
4. How do you implement HLS streaming with hls.js?
5. How do you implement DASH streaming with dash.js?
6. How do you handle multiple audio tracks in streaming?
7. How do you handle multiple subtitle tracks in streaming?
8. What is timestamp synchronization in streaming?
9. How do you monitor quality changes in streaming?
10. How do you handle streaming errors?
11. What is the difference between live and on-demand streaming?
12. How do you implement low-latency streaming?
13. What are the bandwidth requirements for different bitrates?
14. How do you implement bitrate selection algorithm?
15. What are the performance considerations for streaming?

### Recording & Capturing Questions
1. What is the getUserMedia API and how do you use it?
2. How do you capture a photo from a webcam?
3. How do you record video and audio using MediaRecorder?
4. How do you capture screen/tab using getDisplayMedia?
5. What is the difference between sending recording as stream vs full file?
6. How do you combine screen sharing with webcam video?
7. What are the supported MIME types for MediaRecorder?
8. How do you handle permissions for media capture?
9. How do you stop and save a recording?
10. What are the browser compatibility considerations for media capture?
11. How do you implement picture-in-picture recording?
12. How do you record audio from a stream?
13. What is the AudioContext API and how do you use it?
14. How do you implement real-time audio processing?
15. What are the performance considerations for recording?

---

## MINDMAP

![Web Media Handling Mindmap](../../public/assets/img/web-media-handling.png)
