// From Types/Sound.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13814, "/sound", "/datum", {
	file: null,
	repeat: 0,
	wait: 0,
	channel: 0,
	volume: 100,
	frequency: 0,
	pitch: 0,
	pan: 0,
	params: null,
	falloff: 1,
	atom: null,
	transform: null,
	x: null,
	y: null,
	z: null,
	environment: null,
	echo: null,
	len: null,
	offset: null,
	priority: 0,
	status: 0,
});

// /sound/proc/New  (Types/Sound.dm:30)
rt.def("/sound/proc/New", function New(f: Frame, file: Value, repeat: Value, wait: Value, channel: Value, volume: Value) {
	let copy_from: Value = null;
	f.vars = () => [repeat, copy_from];
	if (live(repeat) === null) {
		repeat = 0;
	}
	if (truthy((rt.istype(live(file), T("/sound")) ? 1 : 0))) {
		copy_from = live(file);
		rt.setFv(f, "file", live(f.src), rt.fv(f, "file", live(copy_from)));
		rt.setFv(f, "repeat", live(f.src), rt.fv(f, "repeat", live(copy_from)));
		rt.setFv(f, "wait", live(f.src), rt.fv(f, "wait", live(copy_from)));
		rt.setFv(f, "channel", live(f.src), rt.fv(f, "channel", live(copy_from)));
		rt.setFv(f, "volume", live(f.src), rt.fv(f, "volume", live(copy_from)));
	} else {
		if (live(file) !== null) {
			rt.setFv(f, "file", live(f.src), live(file));
		}
		rt.setFv(f, "repeat", live(f.src), live(repeat));
		if (live(wait) !== null) {
			rt.setFv(f, "wait", live(f.src), live(wait));
		}
		if (live(channel) !== null) {
			rt.setFv(f, "channel", live(f.src), live(channel));
		}
		if (live(volume) === null) return f.dot;
		rt.setFv(f, "volume", live(f.src), live(volume));
	}
	return f.dot;
});
