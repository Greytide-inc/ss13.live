#!/usr/bin/env python3
# mk.py - Write the small test icons used by render_rules.dm (run from this folder).
from PIL import Image, ImageDraw
from PIL.PngImagePlugin import PngInfo
# floor: grey with a light border, so tile edges show in screenshots
im = Image.new("RGBA", (32, 32), (60, 60, 60, 255)); ImageDraw.Draw(im).rectangle([0, 0, 31, 31], outline=(140, 140, 140, 255)); im.save("floor.png")
# arrow: red, points up; green block lower-right; yellow block top-left. Shows turn direction and mirroring.
im = Image.new("RGBA", (32, 32), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
d.polygon([(16, 2), (28, 16), (20, 16), (20, 30), (12, 30), (12, 16), (4, 16)], fill=(220, 30, 30, 255))
d.rectangle([22, 24, 29, 29], fill=(30, 220, 30, 255)); d.rectangle([0, 0, 3, 3], fill=(250, 250, 0, 255))
im.save("arrow.png")
# maptext box backgrounds (the icon covers exactly the maptext box)
for w, h, c in [(96, 64, (20, 20, 120)), (64, 64, (20, 100, 20)), (64, 32, (110, 20, 20)), (32, 32, (20, 90, 110)), (96, 32, (90, 20, 110))]:
	Image.new("RGBA", (w, h), c + (255,)).save(f"bg{w}x{h}.png")
# anim.dmi: 4 frames, frame N is a solid colour with N+1 black bars (red, green, blue, yellow)
cols = [(230, 30, 30), (30, 200, 30), (40, 80, 240), (240, 220, 20)]
states = [("plain", 0, 0), ("rw", 1, 0), ("lp", 0, 2), ("rwlp", 1, 2)]  # name, rewind, loop
sheet = Image.new("RGBA", (32 * 4, 32 * len(states)), (0, 0, 0, 0))
desc = "# BEGIN DMI\nversion = 4.0\n\twidth = 32\n\theight = 32\n"
for r, (n, rw, lp) in enumerate(states):
	for f in range(4):
		fr = Image.new("RGBA", (32, 32), cols[f] + (255,)); fd = ImageDraw.Draw(fr)
		for b in range(f + 1): fd.rectangle([3 + b * 7, 6, 7 + b * 7, 18], fill=(0, 0, 0, 255))
		sheet.paste(fr, (f * 32, r * 32))
	desc += f'state = "{n}"\n\tdirs = 1\n\tframes = 4\n\tdelay = 5,5,5,5\n'
	if lp: desc += f"\tloop = {lp}\n"
	if rw: desc += "\trewind = 1\n"
desc += "# END DMI\n"
pi = PngInfo(); pi.add_text("Description", desc, zip=True); sheet.save("anim.dmi", "PNG", pnginfo=pi)
# layers world: squares in BYOND coords (x from left, y from bottom, inclusive) on a transparent 32x32
def sq(name, x0, y0, x1, y1, c):
	im = Image.new("RGBA", (32, 32), (0, 0, 0, 0)); ImageDraw.Draw(im).rectangle([x0, 31 - y1, x1, 31 - y0], fill=c + (255,)); im.save(name)
sq("sq_p.png", 0, 0, 19, 19, (220, 30, 30))      # parent / own icon: red
sq("sq_o.png", 8, 8, 27, 27, (40, 80, 240))       # overlay or underlay: blue
sq("sq_q.png", 4, 14, 23, 31, (30, 200, 30))      # neighbour obj: green
sq("sq_y.png", 14, 4, 31, 21, (240, 220, 20))     # second overlay: yellow
