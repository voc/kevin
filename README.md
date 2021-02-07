# Killer Experimental Video Internet Noise, KEVIN
WebRTC conferencing tool for bringing video and audio from multiple devices/participants into your video mixer.

## Install/Build
Clone the repository

```
git clone https://github.com/voc/kevin.git
cd kevin
npm install && npm run build
```

## Deployment
- Build and serve the kevin static files via your webserver
- Setup https://github.com/muaz-khan/RTCMultiConnection-Server on the same URL as signalling backend (preferably via a Reverse-Proxy)
  - witht the default setup you need to set ```"socketMessageEvent": "rC3-VOCcast-Message"``` in the RTCMultiConnection-Server config.json

## Usage
### URL parameters
- roomid - use a fixed roomid (for all modes)
- width - pass custom width to ```/view```
- record - record the stream (activated if set at all)

## Contributing
Build and install dependencies like above.

### Run hot-reloading dev server
```
npm run start
```

### Use a RTCMulti server at a different address
You can overwrite the default backend from a .env file like so:
```bash
BACKEND_URL=http://localhost:5001/
```

### Changing webpack options
List the current webpack config with:
```
npx neutrino --inspect
```
It can be modified via .neutrinorc.js
