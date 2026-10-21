// From code/modules/hydroponics/beekeeping/beebox.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/bee_friendly  (code/modules/hydroponics/beekeeping/beebox.dm:19)
rt.def("/mob/living/carbon/human/proc/bee_friendly", function bee_friendly(f: Frame) {
	if (((truthy(rt.sv(f, "dna")) && truthy(rt.fv(f, "species", rt.sv(f, "dna")))) && isEqual(rt.gv(f, "id", rt.fv(f, "species", rt.sv(f, "dna"))), "pod"))) {
		return 1;
	}
	if (((truthy(rt.sv(f, "wear_suit")) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "wear_suit")), 8192))) && (truthy(rt.sv(f, "head")) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "head")), 8192))))) {
		return 1;
	}
	return 0;
});

rt.type(12938, "/obj/structure/beebox", "/obj/structure", {
	queen_bee: null,
	bees: null,
	honeycombs: null,
	honey_frames: null,
	bee_resources: 0,
	anchored: 1,
	name: "apiary",
	desc: "Dr Miles Manners is just your average wasp-themed super hero by day, but by night he becomes DR BEES!",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "beebox",
	density: 1,
});

// /obj/structure/beebox/proc/<init>  (code/modules/hydroponics/beekeeping/beebox.dm:34)
rt.def("/obj/structure/beebox/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bees", rt.list());
	$0 = $0;
	rt.setSv(f, "honeycombs", rt.list());
	$0 = $0;
	rt.setSv(f, "honey_frames", rt.list());
	return f.dot;
});

// /obj/structure/beebox/proc/New  (code/modules/hydroponics/beekeeping/beebox.dm:41)  may sleep
rt.def("/obj/structure/beebox/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/structure/beebox/proc/Destroy  (code/modules/hydroponics/beekeeping/beebox.dm:46)  may sleep
rt.def("/obj/structure/beebox/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.callName(f, rt.sv(f, "bees"), "Cut", []);
	rt.setSv(f, "bees", null);
	yield* g.callName(f, rt.sv(f, "honeycombs"), "Cut", []);
	rt.setSv(f, "honeycombs", null);
	rt.setSv(f, "queen_bee", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(12939, "/obj/structure/beebox/premade", "/obj/structure/beebox", {
	random_reagent: 0,
});

// /obj/structure/beebox/premade/proc/New  (code/modules/hydroponics/beekeeping/beebox.dm:61)  may sleep
rt.def("/obj/structure/beebox/premade/proc/New", function* New(f: Frame) {
	let R: Value = null, i: Value = null, HF: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [R, i, HF, B, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	R = null;
	if (truthy(rt.sv(f, "random_reagent"))) {
		R = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/reagent")])), T("/datum/reagent"))]);
		R = rt.index(rt.gl("chemical_reagents_list"), rt.initial(f, live(R), "id"));
	}
	rt.setSv(f, "queen_bee", (yield* g.new_(f, T("/mob/living/simple_animal/hostile/poison/bees/queen"), [live(f.src)])));
	rt.setFv(f, "beehome", rt.sv(f, "queen_bee"), live(f.src));
	rt.modSrcVar(f, "bees", rt.sv(f, "queen_bee"), add);
	yield* g.callName(f, rt.sv(f, "queen_bee"), "assign_reagent", [live(R)]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "honey_frames", (HF = (yield* g.new_(f, T("/obj/item/honey_frame"), [live(f.src)]))), add);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, (yield* g.srcCall(f, "get_max_bees")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "bees", (B = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/poison/bees"), [live(f.src)]))), add);
		rt.setFv(f, "beehome", live(B), live(f.src));
		yield* g.callName(f, live(B), "assign_reagent", [live(R)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/beebox/proc/process  (code/modules/hydroponics/beekeeping/beebox.dm:90)  may sleep
rt.def("/obj/structure/beebox/proc/process", function* process(f: Frame) {
	let HC: Value = null, freebee: Value = null, B: Value = null;
	f.vars = () => [HC, freebee, B];
	if (!truthy(rt.sv(f, "queen_bee"))) return f.dot;
	if (rt.ge(rt.sv(f, "bee_resources"), 100)) {
		if (rt.lt(rt.len(f, rt.sv(f, "honeycombs")), (yield* g.srcCall(f, "get_max_honeycomb")))) {
			rt.setSv(f, "bee_resources", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "bee_resources"), 100), 0])));
			HC = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/honeycomb"), [live(f.src)]));
			if (truthy(rt.fv(f, "beegent", rt.sv(f, "queen_bee")))) {
				yield* g.callName(f, live(HC), "set_reagent", [rt.gv(f, "id", rt.fv(f, "beegent", rt.sv(f, "queen_bee")))]);
			}
			rt.modSrcVar(f, "honeycombs", live(HC), add);
		}
	}
	if (!rt.lt(rt.len(f, rt.sv(f, "bees")), (yield* g.srcCall(f, "get_max_bees")))) return f.dot;
	freebee = 0;
	if (rt.le(rt.len(f, rt.sv(f, "bees")), 1)) {
		freebee = 1;
	}
	if (!((rt.ge(rt.sv(f, "bee_resources"), 50) && truthy(rt.op(f, "Prob", [], [20]))) || truthy(live(freebee)))) return f.dot;
	if (!truthy(live(freebee))) {
		rt.setSv(f, "bee_resources", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "bee_resources"), 50), 0])));
	}
	rt.setFv(f, "beehome", (B = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/poison/bees"), [live(f.src)]))), live(f.src));
	yield* g.callName(f, live(B), "assign_reagent", [rt.fv(f, "beegent", rt.sv(f, "queen_bee"))]);
	rt.modSrcVar(f, "bees", live(B), add);
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/beebox/proc/get_max_honeycomb  (code/modules/hydroponics/beekeeping/beebox.dm:113)
rt.def("/obj/structure/beebox/proc/get_max_honeycomb", function get_max_honeycomb(f: Frame) {
	let hf: Value = null, HF: Value = null;
	let $e: any;
	f.vars = () => [hf, HF, $e];
	f.dot = 0;
	hf = null;
	rt.forList(f, 0, rt.sv(f, "honey_frames"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hf = $e;
		f.dot = rt.modify(live(f.dot), rt.gv(f, "honeycomb_capacity", (HF = live(hf))), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/structure/beebox/proc/get_max_bees  (code/modules/hydroponics/beekeeping/beebox.dm:119)
rt.def("/obj/structure/beebox/proc/get_max_bees", function get_max_bees(f: Frame) {
	f.dot = multiply(rt.callSrc(f, "get_max_honeycomb", []), 0.5);
	return f.dot;
});

// /obj/structure/beebox/proc/examine  (code/modules/hydroponics/beekeeping/beebox.dm:123)
rt.def("/obj/structure/beebox/proc/examine", function examine(f: Frame) {
	let half_bee: Value = null, plural: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [half_bee, plural, $0, $1, $2, $3];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "queen_bee"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>There is no queen bee! There won't bee any honeycomb without a queen!</span>"]);
	}
	if ((truthy((half_bee = multiply(rt.callSrc(f, "get_max_bees", []), 0.5))) && rt.ge(rt.len(f, rt.sv(f, "bees")), live(half_bee)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>This place is aBUZZ with activity... there are lots of bees!</span>"]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀/100 resource supply.</span>", [rt.sv(f, "bee_resources")])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀% towards a new honeycomb.</span>", [rt.sv(f, "bee_resources")])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀% towards a new bee.</span>", [multiply(rt.sv(f, "bee_resources"), 2)])]);
	if (truthy(rt.len(f, rt.sv(f, "honeycombs")))) {
		plural = (rt.gt(rt.len(f, rt.sv(f, "honeycombs")), 1) ? 1 : 0);
		$0 = live(f.args[0]);
		if (truthy(live(plural))) {
			$1 = "are";
		} else {
			$1 = "is";
		}
		$2 = rt.len(f, rt.sv(f, "honeycombs"));
		if (truthy(live(plural))) {
			$3 = "s";
		} else {
			$3 = "";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>There ＀ ＀ uncollected honeycomb＀ in the apiary.</span>", [$1, $2, $3])]);
	}
	if (!rt.ge(rt.len(f, rt.sv(f, "honeycombs")), rt.callSrc(f, "get_max_honeycomb", []))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>there's no room for more honeycomb!</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/beebox/proc/attackby  (code/modules/hydroponics/beekeeping/beebox.dm:145)  may sleep
rt.def("/obj/structure/beebox/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let HF: Value = null, qb: Value = null, relocated: Value = null, b: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [I, user, params, HF, qb, relocated, b, B, $e];
	if (truthy((rt.istype(live(I), T("/obj/item/honey_frame")) ? 1 : 0))) {
		HF = live(I);
		if (rt.lt(rt.len(f, rt.sv(f, "honey_frames")), 3)) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ adds a frame to the apiary.</span>", [live(user)]));
			if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(HF), live(f.src)])))) {
				return live(f.dot);
			}
			rt.modSrcVar(f, "honey_frames", live(HF), add);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There's no room for any more frames in the apiary!</span>"]);
		}
	}
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (truthy((yield* g.callSrc(f, "default_unfasten_wrench", [null, live(user), null, live(I), "time", 20], rt.Args.Named)))) {
			return live(f.dot);
		}
	}
	if (!truthy((rt.istype(live(I), T("/obj/item/queen_bee")) ? 1 : 0))) return f.dot;
	if (truthy(rt.sv(f, "queen_bee"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This hive already has a queen!</span>"]);
		return live(f.dot);
	}
	qb = live(I);
	yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(qb)]);
	yield* g.callName(f, rt.fv(f, "queen", live(qb)), "forceMove", [live(f.src)]);
	rt.modSrcVar(f, "bees", rt.fv(f, "queen", live(qb)), add);
	rt.setSv(f, "queen_bee", rt.fv(f, "queen", live(qb)));
	rt.setFv(f, "queen", live(qb), null);
	if (truthy(rt.sv(f, "queen_bee"))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ sets ＀ down inside the apiary, making it their new home.</span>", [live(user), live(qb)]));
		relocated = 0;
		b = null;
		rt.forList(f, 0, rt.sv(f, "bees"));
		while (($e = rt.next(f, 0)) !== undefined) {
			b = $e;
			if (truthy((yield* g.callName(f, (B = live(b)), "reagent_incompatible", [rt.sv(f, "queen_bee")])))) {
				(rt.modSrcVar(f, "bees", live(B), subtract));
				rt.setFv(f, "beehome", live(B), null);
				if (isEqual(rt.fv(f, "loc", live(B)), live(f.src))) {
					rt.setFv(f, "loc", live(B), rt.getStep(f, live(f.src), 0));
				}
				relocated = rt.inc(live(relocated), 1);
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(relocated))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This queen has a different reagent to some of the bees who live here, those bees will not return to this apiary!</span>"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The queen bee disappeared! Disappearing bees have been in the news lately...</span>"]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(qb)]);
	return f.dot;
}, true);

// /obj/structure/beebox/proc/attack_hand  (code/modules/hydroponics/beekeeping/beebox.dm:193)  may sleep
rt.def("/obj/structure/beebox/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let bees: Value = null, b: Value = null, B: Value = null, option: Value = null, HF: Value = null, amtH: Value = null, fallen: Value = null, HC: Value = null, multiple: Value = null, QB: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, bees, b, B, option, HF, amtH, fallen, HC, multiple, QB, $0, $1, $2, $e];
	if (!truthy((yield* g.callName(f, live(user), "bee_friendly", [])))) {
		bees = 0;
		b = null;
		rt.forList(f, 0, live(bees));
		while (($e = rt.next(f, 0)) !== undefined) {
			b = $e;
			if (truthy(rt.gv(f, "isqueen", (B = live(b))))) {
				continue;
			}
			if (isEqual(rt.fv(f, "loc", live(B)), live(f.src))) {
				rt.setFv(f, "loc", live(B), rt.getStep(f, live(f.src), 0));
			}
			rt.setFv(f, "target", live(B), live(user));
			bees = 1;
		}
		rt.endFor(f, 0);
		if (truthy(live(bees))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ disturbs the bees!</span>", [live(user)]));
		}
	} else {
		option = (yield* g.call(f, P("/proc/alert"), null, [live(user), "What action do you wish to perform?", "Apiary", "Remove a Honey Frame", "Remove the Queen Bee"]));
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(user))))) {
			return live(f.dot);
		}
		$0 = live(option);
		if ($0 === "Remove a Honey Frame") {
			if (!truthy(rt.len(f, rt.sv(f, "honey_frames")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There are no honey frames to remove!</span>"]);
				return live(f.dot);
			}
			if (truthy((HF = (yield* g.call(f, P("/proc/pick_n_take"), null, [rt.sv(f, "honey_frames")]))))) {
				if (!truthy((yield* g.callName(f, live(user), "put_in_active_hand", [live(HF)])))) {
					rt.setFv(f, "loc", live(HF), rt.getStep(f, live(f.src), 0));
				}
				yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ removes a frame from the apiary.</span>", [live(user)]));
				amtH = rt.fv(f, "honeycomb_capacity", live(HF));
				fallen = 0;
				while (truthy(rt.len(f, rt.sv(f, "honeycombs"))) && truthy(live(amtH))) {
					if (truthy((HC = (yield* g.call(f, P("/proc/pick_n_take"), null, [rt.sv(f, "honeycombs")]))))) {
						rt.setFv(f, "loc", live(HC), rt.getStep(f, live(user), 0));
						amtH = rt.inc(live(amtH), -1);
						fallen = rt.inc(live(fallen), 1);
					}
				}
				if (truthy(live(fallen))) {
					multiple = (rt.gt(live(fallen), 1) ? 1 : 0);
					$0 = live(user);
					if (truthy(live(multiple))) {
						$1 = fmt("＀", [live(fallen)]);
					} else {
						$1 = "a";
					}
					if (truthy(live(multiple))) {
						$2 = "s";
					} else {
						$2 = "";
					}
					yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ scrapes ＀ honeycomb＀ off of the frame.</span>", [$0, $1, $2]));
				}
			}
		} else if ($0 === "Remove the Queen Bee") {
			if ((!truthy(rt.sv(f, "queen_bee")) || !isEqual(rt.fv(f, "loc", rt.sv(f, "queen_bee")), live(f.src)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There is no queen bee to remove!</span>"]);
				return live(f.dot);
			}
			QB = (yield* g.new_(f, T("/obj/item/queen_bee"), []));
			rt.setFv(f, "loc", rt.sv(f, "queen_bee"), live(QB));
			(rt.modSrcVar(f, "bees", rt.sv(f, "queen_bee"), subtract));
			rt.setFv(f, "queen", live(QB), rt.sv(f, "queen_bee"));
			rt.setFv(f, "name", live(QB), rt.fv(f, "name", rt.sv(f, "queen_bee")));
			if (!truthy((yield* g.callName(f, live(user), "put_in_active_hand", [live(QB)])))) {
				rt.setFv(f, "loc", live(QB), rt.getStep(f, live(f.src), 0));
			}
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ removes the queen from the apiary.</span>", [live(user)]));
			rt.setSv(f, "queen_bee", null);
		}
	}
	return f.dot;
}, true);
