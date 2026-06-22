# AR Drawing

A free, browser-based AR drawing tool. Upload any image and trace it on paper using your phone camera — no app install needed.

Live: [ardrawing-nu.vercel.app](https://ardrawing-nu.vercel.app)

## What it does

Projects a semi-transparent image overlay on top of your camera feed. Place a sheet of paper in front of your screen, adjust the opacity, and trace the outline.

## Features

- Live camera feed with image overlay
- Adjustable opacity and size
- Rotate overlay — slider or two-finger twist gesture
- Drag to reposition, pinch to zoom
- Flip horizontal / vertical
- Invert image colors
- Grid overlay — rule of thirds, square grid, or both
- Freeze frame
- Front / rear camera switch
- Wake lock — screen stays on while tracing
- PWA — install to home screen, works offline

## Usage

1. Open the site in Safari (iOS) or Chrome (Android)
2. Allow camera access
3. Tap the image area or press **Image** to upload a reference photo
4. Adjust opacity so you can see both the image and the paper underneath
5. Place paper on your screen or hold your phone over the paper and trace

To install as an app: Safari → Share → Add to Home Screen.

## Tech stack

- React + Vite
- WebRTC (`getUserMedia`) for camera
- Wake Lock API
- CSS transforms for overlay manipulation
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` — camera works on localhost without HTTPS.

## License

MIT