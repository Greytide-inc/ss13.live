// From code/game/objects/structures/watercloset.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12890, "/obj/structure/toilet", "/obj/structure", {
	open: 0,
	cistern: 0,
	w_items: 0,
	swirlie: null,
	anchored: 1,
	name: "toilet",
	desc: "The HT-451, a torque rotation-based, waste disposal unit for small matter. This one seems remarkably clean.",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "toilet00",
	density: 0,
});

// /obj/structure/toilet/proc/Initialize  (code/game/objects/structures/watercloset.dm:15)
rt.def("/obj/structure/toilet/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "open", rt.call(f, P("/proc/round"), null, [rt.call(f, P("/proc/rand"), null, [0, 1])]));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/structure/toilet/proc/attack_hand  (code/game/objects/structures/watercloset.dm:22)  may sleep
rt.def("/obj/structure/toilet/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let GM: Value = null, C: Value = null, I: Value = null;
	f.vars = () => [user, GM, C, I];
	if (truthy(rt.sv(f, "swirlie"))) {
		yield* g.callName(f, live(user), "changeNext_move", [8]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "swing_hit", 25, 1]);
		yield* g.callName(f, rt.sv(f, "swirlie"), "visible_message", [fmt("<span class='danger'>＀ slams the toilet seat onto ＀'s head!</span>", [live(user), rt.sv(f, "swirlie")]), fmt("<span class='userdanger'>＀ slams the toilet seat onto your head!</span>", [live(user)]), "<span class='italics'>You hear reverberating porcelain.</span>"]);
		yield* g.callName(f, rt.sv(f, "swirlie"), "adjustBruteLoss", [5]);
	} else {
		if (((truthy(rt.fv(f, "pulling", live(user))) && isEqual(rt.fv(f, "a_intent", live(user)), "grab")) && truthy((rt.istype(rt.fv(f, "pulling", live(user)), T("/mob/living")) ? 1 : 0)))) {
			yield* g.callName(f, live(user), "changeNext_move", [8]);
			GM = rt.fv(f, "pulling", live(user));
			if (rt.ge(rt.fv(f, "grab_state", live(user)), 1)) {
				if (!isEqual(rt.fv(f, "loc", live(GM)), rt.getStep(f, live(f.src), 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ needs to be on ＀!</span>", [live(GM), live(f.src)])]);
					return live(f.dot);
				}
				if (!truthy(rt.sv(f, "swirlie"))) {
					if (truthy(rt.sv(f, "open"))) {
						yield* g.callName(f, live(GM), "visible_message", [fmt("<span class='danger'>＀ starts to give ＀ a swirlie!</span>", [live(user), live(GM)]), fmt("<span class='userdanger'>＀ starts to give you a swirlie...</span>", [live(user)])]);
						rt.setSv(f, "swirlie", live(GM));
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 30, null, 0, "target", live(f.src)], rt.Args.Named)))) {
							yield* g.callName(f, live(GM), "visible_message", [fmt("<span class='danger'>＀ gives ＀ a swirlie!</span>", [live(user), live(GM)]), fmt("<span class='userdanger'>＀ gives you a swirlie!</span>", [live(user)]), "<span class='italics'>You hear a toilet flushing.</span>"]);
							if (truthy((rt.istype(live(GM), T("/mob/living/carbon")) ? 1 : 0))) {
								if (!truthy(rt.gv(f, "internal", (C = live(GM))))) {
									yield* g.callName(f, live(C), "adjustOxyLoss", [5]);
								}
							} else {
								yield* g.callName(f, live(GM), "adjustOxyLoss", [5]);
							}
						}
						rt.setSv(f, "swirlie", null);
					} else {
						yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/bang.ogg"), 25, 1]);
						yield* g.callName(f, live(GM), "visible_message", [fmt("<span class='danger'>＀ slams ＀ into ＀!</span>", [live(user), rt.fv(f, "name", live(GM)), live(f.src)]), fmt("<span class='userdanger'>＀ slams you into ＀!</span>", [live(user), live(f.src)])]);
						yield* g.callName(f, live(GM), "adjustBruteLoss", [5]);
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need a tighter grip!</span>"]);
			}
		} else {
			if ((truthy(rt.sv(f, "cistern")) && !truthy(rt.sv(f, "open")))) {
				if (!truthy(rt.len(f, rt.sv(f, "contents")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The cistern is empty.</span>"]);
				} else {
					I = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "contents")]);
					if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
						yield* g.callName(f, live(user), "put_in_hands", [live(I)]);
					} else {
						rt.setFv(f, "loc", live(I), rt.getStep(f, live(f.src), 0));
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You find ＀ in the cistern.</span>", [live(I)])]);
					(rt.modSrcVar(f, "w_items", rt.fv(f, "w_class", live(I)), subtract));
				}
			} else {
				rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
				yield* g.srcCall(f, "update_icon");
			}
		}
	}
	return f.dot;
}, true);

// /obj/structure/toilet/proc/update_icon  (code/game/objects/structures/watercloset.dm:71)
rt.def("/obj/structure/toilet/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("toilet＀＀", [rt.sv(f, "open"), rt.sv(f, "cistern")]));
	return f.dot;
});

// /obj/structure/toilet/proc/attackby  (code/game/objects/structures/watercloset.dm:75)  may sleep
rt.def("/obj/structure/toilet/proc/attackby", function* attackby(f: Frame) {
	let RG: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [RG, $0, $1, $2];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		$0 = live(f.args[1]);
		if (truthy(rt.sv(f, "cistern"))) {
			$1 = "replace the lid on the cistern";
		} else {
			$1 = "lift the lid off the cistern";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You start to ＀...</span>", [$1])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/stonedoor_openclose.ogg"), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			$0 = live(f.args[1]);
			$1 = live(f.args[1]);
			if (truthy(rt.sv(f, "cistern"))) {
				$1 = $1;
				$2 = "replaces the lid on the cistern";
			} else {
				$2 = "lifts the lid off the cistern";
			}
			$1 = fmt("＀ ＀!", [$1, $2]);
			if (truthy(rt.sv(f, "cistern"))) {
				$2 = "replace the lid on the cistern";
			} else {
				$2 = "lift the lid off the cistern";
			}
			yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀!</span>", [$2]), "<span class='italics'>You hear grinding porcelain.</span>"]);
			rt.setSv(f, "cistern", (!truthy(rt.sv(f, "cistern")) ? 1 : 0));
			yield* g.srcCall(f, "update_icon");
		}
	} else {
		if (truthy(rt.sv(f, "cistern"))) {
			if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
				if (rt.gt(rt.fv(f, "w_class", live(f.args[0])), 3)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ does not fit!</span>", [live(f.args[0])])]);
					return live(f.dot);
				}
				if (rt.gt(add(rt.sv(f, "w_items"), rt.fv(f, "w_class", live(f.args[0]))), 5)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The cistern is full!</span>"]);
					return live(f.dot);
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it in the cistern!</span>", [live(f.args[0])])]);
					return live(f.dot);
				}
				rt.setFv(f, "loc", live(f.args[0]), live(f.src));
				rt.modSrcVar(f, "w_items", rt.fv(f, "w_class", live(f.args[0])), add);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You carefully place ＀ into the cistern.</span>", [live(f.args[0])])]);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers")) ? 1 : 0))) {
				if (!truthy(rt.sv(f, "open"))) {
					return live(f.dot);
				}
				yield* g.callName(f, rt.gv(f, "reagents", (RG = live(f.args[0]))), "add_reagent", ["water", (yield* g.call(f, P("/proc/min"), null, [subtract(rt.fv(f, "volume", live(RG)), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(RG)))), rt.fv(f, "amount_per_transfer_from_this", live(RG))]))]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You fill ＀ from ＀. Gross.</span>", [live(RG), live(f.src)])]);
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(12891, "/obj/structure/toilet/secret", "/obj/structure/toilet", {
	secret: null,
	secret_type: null,
});

// /obj/structure/toilet/secret/proc/Initialize  (code/game/objects/structures/watercloset.dm:112)  may sleep
rt.def("/obj/structure/toilet/secret/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "secret_type"))) return f.dot;
	rt.setSv(f, "secret", (yield* g.new_(f, rt.sv(f, "secret_type"), [live(f.src)])));
	rt.modField(f, rt.sv(f, "secret"), "desc", " It's a secret!", add);
	rt.modSrcVar(f, "w_items", rt.fv(f, "w_class", rt.sv(f, "secret")), add);
	rt.modSrcVar(f, "contents", rt.sv(f, "secret"), add);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(12892, "/obj/structure/urinal", "/obj/structure", {
	exposed: 0,
	hiddenitem: null,
	anchored: 1,
	name: "urinal",
	desc: "The HU-452, an experimental urinal. Comes complete with experimental urinal cake.",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "urinal",
	density: 0,
});

// /obj/structure/urinal/proc/New  (code/game/objects/structures/watercloset.dm:133)  may sleep
rt.def("/obj/structure/urinal/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "hiddenitem", (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/urinalcake"), [])));
	return f.dot;
}, true);

// /obj/structure/urinal/proc/attack_hand  (code/game/objects/structures/watercloset.dm:137)  may sleep
rt.def("/obj/structure/urinal/proc/attack_hand", function* attack_hand(f: Frame) {
	let GM: Value = null;
	f.vars = () => [GM];
	if (((truthy(rt.fv(f, "pulling", live(f.args[0]))) && isEqual(rt.fv(f, "a_intent", live(f.args[0])), "grab")) && truthy((rt.istype(rt.fv(f, "pulling", live(f.args[0])), T("/mob/living")) ? 1 : 0)))) {
		GM = rt.fv(f, "pulling", live(f.args[0]));
		if (rt.ge(rt.fv(f, "grab_state", live(f.args[0])), 1)) {
			if (!isEqual(rt.fv(f, "loc", live(GM)), rt.getStep(f, live(f.src), 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ needs to be on ＀.</span>", [rt.fv(f, "name", live(GM)), live(f.src)])]);
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[0]), "changeNext_move", [8]);
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ slams ＀ into ＀!</span>", [live(f.args[0]), live(GM), live(f.src)]), fmt("<span class='danger'>You slam ＀ into ＀!</span>", [live(GM), live(f.src)])]);
			yield* g.callName(f, live(GM), "adjustBruteLoss", [8]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You need a tighter grip!</span>"]);
		}
	} else {
		if (truthy(rt.sv(f, "exposed"))) {
			if (!truthy(rt.sv(f, "hiddenitem"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>There is nothing in the drain holder.</span>"]);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
					yield* g.callName(f, live(f.args[0]), "put_in_hands", [rt.sv(f, "hiddenitem")]);
				} else {
					yield* g.callName(f, rt.sv(f, "hiddenitem"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You fish ＀ out of the drain enclosure.</span>", [rt.sv(f, "hiddenitem")])]);
				rt.setSv(f, "hiddenitem", null);
			}
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/urinal/proc/attackby  (code/game/objects/structures/watercloset.dm:163)  may sleep
rt.def("/obj/structure/urinal/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [I, user, params, $0, $1, $2];
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		$0 = live(user);
		if (truthy(rt.sv(f, "exposed"))) {
			$1 = "screw the cap back into place";
		} else {
			$1 = "unscrew the cap to the drain protector";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You start to ＀...</span>", [$1])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/stonedoor_openclose.ogg"), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(20, rt.fv(f, "toolspeed", live(I))), "target", live(f.src)], rt.Args.Named)))) {
			$0 = live(user);
			$1 = live(user);
			if (truthy(rt.sv(f, "exposed"))) {
				$1 = $1;
				$2 = "screws the cap back into place";
			} else {
				$2 = "unscrew the cap to the drain protector";
			}
			$1 = fmt("＀ ＀!", [$1, $2]);
			if (truthy(rt.sv(f, "exposed"))) {
				$2 = "screw the cap back into place";
			} else {
				$2 = "unscrew the cap on the drain";
			}
			yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀!</span>", [$2]), "<span class='italics'>You hear metal and squishing noises.</span>"]);
			rt.setSv(f, "exposed", (!truthy(rt.sv(f, "exposed")) ? 1 : 0));
		}
	} else {
		if (!truthy(rt.sv(f, "exposed"))) return f.dot;
		if (truthy(rt.sv(f, "hiddenitem"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There is already something in the drain enclosure.</span>"]);
			return live(f.dot);
		}
		if (rt.gt(rt.fv(f, "w_class", live(I)), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is too large for the drain enclosure.</span>", [live(I)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>[I] is stuck to your hand, you cannot put it in the drain enclosure!</span>"]);
			return live(f.dot);
		}
		yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
		rt.setSv(f, "hiddenitem", live(I));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You place ＀ into the drain enclosure.</span>", [live(I)])]);
	}
	return f.dot;
}, true);

rt.type(5869, "/obj/item/weapon/reagent_containers/food/urinalcake", "/obj/item/weapon/reagent_containers/food", {
	name: "urinal cake",
	desc: "The noble urinal cake, protecting the station's pipes from the station's pee. Do not eat.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "urinalcake",
	w_class: 1,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/urinalcake/proc/<init>  (code/game/objects/structures/watercloset.dm:190)
rt.def("/obj/item/weapon/reagent_containers/food/urinalcake/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["chlorine", 3, "ammonia", 1]));
	return f.dot;
});

rt.type(10879, "/obj/machinery/shower", "/obj/machinery", {
	on: 0,
	mymist: null,
	ismist: 0,
	watertemp: "normal",
	anchored: 1,
	use_power: 0,
	name: "shower",
	desc: "The HS-451. Installed in the 2550s by the Nanotrasen Hygiene Division.",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "shower",
	density: 0,
});

// /obj/machinery/shower/proc/attack_hand  (code/game/objects/structures/watercloset.dm:216)  may sleep
rt.def("/obj/machinery/shower/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	let G: Value = null, L: Value = null, tile: Value = null;
	let $e: any;
	f.vars = () => [M, G, L, tile, $e];
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "add_fingerprint", live(M));
	if (truthy(rt.sv(f, "on"))) {
		yield* g.srcCall(f, "wash_turf");
		G = null;
		rt.forList(f, 0, rt.sv(f, "loc"), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			if (truthy((rt.istype(live(G), T("/mob/living")) ? 1 : 0))) {
				yield* g.srcCall(f, "wash_mob", (L = live(G)));
			} else {
				yield* g.srcCall(f, "wash_obj", live(G));
			}
		}
		rt.endFor(f, 0);
	} else {
		if (!truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open")) ? 1 : 0))) return f.dot;
		yield* g.callName(f, (tile = rt.sv(f, "loc")), "MakeSlippery", ["min_wet_time", 5, "wet_time_to_add", 1], rt.Args.Named);
	}
	return f.dot;
}, true);

// /obj/machinery/shower/proc/attackby  (code/game/objects/structures/watercloset.dm:234)  may sleep
rt.def("/obj/machinery/shower/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let $0: any;
	f.vars = () => [I, user, params, $0];
	if (isEqual(rt.fv(f, "type", live(I)), T("/obj/item/device/analyzer"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The water temperature seems to be ＀.</span>", [rt.sv(f, "watertemp")])]);
	}
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/wrench")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You begin to adjust the temperature valve with ％！...</span>", [live(I)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(50, rt.fv(f, "toolspeed", live(I))), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	$0 = rt.sv(f, "watertemp");
	if ($0 === "normal") {
		rt.setSv(f, "watertemp", "freezing");
	} else if ($0 === "freezing") {
		rt.setSv(f, "watertemp", "boiling");
	} else if ($0 === "boiling") {
		rt.setSv(f, "watertemp", "normal");
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ adjusts the shower with ％！.</span>", [live(user), live(I)]), fmt("<span class='notice'>You adjust the shower with ％！ to ＀ temperature.</span>", [live(I), rt.sv(f, "watertemp")])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has wrenched a shower to ＀ at (＀,＀,＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.sv(f, "watertemp"), rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z")])]);
	yield* g.srcCall(f, "add_hiddenprint", live(user));
	return f.dot;
}, true);

// /obj/machinery/shower/proc/update_icon  (code/game/objects/structures/watercloset.dm:252)  may sleep
rt.def("/obj/machinery/shower/proc/update_icon", function* update_icon(f: Frame) {
	yield* g.srcCall(f, "cut_overlays");
	if (truthy(rt.sv(f, "mymist"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mymist")]);
	}
	if (truthy(rt.sv(f, "on"))) {
		yield* g.srcCall(f, "add_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/watercloset.dmi"), "water", 4.099999904632568])));
		if (isEqual(rt.sv(f, "watertemp"), "freezing")) {
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "ismist"))) {
			rt.spawnTail(f, 50, "/obj/machinery/shower/proc/update_icon: spawn at game/objects/structures/watercloset.dm:261");
		} else {
			rt.setSv(f, "ismist", 1);
			rt.setSv(f, "mymist", (yield* g.new_(f, T("/obj/effect/mist"), [rt.sv(f, "loc")])));
		}
	} else {
		if (!truthy(rt.sv(f, "ismist"))) return f.dot;
		rt.setSv(f, "ismist", 1);
		rt.setSv(f, "mymist", (yield* g.new_(f, T("/obj/effect/mist"), [rt.sv(f, "loc")])));
		rt.spawnTail(f, 250, "/obj/machinery/shower/proc/update_icon: spawn at game/objects/structures/watercloset.dm:271");
	}
	return f.dot;
}, true);

// a spawn(250) body of /obj/machinery/shower/proc/update_icon, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/shower/proc/update_icon: spawn at game/objects/structures/watercloset.dm:271", function* (f: Frame) {
	if ((!truthy(rt.sv(f, "on")) && truthy(rt.sv(f, "mymist")))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "mymist")]);
		rt.setSv(f, "ismist", 0);
	}
	return null;
});

// a spawn(50) body of /obj/machinery/shower/proc/update_icon, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/shower/proc/update_icon: spawn at game/objects/structures/watercloset.dm:261", function* (f: Frame) {
	if ((truthy(live(f.src)) && truthy(rt.sv(f, "on")))) {
		rt.setSv(f, "ismist", 1);
		rt.setSv(f, "mymist", (yield* g.new_(f, T("/obj/effect/mist"), [rt.sv(f, "loc")])));
	}
	return null;
});

// /obj/machinery/shower/proc/Crossed  (code/game/objects/structures/watercloset.dm:278)  may sleep
rt.def("/obj/machinery/shower/proc/Crossed", function* Crossed(f: Frame) {
	let L: Value = null, C: Value = null;
	f.vars = () => [L, C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "on"))) return f.dot;
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "wash_mob", (L = live(f.args[0])))))) {
			yield* g.callName(f, (C = live(L)), "slip", [80, null, 1]);
		}
	} else {
		yield* g.srcCall(f, "wash_obj", live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["O"] });

// /obj/machinery/shower/proc/wash_obj  (code/game/objects/structures/watercloset.dm:290)
rt.def("/obj/machinery/shower/proc/wash_obj", function wash_obj(f: Frame, O: Value) {
	let I: Value = null;
	f.vars = () => [I];
	rt.callName(f, live(O), "clean_blood", []);
	if (!truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "acid_level", (I = live(O)), 0);
	rt.callName(f, live(I), "extinguish", []);
	return f.dot;
});

// /obj/machinery/shower/proc/wash_turf  (code/game/objects/structures/watercloset.dm:299)  may sleep
rt.def("/obj/machinery/shower/proc/wash_turf", function* wash_turf(f: Frame) {
	let tile: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [tile, E, $e];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	tile = rt.sv(f, "loc");
	yield* g.callName(f, rt.sv(f, "loc"), "clean_blood", []);
	E = null;
	rt.forList(f, 0, live(tile), T("/obj/effect"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		if ((truthy((rt.istype(live(E), T("/obj/effect/decal/cleanable")) ? 1 : 0)) || truthy((rt.istype(live(E), T("/obj/effect/rune")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(E)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/shower/proc/wash_mob  (code/game/objects/structures/watercloset.dm:308)  may sleep
rt.def("/obj/machinery/shower/proc/wash_mob", function* wash_mob(f: Frame, L: Value) {
	let M: Value = null, I: Value = null, H: Value = null, washgloves: Value = null, washshoes: Value = null, washmask: Value = null, washears: Value = null, washglasses: Value = null;
	let $e: any;
	f.vars = () => [L, M, I, H, washgloves, washshoes, washmask, washears, washglasses, $e];
	yield* g.callName(f, live(L), "wash_cream", []);
	yield* g.callName(f, live(L), "ExtinguishMob", []);
	yield* g.callName(f, live(L), "adjust_fire_stacks", [-20]);
	if (truthy((rt.istype(live(L), T("/mob/living/carbon")) ? 1 : 0))) {
		M = live(L);
		f.dot = 1;
		yield* g.srcCall(f, "check_heat", live(M));
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(M)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.callName(f, live(I), "clean_blood", []);
		}
		rt.endFor(f, 0);
		if (truthy(rt.fv(f, "back", live(M)))) {
			if (truthy((yield* g.callName(f, rt.fv(f, "back", live(M)), "clean_blood", [])))) {
				yield* g.callName(f, live(M), "update_inv_back", [0]);
			}
		}
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = live(M);
			washgloves = 1;
			washshoes = 1;
			washmask = 1;
			washears = 1;
			washglasses = 1;
			if (truthy(rt.fv(f, "wear_suit", live(H)))) {
				washgloves = (!truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 1)) ? 1 : 0);
				washshoes = (!truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 8)) ? 1 : 0);
			}
			if (truthy(rt.fv(f, "head", live(H)))) {
				washmask = (!truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "head", live(H))), 16)) ? 1 : 0);
				washglasses = (!truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "head", live(H))), 64)) ? 1 : 0);
				washears = (!truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "head", live(H))), 32)) ? 1 : 0);
			}
			if (truthy(rt.fv(f, "wear_mask", live(H)))) {
				if (truthy(live(washears))) {
					washears = (!truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_mask", live(H))), 32)) ? 1 : 0);
				}
				if (truthy(live(washglasses))) {
					washglasses = (!truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_mask", live(H))), 64)) ? 1 : 0);
				}
			}
			if (truthy(rt.fv(f, "head", live(H)))) {
				if (truthy((yield* g.callName(f, rt.fv(f, "head", live(H)), "clean_blood", [])))) {
					yield* g.callName(f, live(H), "update_inv_head", []);
				}
			}
			if (truthy(rt.fv(f, "wear_suit", live(H)))) {
				if (truthy((yield* g.callName(f, rt.fv(f, "wear_suit", live(H)), "clean_blood", [])))) {
					yield* g.callName(f, live(H), "update_inv_wear_suit", []);
				}
			} else {
				if (truthy(rt.fv(f, "w_uniform", live(H)))) {
					if (truthy((yield* g.callName(f, rt.fv(f, "w_uniform", live(H)), "clean_blood", [])))) {
						yield* g.callName(f, live(H), "update_inv_w_uniform", []);
					}
				}
			}
			if (truthy(live(washgloves))) {
				yield* g.callName(f, live(H), "clean_blood", []);
			}
			if ((truthy(rt.fv(f, "shoes", live(H))) && truthy(live(washshoes)))) {
				if (truthy((yield* g.callName(f, rt.fv(f, "shoes", live(H)), "clean_blood", [])))) {
					yield* g.callName(f, live(H), "update_inv_shoes", []);
				}
			}
			if (truthy(rt.fv(f, "wear_mask", live(H)))) {
				if (truthy(live(washmask))) {
					if (truthy((yield* g.callName(f, rt.fv(f, "wear_mask", live(H)), "clean_blood", [])))) {
						yield* g.callName(f, live(H), "update_inv_wear_mask", []);
					}
				}
			} else {
				rt.setFv(f, "lip_style", live(H), null);
				yield* g.callName(f, live(H), "update_body", []);
			}
			if ((truthy(rt.fv(f, "glasses", live(H))) && truthy(live(washglasses)))) {
				if (truthy((yield* g.callName(f, rt.fv(f, "glasses", live(H)), "clean_blood", [])))) {
					yield* g.callName(f, live(H), "update_inv_glasses", []);
				}
			}
			if ((truthy(rt.fv(f, "ears", live(H))) && truthy(live(washears)))) {
				if (truthy((yield* g.callName(f, rt.fv(f, "ears", live(H)), "clean_blood", [])))) {
					yield* g.callName(f, live(H), "update_inv_ears", []);
				}
			}
			if (truthy(rt.fv(f, "belt", live(H)))) {
				if (truthy((yield* g.callName(f, rt.fv(f, "belt", live(H)), "clean_blood", [])))) {
					yield* g.callName(f, live(H), "update_inv_belt", []);
				}
			}
		} else {
			if (truthy(rt.fv(f, "wear_mask", live(M)))) {
				if (truthy((yield* g.callName(f, rt.fv(f, "wear_mask", live(M)), "clean_blood", [])))) {
					yield* g.callName(f, live(M), "update_inv_wear_mask", [0]);
				}
			}
			yield* g.callName(f, live(M), "clean_blood", []);
		}
	} else {
		yield* g.callName(f, live(L), "clean_blood", []);
	}
	return f.dot;
}, true);

// /obj/machinery/shower/proc/process  (code/game/objects/structures/watercloset.dm:384)  may sleep
rt.def("/obj/machinery/shower/proc/process", function* process(f: Frame) {
	let G: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [G, L, $e];
	if (!truthy(rt.sv(f, "on"))) return f.dot;
	yield* g.srcCall(f, "wash_turf");
	G = null;
	rt.forList(f, 0, rt.sv(f, "loc"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (truthy((rt.istype(live(G), T("/mob/living")) ? 1 : 0))) {
			yield* g.srcCall(f, "wash_mob", (L = live(G)));
		} else {
			yield* g.srcCall(f, "wash_obj", live(G));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/shower/proc/deconstruct  (code/game/objects/structures/watercloset.dm:393)  may sleep
rt.def("/obj/machinery/shower/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 3]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/shower/proc/check_heat  (code/game/objects/structures/watercloset.dm:397)  may sleep
rt.def("/obj/machinery/shower/proc/check_heat", function* check_heat(f: Frame, C: Value) {
	f.vars = () => [C];
	if (isEqual(rt.sv(f, "watertemp"), "freezing")) {
		rt.setFv(f, "bodytemperature", live(C), (yield* g.call(f, P("/proc/max"), null, [80, subtract(rt.fv(f, "bodytemperature", live(C)), 80)])));
		yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='warning'>The water is freezing!</span>"]);
	} else {
		if (!isEqual(rt.sv(f, "watertemp"), "boiling")) return f.dot;
		rt.setFv(f, "bodytemperature", live(C), (yield* g.call(f, P("/proc/min"), null, [500, add(rt.fv(f, "bodytemperature", live(C)), 35)])));
		yield* g.callName(f, live(C), "adjustFireLoss", [5]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='danger'>The water is searing!</span>"]);
	}
	return f.dot;
}, true);

rt.type(12893, "/obj/structure/sink", "/obj/structure", {
	busy: 0,
	dispensedreagent: "water",
	anchored: 1,
	name: "sink",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "sink",
	desc: "A sink used for washing one's hands and face.",
});

// /obj/structure/sink/proc/attack_hand  (code/game/objects/structures/watercloset.dm:428)  may sleep
rt.def("/obj/structure/sink/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let selected_area: Value = null, washing_face: Value = null, H: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, selected_area, washing_face, H, $0, $1, $2];
	if ((!truthy(live(user)) || !truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(user))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "busy"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Someone's already washing here.</span>"]);
		return live(f.dot);
	}
	selected_area = (yield* g.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))]));
	washing_face = 0;
	if (truthy((rt.isIn(f, live(selected_area), rt.list("head", "mouth", "eyes")) ? 1 : 0))) {
		washing_face = 1;
	}
	$0 = live(user);
	$1 = live(user);
	if (truthy(live(washing_face))) {
		$1 = $1;
		$2 = "face";
	} else {
		$2 = "hands";
	}
	$1 = fmt("<span class='notice'>＀ starts washing their ＀...</span>", [$1, $2]);
	if (truthy(live(washing_face))) {
		$2 = "face";
	} else {
		$2 = "hands";
	}
	yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You start washing your ＀...</span>", [$2])]);
	rt.setSv(f, "busy", 1);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 40, "target", live(f.src)], rt.Args.Named)))) {
		rt.setSv(f, "busy", 0);
		return live(f.dot);
	}
	rt.setSv(f, "busy", 0);
	$0 = live(user);
	$1 = live(user);
	if (truthy(live(washing_face))) {
		$1 = $1;
		$2 = "face";
	} else {
		$2 = "hands";
	}
	$1 = fmt("<span class='notice'>＀ washes their ＀ using ＀.</span>", [$1, $2, live(f.src)]);
	if (truthy(live(washing_face))) {
		$2 = "face";
	} else {
		$2 = "hands";
	}
	yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You wash your ＀ using ＀.</span>", [$2, live(f.src)])]);
	if (truthy(live(washing_face))) {
		if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
			rt.setFv(f, "lip_style", (H = live(user)), null);
			rt.setFv(f, "lip_color", live(H), rt.initial(f, live(H), "lip_color"));
			yield* g.callName(f, live(H), "wash_cream", []);
			yield* g.callName(f, live(H), "regenerate_icons", []);
		}
		rt.setFv(f, "drowsyness", live(user), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "drowsyness", live(user)), (yield* g.call(f, P("/proc/rand"), null, [2, 3]))), 0])));
	} else {
		yield* g.callName(f, live(user), "clean_blood", []);
	}
	return f.dot;
}, true);

// /obj/structure/sink/proc/attackby  (code/game/objects/structures/watercloset.dm:468)  may sleep
rt.def("/obj/structure/sink/proc/attackby", function* attackby(f: Frame) {
	let RG: Value = null, B: Value = null, stunforce: Value = null, G: Value = null;
	f.vars = () => [RG, B, stunforce, G];
	if (truthy(rt.sv(f, "busy"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Someone's already washing here!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers")) ? 1 : 0))) {
		if (truthy(rt.bitAnd(rt.gv(f, "container_type", (RG = live(f.args[0]))), 4096))) {
			if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", live(RG)), "holder_full", [])))) {
				yield* g.callName(f, rt.fv(f, "reagents", live(RG)), "add_reagent", [fmt("＀", [rt.sv(f, "dispensedreagent")]), (yield* g.call(f, P("/proc/min"), null, [subtract(rt.fv(f, "volume", live(RG)), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(RG)))), rt.fv(f, "amount_per_transfer_from_this", live(RG))]))]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You fill ＀ from ＀.</span>", [live(RG), live(f.src)])]);
				return 1;
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＄！ is full.</span>", [live(RG)])]);
			return 0;
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/melee/baton")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "cell", (B = live(f.args[0]))))) {
			if ((rt.gt(rt.gv(f, "charge", rt.fv(f, "cell", live(B))), 0) && isEqual(rt.fv(f, "status", live(B)), 1))) {
				yield* g.call(f, P("/proc/flick"), null, ["baton_active", live(f.src)]);
				stunforce = rt.fv(f, "stunforce", live(B));
				yield* g.callName(f, live(f.args[1]), "Knockdown", [live(stunforce)]);
				rt.setFv(f, "stuttering", live(f.args[1]), live(stunforce));
				yield* g.callName(f, live(B), "deductcharge", [rt.fv(f, "hitcost", live(B))]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ shocks themself while attempting to wash the active ＀!</span>", [live(f.args[1]), rt.fv(f, "name", live(B))]), fmt("<span class='userdanger'>You unwisely attempt to wash ＀ while it's still on.</span>", [live(B)])]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "sparks", 50, 1]);
				return live(f.dot);
			}
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/mop")) ? 1 : 0))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", [fmt("＀", [rt.sv(f, "dispensedreagent")]), 5]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You wet ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/slosh.ogg"), 25, 1]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/medical/gauze")) ? 1 : 0))) {
		G = live(f.args[0]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/glass/rag"), [rt.fv(f, "loc", live(f.src))]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You tear off a strip of gauze and make a rag.</span>"]);
		yield* g.callName(f, live(G), "use", [1]);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 128))) {
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start washing ＀...</span>", [live(f.args[0])])]);
		rt.setSv(f, "busy", 1);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
			rt.setSv(f, "busy", 0);
			return 1;
		}
		rt.setSv(f, "busy", 0);
		yield* g.callName(f, live(f.args[0]), "clean_blood", []);
		rt.setFv(f, "acid_level", live(f.args[0]), 0);
		yield* g.srcCall(f, "create_reagents", 5);
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [fmt("＀", [rt.sv(f, "dispensedreagent")]), 5]);
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(f.args[0]), 1]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ washes ＀ using ＀.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You wash ＀ using ＀.</span>", [live(f.args[0]), live(f.src)])]);
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/structure/sink/proc/deconstruct  (code/game/objects/structures/watercloset.dm:532)  may sleep
rt.def("/obj/structure/sink/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 3]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12895, "/obj/structure/sink/puddle", "/obj/structure/sink", {
	name: "puddle",
	desc: "A puddle used for washing one's hands and face.",
	icon_state: "puddle",
});

// /obj/structure/sink/puddle/proc/attack_hand  (code/game/objects/structures/watercloset.dm:548)  may sleep
rt.def("/obj/structure/sink/puddle/proc/attack_hand", function* attack_hand(f: Frame) {
	rt.setSv(f, "icon_state", "puddle-splash");
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", "puddle");
	return f.dot;
}, true, { args: ["M"] });

// /obj/structure/sink/puddle/proc/attackby  (code/game/objects/structures/watercloset.dm:553)  may sleep
rt.def("/obj/structure/sink/puddle/proc/attackby", function* attackby(f: Frame) {
	rt.setSv(f, "icon_state", "puddle-splash");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "icon_state", "puddle");
	return f.dot;
}, true, { args: ["O", "user", "params"] });

rt.type(12896, "/obj/structure/curtain", "/obj/structure", {
	open: 1,
	anchored: 1,
	name: "curtain",
	desc: "Contains less than 1% mercury.",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "open",
	color: "#ACD1E9",
	alpha: 200,
	layer: 3.4,
	opacity: 0,
	density: 0,
});

// /obj/structure/curtain/proc/toggle  (code/game/objects/structures/watercloset.dm:576)
rt.def("/obj/structure/curtain/proc/toggle", function toggle(f: Frame) {
	rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/structure/curtain/proc/update_icon  (code/game/objects/structures/watercloset.dm:580)
rt.def("/obj/structure/curtain/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "open"))) {
		rt.setSv(f, "icon_state", "closed");
		rt.setSv(f, "layer", 4.25);
		rt.setSv(f, "density", 1);
		rt.setSv(f, "open", 0);
	} else {
		rt.setSv(f, "icon_state", "open");
		rt.setSv(f, "layer", 3.4000000953674316);
		rt.setSv(f, "density", 0);
		rt.setSv(f, "open", 1);
	}
	return f.dot;
});

// /obj/structure/curtain/proc/attackby  (code/game/objects/structures/watercloset.dm:593)  may sleep
rt.def("/obj/structure/curtain/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0))) {
		rt.setSv(f, "color", (yield* g.op(f, "Prompt", [256], [null, null, "Choose Color", live(f.args[1]), null])));
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "anchored"))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ unscrews ＀ from the floor.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start to unscrew ＀ from the floor...</span>", [live(f.src)]), "You hear rustling noises."]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if (!truthy(rt.sv(f, "anchored"))) {
						return live(f.dot);
					}
					rt.setSv(f, "anchored", 0);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You unscrew ＀ from the floor.</span>", [live(f.src)])]);
				}
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ screws ＀ to the floor.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start to screw ＀ to the floor...</span>", [live(f.src)]), "You hear rustling noises."]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if (truthy(rt.sv(f, "anchored"))) {
						return live(f.dot);
					}
					rt.setSv(f, "anchored", 1);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You screw ＀ to the floor.</span>", [live(f.src)])]);
				}
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
				if (!truthy(rt.sv(f, "anchored"))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ cuts apart ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start to cut apart ＀.</span>", [live(f.src)]), "You hear cutting."]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						if (truthy(rt.sv(f, "anchored"))) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut apart ＀.</span>", [live(f.src)])]);
						yield* g.srcCall(f, "deconstruct");
					}
				}
			} else {
				f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user"] });

// /obj/structure/curtain/proc/attack_hand  (code/game/objects/structures/watercloset.dm:626)  may sleep
rt.def("/obj/structure/curtain/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/curtain.ogg"), 50, 1]);
	yield* g.srcCall(f, "toggle");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/curtain/proc/deconstruct  (code/game/objects/structures/watercloset.dm:631)  may sleep
rt.def("/obj/structure/curtain/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/cloth"), [rt.sv(f, "loc"), 2]);
	yield* g.new_(f, T("/obj/item/stack/sheet/plastic"), [rt.sv(f, "loc"), 2]);
	yield* g.new_(f, T("/obj/item/stack/rods"), [rt.sv(f, "loc"), 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/curtain/proc/play_attack_sound  (code/game/objects/structures/watercloset.dm:637)
rt.def("/obj/structure/curtain/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(live(damage_amount))) {
			rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/slash.ogg"), 80, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 80, 1]);
	}
	return f.dot;
});
