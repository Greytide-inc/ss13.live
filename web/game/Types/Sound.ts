// Based on BYOND's Types/Sound.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// Sound.dm:30
rt.def("/sound/proc/New", function New(f: Frame, file: Value, repeat: Value, wait: Value, channel: Value, volume: Value) {
	let copy_from: Value = null;
	repeat ??= 0;
	if (rt.istype(file, T("/sound"))) {
		copy_from = file;
		this.file = copy_from.file;
		this.repeat = copy_from.repeat;
		this.wait = copy_from.wait;
		this.channel = copy_from.channel;
		this.volume = copy_from.volume;
	} else {
		if (file !== null) {
			this.file = file;
		}
		this.repeat = repeat;
		if (wait !== null) {
			this.wait = wait;
		}
		if (channel !== null) {
			this.channel = channel;
		}
		if (volume === null) return f.dot;
		this.volume = volume;
	}
	return f.dot;
});
