// From code/game/alternate_appearance.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalactive_alternate_appearances  (code/game/alternate_appearance.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalactive_alternate_appearances", function InitGlobalactive_alternate_appearances(f: Frame) {
	rt.setGl("active_alternate_appearances", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "active_alternate_appearances", add);
	return f.dot;
});

// /atom/proc/remove_alt_appearance  (code/game/alternate_appearance.dm:9)  may sleep
rt.def("/atom/proc/remove_alt_appearance", function* remove_alt_appearance(f: Frame, key: Value) {
	let K: Value = null, AA: Value = null;
	let $e: any;
	f.vars = () => [key, K, AA, $e];
	if (!truthy(rt.sv(f, "alternate_appearances"))) return f.dot;
	K = null;
	rt.forList(f, 0, rt.sv(f, "alternate_appearances"));
	while (($e = rt.next(f, 0)) !== undefined) {
		K = $e;
		if (isEqual(rt.gv(f, "appearance_key", (AA = rt.index(rt.sv(f, "alternate_appearances"), live(K)))), live(key))) {
			yield* g.callName(f, live(AA), "remove_from_hud", [live(f.src)]);
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /atom/proc/add_alt_appearance  (code/game/alternate_appearance.dm:16)  may sleep
rt.def("/atom/proc/add_alt_appearance", function* add_alt_appearance(f: Frame) {
	let _arguments: Value = null;
	f.vars = () => [_arguments];
	if ((!truthy(live(f.args[0])) || !truthy(live(f.args[1])))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "alternate_appearances")) && truthy(rt.index(rt.sv(f, "alternate_appearances"), live(f.args[1]))))) {
		return live(f.dot);
	}
	yield* g.new_(f, live(f.args[0]), [(_arguments = (yield* g.callName(f, f.argsList, "Copy", [2])))], rt.Args.List);
	return f.dot;
}, true, { args: ["type", "key"] });

rt.type(549, "/datum/atom_hud/alternate_appearance", "/datum/atom_hud", {
	appearance_key: null,
});

// /datum/atom_hud/alternate_appearance/proc/New  (code/game/alternate_appearance.dm:28)
rt.def("/datum/atom_hud/alternate_appearance/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modGl("active_alternate_appearances", live(f.src), add);
	rt.setSv(f, "appearance_key", live(f.args[0]));
	return f.dot;
}, false, { args: ["key"] });

// /datum/atom_hud/alternate_appearance/proc/Destroy  (code/game/alternate_appearance.dm:33)  may sleep
rt.def("/datum/atom_hud/alternate_appearance/proc/Destroy", function* Destroy(f: Frame) {
	let v: Value = null;
	let $e: any;
	f.vars = () => [v, $e];
	v = null;
	rt.forList(f, 0, rt.sv(f, "hudusers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		yield* g.srcCall(f, "remove_hud_from", live(v));
	}
	rt.endFor(f, 0);
	v = null;
	rt.forList(f, 0, rt.sv(f, "hudatoms"));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		yield* g.srcCall(f, "remove_from_hud", live(v));
	}
	rt.endFor(f, 0);
	(rt.modGl("active_alternate_appearances", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/atom_hud/alternate_appearance/proc/onNewMob  (code/game/alternate_appearance.dm:41)
rt.def("/datum/atom_hud/alternate_appearance/proc/onNewMob", function onNewMob(f: Frame, M: Value) {
	if (!truthy(rt.callSrc(f, "mobShouldSee", [live(M)]))) return f.dot;
	rt.callSrc(f, "add_hud_to", [live(M)]);
	return f.dot;
});

// /datum/atom_hud/alternate_appearance/proc/add_to_hud  (code/game/alternate_appearance.dm:48)
rt.def("/datum/atom_hud/alternate_appearance/proc/add_to_hud", function add_to_hud(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	if (!truthy(rt.fv(f, "alternate_appearances", live(f.args[0])))) {
		rt.setFv(f, "alternate_appearances", live(f.args[0]), rt.list());
	}
	rt.setAt(rt.fv(f, "alternate_appearances", live(f.args[0])), rt.sv(f, "appearance_key"), live(f.src));
	return f.dot;
}, false, { args: ["A", "I"] });

// /datum/atom_hud/alternate_appearance/proc/remove_from_hud  (code/game/alternate_appearance.dm:54)
rt.def("/datum/atom_hud/alternate_appearance/proc/remove_from_hud", function remove_from_hud(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	if (!truthy(rt.fv(f, "alternate_appearances", live(f.args[0])))) return f.dot;
	(rt.modField(f, live(f.args[0]), "alternate_appearances", rt.sv(f, "appearance_key"), subtract));
	if (truthy(rt.getLen(f, rt.fv(f, "alternate_appearances", live(f.args[0]))))) return f.dot;
	rt.setFv(f, "alternate_appearances", live(f.args[0]), null);
	return f.dot;
}, false, { args: ["A"] });

rt.type(550, "/datum/atom_hud/alternate_appearance/basic", "/datum/atom_hud/alternate_appearance", {
	target: null,
	theImage: null,
	add_ghost_version: 0,
	ghost_appearance: null,
});

// /datum/atom_hud/alternate_appearance/basic/proc/New  (code/game/alternate_appearance.dm:67)
rt.def("/datum/atom_hud/alternate_appearance/basic/proc/New", function New(f: Frame) {
	let ghost_image: Value = null;
	f.vars = () => [ghost_image];
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "theImage", live(f.args[1]));
	rt.setSv(f, "target", rt.fv(f, "loc", live(f.args[1])));
	rt.setSv(f, "hud_icons", rt.list(rt.sv(f, "appearance_key")));
	rt.callSrc(f, "add_to_hud", [rt.sv(f, "target"), live(f.args[1])]);
	if ((truthy(live(f.args[2])) && truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "target")])))) {
		rt.callSrc(f, "add_hud_to", [rt.sv(f, "target")]);
	}
	if (!truthy(rt.sv(f, "add_ghost_version"))) return f.dot;
	rt.setFv(f, "override", (ghost_image = rt.call(f, P("/proc/image"), null, ["icon", rt.fv(f, "icon", live(f.args[1])), "icon_state", rt.fv(f, "icon_state", live(f.args[1])), "loc", rt.fv(f, "loc", live(f.args[1]))], rt.Args.Named)), 0);
	rt.setFv(f, "alpha", live(ghost_image), 128);
	rt.setSv(f, "ghost_appearance", rt.new_(f, T("/datum/atom_hud/alternate_appearance/basic/observers"), [add(live(f.args[0]), "_observer"), live(ghost_image), 0]));
	return f.dot;
}, false, { args: ["key", "I", "target_sees_appearance"] });

// /datum/atom_hud/alternate_appearance/basic/proc/Destroy  (code/game/alternate_appearance.dm:81)  may sleep
rt.def("/datum/atom_hud/alternate_appearance/basic/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "ghost_appearance"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "ghost_appearance")]);
	rt.setSv(f, "ghost_appearance", null);
	return f.dot;
}, true);

// /datum/atom_hud/alternate_appearance/basic/proc/add_to_hud  (code/game/alternate_appearance.dm:87)
rt.def("/datum/atom_hud/alternate_appearance/basic/proc/add_to_hud", function add_to_hud(f: Frame) {
	rt.setAt(rt.fv(f, "hud_list", live(f.args[0])), rt.sv(f, "appearance_key"), rt.sv(f, "theImage"));
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["A"] });

// /datum/atom_hud/alternate_appearance/basic/proc/remove_from_hud  (code/game/alternate_appearance.dm:90)  may sleep
rt.def("/datum/atom_hud/alternate_appearance/basic/proc/remove_from_hud", function* remove_from_hud(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, live(f.args[0]), "hud_list", rt.sv(f, "appearance_key"), subtract));
	if (!(truthy(live(f.dot)) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["A"] });

rt.type(551, "/datum/atom_hud/alternate_appearance/basic/everyone", "/datum/atom_hud/alternate_appearance/basic", {
	add_ghost_version: 1,
});

// /datum/atom_hud/alternate_appearance/basic/everyone/proc/New  (code/game/alternate_appearance.dm:99)
rt.def("/datum/atom_hud/alternate_appearance/basic/everyone/proc/New", function New(f: Frame) {
	let mob: Value = null;
	let $e: any;
	f.vars = () => [mob, $e];
	rt.callSuper(f, [], rt.Args.Same);
	mob = null;
	rt.forList(f, 0, rt.gl("mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mob = $e;
		if (truthy(rt.callSrc(f, "mobShouldSee", [live(mob)]))) {
			rt.callSrc(f, "add_hud_to", [live(mob)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/atom_hud/alternate_appearance/basic/everyone/proc/mobShouldSee  (code/game/alternate_appearance.dm:105)
rt.def("/datum/atom_hud/alternate_appearance/basic/everyone/proc/mobShouldSee", function mobShouldSee(f: Frame, M: Value) {
	return (!truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0)) ? 1 : 0);
});

rt.type(552, "/datum/atom_hud/alternate_appearance/basic/silicons", "/datum/atom_hud/alternate_appearance/basic", {});

// /datum/atom_hud/alternate_appearance/basic/silicons/proc/New  (code/game/alternate_appearance.dm:110)
rt.def("/datum/atom_hud/alternate_appearance/basic/silicons/proc/New", function New(f: Frame) {
	let mob: Value = null;
	let $e: any;
	f.vars = () => [mob, $e];
	rt.callSuper(f, [], rt.Args.Same);
	mob = null;
	rt.forList(f, 0, rt.gl("silicon_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mob = $e;
		if (truthy(rt.callSrc(f, "mobShouldSee", [live(mob)]))) {
			rt.callSrc(f, "add_hud_to", [live(mob)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/atom_hud/alternate_appearance/basic/silicons/proc/mobShouldSee  (code/game/alternate_appearance.dm:116)
rt.def("/datum/atom_hud/alternate_appearance/basic/silicons/proc/mobShouldSee", function mobShouldSee(f: Frame, M: Value) {
	if (truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))) {
		return 1;
	}
	return 0;
});

rt.type(553, "/datum/atom_hud/alternate_appearance/basic/observers", "/datum/atom_hud/alternate_appearance/basic", {
	add_ghost_version: 0,
});

// /datum/atom_hud/alternate_appearance/basic/observers/proc/New  (code/game/alternate_appearance.dm:124)
rt.def("/datum/atom_hud/alternate_appearance/basic/observers/proc/New", function New(f: Frame) {
	let mob: Value = null;
	let $e: any;
	f.vars = () => [mob, $e];
	rt.callSuper(f, [], rt.Args.Same);
	mob = null;
	rt.forList(f, 0, rt.gl("dead_mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mob = $e;
		if (truthy(rt.callSrc(f, "mobShouldSee", [live(mob)]))) {
			rt.callSrc(f, "add_hud_to", [live(mob)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/atom_hud/alternate_appearance/basic/observers/proc/mobShouldSee  (code/game/alternate_appearance.dm:130)
rt.def("/datum/atom_hud/alternate_appearance/basic/observers/proc/mobShouldSee", function mobShouldSee(f: Frame, M: Value) {
	return (rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0);
});
