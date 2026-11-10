// Based on BYOND's Types/Vector.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13815, "/vector", "/", {
	len: null,
	size: null,
	x: 0,
	y: 0,
	z: 0,
});

// Vector.dm:14
rt.def("/vector/proc/Dot", function Dot(f: Frame, B: Value) {
	return this.x * B.x + this.y * B.y + this.z * B.z;
});

// Vector.dm:17
rt.def("/vector/proc/Interpolate", function Interpolate(f: Frame, B: Value, t: Value) {
	return this + (B - this) * t;
});

// Vector.dm:27
rt.def("/proc/vector", function vector(f: Frame, x: Value, y: Value, z: Value) {
	return new_(T("/vector"), x, y, z);
});
