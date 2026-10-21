#!/usr/bin/env python3
# frames.py - Read which animation frame each anim tile shows in every captured video frame.
# Usage: frames.py DIR_OF_PNGS  (from ffmpeg -i cap.mkv DIR/%04d.png, 20 fps). Prints one line per change.
import sys, os
from PIL import Image
cols = {(230, 30, 30): "0", (30, 200, 30): "1", (40, 80, 240): "2", (240, 220, 20): "3"}
names = ["plain", "rw", "lp", "rwlp"]
tiles = [(f"{names[i]}@row{y}", 39 + (1 + i * 3) * 32 + 16, 303 + (11 - y) * 32 + 27) for y in (2, 1) for i in range(4)]
d = sys.argv[1]; prev = None
for n, f in enumerate(sorted(os.listdir(d))):
	im = Image.open(os.path.join(d, f)).convert("RGB")
	cur = " ".join(cols.get(im.getpixel((x, y)), ".") for _, x, y in tiles)
	if cur != prev: print(f"t={n / 20:6.2f}s  {cur}")
	prev = cur
print("columns:", " ".join(t[0] for t in tiles))
