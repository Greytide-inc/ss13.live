// From code/controllers/subsystem/assets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(14, "/datum/controller/subsystem/assets", "/datum/controller/subsystem", {
	cache: null,
	name: "Assets",
	init_order: -3,
	flags: 2,
});

// /datum/controller/subsystem/assets/proc/New  (code/controllers/subsystem/assets.dm:1)  may sleep
rt.def("/datum/controller/subsystem/assets/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSassets"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSassets"), T("/datum/controller/subsystem/assets")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSassets")]);
		}
		rt.setGl("SSassets", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/assets/proc/<init>  (code/controllers/subsystem/assets.dm:5)
rt.def("/datum/controller/subsystem/assets/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cache", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/assets/proc/Initialize  (code/controllers/subsystem/assets.dm:8)  may sleep
rt.def("/datum/controller/subsystem/assets/proc/Initialize", function* Initialize(f: Frame) {
	let type: Value = null, A: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [type, A, C, $e];
	type = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/asset")])), rt.list(T("/datum/asset"), T("/datum/asset/simple"))));
	while (($e = rt.next(f, 0)) !== undefined) {
		type = $e;
		yield* g.callName(f, (A = (yield* g.new_(f, live(type), []))), "register", []);
	}
	rt.endFor(f, 0);
	C = null;
	rt.forList(f, 0, rt.gl("clients"), T("/client"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/getFilesSlow"), live(C), rt.sv(f, "cache"), 0])), 10]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["timeofday"] });
