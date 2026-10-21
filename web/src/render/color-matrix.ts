// color-matrix - Applies a BYOND color-matrix `color` (a flat 20-number list) to RGBA pixel data,
// in place. Pulled out of station-client.ts so it has no DOM dependency and can be unit
// tested directly under Node (see web/tests/draw/draw.test.ts).
//
// BYOND's matrix format (DM reference, `atom/color` set to a 20-item list): the list is 5 rows of 4
// numbers. Row 0..3 give, respectively, how much the input pixel's R, G, B and A component
// contributes to each of the output R, G, B, A channels; row 4 is a constant added to each output
// channel regardless of input. tg's own lighting code builds exactly this shape (see
// code/modules/lighting/lighting_object.dm's update(), and LIGHTING_BASE_MATRIX in
// code/__DEFINES/lighting.dm):
//
//   list(rr,rg,rb,0,  gr,gg,gb,0,  br,bg,bb,0,  ar,ag,ab,0,  0,0,0,1)
//    row0=R-input row1=G-input row2=B-input row3=A-input row4=constant
//
// so e.g. row2 (br,bg,bb,0) is how much the sprite's *blue* channel at a pixel contributes to that
// pixel's output R/G/B/A -- and tg's lighting_object.dm sets that row to "cb", the cached light
// color of one of the tile's four corners. The base sprite (icons/effects/lighting_object.dmi,
// icon_state "") is a flat-shaded gradient where each corner is pure R, pure G, pure B or pure A
// (confirmed by inspecting the .dmi directly: top-left corner pixel is (0,0,255,1) -- pure blue --
// top-right is (0,0,0,255) -- pure alpha -- bottom-left (255,0,0,1) -- pure red -- bottom-right
// (0,255,0,1) -- pure green), so plugging each corner's pixel through the matrix yields exactly that
// corner's own light color there, and BYOND's normal bilinear scaling of the icon across the tile
// blends smoothly between the four corners' colors in between -- a lighting gradient baked into a
// generic pixel-shader-free 2D engine via ordinary icon scaling + a color matrix.
//
// Flat index into the 20-number list: m[row*4 + col], row 0..3 = input R,G,B,A, row 4 = constant;
// col 0..3 = output R,G,B,A. So for input (r,g,b,a) in 0..1:
//   outR = r*m[0] + g*m[4] + b*m[8]  + a*m[12] + m[16]
//   outG = r*m[1] + g*m[5] + b*m[9]  + a*m[13] + m[17]
//   outB = r*m[2] + g*m[6] + b*m[10] + a*m[14] + m[18]
//   outA = r*m[3] + g*m[7] + b*m[11] + a*m[15] + m[19]

/** Applies `m` (BYOND's flat 20-number color-matrix format) to every RGBA pixel in `data`
 *  (e.g. an ImageData.data view), in place. Assigning into a Uint8ClampedArray already rounds and
 *  clamps to 0..255 per spec, so the math below is plain float arithmetic in 0..1 space. */
export function applyColorMatrix(data: Uint8ClampedArray, m: readonly number[]): void {
	for (let i = 0; i < data.length; i += 4) {
		const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255, a = data[i + 3] / 255;
		const outR = r * m[0] + g * m[4] + b * m[8] + a * m[12] + m[16];
		const outG = r * m[1] + g * m[5] + b * m[9] + a * m[13] + m[17];
		const outB = r * m[2] + g * m[6] + b * m[10] + a * m[14] + m[18];
		const outA = r * m[3] + g * m[7] + b * m[11] + a * m[15] + m[19];
		data[i] = outR * 255;
		data[i + 1] = outG * 255;
		data[i + 2] = outB * 255;
		data[i + 3] = outA * 255;
	}
}
