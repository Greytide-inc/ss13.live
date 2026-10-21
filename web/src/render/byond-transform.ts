// byond-transform - Converts a BYOND appearance's `transform` (the /matrix a,b,c,d,e,f pair) into
// HTML Canvas's `setTransform`/`ctx.transform` convention, and applies it around an icon's own
// centre the way BYOND renders it.
//
// BYOND matrix convention (DM reference, /matrix): matrix(a,b,c,d,e,f) maps a point (x,y) -- pixel
// offsets from the icon's centre, BYOND's y-up space -- to
//   x' = a*x + b*y + c
//   y' = d*x + e*y + f
// so c and f are the translate. tg itself confirms this: parallax.dm builds its slide-in offsets as
// matrix(1,0,0,0,1,480) for NORTH (f = +480 px up) and matrix(1,0,480,0,1,0) for EAST, and
// fullscreen.dm's matrix(200,0,0,0,200,0) is a plain 200x scale. matrix.Turn(t) is clockwise:
// a=cos t, b=sin t, d=-sin t, e=cos t.
// (Fix: the first version used canvas's own a..f order, which misread every one of
// those tg matrices.)
//
// Canvas's 2D matrix [A,B,C,D,E,F] means x' = A*x + C*y + E, y' = B*x + D*y + F with y DOWN.
// Flipping y on the way in and out (y_byond = -y_canvas):
//   x' = a*x - b*y + c           -> A = a,  C = -b, E = c
//   -y' = d*x - e*y + f -> y' = -d*x + e*y - f  -> B = -d, D = e, F = -f
// So canvas = [a, -d, -b, e, c, -f]. Checks in tests/draw/byond-transform.test.ts.

// A 6-number [a,b,c,d,e,f] array, same shape as Appearance.transform (number[] | null). Kept as a
// plain readonly array rather than a fixed 6-tuple so callers can pass an Appearance's `transform`
// straight through without a length-unchecked cast.
export type ByondMatrix = readonly number[];
export type CanvasMatrix = readonly [number, number, number, number, number, number];

export function byondMatrixToCanvas(m: ByondMatrix): CanvasMatrix {
	const [a, b, c, d, e, f] = m;
	return [a, -d, -b, e, c, -f];
}

/** Draws one icon rect, optionally applying a BYOND transform around the rect's own centre.
 *  `dx,dy` is the rect's normal (untransformed) top-left destination -- i.e. what the caller would
 *  pass to a plain ctx.drawImage. When `transform` is null this is exactly that plain drawImage
 *  (fast path, no save/restore); when present, the image is drawn centred at (dx+w/2, dy+h/2) and
 *  the BYOND matrix (converted to canvas space) is applied around that centre, so pixel_x/pixel_y
 *  positioning (baked into dx,dy by the caller) and `transform` compose the way BYOND's own e/f
 *  translate would layer on top of an already-placed icon. */
export function drawImageWithTransform(
	ctx: CanvasRenderingContext2D,
	img: CanvasImageSource,
	src: { x: number; y: number; w: number; h: number },
	dx: number,
	dy: number,
	transform: ByondMatrix | null,
): void {
	if (!transform) {
		ctx.drawImage(img, src.x, src.y, src.w, src.h, dx, dy, src.w, src.h);
		return;
	}
	const [ca, cb, cc, cd, ce, cf] = byondMatrixToCanvas(transform);
	const cx = dx + src.w / 2;
	const cy = dy + src.h / 2;
	ctx.save();
	ctx.translate(cx, cy);
	ctx.transform(ca, cb, cc, cd, ce, cf);
	ctx.drawImage(img, src.x, src.y, src.w, src.h, -src.w / 2, -src.h / 2, src.w, src.h);
	ctx.restore();
}
