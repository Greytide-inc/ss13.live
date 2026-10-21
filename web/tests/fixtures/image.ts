// image.ts - fixture for the client.images section (runImagesCheck): the DM tests/dm/image_helpers.dm (vlc_* are in los.ts).
import type { Frame, Value } from "./lib.js";
import { rt } from "./lib.js";
const { P, live, add, subtract } = rt;

rt.def("/proc/img_add", function img_add(f: Frame, C: Value, A: Value) {
	const I = rt.call(f, P("/proc/image"), null, [rt.rsc("bb_icon.dmi"), live(A), "cardboard_special", add(rt.get(f, live(A), "layer"), 1)]);
	rt.modField(f, live(C), "images", live(I), add);
	rt.set(f, live(I), "alpha", 0);
	rt.op(f, "Animate", [2, 10], [null, I, "pixel_z", 32, "alpha", 255, "time", 5, "easing", 5], false);
	return I;
});

rt.def("/proc/img_remove", function img_remove(f: Frame, C: Value, I: Value) {
	rt.modField(f, live(C), "images", live(I), subtract);
	return f.dot;
});

rt.def("/proc/img_fly", function img_fly(f: Frame, A: Value) {
	rt.set(f, live(A), "pixel_z", 12);
	rt.set(f, live(A), "pixel_w", -3);
	rt.set(f, live(A), "pixel_y", 2);
	return f.dot;
});

rt.def("/proc/img_step", function img_step(f: Frame, A: Value) {
	rt.set(f, live(A), "loc", rt.locate(rt.get(f, live(A), "x"), subtract(rt.get(f, live(A), "y"), 1), rt.get(f, live(A), "z")));
	return f.dot;
});
