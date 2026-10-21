// From code/game/objects/structures/reflector.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12861, "/obj/structure/reflector", "/obj/structure", {
	finished: 0,
	admin: 0,
	framebuildstacktype: rt.typePath("/obj/item/stack/sheet/metal"),
	framebuildstackamount: 5,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/metal"),
	buildstackamount: 0,
	anchored: 0,
	name: "reflector frame",
	icon: rt.rsc("icons/obj/stock_parts.dmi"),
	icon_state: "box_0",
	desc: "An angled mirror for reflecting lasers. This one does so at a 90 degree angle.",
	density: 1,
	layer: 2.9,
});

// /obj/structure/reflector/proc/bullet_act  (code/game/objects/structures/reflector.dm:17)  may sleep
rt.def("/obj/structure/reflector/proc/bullet_act", function* bullet_act(f: Frame) {
	let reflector_turf: Value = null, reflect_turf: Value = null, new_dir: Value = null;
	f.vars = () => [reflector_turf, reflect_turf, new_dir];
	reflector_turf = rt.getStep(f, live(f.src), 0);
	reflect_turf = null;
	new_dir = (yield* g.srcCall(f, "get_reflection", rt.fv(f, "dir", live(f.src)), rt.fv(f, "dir", live(f.args[0]))));
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/beam")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(live(new_dir))) {
		reflect_turf = rt.getStep(f, live(reflect_turf), live(new_dir));
	} else {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ is hit by the ＀!</span>", [live(f.src), live(f.args[0])]));
		new_dir = 0;
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	reflect_turf = rt.getStep(f, rt.sv(f, "loc"), live(new_dir));
	rt.setFv(f, "original", live(f.args[0]), live(reflect_turf));
	rt.setFv(f, "starting", live(f.args[0]), live(reflector_turf));
	rt.setFv(f, "current", live(f.args[0]), live(reflector_turf));
	rt.setFv(f, "yo", live(f.args[0]), subtract(rt.fv(f, "y", live(reflect_turf)), rt.fv(f, "y", live(reflector_turf))));
	rt.setFv(f, "xo", live(f.args[0]), subtract(rt.fv(f, "x", live(reflect_turf)), rt.fv(f, "x", live(reflector_turf))));
	rt.setFv(f, "range", live(f.args[0]), rt.initial(f, live(f.args[0]), "range"));
	new_dir = 0;
	return -1;
}, true, { args: ["P"] });

// /obj/structure/reflector/proc/attackby  (code/game/objects/structures/reflector.dm:44)  may sleep
rt.def("/obj/structure/reflector/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, S: Value = null;
	let $0: any;
	f.vars = () => [WT, S, $0];
	if (truthy(rt.sv(f, "admin"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "anchored"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("Unweld the ＀ first!", [live(f.src)])]);
		}
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(80, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("You dismantle the ＀.", [live(f.src)])]);
			yield* g.new_(f, rt.sv(f, "framebuildstacktype"), [rt.sv(f, "loc"), rt.sv(f, "framebuildstackamount")]);
			yield* g.new_(f, rt.sv(f, "buildstacktype"), [rt.sv(f, "loc"), rt.sv(f, "buildstackamount")]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			WT = live(f.args[0]);
			$0 = rt.sv(f, "anchored");
			if ($0 === 0) {
				if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to weld the ＀ to the floor.", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), fmt("<span class='notice'>You start to weld ％！ to the floor...</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
							return live(f.dot);
						}
						rt.setSv(f, "anchored", 1);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You weld ％！ to the floor.</span>", [live(f.src)])]);
					}
				}
			} else if ($0 === 1) {
				if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts to cut the ＀ free from the floor.", [rt.fv(f, "name", live(f.args[1])), rt.fv(f, "name", live(f.src))]), fmt("<span class='notice'>You start to cut ％！ free from the floor...</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
							return live(f.dot);
						}
						rt.setSv(f, "anchored", 0);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut ％！ free from the floor.</span>", [live(f.src)])]);
					}
				}
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet")) ? 1 : 0))) {
				if (truthy(rt.sv(f, "finished"))) {
					return live(f.dot);
				}
				S = live(f.args[0]);
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/glass")) ? 1 : 0))) {
					if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 5)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need five sheets of glass to create a reflector!</span>"]);
						return live(f.dot);
					} else {
						yield* g.callName(f, live(S), "use", [5]);
						yield* g.new_(f, T("/obj/structure/reflector/single"), [rt.fv(f, "loc", live(f.src))]);
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					}
				}
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/rglass")) ? 1 : 0))) {
					if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 10)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need ten sheets of reinforced glass to create a double reflector!</span>"]);
						return live(f.dot);
					} else {
						yield* g.callName(f, live(S), "use", [10]);
						yield* g.new_(f, T("/obj/structure/reflector/double"), [rt.fv(f, "loc", live(f.src))]);
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					}
				}
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/mineral/diamond")) ? 1 : 0))) {
					if (rt.ge((yield* g.callName(f, live(S), "get_amount", [])), 1)) {
						yield* g.callName(f, live(S), "use", [1]);
						yield* g.new_(f, T("/obj/structure/reflector/box"), [rt.fv(f, "loc", live(f.src))]);
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					}
				}
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/reflector/verb/rotate  (code/game/objects/structures/reflector.dm:116)
rt.def("/obj/structure/reflector/verb/rotate", function rotate(f: Frame) {
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "anchored", live(f.src)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>It is fastened to the floor!</span>"]);
		return 0;
	}
	rt.callName(f, live(f.src), "setDir", [rt.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.src)), 270])]);
	return 1;
}, false, { verb: { name: "Rotate", category: "Object", src: 3, range: 1 } });

// /obj/structure/reflector/proc/AltClick  (code/game/objects/structures/reflector.dm:126)  may sleep
rt.def("/obj/structure/reflector/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.callName(f, live(f.args[0]), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "rotate");
	}
	return f.dot;
}, true, { args: ["user"] });

rt.type(12862, "/obj/structure/reflector/single", "/obj/structure/reflector", {
	finished: 1,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/glass"),
	buildstackamount: 5,
	name: "reflector",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "reflector",
	desc: "A double sided angled mirror for reflecting lasers. This one does so at a 90 degree angle.",
}, { global: { rotations: 801 } });

// /obj/structure/reflector/single/proc/get_reflection  (code/game/objects/structures/reflector.dm:152)
rt.def("/obj/structure/reflector/single/proc/get_reflection", function get_reflection(f: Frame, srcdir: Value, pdir: Value) {
	let new_dir: Value = null;
	f.vars = () => [new_dir];
	return (new_dir = rt.index(rt.index(rt.gl("rotations"), fmt("＀", [live(srcdir)])), fmt("＀", [live(pdir)])));
});

rt.type(12864, "/obj/structure/reflector/double", "/obj/structure/reflector", {
	finished: 1,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/rglass"),
	buildstackamount: 10,
	name: "double sided reflector",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "reflector_double",
	desc: "A double sided angled mirror for reflecting lasers. This one does so at a 90 degree angle.",
}, { global: { double_rotations: 802 } });

// /obj/structure/reflector/double/proc/get_reflection  (code/game/objects/structures/reflector.dm:175)
rt.def("/obj/structure/reflector/double/proc/get_reflection", function get_reflection(f: Frame, srcdir: Value, pdir: Value) {
	let new_dir: Value = null;
	f.vars = () => [new_dir];
	return (new_dir = rt.index(rt.index(rt.gl("double_rotations"), fmt("＀", [live(srcdir)])), fmt("＀", [live(pdir)])));
});

rt.type(12866, "/obj/structure/reflector/box", "/obj/structure/reflector", {
	finished: 1,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
	buildstackamount: 1,
	name: "reflector box",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "reflector_box",
	desc: "A box with an internal set of mirrors that reflects all laser fire in a single direction.",
}, { global: { box_rotations: 803 } });

// /obj/structure/reflector/box/proc/get_reflection  (code/game/objects/structures/reflector.dm:198)
rt.def("/obj/structure/reflector/box/proc/get_reflection", function get_reflection(f: Frame, srcdir: Value, pdir: Value) {
	let new_dir: Value = null;
	f.vars = () => [new_dir];
	return (new_dir = rt.index(rt.index(rt.gl("box_rotations"), fmt("＀", [live(srcdir)])), fmt("＀", [live(pdir)])));
});

// /obj/structure/reflector/proc/ex_act  (code/game/objects/structures/reflector.dm:208)
rt.def("/obj/structure/reflector/proc/ex_act", function ex_act(f: Frame) {
	if (truthy(rt.sv(f, "admin"))) {
		return live(f.dot);
	} else {
		rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { waitfor: false });

// /obj/structure/reflector/proc/singularity_act  (code/game/objects/structures/reflector.dm:215)  may sleep
rt.def("/obj/structure/reflector/proc/singularity_act", function* singularity_act(f: Frame) {
	if (truthy(rt.sv(f, "admin"))) {
		return live(f.dot);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);
