// From code/modules/assembly/infrared.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9376, "/obj/item/device/assembly/infra", "/obj/item/device/assembly", {
	on: 0,
	visible: 0,
	first: null,
	last: null,
	name: "infrared emitter",
	desc: "Emits a visible or invisible beam and is triggered when the beam is interrupted.\n<span class='notice'>Alt-click to rotate it clockwise.</span>",
	icon_state: "infrared",
	materials: null,
	origin_tech: "magnets=2;materials=2",
});

// /obj/item/device/assembly/infra/proc/<init>  (code/modules/assembly/infrared.dm:5)
rt.def("/obj/item/device/assembly/infra/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000, "$glass", 500]));
	return f.dot;
});

// /obj/item/device/assembly/infra/proc/New  (code/modules/assembly/infrared.dm:15)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/device/assembly/infra/proc/Destroy  (code/modules/assembly/infrared.dm:20)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "first"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "first")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/assembly/infra/proc/describe  (code/modules/assembly/infrared.dm:24)
rt.def("/obj/item/device/assembly/infra/proc/describe", function describe(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.sv(f, "on"))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	return fmt("The infrared trigger is ＀.", [$0]);
});

// /obj/item/device/assembly/infra/proc/activate  (code/modules/assembly/infrared.dm:27)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/activate", function* activate(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/item/device/assembly/infra/proc/toggle_secure  (code/modules/assembly/infrared.dm:34)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/toggle_secure", function* toggle_secure(f: Frame) {
	rt.setSv(f, "secured", (!truthy(rt.sv(f, "secured")) ? 1 : 0));
	if (truthy(rt.sv(f, "secured"))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	} else {
		rt.setSv(f, "on", 0);
		if (truthy(rt.sv(f, "first"))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "first")]);
		}
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	yield* g.srcCall(f, "update_icon");
	return rt.sv(f, "secured");
}, true);

// /obj/item/device/assembly/infra/proc/update_icon  (code/modules/assembly/infrared.dm:46)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/update_icon", function* update_icon(f: Frame) {
	yield* g.srcCall(f, "cut_overlays");
	rt.setSv(f, "attached_overlays", rt.list());
	if (truthy(rt.sv(f, "on"))) {
		yield* g.srcCall(f, "add_overlay", "infrared_on");
		rt.modSrcVar(f, "attached_overlays", "infrared_on", add);
	}
	if (truthy(rt.sv(f, "holder"))) {
		yield* g.callName(f, rt.sv(f, "holder"), "update_icon", []);
	}
	return live(f.dot);
}, true);

// /obj/item/device/assembly/infra/proc/process  (code/modules/assembly/infrared.dm:57)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/process", function* process(f: Frame) {
	let _T: Value = null, I: Value = null;
	f.vars = () => [_T, I];
	if (!truthy(rt.sv(f, "on"))) {
		if (truthy(rt.sv(f, "first"))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "first")]);
		}
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "secured"))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "first")) && truthy(rt.sv(f, "last")))) {
		yield* g.callName(f, rt.sv(f, "last"), "process", []);
		return live(f.dot);
	}
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) return f.dot;
	rt.setFv(f, "master", (I = (yield* g.new_(f, T("/obj/effect/beam/i_beam"), [live(_T)]))), live(f.src));
	rt.setFv(f, "density", live(I), 1);
	yield* g.callName(f, live(I), "setDir", [rt.sv(f, "dir")]);
	rt.setSv(f, "first", live(I));
	yield* g.call(f, P("/proc/step"), null, [live(I), rt.fv(f, "dir", live(I))]);
	if (!truthy(rt.sv(f, "first"))) return f.dot;
	rt.setFv(f, "density", live(I), 0);
	yield* g.callName(f, live(I), "vis_spread", [rt.sv(f, "visible")]);
	rt.setFv(f, "limit", live(I), 8);
	yield* g.callName(f, live(I), "process", []);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/device/assembly/infra/proc/attack_hand  (code/modules/assembly/infrared.dm:81)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "first")]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);

// /obj/item/device/assembly/infra/proc/Move  (code/modules/assembly/infrared.dm:86)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/Move", function* Move(f: Frame) {
	let t: Value = null;
	f.vars = () => [t];
	t = rt.sv(f, "dir");
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "setDir", live(t));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "first")]);
	return live(f.dot);
}, true);

// /obj/item/device/assembly/infra/proc/holder_movement  (code/modules/assembly/infrared.dm:93)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/holder_movement", function* holder_movement(f: Frame) {
	if (!truthy(rt.sv(f, "holder"))) {
		return 0;
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "first")]);
	return 1;
}, true);

// /obj/item/device/assembly/infra/proc/trigger_beam  (code/modules/assembly/infrared.dm:99)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/trigger_beam", function* trigger_beam(f: Frame) {
	if (((!truthy(rt.sv(f, "secured")) || !truthy(rt.sv(f, "on"))) || rt.gt(rt.sv(f, "next_activate"), rt.worldTime(f)))) {
		return 0;
	}
	yield* g.srcCall(f, "pulse", 0);
	yield* g.srcCall(f, "audible_message", fmt("＀ *beep* *beep*", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))]), null, 3);
	rt.setSv(f, "next_activate", add(rt.worldTime(f), 30));
	return f.dot;
}, true);

// /obj/item/device/assembly/infra/proc/interact  (code/modules/assembly/infrared.dm:106)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, dat, $0, $1];
	if (!truthy((yield* g.srcCall(f, "is_secured", live(user))))) return f.dot;
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	if (truthy(rt.sv(f, "on"))) {
		$0 = fmt("<A href='?src=＃;state=0'>On</A>", [live(f.src)]);
	} else {
		$0 = fmt("<A href='?src=＃;state=1'>Off</A>", [live(f.src)]);
	}
	if (truthy(rt.sv(f, "visible"))) {
		$1 = fmt("<A href='?src=＃;visible=0'>Visible</A>", [live(f.src)]);
	} else {
		$1 = fmt("<A href='?src=＃;visible=1'>Invisible</A>", [live(f.src)]);
	}
	dat = fmt("<TT><B>Infrared Laser</B>\n<B>Status</B>: ＀<BR>\n<B>Visibility</B>: ＀<BR>\n</TT>", [$0, $1]);
	dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;refresh=1'>Refresh</A>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;close=1'>Close</A>", [live(f.src)]), add);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=infra"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "infra"]);
	return live(f.dot);
}, true);

// /obj/item/device/assembly/infra/proc/Topic  (code/modules/assembly/infrared.dm:116)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((yield* g.callName(f, live(f.usr), "incapacitated", []))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "loc"), live(f.usr)])), 1))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=infra"], false);
		yield* g.call(f, P("/proc/onclose"), null, [live(f.usr), "infra"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "state"))) {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		yield* g.srcCall(f, "update_icon");
	}
	if (truthy(rt.at(live(f.args[1]), "visible"))) {
		rt.setSv(f, "visible", (!truthy(rt.sv(f, "visible")) ? 1 : 0));
		if (truthy(rt.sv(f, "first"))) {
			yield* g.callName(f, rt.sv(f, "first"), "vis_spread", [rt.sv(f, "visible")]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=infra"], false);
		return live(f.dot);
	}
	if (!truthy(live(f.usr))) return f.dot;
	yield* g.srcCall(f, "attack_self", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/item/device/assembly/infra/verb/rotate  (code/modules/assembly/infrared.dm:139)
rt.def("/obj/item/device/assembly/infra/verb/rotate", function rotate(f: Frame) {
	if (truthy(rt.callName(f, live(f.usr), "incapacitated", []))) {
		return live(f.dot);
	}
	rt.callSrc(f, "setDir", [rt.call(f, P("/proc/turn"), null, [rt.sv(f, "dir"), 90])]);
	return live(f.dot);
}, false, { verb: { name: "Rotate Infrared Laser", category: "Object", src: 11 } });

// /obj/item/device/assembly/infra/proc/AltClick  (code/modules/assembly/infrared.dm:146)  may sleep
rt.def("/obj/item/device/assembly/infra/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "rotate");
	}
	return f.dot;
}, true, { args: ["user"] });

rt.type(11834, "/obj/effect/beam/i_beam", "/obj/effect/beam", {
	next: null,
	previous: null,
	master: null,
	limit: null,
	visible: 0,
	left: null,
	anchored: 1,
	name: "infrared beam",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	icon_state: "ibeam",
});

// /obj/effect/beam/i_beam/proc/hit  (code/modules/assembly/infrared.dm:174)  may sleep
rt.def("/obj/effect/beam/i_beam/proc/hit", function* hit(f: Frame) {
	if (truthy(rt.sv(f, "master"))) {
		yield* g.callName(f, rt.sv(f, "master"), "trigger_beam", []);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

// /obj/effect/beam/i_beam/proc/vis_spread  (code/modules/assembly/infrared.dm:179)
rt.def("/obj/effect/beam/i_beam/proc/vis_spread", function vis_spread(f: Frame, v: Value) {
	rt.setSv(f, "visible", live(v));
	if (!truthy(rt.sv(f, "next"))) return f.dot;
	rt.callName(f, rt.sv(f, "next"), "vis_spread", [live(v)]);
	return f.dot;
});

// /obj/effect/beam/i_beam/proc/process  (code/modules/assembly/infrared.dm:185)  may sleep
rt.def("/obj/effect/beam/i_beam/proc/process", function* process(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if ((truthy(rt.fv(f, "density", rt.sv(f, "loc"))) || !truthy(rt.sv(f, "master")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "left"), 0)) {
		rt.incSrcVar(f, "left", -1, true);
	}
	if (rt.lt(rt.sv(f, "left"), 1)) {
		if (!truthy(rt.sv(f, "visible"))) {
			rt.setSv(f, "invisibility", 101);
		} else {
			rt.setSv(f, "invisibility", 0);
		}
	} else {
		rt.setSv(f, "invisibility", 0);
	}
	if (!(!truthy(rt.sv(f, "next")) && rt.gt(rt.sv(f, "limit"), 0))) return f.dot;
	rt.setFv(f, "master", (I = (yield* g.new_(f, T("/obj/effect/beam/i_beam"), [rt.sv(f, "loc")]))), rt.sv(f, "master"));
	rt.setFv(f, "density", live(I), 1);
	yield* g.callName(f, live(I), "setDir", [rt.sv(f, "dir")]);
	rt.setFv(f, "previous", live(I), live(f.src));
	rt.setSv(f, "next", live(I));
	yield* g.call(f, P("/proc/step"), null, [live(I), rt.fv(f, "dir", live(I))]);
	if (!truthy(rt.sv(f, "next"))) return f.dot;
	rt.setFv(f, "density", live(I), 0);
	yield* g.callName(f, live(I), "vis_spread", [rt.sv(f, "visible")]);
	rt.setFv(f, "limit", live(I), subtract(rt.sv(f, "limit"), 1));
	rt.setFv(f, "last", rt.sv(f, "master"), live(I));
	yield* g.callName(f, live(I), "process", []);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/beam/i_beam/proc/Bump  (code/modules/assembly/infrared.dm:214)  may sleep
rt.def("/obj/effect/beam/i_beam/proc/Bump", function* Bump(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

// /obj/effect/beam/i_beam/proc/Bumped  (code/modules/assembly/infrared.dm:218)  may sleep
rt.def("/obj/effect/beam/i_beam/proc/Bumped", function* Bumped(f: Frame) {
	yield* g.srcCall(f, "hit");
	return f.dot;
}, true);

// /obj/effect/beam/i_beam/proc/Crossed  (code/modules/assembly/infrared.dm:221)  may sleep
rt.def("/obj/effect/beam/i_beam/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (truthy((rt.istype(live(AM), T("/obj/effect/beam")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "hit");
	return f.dot;
}, true);

// /obj/effect/beam/i_beam/proc/Destroy  (code/modules/assembly/infrared.dm:226)  may sleep
rt.def("/obj/effect/beam/i_beam/proc/Destroy", function* Destroy(f: Frame) {
	if (isEqual(rt.fv(f, "first", rt.sv(f, "master")), live(f.src))) {
		rt.setFv(f, "first", rt.sv(f, "master"), null);
	}
	if (truthy(rt.sv(f, "next"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "next")]);
		rt.setSv(f, "next", null);
	}
	if (truthy(rt.sv(f, "previous"))) {
		rt.setFv(f, "next", rt.sv(f, "previous"), null);
		rt.setFv(f, "last", rt.sv(f, "master"), rt.sv(f, "previous"));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
