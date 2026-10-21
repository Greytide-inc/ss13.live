// From Types/Vector.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13815, "/vector", "/", {
	len: null,
	size: null,
	x: 0,
	y: 0,
	z: 0,
});

// /vector/proc/Dot  (Types/Vector.dm:14)
rt.def("/vector/proc/Dot", function Dot(f: Frame, B: Value) {
	return add(add(multiply(rt.sv(f, "x"), rt.fv(f, "x", live(B))), multiply(rt.sv(f, "y"), rt.fv(f, "y", live(B)))), multiply(rt.sv(f, "z"), rt.fv(f, "z", live(B))));
});

// /vector/proc/Interpolate  (Types/Vector.dm:17)
rt.def("/vector/proc/Interpolate", function Interpolate(f: Frame, B: Value, t: Value) {
	return add(live(f.src), multiply(subtract(live(B), live(f.src)), live(t)));
});

// /proc/vector  (Types/Vector.dm:27)
rt.def("/proc/vector", function vector(f: Frame, x: Value, y: Value, z: Value) {
	return rt.new_(f, T("/vector"), [live(x), live(y), live(z)]);
});
