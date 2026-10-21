// From code/controllers/subsystem/processing/overlays.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(56, "/datum/controller/subsystem/processing/overlays", "/datum/controller/subsystem/processing", {
	overlay_icon_state_caches: null,
	overlay_icon_cache: null,
	initialized: 0,
	name: "Overlay",
	flags: 16,
	wait: 1,
	priority: 500,
	init_order: -6,
	runlevels: 14,
	stat_tag: "Ov",
	currentrun: null,
});

// /datum/controller/subsystem/processing/overlays/proc/New  (code/controllers/subsystem/processing/overlays.dm:1)  may sleep
rt.def("/datum/controller/subsystem/processing/overlays/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSoverlays"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSoverlays"), T("/datum/controller/subsystem/processing/overlays")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSoverlays")]);
		}
		rt.setGl("SSoverlays", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/processing/overlays/proc/<init>  (code/controllers/subsystem/processing/overlays.dm:10)
rt.def("/datum/controller/subsystem/processing/overlays/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "currentrun", null);
	return f.dot;
});

// /datum/controller/subsystem/processing/overlays/proc/PreInit  (code/controllers/subsystem/processing/overlays.dm:16)
rt.def("/datum/controller/subsystem/processing/overlays/proc/PreInit", function PreInit(f: Frame) {
	if (!truthy(rt.sv(f, "overlay_icon_state_caches"))) {
		rt.setSv(f, "overlay_icon_state_caches", rt.list());
	}
	if (truthy(rt.sv(f, "overlay_icon_cache"))) return f.dot;
	rt.setSv(f, "overlay_icon_cache", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/processing/overlays/proc/Initialize  (code/controllers/subsystem/processing/overlays.dm:21)  may sleep
rt.def("/datum/controller/subsystem/processing/overlays/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "initialized", 1);
	yield* g.srcCall(f, "Flush");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/controller/subsystem/processing/overlays/proc/fire  (code/controllers/subsystem/processing/overlays.dm:30)  may sleep
rt.def("/datum/controller/subsystem/processing/overlays/proc/fire", function* fire(f: Frame, resumed: Value, mc_check: Value) {
	let thing: Value = null;
	let $0: any;
	f.vars = () => [resumed, mc_check, thing, $0];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (live(mc_check) === null) {
		mc_check = 1;
	}
	while (truthy(rt.len(f, rt.sv(f, "processing")))) {
		thing = rt.index(rt.sv(f, "processing"), rt.len(f, rt.sv(f, "processing")));
		rt.incField(f, rt.sv(f, "processing"), "len", -1, true);
		if (truthy(live(thing))) {
			yield* g.callName(f, live(thing), "compile_overlays", [0]);
		}
		if (truthy(live(mc_check))) {
			if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
				$0 = (yield* g.srcCall(f, "pause"));
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				break;
			}
		} else {
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/processing/overlays/proc/Flush  (code/controllers/subsystem/processing/overlays.dm:42)  may sleep
rt.def("/datum/controller/subsystem/processing/overlays/proc/Flush", function* Flush(f: Frame) {
	if (!truthy(rt.len(f, rt.sv(f, "processing")))) return f.dot;
	yield* g.callSrc(f, "fire", ["mc_check", 0], rt.Args.Named);
	return f.dot;
}, true);

// /atom/proc/compile_overlays  (code/controllers/subsystem/processing/overlays.dm:47)
rt.def("/atom/proc/compile_overlays", function compile_overlays(f: Frame) {
	if ((truthy(rt.length(rt.sv(f, "priority_overlays"))) && truthy(rt.length(rt.sv(f, "our_overlays"))))) {
		rt.setSv(f, "overlays", add(rt.sv(f, "our_overlays"), rt.sv(f, "priority_overlays")));
	} else {
		if (truthy(rt.length(rt.sv(f, "our_overlays")))) {
			rt.setSv(f, "overlays", rt.sv(f, "our_overlays"));
		} else {
			if (truthy(rt.length(rt.sv(f, "priority_overlays")))) {
				rt.setSv(f, "overlays", rt.sv(f, "priority_overlays"));
			} else {
				rt.callName(f, rt.sv(f, "overlays"), "Cut", []);
			}
		}
	}
	(rt.modSrcVar(f, "flags", 16776959, rt.bitAnd));
	return f.dot;
});

// /proc/iconstate2appearance  (code/controllers/subsystem/processing/overlays.dm:60)
rt.def("/proc/iconstate2appearance", function iconstate2appearance(f: Frame, icon: Value, iconstate: Value) {
	let icon_states_cache: Value = null, cached_icon: Value = null, cached_appearance: Value = null;
	f.vars = () => [icon_states_cache, cached_icon, cached_appearance];
	icon_states_cache = rt.fv(f, "overlay_icon_state_caches", rt.gl("SSoverlays"));
	if (truthy((cached_icon = rt.index(live(icon_states_cache), live(icon))))) {
		if (truthy((cached_appearance = rt.index(live(cached_icon), fmt("＀", [live(iconstate)]))))) {
			return live(cached_appearance);
		}
	}
	rt.setFv(f, "icon", rt.gl("stringbro"), live(icon));
	rt.setFv(f, "icon_state", rt.gl("stringbro"), live(iconstate));
	if (!truthy(live(cached_icon))) {
		cached_icon = rt.list();
		rt.setAt(live(icon_states_cache), live(icon), live(cached_icon));
	}
	cached_appearance = rt.fv(f, "appearance", rt.gl("stringbro"));
	rt.setAt(live(cached_icon), fmt("＀", [live(iconstate)]), live(cached_appearance));
	return live(cached_appearance);
});

// /proc/icon2appearance  (code/controllers/subsystem/processing/overlays.dm:77)
rt.def("/proc/icon2appearance", function icon2appearance(f: Frame, icon: Value) {
	let icon_cache: Value = null;
	f.vars = () => [icon_cache];
	f.dot = rt.index((icon_cache = rt.fv(f, "overlay_icon_cache", rt.gl("SSoverlays"))), live(icon));
	if (truthy(live(f.dot))) return f.dot;
	rt.setFv(f, "icon", rt.gl("iconbro"), live(icon));
	f.dot = rt.fv(f, "appearance", rt.gl("iconbro"));
	rt.setAt(live(icon_cache), live(icon), live(f.dot));
	return f.dot;
});

// /atom/proc/build_appearance_list  (code/controllers/subsystem/processing/overlays.dm:85)
rt.def("/atom/proc/build_appearance_list", function build_appearance_list(f: Frame, new_overlays: Value) {
	let i: Value = null, cached_overlay: Value = null;
	let $e: any;
	f.vars = () => [new_overlays, i, cached_overlay, $e];
	if (!truthy((rt.istype(live(new_overlays), T("/list")) ? 1 : 0))) {
		new_overlays = rt.list(live(new_overlays));
	} else {
		rt.call(f, P("/proc/listclearnulls"), null, [live(new_overlays)]);
	}
	i = null;
	rt.forRange(f, 0, 1, rt.length(live(new_overlays)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.call(f, P("/proc/istext"), null, [(cached_overlay = rt.index(live(new_overlays), live(i)))]))) {
			rt.setAt(live(new_overlays), live(i), rt.call(f, P("/proc/iconstate2appearance"), null, [rt.sv(f, "icon"), live(cached_overlay)]));
		} else {
			if (truthy(rt.call(f, P("/proc/isicon"), null, [live(cached_overlay)]))) {
				rt.setAt(live(new_overlays), live(i), rt.call(f, P("/proc/icon2appearance"), null, [live(cached_overlay)]));
			} else {
				rt.setFv(f, "appearance", rt.gl("appearance_bro"), live(cached_overlay));
				if (!truthy(rt.call(f, P("/proc/ispath"), null, [live(cached_overlay)]))) {
					rt.setFv(f, "dir", rt.gl("appearance_bro"), rt.fv(f, "dir", live(cached_overlay)));
				}
				rt.setAt(live(new_overlays), live(i), rt.fv(f, "appearance", rt.gl("appearance_bro")));
			}
		}
	}
	rt.endFor(f, 0);
	return live(new_overlays);
});

// /atom/proc/cut_overlays  (code/controllers/subsystem/processing/overlays.dm:105)
rt.def("/atom/proc/cut_overlays", function cut_overlays(f: Frame, priority: Value) {
	let cached_overlays: Value = null, cached_priority: Value = null, need_compile: Value = null;
	f.vars = () => [priority, cached_overlays, cached_priority, need_compile];
	if (live(priority) === null) {
		priority = 0;
	}
	cached_overlays = rt.sv(f, "our_overlays");
	cached_priority = rt.sv(f, "priority_overlays");
	need_compile = 0;
	if (truthy(rt.length(live(cached_overlays)))) {
		rt.callName(f, live(cached_overlays), "Cut", []);
		need_compile = 1;
	}
	if ((truthy(live(priority)) && truthy(rt.length(live(cached_priority))))) {
		rt.callName(f, live(cached_priority), "Cut", []);
		need_compile = 1;
	}
	if (!(!truthy(rt.bitAnd(rt.sv(f, "flags"), 256)) && truthy(live(need_compile)))) return f.dot;
	(rt.modSrcVar(f, "flags", 256, rt.bitOr));
	rt.modField(f, rt.gl("SSoverlays"), "processing", live(f.src), add);
	return f.dot;
});

// /atom/proc/cut_overlay  (code/controllers/subsystem/processing/overlays.dm:122)
rt.def("/atom/proc/cut_overlay", function cut_overlay(f: Frame, overlays: Value, priority: Value) {
	let cached_overlays: Value = null, cached_priority: Value = null, init_o_len: Value = null, init_p_len: Value = null;
	f.vars = () => [overlays, cached_overlays, cached_priority, init_o_len, init_p_len];
	if (!truthy(live(overlays))) {
		return live(f.dot);
	}
	overlays = rt.callSrc(f, "build_appearance_list", [live(overlays)]);
	cached_overlays = rt.sv(f, "our_overlays");
	cached_priority = rt.sv(f, "priority_overlays");
	init_o_len = rt.length(live(cached_overlays));
	init_p_len = rt.length(live(cached_priority));
	if (truthy(live(cached_overlays))) {
		(cached_overlays = rt.modify(live(cached_overlays), live(overlays), subtract));
		if (!truthy(rt.len(f, live(cached_overlays)))) {
			cached_overlays = null;
		}
	}
	if (truthy(live(priority))) {
		if (truthy(live(cached_priority))) {
			(cached_priority = rt.modify(live(cached_priority), live(overlays), subtract));
			if (!truthy(rt.len(f, live(cached_priority)))) {
				cached_priority = null;
			}
		}
	}
	if (!(!truthy(rt.bitAnd(rt.sv(f, "flags"), 256)) && (!isEqual(live(init_o_len), rt.length(live(cached_priority))) || !isEqual(live(init_p_len), rt.length(live(cached_overlays)))))) return f.dot;
	(rt.modSrcVar(f, "flags", 256, rt.bitOr));
	rt.modField(f, rt.gl("SSoverlays"), "processing", live(f.src), add);
	return f.dot;
});

// /atom/proc/add_overlay  (code/controllers/subsystem/processing/overlays.dm:140)
rt.def("/atom/proc/add_overlay", function add_overlay(f: Frame, overlays: Value, priority: Value) {
	let cached_overlays: Value = null, cached_priority: Value = null, init_o_len: Value = null, init_p_len: Value = null, need_compile: Value = null;
	f.vars = () => [overlays, priority, cached_overlays, cached_priority, init_o_len, init_p_len, need_compile];
	if (live(priority) === null) {
		priority = 0;
	}
	if (!truthy(live(overlays))) {
		return live(f.dot);
	}
	overlays = rt.callSrc(f, "build_appearance_list", [live(overlays)]);
	if (!truthy(rt.sv(f, "our_overlays"))) {
		rt.setSv(f, "our_overlays", rt.list());
	}
	if (!truthy(rt.sv(f, "priority_overlays"))) {
		rt.setSv(f, "priority_overlays", rt.list());
	}
	cached_overlays = rt.sv(f, "our_overlays");
	cached_priority = rt.sv(f, "priority_overlays");
	init_o_len = rt.len(f, live(cached_overlays));
	init_p_len = rt.len(f, live(cached_priority));
	need_compile = null;
	if (truthy(live(priority))) {
		cached_priority = rt.modify(live(cached_priority), live(overlays), add);
		need_compile = (!isEqual(live(init_p_len), rt.len(f, live(cached_priority))) ? 1 : 0);
	} else {
		cached_overlays = rt.modify(live(cached_overlays), live(overlays), add);
		need_compile = (!isEqual(live(init_o_len), rt.len(f, live(cached_overlays))) ? 1 : 0);
	}
	if (!(!truthy(rt.bitAnd(rt.sv(f, "flags"), 256)) && truthy(live(need_compile)))) return f.dot;
	(rt.modSrcVar(f, "flags", 256, rt.bitOr));
	rt.modField(f, rt.gl("SSoverlays"), "processing", live(f.src), add);
	return f.dot;
});

// /atom/proc/copy_overlays  (code/controllers/subsystem/processing/overlays.dm:165)
rt.def("/atom/proc/copy_overlays", function copy_overlays(f: Frame, other: Value, cut_old: Value) {
	let cached_other: Value = null;
	f.vars = () => [cached_other];
	if (!truthy(live(other))) {
		if (truthy(live(cut_old))) {
			rt.callSrc(f, "cut_overlays", []);
		}
		return live(f.dot);
	}
	if (truthy((cached_other = rt.fv(f, "our_overlays", live(other))))) {
		if ((truthy(live(cut_old)) || !truthy(rt.length(rt.sv(f, "our_overlays"))))) {
			rt.setSv(f, "our_overlays", rt.callName(f, live(cached_other), "Copy", []));
		} else {
			(rt.modSrcVar(f, "our_overlays", live(cached_other), rt.bitOr));
		}
		if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 256))) {
			(rt.modSrcVar(f, "flags", 256, rt.bitOr));
			rt.modField(f, rt.gl("SSoverlays"), "processing", live(f.src), add);
		}
	} else {
		if (!truthy(live(cut_old))) return f.dot;
		rt.callSrc(f, "cut_overlays", []);
	}
	return f.dot;
});

// /image/proc/add_overlay  (code/controllers/subsystem/processing/overlays.dm:186)
rt.def("/image/proc/add_overlay", function add_overlay(f: Frame, x: Value) {
	rt.modSrcVar(f, "overlays", live(x), add);
	return f.dot;
});

// /image/proc/cut_overlay  (code/controllers/subsystem/processing/overlays.dm:189)
rt.def("/image/proc/cut_overlay", function cut_overlay(f: Frame, x: Value) {
	(rt.modSrcVar(f, "overlays", live(x), subtract));
	return f.dot;
});

// /image/proc/cut_overlays  (code/controllers/subsystem/processing/overlays.dm:192)
rt.def("/image/proc/cut_overlays", function cut_overlays(f: Frame, x: Value) {
	rt.callName(f, rt.sv(f, "overlays"), "Cut", []);
	return f.dot;
});

// /image/proc/copy_overlays  (code/controllers/subsystem/processing/overlays.dm:195)
rt.def("/image/proc/copy_overlays", function copy_overlays(f: Frame, other: Value, cut_old: Value) {
	let cached_other: Value = null;
	f.vars = () => [cached_other];
	if (!truthy(live(other))) {
		if (truthy(live(cut_old))) {
			rt.callSrc(f, "cut_overlays", []);
		}
		return live(f.dot);
	}
	if (truthy((cached_other = rt.fv(f, "our_overlays", live(other))))) {
		if ((truthy(live(cut_old)) || !truthy(rt.len(f, rt.sv(f, "overlays"))))) {
			rt.setSv(f, "overlays", rt.callName(f, live(cached_other), "Copy", []));
		} else {
			(rt.modSrcVar(f, "overlays", live(cached_other), rt.bitOr));
		}
	} else {
		if (!truthy(live(cut_old))) return f.dot;
		rt.callSrc(f, "cut_overlays", []);
	}
	return f.dot;
});
