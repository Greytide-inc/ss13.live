// From code/game/objects/items/weapons/grenades/plastic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6921, "/obj/item/weapon/grenade/plastic", "/obj/item/weapon/grenade", {
	target: null,
	plastic_overlay: null,
	nadeassembly: null,
	assemblyattacher: null,
	directional: 0,
	aim_dir: 1,
	boom_sizes: null,
	flags: 4,
	det_time: 10,
	display_timer: 0,
	name: "plastic explosive",
	desc: "Used to put holes in specific areas without too much extra hole.",
	icon_state: "plastic-explosive0",
	item_state: "plastic-explosive",
});

// /obj/item/weapon/grenade/plastic/proc/New  (code/game/objects/items/weapons/grenades/plastic.dm:18)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/New", function* New(f: Frame) {
	rt.setSv(f, "plastic_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), fmt("＀2", [rt.sv(f, "item_state")])])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/proc/Initialize  (code/game/objects/items/weapons/grenades/plastic.dm:22)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "no_emp_wires", 1);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/grenade/plastic/proc/Destroy  (code/game/objects/items/weapons/grenades/plastic.dm:26)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "nadeassembly")]);
	rt.setSv(f, "nadeassembly", null);
	rt.setSv(f, "target", null);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/proc/attackby  (code/game/objects/items/weapons/grenades/plastic.dm:32)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/attackby", function* attackby(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if ((!truthy(rt.sv(f, "nadeassembly")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly_holder")) ? 1 : 0)))) {
		A = live(f.args[0]);
		if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		rt.setSv(f, "nadeassembly", live(A));
		rt.setFv(f, "master", live(A), live(f.src));
		rt.setSv(f, "assemblyattacher", rt.fv(f, "ckey", live(f.args[1])));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the ＀.</span>", [live(A), rt.sv(f, "name")])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/tap.ogg"), 20, 1]);
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "nadeassembly")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 20, 1]);
		yield* g.callName(f, rt.sv(f, "nadeassembly"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		rt.setFv(f, "master", rt.sv(f, "nadeassembly"), null);
		rt.setSv(f, "nadeassembly", null);
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/grenade/plastic/proc/prime  (code/game/objects/items/weapons/grenades/plastic.dm:55)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/prime", function* prime(f: Frame) {
	let location: Value = null, _T: Value = null, M: Value = null;
	f.vars = () => [location, _T, M];
	location = null;
	if (truthy(rt.sv(f, "target"))) {
		if (!(!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) {
			location = rt.getStep(f, rt.sv(f, "target"), 0);
			yield* g.callName(f, rt.sv(f, "target"), "cut_overlay", [rt.sv(f, "plastic_overlay"), 1]);
		}
	} else {
		location = rt.getStep(f, live(f.src), 0);
	}
	if (truthy(live(location))) {
		if (((truthy(rt.sv(f, "directional")) && truthy(rt.sv(f, "target"))) && truthy(rt.fv(f, "density", rt.sv(f, "target"))))) {
			yield* g.call(f, P("/proc/explosion"), null, [rt.getStep(f, (_T = rt.getStep(f, live(location), rt.sv(f, "aim_dir"))), rt.sv(f, "aim_dir")), rt.index(rt.sv(f, "boom_sizes"), 1), rt.index(rt.sv(f, "boom_sizes"), 2), rt.index(rt.sv(f, "boom_sizes"), 3)]);
		} else {
			yield* g.call(f, P("/proc/explosion"), null, [live(location), rt.index(rt.sv(f, "boom_sizes"), 1), rt.index(rt.sv(f, "boom_sizes"), 2), rt.index(rt.sv(f, "boom_sizes"), 3)]);
		}
		yield* g.callName(f, live(location), "ex_act", [2, rt.sv(f, "target")]);
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "target")])))) {
		yield* g.callName(f, (M = rt.sv(f, "target")), "gib", []);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/proc/receive_signal  (code/game/objects/items/weapons/grenades/plastic.dm:74)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/receive_signal", function* receive_signal(f: Frame) {
	yield* g.srcCall(f, "prime");
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/proc/Crossed  (code/game/objects/items/weapons/grenades/plastic.dm:78)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!truthy(rt.sv(f, "nadeassembly"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "nadeassembly"), "Crossed", [live(AM)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/proc/on_found  (code/game/objects/items/weapons/grenades/plastic.dm:82)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/on_found", function* on_found(f: Frame, finder: Value) {
	f.vars = () => [finder];
	if (!truthy(rt.sv(f, "nadeassembly"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "nadeassembly"), "on_found", [live(finder)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/proc/attack_self  (code/game/objects/items/weapons/grenades/plastic.dm:86)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let newtime: Value = null;
	f.vars = () => [user, newtime];
	if (truthy(rt.sv(f, "nadeassembly"))) {
		yield* g.callName(f, rt.sv(f, "nadeassembly"), "attack_self", [live(user)]);
		return live(f.dot);
	}
	newtime = (yield* g.op(f, "Prompt", [32], [10, "Timer", "Please set the timer.", live(f.usr), null]));
	if (!isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(f.src))) return f.dot;
	rt.setSv(f, "det_time", (newtime = (yield* g.call(f, P("/proc/max"), null, [10, (yield* g.call(f, P("/proc/min"), null, [live(newtime), 60000]))]))));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("Timer set for ＀ seconds.", [rt.sv(f, "det_time")])]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/proc/afterattack  (code/game/objects/items/weapons/grenades/plastic.dm:95)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/afterattack", function* afterattack(f: Frame, AM: Value, user: Value, flag: Value) {
	let I: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [AM, user, flag, I, $0, $1, $2, $3];
	rt.setSv(f, "aim_dir", rt.getDir(f, live(user), live(AM)));
	if (!truthy(live(flag))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start planting the ＀. The timer is set to ＀...</span>", [live(f.src), rt.sv(f, "det_time")])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, "target", live(AM)], rt.Args.Named)))) return f.dot;
	if (!truthy((yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(f.src)])))) {
		return live(f.dot);
	}
	rt.setFv(f, "target", live(f.src), live(AM));
	yield* g.srcCall(f, "forceMove", null);
	if (truthy((rt.istype(live(AM), T("/obj/item")) ? 1 : 0))) {
		rt.setFv(f, "throw_speed", (I = live(AM)), (yield* g.call(f, P("/proc/max"), null, [1, subtract(rt.fv(f, "throw_speed", live(I)), 3)])));
		rt.setFv(f, "throw_range", live(I), (yield* g.call(f, P("/proc/max"), null, [1, subtract(rt.fv(f, "throw_range", live(I)), 3)])));
		rt.setFv(f, "embed_chance", live(I), 0);
	}
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
	$1 = rt.sv(f, "name");
	$2 = rt.fv(f, "name", rt.sv(f, "target"));
	if (truthy(rt.sv(f, "target"))) {
		$3 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", rt.sv(f, "target")), rt.fv(f, "y", rt.sv(f, "target")), rt.fv(f, "z", rt.sv(f, "target"))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", rt.sv(f, "target")), rt.fv(f, "y", rt.sv(f, "target")), rt.fv(f, "z", rt.sv(f, "target"))])]);
	} else {
		$3 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ planted ＀ on ＀ at ＀ with ＀ second fuse", [$0, $1, $2, fmt("＀", [$3]), rt.sv(f, "det_time")]), 0, 1]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ planted ＀ on ＀ at ＀ with ＀ second fuse", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.sv(f, "name"), rt.fv(f, "name", rt.sv(f, "target")), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), rt.sv(f, "det_time")])]);
	yield* g.callName(f, rt.sv(f, "target"), "add_overlay", [rt.sv(f, "plastic_overlay"), 1]);
	if (!truthy(rt.sv(f, "nadeassembly"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You plant the bomb. Timer counting down from ＀.</span>", [rt.sv(f, "det_time")])]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/grenade/plastic/proc/prime")])), multiply(rt.sv(f, "det_time"), 10)]);
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/proc/suicide_act  (code/game/objects/items/weapons/grenades/plastic.dm:126)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let message_say: Value = null, role: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, message_say, role, $0, $1, $2];
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
	$1 = live(f.src);
	if (truthy(live(user))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))])]);
	} else {
		$2 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ suicided with ＀ at ＀", [$0, $1, fmt("＀", [$2])]), 0, 1]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ suicided with ＀ at ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(f.src), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(user)), rt.fv(f, "y", live(user)), rt.fv(f, "z", live(user))])])]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ activates the ＀ and holds it above ＀ head! It looks like ＀ going out with a bang!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	message_say = "FOR NO RAISIN!";
	if (truthy(rt.fv(f, "mind", live(user)))) {
		if (truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(user))))) {
			if ((isEqual((role = (yield* g.call(f, P("/proc/lowertext"), null, [rt.gv(f, "special_role", rt.fv(f, "mind", live(user)))]))), "traitor") || isEqual(live(role), "syndicate"))) {
				message_say = "FOR THE SYNDICATE!";
			} else {
				if (isEqual(live(role), "changeling")) {
					message_say = "FOR THE HIVE!";
				} else {
					if (isEqual(live(role), "cultist")) {
						message_say = "FOR NAR-SIE!";
					} else {
						if ((isEqual(live(role), "revolutionary") || isEqual(live(role), "head revolutionary"))) {
							message_say = "VIVA LA REVOLUTION!";
						} else {
							if (truthy(rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user))))) {
								message_say = fmt("＀ RULES!", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.gv(f, "name", rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user))))]))]);
							}
						}
					}
				}
			}
		}
	}
	yield* g.callName(f, live(user), "say", [live(message_say)]);
	yield* g.call(f, P("/proc/explosion"), null, [live(user), 0, 2, 0]);
	yield* g.callName(f, live(user), "gib", [1, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/proc/update_icon  (code/game/objects/items/weapons/grenades/plastic.dm:150)
rt.def("/obj/item/weapon/grenade/plastic/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "nadeassembly"))) {
		rt.setSv(f, "icon_state", fmt("＀1", [rt.sv(f, "item_state")]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀0", [rt.sv(f, "item_state")]));
	}
	return f.dot;
});

rt.type(6922, "/obj/item/weapon/grenade/plastic/c4", "/obj/item/weapon/grenade/plastic", {
	timer: 10,
	open_panel: 0,
	flags: 4,
	name: "C4",
	desc: "Used to put holes in specific areas without too much extra hole. A saboteur's favorite.",
	gender: "plural",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "plastic-explosive0",
	item_state: "plasticx",
	w_class: 2,
	origin_tech: "syndicate=1",
});

// /obj/item/weapon/grenade/plastic/c4/proc/New  (code/game/objects/items/weapons/grenades/plastic.dm:172)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/New", function* New(f: Frame) {
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/explosive/c4"), [live(f.src)])));
	rt.setSv(f, "plastic_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "plastic-explosive2"])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/c4/proc/Destroy  (code/game/objects/items/weapons/grenades/plastic.dm:177)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	rt.setSv(f, "target", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/grenade/plastic/c4/proc/suicide_act  (code/game/objects/items/weapons/grenades/plastic.dm:183)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let message_say: Value = null, role: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, message_say, role, $0, $1, $2];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ activates the ＀ and holds it above ＀ head! It looks like ＀ going out with a bang!</span>", [live(user), rt.fv(f, "name", live(f.src)), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	message_say = "FOR NO RAISIN!";
	if (truthy(rt.fv(f, "mind", live(user)))) {
		if (truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(user))))) {
			if ((isEqual((role = (yield* g.call(f, P("/proc/lowertext"), null, [rt.gv(f, "special_role", rt.fv(f, "mind", live(user)))]))), "traitor") || isEqual(live(role), "syndicate"))) {
				message_say = "FOR THE SYNDICATE!";
			} else {
				if (isEqual(live(role), "changeling")) {
					message_say = "FOR THE HIVE!";
				} else {
					if (isEqual(live(role), "cultist")) {
						message_say = "FOR NAR-SIE!";
					} else {
						if ((isEqual(live(role), "revolutionary") || isEqual(live(role), "head revolutionary"))) {
							message_say = "VIVA LA REVOLUTION!";
						} else {
							if (truthy(rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user))))) {
								message_say = fmt("＀ RULES!", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.gv(f, "name", rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user))))]))]);
							}
						}
					}
				}
			}
		}
	}
	yield* g.callName(f, live(user), "say", [live(message_say)]);
	rt.setSv(f, "target", live(user));
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
	$1 = rt.sv(f, "name");
	if (truthy(live(f.src))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
	} else {
		$2 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ suicided with ＀ at ＀", [$0, $1, fmt("＀", [$2])]), 0, 1]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ suicided with ＀ at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.sv(f, "name"), rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z")])]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.srcCall(f, "explode", rt.getStep(f, live(user), 0));
	yield* g.callName(f, live(user), "gib", [1, 1]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/c4/proc/attackby  (code/game/objects/items/weapons/grenades/plastic.dm:207)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		rt.setSv(f, "open_panel", (!truthy(rt.sv(f, "open_panel")) ? 1 : 0));
		$0 = live(f.args[1]);
		if (truthy(rt.sv(f, "open_panel"))) {
			$1 = "open";
		} else {
			$1 = "close";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the wire panel.</span>", [$1])]);
	} else {
		if (truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])])))) {
			yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/grenade/plastic/c4/proc/attack_self  (code/game/objects/items/weapons/grenades/plastic.dm:216)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let newtime: Value = null;
	f.vars = () => [user, newtime];
	newtime = (yield* g.op(f, "Prompt", [32], [10, "Timer", "Please set the timer.", live(f.usr), null]));
	if (!isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(f.src))) return f.dot;
	rt.setSv(f, "timer", (newtime = (yield* g.call(f, P("/proc/max"), null, [10, (yield* g.call(f, P("/proc/min"), null, [live(newtime), 60000]))]))));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("Timer set for ＀ seconds.", [rt.sv(f, "timer")])]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/c4/proc/afterattack  (code/game/objects/items/weapons/grenades/plastic.dm:223)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/afterattack", function* afterattack(f: Frame, AM: Value, user: Value, flag: Value) {
	let S: Value = null, message: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [AM, user, flag, S, message, $0, $1, $2, $3];
	if (!truthy(live(flag))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "loc"), live(AM))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(AM), T("/obj/item/weapon/storage")) ? 1 : 0)) && !(truthy((rt.istype(live(AM), T("/obj/item/weapon/storage/secure")) ? 1 : 0)) || truthy((rt.istype(live(AM), T("/obj/item/weapon/storage/lockbox")) ? 1 : 0))))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(AM), T("/obj/item/weapon/storage/secure")) ? 1 : 0)) || truthy((rt.istype(live(AM), T("/obj/item/weapon/storage/lockbox")) ? 1 : 0)))) {
		if (!truthy(rt.gv(f, "locked", (S = live(AM))))) {
			return live(f.dot);
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start planting the bomb...</span>"]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, "target", live(AM)], rt.Args.Named)))) return f.dot;
	if (!truthy((yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(f.src)])))) {
		return live(f.dot);
	}
	rt.setFv(f, "target", live(f.src), live(AM));
	yield* g.srcCall(f, "forceMove", null);
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
	$1 = rt.sv(f, "name");
	$2 = rt.fv(f, "name", rt.sv(f, "target"));
	if (truthy(rt.sv(f, "target"))) {
		$3 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", rt.sv(f, "target")), rt.fv(f, "y", rt.sv(f, "target")), rt.fv(f, "z", rt.sv(f, "target"))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", rt.sv(f, "target")), rt.fv(f, "y", rt.sv(f, "target")), rt.fv(f, "z", rt.sv(f, "target"))])]);
	} else {
		$3 = "nonexistent location";
	}
	rt.modGl("bombers", (message = fmt("＀ planted ＀ on ＀ at ＀ with ＀ second fuse", [$0, $1, $2, fmt("＀", [$3]), rt.sv(f, "timer")])), add);
	yield* g.call(f, P("/proc/message_admins"), null, [live(message), 0, 1]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ planted ＀ on ＀ at ＀ with ＀ second fuse", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.sv(f, "name"), rt.fv(f, "name", rt.sv(f, "target")), fmt("(＀,＀,＀)", [rt.fv(f, "x", rt.sv(f, "target")), rt.fv(f, "y", rt.sv(f, "target")), rt.fv(f, "z", rt.sv(f, "target"))]), rt.sv(f, "timer")])]);
	yield* g.callName(f, rt.sv(f, "target"), "add_overlay", [rt.sv(f, "plastic_overlay"), 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You plant the bomb. Timer counting down from ＀.</span>", [rt.sv(f, "timer")])]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/grenade/plastic/c4/proc/explode")])), multiply(rt.sv(f, "timer"), 10)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/plastic/c4/proc/explode  (code/game/objects/items/weapons/grenades/plastic.dm:254)  may sleep
rt.def("/obj/item/weapon/grenade/plastic/c4/proc/explode", function* explode(f: Frame) {
	let location: Value = null;
	f.vars = () => [location];
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	location = null;
	if (truthy(rt.sv(f, "target"))) {
		if (!(!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) {
			location = rt.getStep(f, rt.sv(f, "target"), 0);
			yield* g.callName(f, rt.sv(f, "target"), "cut_overlay", [rt.sv(f, "plastic_overlay"), 1]);
		}
	} else {
		location = rt.getStep(f, live(f.src), 0);
	}
	if (truthy(live(location))) {
		yield* g.callName(f, live(location), "ex_act", [2, rt.sv(f, "target")]);
		yield* g.call(f, P("/proc/explosion"), null, [live(location), 0, 0, 3]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
