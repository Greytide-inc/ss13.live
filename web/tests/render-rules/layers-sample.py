#!/usr/bin/env python3
# layers-sample.py IMAGE [ORIGIN_X ORIGIN_Y] - print who is on top at two points of every layers.dm case tile.
# Origin = screen pixel of tile (1,11)'s top-left (BYOND capture: 39,303). At (22,24) only overlay+Q overlap; at (12,10) only P+overlay.
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert("RGB")
ox, oy = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (39, 303)
names = {(220, 30, 30): "P", (40, 80, 240): "O", (30, 200, 30): "Q", (240, 220, 20): "Y"}
def at(x, y, px, py):  # BYOND tile x,y and pixel offset (from bottom-left)
	c = im.getpixel((ox + (x - 1) * 32 + px, oy + (11 - y) * 32 + 31 - py))
	return names.get(c, "?%s" % (c,))
for y, xs in [(9, range(2, 13, 2)), (7, range(2, 11, 2)), (5, range(2, 11, 2)), (3, range(2, 11, 2))]:
	print("row", y, " ".join("x%d:%s" % (x, at(x, y, 22, 24) + at(x, y, 12, 10) + at(x, y, 24, 15)) for x in xs))
