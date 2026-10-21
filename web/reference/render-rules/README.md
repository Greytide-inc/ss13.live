# BYOND 511 render rules

Real DreamSeeker 511.1385 (Wine) showing the test world in `web/tests/render-rules/`, on a nested
Xephyr display. The map element uses tg's skin settings (Arial 7pt, text-color none). Wine draws
Arial with Liberation Sans, which has the same metrics.
Reproduce: `web/tests/render-rules/run.sh` (about 40 s; output in `web/build/render-rules/`).

- `byond-511-render-rules.png` (and `-2x`): the 15x11 map at 32 px per tile. Coloured blocks are the maptext boxes.
- `byond-511-anim-strip.png`: animation rows every 0.5 s. Columns are plain, rewind, loop=2, and rewind+loop=2. The top row of each pair appeared at t=0, the lower row at t=2.5 s.
- `byond-511-anim-timeline.txt`: frame index per tile at 20 fps (`frames.py`).

Layout (tile x,y of the box's bottom-left; boxes are 96x64 unless noted):
row 11: tg HUD string `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'>` "42" (32x32), `<div align='center'>DV` (96x32), `<div valign='middle'>VM` (96x32), same HUD string "100%", `style='position:relative; left:6px'` P6.
rows 9-10: "Hi"; wrap (64x64); `<span right>R1</span><br>L2`; `L1<br><span right>R2</span>`.
rows 6-7: `<span center>C1</span><br><span right>R2</span>`; wrap overflow (64x32); long word (64x64); `L<span center>CC</span>`.
row 4: arrow (points up, green block lower-right, yellow top-left) as plain, scale 2, turn 90, turn 45, translate(16,8), Scale(2,1).Turn(90).Translate(16,0) = (0,1,16,-2,0,0), shear (1,0.5,0,0,1,0).

| Rule | BYOND 511 result | Ours before | Fixed? |
|---|---|---|---|
| Maptext vertical anchor | Bottom of the box. The text grows upward. If it overflows, the top lines are clipped | Bottom | Already right |
| `<div valign>` | top/middle/bottom work in 511 (tg's HUD counters sit mid-box) | Tag dropped (thought to be 512+) | Yes |
| Word wrap | Breaks at spaces. A word wider than the box is split mid-word | Same | Already right |
| text-align / `<div align>` | One alignment for the whole box: the one in effect at the first text character. `R1(right)<br>L2` is all right; `L1<br>R2(right)` is all left; `L<center>CC` is left | Last `text-align` wins; `<div align>` dropped | Yes |
| `position:relative; left:6px` | Ignored | Ignored | Already right |
| Default maptext font | Arial 7pt (9.33 px). Cap height 7 px, line pitch 9 px, baseline 3 px above the line bottom. White with tg's skin (black with BYOND's default skin) | 7 **px** sans-serif, 1.3 line height, white | Yes |
| transform scale | Around the icon centre | Same | Already right |
| transform turn | Clockwise, around the centre. BYOND stores turn(90) as (0,1,0,-1,0,0) | Same (corrected earlier) | Already right |
| transform translate | c = right, f = up | Same | Already right |
| Combination | The matrix procs compose in call order (scale, then turn, then translate); the renderer only sees the final a-f | Same | Already right (new test) |
| Shear b=0.5 | Top of the icon leans right (x' = x + b*y) | Same | Already right (new test) |
| Rewind | 0 1 2 3 2 1, then repeat. Both end frames show once | Same | Already right |
| loop=N, plain | Plays N times, then stays on the **last** frame | Same | Already right |
| loop=N, rewind | 0123210123210, then stays on **frame 0** | Stayed on frame 1 (the last step) | Yes |
| Animation clock | loop=0 states run on one shared clock: a copy made 2.5 s later shows the same frame as the first. loop>0 states start from frame 0 when the object appears | One shared clock for everything | loop=0 right. Per-object start for loop>0 is not modelled (nothing in the dumps uses it) |

## FLOAT_LAYER ordering

`byond-511-layers.png` (and `-2x`): BYOND 511.1385 capture of `tests/render-rules/layers.dm` (`run.sh layers`). Each case is one
tile: P (red, layer 3) with a blue overlay/underlay, and Q (green) an obj on the same tile. `layers-sample.py` reads who is on top.
Ours (`?scene=layers-demo`, `src/render/layers-demo.ts`) is pixel-identical to it over the whole 480x352 map.

| Rule | BYOND 511 |
|---|---|
| Floating overlay (layer FLOAT_LAYER) | Draws with its owner, just above it, inside the owner's layer slot. Q at 3.01, 3.5, 4 draws over it; Q at 2.99 under it. Q at layer 3 (same as owner): whoever was created later is on top (Q first, then P: overlay over Q) |
| Floating underlay | Just below the owner, above everything on a lower layer (Q at 2.99 and 2.5 both under it) |
| Explicit-layer overlay/underlay (layer >= 0) | Absolute: sorts against every atom at that layer (overlay 4.5 over Q 4; overlay 3.5 under Q 4; underlay 3.6 over P and Q 3.5). Tie with Q at the same layer: owner's creation order |
| Two floating overlays | FLOAT_LAYER-1 (-2) under FLOAT_LAYER (-1), whatever the list order; equal layers: later in the list on top |
| Old renderer | Drew underlays over the owner; explicit-layer overlays only at the owner's layer (Q 4 wrongly over overlay 4.5) |
