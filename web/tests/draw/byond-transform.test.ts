// byond-transform.test - Pure checks for byond-transform.ts's BYOND-matrix-to-canvas-matrix
// conversion (convention fixed by hand). No DOM/canvas needed -- just the
// a..f arithmetic -- so this runs under plain Node.
//
// BYOND: x' = a*x + b*y + c, y' = d*x + e*y + f (y up). Canvas: x' = A*x + C*y + E, y' = B*x + D*y + F
// (y down). Every expected value below uses a real tg matrix where there is one.
//
// Usage: part of npm test (tests/all.mjs).

import { byondMatrixToCanvas } from "../../src/render/byond-transform.js";

let failures = 0;
function fail(msg: string): void {
	failures++;
	console.log(`FAIL ${msg}`);
}
function closeArr(actual: readonly number[], expected: readonly number[], label: string): void {
	for (let i = 0; i < expected.length; i++) {
		if (Math.abs(actual[i] - expected[i]) > 1e-9) {
			fail(`${label}: index ${i} expected ${expected[i]}, got ${actual[i]} (full: [${actual.join(",")}])`);
			return;
		}
	}
}
function applyCanvas(m: readonly number[], x: number, y: number): [number, number] {
	const [a, b, c, d, e, f] = m;
	return [a * x + c * y + e, b * x + d * y + f];
}

// 1. Identity: matrix() is a=1,e=1.
closeArr(byondMatrixToCanvas([1, 0, 0, 0, 1, 0]), [1, 0, 0, 1, 0, 0], "identity");

// 2. Scale: fullscreen.dm's lighting_backdrop matrix(200, 0, 0, 0, 200, 0).
closeArr(byondMatrixToCanvas([200, 0, 0, 0, 200, 0]), [200, 0, 0, 200, 0, 0], "scale 200x");

// 3. Translates: parallax.dm's slide-in offsets. NORTH matrix(1,0,0,0,1,480) moves 480 px up in
// BYOND = canvas y -480. EAST matrix(1,0,480,0,1,0) moves 480 px right.
closeArr(byondMatrixToCanvas([1, 0, 0, 0, 1, 480]), [1, 0, 0, 1, 0, -480], "translate north 480");
closeArr(byondMatrixToCanvas([1, 0, 480, 0, 1, 0]), [1, 0, 0, 1, 480, 0], "translate east 480");

// 4. Turn(90), clockwise: a=cos=0, b=sin=1, d=-sin=-1, e=cos=0. A point to the right of the centre
// (canvas (1,0)) must end up below it on screen (canvas (0,1)); a point above it (canvas (0,-1))
// must end up to its right (canvas (1,0)).
const rot90 = byondMatrixToCanvas([0, 1, 0, -1, 0, 0]);
closeArr(rot90, [0, 1, -1, 0, 0, 0], "Turn(90) matrix");
closeArr(applyCanvas(rot90, 1, 0), [0, 1], "Turn(90): right -> down");
closeArr(applyCanvas(rot90, 0, -1), [1, 0], "Turn(90): up -> right");

// 5. BYOND 511 screenshots (web/reference/render-rules/): matrices as BYOND logged them.
// Scale(2,1).Turn(90).Translate(16,0) = (0,1,16,-2,0,0): tip (canvas (0,-16)) lands 32 px right of the old centre.
closeArr(applyCanvas(byondMatrixToCanvas([0, 1, 16, -2, 0, 0]), 0, -16), [32, 0], "combo: tip -> right");
// Shear matrix(1,0.5,0,0,1,0): the top of the icon leans right (x' = x + 0.5*y, y up).
closeArr(applyCanvas(byondMatrixToCanvas([1, 0.5, 0, 0, 1, 0]), 0, -16), [8, -16], "shear: top leans right");

if (failures === 0) {
	console.log("ALL BYOND-TRANSFORM TESTS PASSED");
} else {
	console.log(`${failures} byond-transform test(s) FAILED`);
	process.exitCode = 1;
}
