#!/usr/bin/env python3
# nested-sample.py IMAGE [ORIGIN_X ORIGIN_Y] - print the colour at points of every nested.dm case tile (row 9).
# Origin = screen pixel of tile (1,11)'s top-left (BYOND capture: 39,303, as layers-sample.py).
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert("RGB")
ox, oy = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (39, 303)
names = {(220, 30, 30): "P", (40, 80, 240): "O", (30, 200, 30): "Q", (240, 220, 20): "Y"}
def at(x, y, px, py):  # tile x,y and pixel offset from its bottom-left
	c = im.getpixel((ox + (x - 1) * 32 + px, oy + (11 - y) * 32 + 31 - py))
	return names.get(c, "-")
pts = [(2, 2), (2, 18), (18, 2), (18, 18), (10, 18), (10, 2), (26, 18), (26, 26)]
for x in range(2, 13, 2):
	print("x%d" % x, " ".join("%d,%d:%s" % (px, py, at(x, 9, px, py)) for px, py in pts))
print("row7", " ".join("x%d:%s" % (x, at(x, 7, 16, 16)) for x in range(2, 15)))
