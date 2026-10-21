// From code/game/objects/structures/statues.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12829, "/obj/structure/statue", "/obj/structure", {
	oreAmount: 5,
	material_drop_type: rt.typePath("/obj/item/stack/sheet/metal"),
	anchored: 0,
	CanAtmosPass: -2,
	name: "statue",
	desc: "Placeholder. Yell at Firecage if you SOMEHOW see this.",
	icon: rt.rsc("icons/obj/statue.dmi"),
	icon_state: "",
	density: 1,
	obj_integrity: 100,
	max_integrity: 100,
});

// /obj/structure/statue/proc/attackby  (code/game/objects/structures/statues.dm:18)  may sleep
rt.def("/obj/structure/statue/proc/attackby", function* attackby(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "anchored"))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ is loosening the ＀'s bolts.", [live(f.args[1]), rt.sv(f, "name")]), fmt("<span class='notice'>You are loosening the ＀'s bolts...</span>", [rt.sv(f, "name")])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if ((!truthy(rt.fv(f, "loc", live(f.src))) || !truthy(rt.sv(f, "anchored")))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ loosened the ＀'s bolts!", [live(f.args[1]), rt.sv(f, "name")]), fmt("<span class='notice'>You loosen the ＀'s bolts!</span>", [rt.sv(f, "name")])]);
				rt.setSv(f, "anchored", 0);
			}
		} else {
			if (!truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/turf/open/floor")) ? 1 : 0))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>A floor must be present to secure the ＀!</span>", [rt.sv(f, "name")])]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ is securing the ＀'s bolts...", [live(f.args[1]), rt.sv(f, "name")]), fmt("<span class='notice'>You are securing the ＀'s bolts...</span>", [rt.sv(f, "name")])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if ((!truthy(rt.fv(f, "loc", live(f.src))) || truthy(rt.sv(f, "anchored")))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has secured the ＀'s bolts.", [live(f.args[1]), rt.sv(f, "name")]), fmt("<span class='notice'>You have secured the ＀'s bolts.</span>", [rt.sv(f, "name")])]);
				rt.setSv(f, "anchored", 1);
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy/plasmacutter")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ is slicing apart the ＀...", [live(f.args[1]), rt.sv(f, "name")]), fmt("<span class='notice'>You are slicing apart the ＀...</span>", [rt.sv(f, "name")])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if (!truthy(rt.fv(f, "loc", live(f.src)))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ slices apart the ＀.", [live(f.args[1]), rt.sv(f, "name")]), fmt("<span class='notice'>You slice apart the ＀.</span>", [rt.sv(f, "name")])]);
				yield* g.srcCall(f, "deconstruct", 1);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pickaxe/drill/jackhammer")) ? 1 : 0))) {
				D = live(f.args[0]);
				if (!truthy(rt.fv(f, "loc", live(f.src)))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ destroys the ＀!", [live(f.args[1]), rt.sv(f, "name")]), fmt("<span class='notice'>You destroy the ＀.</span>", [rt.sv(f, "name")])]);
				yield* g.callName(f, live(D), "playDigSound", []);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 40, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ is slicing apart the ＀.", [live(f.args[1]), rt.sv(f, "name")]), fmt("<span class='notice'>You are slicing apart the ＀...</span>", [rt.sv(f, "name")])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						if (!truthy(rt.fv(f, "loc", live(f.src)))) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ slices apart the ＀.", [live(f.args[1]), rt.sv(f, "name")]), fmt("<span class='notice'>You slice apart the ＀!</span>", [rt.sv(f, "name")])]);
						yield* g.srcCall(f, "deconstruct", 1);
					}
				} else {
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/statue/proc/attack_hand  (code/game/objects/structures/statues.dm:80)  may sleep
rt.def("/obj/structure/statue/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ rubs some dust off from the ＀'s surface.", [live(user), rt.sv(f, "name")]), fmt("<span class='notice'>You rub some dust off from the ＀'s surface.</span>", [rt.sv(f, "name")])]);
	return f.dot;
}, true);

// /obj/structure/statue/proc/deconstruct  (code/game/objects/structures/statues.dm:86)  may sleep
rt.def("/obj/structure/statue/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let drop_amt: Value = null;
	f.vars = () => [disassembled, drop_amt];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(rt.sv(f, "material_drop_type"))) {
			drop_amt = rt.sv(f, "oreAmount");
			if (!truthy(live(disassembled))) {
				(drop_amt = rt.modify(live(drop_amt), 2, subtract));
			}
			if (rt.gt(live(drop_amt), 0)) {
				yield* g.new_(f, rt.sv(f, "material_drop_type"), [rt.getStep(f, live(f.src), 0), live(drop_amt)]);
			}
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12831, "/obj/structure/statue/uranium", "/obj/structure/statue", {
	last_event: 0,
	active: null,
	light_range: 2,
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
	obj_integrity: 300,
});

// /obj/structure/statue/uranium/proc/attackby  (code/game/objects/structures/statues.dm:116)  may sleep
rt.def("/obj/structure/statue/uranium/proc/attackby", function* attackby(f: Frame) {
	yield* g.srcCall(f, "radiate");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/structure/statue/uranium/proc/Bumped  (code/game/objects/structures/statues.dm:120)  may sleep
rt.def("/obj/structure/statue/uranium/proc/Bumped", function* Bumped(f: Frame) {
	yield* g.srcCall(f, "radiate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/statue/uranium/proc/attack_hand  (code/game/objects/structures/statues.dm:124)  may sleep
rt.def("/obj/structure/statue/uranium/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.srcCall(f, "radiate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/statue/uranium/proc/attack_paw  (code/game/objects/structures/statues.dm:128)  may sleep
rt.def("/obj/structure/statue/uranium/proc/attack_paw", function* attack_paw(f: Frame) {
	yield* g.srcCall(f, "radiate");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/statue/uranium/proc/radiate  (code/game/objects/structures/statues.dm:132)  may sleep
rt.def("/obj/structure/statue/uranium/proc/radiate", function* radiate(f: Frame) {
	if (!truthy(rt.sv(f, "active"))) {
		if (rt.gt(rt.worldTime(f), add(rt.sv(f, "last_event"), 15))) {
			rt.setSv(f, "active", 1);
			yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 3, 3, 12, 0]);
			rt.setSv(f, "last_event", rt.worldTime(f));
			rt.setSv(f, "active", null);
			return live(f.dot);
		}
	}
	return live(f.dot);
}, true);

rt.type(12834, "/obj/structure/statue/plasma", "/obj/structure/statue", {
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
	obj_integrity: 200,
	desc: "This statue is suitably made from plasma.",
});

// /obj/structure/statue/plasma/proc/temperature_expose  (code/game/objects/structures/statues.dm:153)  may sleep
rt.def("/obj/structure/statue/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "PlasmaBurn", live(exposed_temperature));
	return f.dot;
}, true);

// /obj/structure/statue/plasma/proc/bullet_act  (code/game/objects/structures/statues.dm:159)  may sleep
rt.def("/obj/structure/statue/plasma/proc/bullet_act", function* bullet_act(f: Frame) {
	let burn: Value = null, _T: Value = null;
	let $0: any, $1: any;
	f.vars = () => [burn, _T, $0, $1];
	burn = 0;
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/beam")) ? 1 : 0))) {
		yield* g.srcCall(f, "PlasmaBurn", 2500);
		burn = 1;
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/ion")) ? 1 : 0))) {
			yield* g.srcCall(f, "PlasmaBurn", 500);
			burn = 1;
		}
	}
	if (truthy(live(burn))) {
		_T = rt.getStep(f, live(f.src), 0);
		if (truthy(rt.fv(f, "firer", live(f.args[0])))) {
			$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "firer", live(f.args[0]))])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.fv(f, "firer", live(f.args[0]))]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.fv(f, "firer", live(f.args[0]))])]);
			if (truthy(live(_T))) {
				$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
			} else {
				$1 = "nonexistent location";
			}
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("Plasma statue ignited by ＀ in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("Plasma statue ignited by ＀ in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "firer", live(f.args[0]))])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		} else {
			$0 = live(f.args[0]);
			if (truthy(live(_T))) {
				$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
			} else {
				$1 = "nonexistent location";
			}
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("Plasma statue ignited by ＀. No known firer, in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("Plasma statue ignited by ＀ in ＀. No known firer.", [live(f.args[0]), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["Proj"] });

// /obj/structure/statue/plasma/proc/attackby  (code/game/objects/structures/statues.dm:176)  may sleep
rt.def("/obj/structure/statue/plasma/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null;
	let $0: any, $1: any;
	f.vars = () => [_T, $0, $1];
	if (rt.gt((yield* g.callName(f, live(f.args[0]), "is_hot", [])), 300)) {
		_T = rt.getStep(f, live(f.src), 0);
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.args[1])]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.args[1])])]);
		if (truthy(live(_T))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$1 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Plasma statue ignited by ＀ in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Plasma statue ignited by ＀ in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		yield* g.srcCall(f, "ignite", (yield* g.callName(f, live(f.args[0]), "is_hot", [])));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/statue/plasma/proc/PlasmaBurn  (code/game/objects/structures/statues.dm:185)  may sleep
rt.def("/obj/structure/statue/plasma/proc/PlasmaBurn", function* PlasmaBurn(f: Frame) {
	yield* g.srcCall(f, "atmos_spawn_air", "plasma=400;TEMP=1000");
	yield* g.srcCall(f, "deconstruct", 0);
	return f.dot;
}, true);

// /obj/structure/statue/plasma/proc/ignite  (code/game/objects/structures/statues.dm:189)  may sleep
rt.def("/obj/structure/statue/plasma/proc/ignite", function* ignite(f: Frame, exposed_temperature: Value) {
	f.vars = () => [exposed_temperature];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "PlasmaBurn", live(exposed_temperature));
	return f.dot;
}, true);

rt.type(12852, "/obj/structure/statue/bananium", "/obj/structure/statue", {
	spam_flag: 0,
	material_drop_type: rt.typePath("/obj/item/stack/sheet/mineral/bananium"),
	obj_integrity: 300,
	desc: "A bananium statue with a small engraving:'HOOOOOOONK'.",
});

// /obj/structure/statue/bananium/proc/Bumped  (code/game/objects/structures/statues.dm:278)
rt.def("/obj/structure/statue/bananium/proc/Bumped", function Bumped(f: Frame) {
	rt.callSrc(f, "honk", []);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/statue/bananium/proc/attackby  (code/game/objects/structures/statues.dm:282)  may sleep
rt.def("/obj/structure/statue/bananium/proc/attackby", function* attackby(f: Frame) {
	yield* g.srcCall(f, "honk");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/structure/statue/bananium/proc/attack_hand  (code/game/objects/structures/statues.dm:286)  may sleep
rt.def("/obj/structure/statue/bananium/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.srcCall(f, "honk");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/statue/bananium/proc/attack_paw  (code/game/objects/structures/statues.dm:290)
rt.def("/obj/structure/statue/bananium/proc/attack_paw", function attack_paw(f: Frame) {
	rt.callSrc(f, "honk", []);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/statue/bananium/proc/honk  (code/game/objects/structures/statues.dm:294)
rt.def("/obj/structure/statue/bananium/proc/honk", function honk(f: Frame) {
	if (truthy(rt.sv(f, "spam_flag"))) return f.dot;
	rt.setSv(f, "spam_flag", 1);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/bikehorn.ogg"), 50, 1]);
	rt.spawnTail(f, 20, "/obj/structure/statue/bananium/proc/honk: spawn at game/objects/structures/statues.dm:297");
	return f.dot;
});

// a spawn(20) body of /obj/structure/statue/bananium/proc/honk, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/statue/bananium/proc/honk: spawn at game/objects/structures/statues.dm:297", function* (f: Frame) {
	rt.setSv(f, "spam_flag", 0);
	return null;
});
