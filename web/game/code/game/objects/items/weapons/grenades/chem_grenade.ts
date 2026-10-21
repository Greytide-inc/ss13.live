// From code/game/objects/items/weapons/grenades/chem_grenade.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6881, "/obj/item/weapon/grenade/chem_grenade", "/obj/item/weapon/grenade", {
	stage: 1,
	beakers: null,
	allowed_containers: null,
	affected_area: 3,
	nadeassembly: null,
	assemblyattacher: null,
	ignition_temp: 10,
	threatscale: 1,
	no_splash: 0,
	name: "chemical grenade",
	desc: "A custom made grenade.",
	icon_state: "chemg",
	item_state: "flashbang",
	w_class: 2,
	force: 2,
});

// /obj/item/weapon/grenade/chem_grenade/proc/<init>  (code/game/objects/items/weapons/grenades/chem_grenade.dm:13)
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "beakers", rt.list());
	$0 = $0;
	rt.setSv(f, "allowed_containers", rt.list(T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/glass/bottle")));
	return f.dot;
});

// /obj/item/weapon/grenade/chem_grenade/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:23)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "create_reagents", 1000);
	yield* g.srcCall(f, "stage_change");
	return f.dot;
}, true);

// /obj/item/weapon/grenade/chem_grenade/proc/examine  (code/game/objects/items/weapons/grenades/chem_grenade.dm:28)
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/examine", function examine(f: Frame) {
	rt.setSv(f, "display_timer", ((isEqual(rt.sv(f, "stage"), 3) ? 1 : 0) && (!truthy(rt.sv(f, "nadeassembly")) ? 1 : 0)));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/grenade/chem_grenade/proc/attack_self  (code/game/objects/items/weapons/grenades/chem_grenade.dm:33)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let bombturf: Value = null, A: Value = null, C: Value = null;
	f.vars = () => [user, bombturf, A, C];
	if (!(isEqual(rt.sv(f, "stage"), 3) && !truthy(rt.sv(f, "active")))) return f.dot;
	if (truthy(rt.sv(f, "nadeassembly"))) {
		yield* g.callName(f, rt.sv(f, "nadeassembly"), "attack_self", [live(user)]);
	} else {
		if (!truthy((yield* g.srcCall(f, "clown_check", live(user))))) return f.dot;
		bombturf = rt.getStep(f, live(f.src), 0);
		A = (yield* g.call(f, P("/proc/get_area"), null, [live(bombturf)]));
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has primed a ＀ for detonation at ＀＀.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]), rt.sv(f, "name"), rt.fv(f, "name", live(A)), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has primed a ＀ for detonation at ＀ ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "name"), rt.fv(f, "name", live(A)), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You prime the ＀! ＀ second５!</span>", [rt.sv(f, "name"), divide(rt.sv(f, "det_time"), 10)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/weapons/armbomb.ogg"), 60, 1]);
		rt.setSv(f, "active", 1);
		rt.setSv(f, "icon_state", add(rt.initial(f, live(f.src), "icon_state"), "_active"));
		if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
			yield* g.callName(f, (C = live(user)), "throw_mode_on", []);
		}
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/grenade/chem_grenade/proc/prime")])), rt.sv(f, "det_time")]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/grenade/chem_grenade/proc/attackby  (code/game/objects/items/weapons/grenades/chem_grenade.dm:53)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/attackby", function* attackby(f: Frame) {
	let A: Value = null, C: Value = null, O: Value = null;
	let $0: any, $e: any;
	f.vars = () => [A, C, O, $0, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "stage"), 2)) {
			if (truthy(rt.len(f, rt.sv(f, "beakers")))) {
				yield* g.srcCall(f, "stage_change", 3);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You lock the ＀ assembly.</span>", [rt.initial(f, live(f.src), "name")])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 25, -3]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need to add at least one beaker before locking the ＀ assembly!</span>", [rt.initial(f, live(f.src), "name")])]);
			}
		} else {
			if ((isEqual(rt.sv(f, "stage"), 3) && !truthy(rt.sv(f, "nadeassembly")))) {
				if (isEqual(rt.sv(f, "det_time"), 50)) {
					$0 = 30;
				} else {
					$0 = 50;
				}
				rt.setSv(f, "det_time", $0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You modify the time delay. It's set for ＀ second５.</span>", [divide(rt.sv(f, "det_time"), 10)])]);
			} else {
				if (isEqual(rt.sv(f, "stage"), 1)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to add an activation mechanism!</span>"]);
				}
			}
		}
	} else {
		if ((isEqual(rt.sv(f, "stage"), 2) && truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.args[0]), rt.sv(f, "allowed_containers")]))))) {
			f.dot = 1;
			if (isEqual(rt.len(f, rt.sv(f, "beakers")), 2)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ can not hold more containers!</span>", [live(f.src)])]);
				return live(f.dot);
			} else {
				if (truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(f.args[0]))))) {
					if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the ＀ assembly.</span>", [live(f.args[0]), rt.initial(f, live(f.src), "name")])]);
					rt.modSrcVar(f, "beakers", live(f.args[0]), add);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is empty!</span>", [live(f.args[0])])]);
				}
			}
		} else {
			if ((isEqual(rt.sv(f, "stage"), 1) && truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly_holder")) ? 1 : 0)))) {
				f.dot = 1;
				if (isEqual((rt.istype(rt.gv(f, "a_left", (A = live(f.args[0]))), T("/obj/item/device/assembly/igniter")) ? 1 : 0), (rt.istype(rt.fv(f, "a_right", live(A)), T("/obj/item/device/assembly/igniter")) ? 1 : 0))) {
					return live(f.dot);
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				rt.setSv(f, "nadeassembly", live(A));
				rt.setFv(f, "master", live(A), live(f.src));
				rt.setSv(f, "assemblyattacher", rt.fv(f, "ckey", live(f.args[1])));
				yield* g.srcCall(f, "stage_change", 2);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the ＀ assembly.</span>", [live(A), rt.initial(f, live(f.src), "name")])]);
			} else {
				if ((isEqual(rt.sv(f, "stage"), 1) && truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0)))) {
					if (truthy((yield* g.callName(f, (C = live(f.args[0])), "use", [1])))) {
						rt.setSv(f, "det_time", 50);
						yield* g.srcCall(f, "stage_change", 2);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You rig the ＀ assembly.</span>", [rt.initial(f, live(f.src), "name")])]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one length of coil to wire the assembly!</span>"]);
						return live(f.dot);
					}
				} else {
					if (((isEqual(rt.sv(f, "stage"), 3) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) && !truthy(rt.sv(f, "active")))) {
						yield* g.srcCall(f, "stage_change", 2);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You unlock the ＀ assembly.</span>", [rt.initial(f, live(f.src), "name")])]);
					} else {
						if ((isEqual(rt.sv(f, "stage"), 2) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)))) {
							if (truthy(rt.len(f, rt.sv(f, "beakers")))) {
								O = null;
								rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj"));
								while (($e = rt.next(f, 0)) !== undefined) {
									O = $e;
									rt.setFv(f, "loc", live(O), rt.getStep(f, live(f.src), 0));
								}
								rt.endFor(f, 0);
								rt.setSv(f, "beakers", rt.list());
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You open the ＀ assembly and remove the payload.</span>", [rt.initial(f, live(f.src), "name")])]);
								return live(f.dot);
							}
							if (truthy(rt.sv(f, "nadeassembly"))) {
								rt.setFv(f, "loc", rt.sv(f, "nadeassembly"), rt.getStep(f, live(f.src), 0));
								rt.setFv(f, "master", rt.sv(f, "nadeassembly"), null);
								rt.setSv(f, "nadeassembly", null);
							} else {
								yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, live(f.src), 0), 1]);
							}
							yield* g.srcCall(f, "stage_change", 1);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You remove the activation mechanism from the ＀ assembly.</span>", [rt.initial(f, live(f.src), "name")])]);
						} else {
							return (yield* g.callSuper(f, [], rt.Args.Same));
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/grenade/chem_grenade/proc/stage_change  (code/game/objects/items/weapons/grenades/chem_grenade.dm:130)
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/stage_change", function stage_change(f: Frame, N: Value) {
	if (truthy(live(N))) {
		rt.setSv(f, "stage", live(N));
	}
	if (isEqual(rt.sv(f, "stage"), 1)) {
		rt.setSv(f, "name", fmt("＀ casing", [rt.initial(f, live(f.src), "name")]));
		rt.setSv(f, "desc", fmt("A do it yourself ＀!", [rt.initial(f, live(f.src), "name")]));
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	} else {
		if (isEqual(rt.sv(f, "stage"), 2)) {
			rt.setSv(f, "name", fmt("unsecured ＀", [rt.initial(f, live(f.src), "name")]));
			rt.setSv(f, "desc", fmt("An unsecured ＀ assembly.", [rt.initial(f, live(f.src), "name")]));
			rt.setSv(f, "icon_state", fmt("＀_ass", [rt.initial(f, live(f.src), "icon_state")]));
		} else {
			if (!isEqual(rt.sv(f, "stage"), 3)) return f.dot;
			rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
			rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
			rt.setSv(f, "icon_state", fmt("＀_locked", [rt.initial(f, live(f.src), "icon_state")]));
		}
	}
	return f.dot;
});

// /obj/item/weapon/grenade/chem_grenade/proc/receive_signal  (code/game/objects/items/weapons/grenades/chem_grenade.dm:147)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/receive_signal", function* receive_signal(f: Frame) {
	yield* g.srcCall(f, "prime");
	return f.dot;
}, true);

// /obj/item/weapon/grenade/chem_grenade/proc/Crossed  (code/game/objects/items/weapons/grenades/chem_grenade.dm:152)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!truthy(rt.sv(f, "nadeassembly"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "nadeassembly"), "Crossed", [live(AM)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/chem_grenade/proc/on_found  (code/game/objects/items/weapons/grenades/chem_grenade.dm:156)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/on_found", function* on_found(f: Frame, finder: Value) {
	f.vars = () => [finder];
	if (!truthy(rt.sv(f, "nadeassembly"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "nadeassembly"), "on_found", [live(finder)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/chem_grenade/proc/prime  (code/game/objects/items/weapons/grenades/chem_grenade.dm:159)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/prime", function* prime(f: Frame) {
	let reactants: Value = null, G: Value = null, O: Value = null, M: Value = null, last: Value = null, _T: Value = null, A: Value = null, DT: Value = null, DA: Value = null;
	let $e: any;
	f.vars = () => [reactants, G, O, M, last, _T, A, DT, DA, $e];
	if (!isEqual(rt.sv(f, "stage"), 3)) {
		return live(f.dot);
	}
	reactants = rt.list();
	G = null;
	rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj/item/weapon/reagent_containers/glass"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		reactants = rt.modify(live(reactants), rt.fv(f, "reagents", live(G)), add);
	}
	rt.endFor(f, 0);
	if ((!truthy((yield* g.call(f, P("/proc/chem_splash"), null, [rt.getStep(f, live(f.src), 0), rt.sv(f, "affected_area"), live(reactants), rt.sv(f, "ignition_temp"), rt.sv(f, "threatscale")]))) && !truthy(rt.sv(f, "no_splash")))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/screwdriver2.ogg"), 50, 1]);
		if (truthy(rt.len(f, rt.sv(f, "beakers")))) {
			O = null;
			rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj"));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				rt.setFv(f, "loc", live(O), rt.getStep(f, live(f.src), 0));
			}
			rt.endFor(f, 0);
			rt.setSv(f, "beakers", rt.list());
		}
		yield* g.srcCall(f, "stage_change", 1);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "nadeassembly"))) {
		M = (yield* g.call(f, P("/proc/get_mob_by_ckey"), null, [rt.sv(f, "assemblyattacher")]));
		last = (yield* g.call(f, P("/proc/get_mob_by_ckey"), null, [rt.fv(f, "fingerprintslast", rt.sv(f, "nadeassembly"))]));
		_T = rt.getStep(f, live(f.src), 0);
		A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("grenade primed by an assembly, attached by ＀ and last touched by ＀ (＀ and ＀) at ＀ ＀</a>.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(M)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(M)])]), fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(last)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(last)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(last)])]), rt.gv(f, "name", rt.fv(f, "a_left", rt.sv(f, "nadeassembly"))), rt.gv(f, "name", rt.fv(f, "a_right", rt.sv(f, "nadeassembly"))), rt.fv(f, "name", live(A)), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("grenade primed by an assembly, attached by ＀ and last touched by ＀ (＀ and ＀) at ＀ ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(M)])), (yield* g.call(f, P("/proc/key_name"), null, [live(last)])), rt.gv(f, "name", rt.fv(f, "a_left", rt.sv(f, "nadeassembly"))), rt.gv(f, "name", rt.fv(f, "a_right", rt.sv(f, "nadeassembly"))), rt.fv(f, "name", live(A)), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
	}
	DT = rt.getStep(f, live(f.src), 0);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("A grenade detonated at ＀ ＀", [rt.gv(f, "name", (DA = (yield* g.call(f, P("/proc/get_area"), null, [live(DT)])))), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(DT)), rt.fv(f, "y", live(DT)), rt.fv(f, "z", live(DT))])])]);
	yield* g.srcCall(f, "update_mob");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(6882, "/obj/item/weapon/grenade/chem_grenade/large", "/obj/item/weapon/grenade/chem_grenade", {
	allowed_containers: null,
	affected_area: 5,
	ignition_temp: 25,
	threatscale: 1.1,
	name: "large grenade",
	desc: "A custom made large grenade. It affects a larger area.",
	icon_state: "large_grenade",
	origin_tech: "combat=3;engineering=3",
});

// /obj/item/weapon/grenade/chem_grenade/large/proc/<init>  (code/game/objects/items/weapons/grenades/chem_grenade.dm:196)
rt.def("/obj/item/weapon/grenade/chem_grenade/large/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed_containers", rt.list(T("/obj/item/weapon/reagent_containers/glass"), T("/obj/item/weapon/reagent_containers/food/condiment"), T("/obj/item/weapon/reagent_containers/food/drinks")));
	return f.dot;
});

// /obj/item/weapon/grenade/chem_grenade/large/proc/prime  (code/game/objects/items/weapons/grenades/chem_grenade.dm:204)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/large/proc/prime", function* prime(f: Frame) {
	let S: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [S, G, $e];
	if (!isEqual(rt.sv(f, "stage"), 3)) {
		return live(f.dot);
	}
	S = null;
	rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj/item/slime_extract"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (truthy(rt.fv(f, "Uses", live(S)))) {
			G = null;
			rt.forList(f, 1, rt.sv(f, "beakers"), T("/obj/item/weapon/reagent_containers/glass"));
			while (($e = rt.next(f, 1)) !== undefined) {
				G = $e;
				yield* g.callName(f, rt.fv(f, "reagents", live(G)), "trans_to", [live(S), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(G)))]);
			}
			rt.endFor(f, 1);
			if (truthy(live(S))) {
				if ((truthy(rt.fv(f, "reagents", live(S))) && truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(S)))))) {
					G = null;
					rt.forList(f, 1, rt.sv(f, "beakers"), T("/obj/item/weapon/reagent_containers/glass"));
					while (($e = rt.next(f, 1)) !== undefined) {
						G = $e;
						yield* g.callName(f, rt.fv(f, "reagents", live(S)), "trans_to", [live(G), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(S)))]);
					}
					rt.endFor(f, 1);
				} else {
					yield* g.callName(f, live(S), "forceMove", [rt.getStep(f, live(f.src), 0)]);
					rt.setSv(f, "no_splash", 1);
				}
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/chem_grenade/large/proc/attackby  (code/game/objects/items/weapons/grenades/chem_grenade.dm:229)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/large/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/slime_extract")) ? 1 : 0)) && isEqual(rt.sv(f, "stage"), 2))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the ＀ assembly.</span>", [live(f.args[0]), rt.initial(f, live(f.src), "name")])]);
		rt.modSrcVar(f, "beakers", live(f.args[0]), add);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(6885, "/obj/item/weapon/grenade/chem_grenade/adv_release", "/obj/item/weapon/grenade/chem_grenade", {
	unit_spread: 10,
	name: "advanced release grenade",
	desc: "A custom made advanced release grenade. It is able to be detonated more than once. Can be configured using a multitool.",
	icon_state: "timeg",
	origin_tech: "combat=3;engineering=4",
});

// /obj/item/weapon/grenade/chem_grenade/adv_release/proc/attackby  (code/game/objects/items/weapons/grenades/chem_grenade.dm:260)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/adv_release/proc/attackby", function* attackby(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		$0 = rt.sv(f, "unit_spread");
		if (rt.inRange($0, 0, 24)) {
			rt.modSrcVar(f, "unit_spread", 5, add);
		} else if (rt.inRange($0, 25, 99)) {
			rt.modSrcVar(f, "unit_spread", 25, add);
		} else {
			rt.setSv(f, "unit_spread", 5);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'> You set the time release to ＀ units per detonation.</span>", [rt.sv(f, "unit_spread")])]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/grenade/chem_grenade/adv_release/proc/prime  (code/game/objects/items/weapons/grenades/chem_grenade.dm:273)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/adv_release/proc/prime", function* prime(f: Frame) {
	let total_volume: Value = null, RC: Value = null, fraction: Value = null, reactants: Value = null, RC_3: Value = null, M: Value = null, last: Value = null, _T: Value = null, A: Value = null, DT: Value = null, DA: Value = null;
	let $e: any;
	f.vars = () => [total_volume, RC, fraction, reactants, RC_3, M, last, _T, A, DT, DA, $e];
	if (!isEqual(rt.sv(f, "stage"), 3)) {
		return live(f.dot);
	}
	total_volume = 0;
	RC = null;
	rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj/item/weapon/reagent_containers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RC = $e;
		total_volume = rt.modify(live(total_volume), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(RC))), add);
	}
	rt.endFor(f, 0);
	if (!truthy(live(total_volume))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "nadeassembly")]);
		return live(f.dot);
	}
	fraction = divide(rt.sv(f, "unit_spread"), live(total_volume));
	rt.setFv(f, "my_atom", (reactants = (yield* g.new_(f, T("/datum/reagents"), [rt.sv(f, "unit_spread")]))), live(f.src));
	RC_3 = null;
	rt.forList(f, 0, rt.sv(f, "beakers"), T("/obj/item/weapon/reagent_containers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RC_3 = $e;
		yield* g.callName(f, rt.fv(f, "reagents", live(RC_3)), "trans_to", [live(reactants), multiply(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(RC_3))), live(fraction)), rt.sv(f, "threatscale"), 1, 1]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/chem_splash"), null, [rt.getStep(f, live(f.src), 0), rt.sv(f, "affected_area"), rt.list(live(reactants)), rt.sv(f, "ignition_temp"), rt.sv(f, "threatscale")]);
	if (truthy(rt.sv(f, "nadeassembly"))) {
		M = (yield* g.call(f, P("/proc/get_mob_by_ckey"), null, [rt.sv(f, "assemblyattacher")]));
		last = (yield* g.call(f, P("/proc/get_mob_by_ckey"), null, [rt.fv(f, "fingerprintslast", rt.sv(f, "nadeassembly"))]));
		_T = rt.getStep(f, live(f.src), 0);
		A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]));
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("grenade primed by an assembly, attached by ＀<A HREF='?_src_=holder;adminmoreinfo=＃'>(?)</A> (<A HREF='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>) and last touched by ＀<A HREF='?_src_=holder;adminmoreinfo=＃'>(?)</A> (<A HREF='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>) (＀ and ＀) at <A HREF='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>＀ (JMP)</a>.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)])), live(M), live(M), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(last)])), live(last), live(last), rt.gv(f, "name", rt.fv(f, "a_left", rt.sv(f, "nadeassembly"))), rt.gv(f, "name", rt.fv(f, "a_right", rt.sv(f, "nadeassembly"))), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T)), rt.fv(f, "name", live(A))])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("grenade primed by an assembly, attached by ＀ and last touched by ＀ (＀ and ＀) at ＀ (＀, ＀, ＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(M)])), (yield* g.call(f, P("/proc/key_name"), null, [live(last)])), rt.gv(f, "name", rt.fv(f, "a_left", rt.sv(f, "nadeassembly"))), rt.gv(f, "name", rt.fv(f, "a_right", rt.sv(f, "nadeassembly"))), rt.fv(f, "name", live(A)), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	} else {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/grenade/chem_grenade/adv_release/proc/prime")])), rt.sv(f, "det_time")]);
	}
	DT = rt.getStep(f, live(f.src), 0);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("A grenade detonated at ＀ (＀, ＀, ＀)", [rt.gv(f, "name", (DA = (yield* g.call(f, P("/proc/get_area"), null, [live(DT)])))), rt.fv(f, "x", live(DT)), rt.fv(f, "y", live(DT)), rt.fv(f, "z", live(DT))])]);
	return f.dot;
}, true);

rt.type(6886, "/obj/item/weapon/grenade/chem_grenade/metalfoam", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "metal foam grenade",
	desc: "Used for emergency sealing of air breaches.",
});

// /obj/item/weapon/grenade/chem_grenade/metalfoam/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:317)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/metalfoam/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["aluminium", 30]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["foaming_agent", 10]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["facid", 10]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6887, "/obj/item/weapon/grenade/chem_grenade/incendiary", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "incendiary grenade",
	desc: "Used for clearing rooms of living things.",
});

// /obj/item/weapon/grenade/chem_grenade/incendiary/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:335)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/incendiary/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["phosphorus", 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["stable_plasma", 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["sacid", 25]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6888, "/obj/item/weapon/grenade/chem_grenade/antiweed", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "weedkiller grenade",
	desc: "Used for purging large areas of invasive plant species. Contents under pressure. Do not directly inhale contents.",
});

// /obj/item/weapon/grenade/chem_grenade/antiweed/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:353)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/antiweed/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["plantbgone", 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["potassium", 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["phosphorus", 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["sugar", 25]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6889, "/obj/item/weapon/grenade/chem_grenade/cleaner", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "cleaner grenade",
	desc: "BLAM!-brand foaming space cleaner. In a special applicator for rapid cleaning of wide areas.",
});

// /obj/item/weapon/grenade/chem_grenade/cleaner/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:372)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/cleaner/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["fluorosurfactant", 40]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["water", 40]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["cleaner", 10]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6890, "/obj/item/weapon/grenade/chem_grenade/ez_clean", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "cleaner grenade",
	desc: "Waffle Co.-brand foaming space cleaner. In a special applicator for rapid cleaning of wide areas.",
});

// /obj/item/weapon/grenade/chem_grenade/ez_clean/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:390)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/ez_clean/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/large"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/large"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["fluorosurfactant", 40]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["water", 40]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["ez_clean", 60]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6891, "/obj/item/weapon/grenade/chem_grenade/teargas", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "teargas grenade",
	desc: "Used for nonlethal riot control. Contents under pressure. Do not directly inhale contents.",
});

// /obj/item/weapon/grenade/chem_grenade/teargas/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:409)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/teargas/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/large"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/large"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["condensedcapsaicin", 60]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["potassium", 40]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["phosphorus", 40]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["sugar", 40]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6892, "/obj/item/weapon/grenade/chem_grenade/facid", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "acid grenade",
	desc: "Used for melting armoured opponents.",
});

// /obj/item/weapon/grenade/chem_grenade/facid/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:428)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/facid/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["facid", 290]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["potassium", 10]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["phosphorus", 10]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["sugar", 10]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["facid", 280]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6893, "/obj/item/weapon/grenade/chem_grenade/colorful", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "colorful grenade",
	desc: "Used for wide scale painting projects.",
});

// /obj/item/weapon/grenade/chem_grenade/colorful/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:448)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/colorful/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["colorful_reagent", 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["potassium", 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["phosphorus", 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["sugar", 25]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6894, "/obj/item/weapon/grenade/chem_grenade/glitter", "/obj/item/weapon/grenade/chem_grenade", {
	glitter_type: "glitter",
	stage: 3,
	name: "generic glitter grenade",
	desc: "You shouldn't see this description.",
});

// /obj/item/weapon/grenade/chem_grenade/glitter/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:467)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/glitter/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", [rt.sv(f, "glitter_type"), 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["potassium", 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["phosphorus", 25]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["sugar", 25]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6898, "/obj/item/weapon/grenade/chem_grenade/clf3", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "clf3 grenade",
	desc: "BURN!-brand foaming clf3. In a special applicator for rapid purging of wide areas.",
});

// /obj/item/weapon/grenade/chem_grenade/clf3/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:500)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/clf3/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["fluorosurfactant", 250]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["clf3", 50]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["water", 250]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["clf3", 50]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6899, "/obj/item/weapon/grenade/chem_grenade/bioterrorfoam", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "Bio terror foam grenade",
	desc: "Tiger Cooperative chemical foam grenade. Causes temporary irration, blindness, confusion, mutism, and mutations to carbon based life forms. Contains additional spore toxin",
});

// /obj/item/weapon/grenade/chem_grenade/bioterrorfoam/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:518)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/bioterrorfoam/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["cryptobiolin", 75]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["water", 50]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["mutetoxin", 50]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["spore", 75]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["itching_powder", 50]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["fluorosurfactant", 150]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["mutagen", 150]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);

rt.type(6900, "/obj/item/weapon/grenade/chem_grenade/tuberculosis", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "Fungal tuberculosis grenade",
	desc: "WARNING: GRENADE WILL RELEASE DEADLY SPORES CONTAINING ACTIVE AGENTS. SEAL SUIT AND AIRFLOW BEFORE USE.",
});

// /obj/item/weapon/grenade/chem_grenade/tuberculosis/proc/Initialize  (code/game/objects/items/weapons/grenades/chem_grenade.dm:538)  may sleep
rt.def("/obj/item/weapon/grenade/chem_grenade/tuberculosis/proc/Initialize", function* Initialize(f: Frame) {
	let B1: Value = null, B2: Value = null;
	f.vars = () => [B1, B2];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	B1 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), [live(f.src)]));
	B2 = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), [live(f.src)]));
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["potassium", 50]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["phosphorus", 50]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B1)), "add_reagent", ["fungalspores", 200]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["blood", 250]);
	yield* g.callName(f, rt.fv(f, "reagents", live(B2)), "add_reagent", ["sugar", 50]);
	rt.modSrcVar(f, "beakers", live(B1), add);
	rt.modSrcVar(f, "beakers", live(B2), add);
	return f.dot;
}, true);
