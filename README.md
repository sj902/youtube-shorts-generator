# yt — auto shorts generator

A small pipeline that builds vertical short-form videos automatically. It pulls
stock portrait clips from [Pexels](https://www.pexels.com/) by hashtag, drops a
random royalty-free music track on top, and writes the finished shorts to a
dated output folder — ready to upload to YouTube Shorts, Reels, or TikTok.

## How it works

```
 Pexels API ──► get-videos/  ──► video/         (raw .mp4 clips)
                                    │
                                    ▼
 stock-music/  ──► joiner/    ──► opfiles/YYYY-MM-DD/   (final shorts)
```

1. **`get-videos/index.js`** picks a random tag from `YT_TAGS`, queries the
   Pexels API for portrait videos, and downloads the highest-resolution copy of
   each result into `video/`.
2. **`joiner/joiner.sh`** loops over those clips, picks a random track from
   `stock-music/`, trims it to the clip length with `ffmpeg`, and muxes audio +
   video into `opfiles/<today>/`.
3. **`run.sh`** runs the two steps end-to-end and clears the scratch `video/`
   folder afterwards.

## Requirements

- Node.js 16+
- [`ffmpeg`](https://ffmpeg.org/) and `ffprobe` on your `PATH`
- A free [Pexels API key](https://www.pexels.com/api/)

## Setup

```bash
cd get-videos
npm install
cd ..

export PEXELS_API_KEY=your_key_here
```

## Usage

Generate a batch of shorts using the default tags (`diwali`, `holi`):

```bash
./run.sh
```

Override the tag pool or batch size with env vars:

```bash
YT_TAGS="sunset,beach,city" YT_PER_PAGE=15 ./run.sh
```

Finished shorts land in `opfiles/<YYYY-MM-DD>/`.

## Layout

| Path           | Purpose                                                   |
| -------------- | --------------------------------------------------------- |
| `get-videos/`  | Node script that downloads portrait clips from Pexels     |
| `joiner/`      | Bash + ffmpeg script that adds music to each clip         |
| `stock-music/` | Royalty-free tracks from [Mixkit](https://mixkit.co/)     |
| `video/`       | Scratch folder for raw downloads (gitignored)             |
| `temp-audio/`  | Per-day trimmed audio cache (gitignored)                  |
| `opfiles/`     | Final shorts, organized by date (gitignored)              |
| `run.sh`       | End-to-end pipeline runner                                |

## Notes

- Music is from [Mixkit](https://mixkit.co/free-stock-music/) and is free to use.
- Video is sourced via the Pexels API and is also free to use; check Pexels'
  [licence](https://www.pexels.com/license/) before redistributing.
- The pipeline is intentionally simple — no scheduling, no upload step. Pair it
  with `cron` and the YouTube Data API if you want it fully hands-off.
