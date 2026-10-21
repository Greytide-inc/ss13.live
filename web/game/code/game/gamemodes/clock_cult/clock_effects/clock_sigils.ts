// From code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11411, "/obj/effect/clockwork/sigil", "/obj/effect/clockwork", {
	affects_servants: 0,
	stat_affected: 0,
	sigil_name: "Sigil",
	resist_string: "glows blinding white",
	clockwork_desc: "A sigil of some purpose.",
	name: "sigil",
	desc: "A strange set of markings drawn on the ground.",
	icon_state: "sigil",
	layer: 2.5,
	alpha: 50,
	resistance_flags: 0,
});

// /obj/effect/clockwork/sigil/proc/sigil_effects  empty
rt.def("/obj/effect/clockwork/sigil/proc/sigil_effects", undefined, false, { args: ["L"] });

// /obj/effect/clockwork/sigil/proc/attackby  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:16)  may sleep
rt.def("/obj/effect/clockwork/sigil/proc/attackby", function* attackby(f: Frame) {
	if ((truthy(rt.fv(f, "force", live(f.args[0]))) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ scatters ＀ with ＀!</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='danger'>You scatter ＀ with ＀!</span>", [live(f.src), live(f.args[0])])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/effect/clockwork/sigil/proc/attack_hand  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:23)  may sleep
rt.def("/obj/effect/clockwork/sigil/proc/attack_hand", function* attack_hand(f: Frame) {
	if (((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)) && !truthy(rt.fv(f, "stat", live(f.args[0])))) && (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))) || (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))) && isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm"))))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ stamps out ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='danger'>You stomp on ＀, scattering it into thousands of particles.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/effect/clockwork/sigil/proc/ex_act  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:30)  may sleep
rt.def("/obj/effect/clockwork/sigil/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ scatters into thousands of particles.</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/clockwork/sigil/proc/Crossed  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:34)  may sleep
rt.def("/obj/effect/clockwork/sigil/proc/Crossed", function* Crossed(f: Frame) {
	let L: Value = null, I: Value = null;
	f.vars = () => [L, I];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) return f.dot;
	if (!rt.le(rt.gv(f, "stat", (L = live(f.args[0]))), rt.sv(f, "stat_affected"))) return f.dot;
	if (!(((!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))) || (truthy(rt.sv(f, "affects_servants")) && truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))))) && (truthy(rt.fv(f, "mind", live(L))) || truthy((yield* g.callName(f, live(L), "has_status_effect", [T("/datum/status_effect/sigil_mark")]))))) && !truthy((rt.istype(live(L), T("/mob/living/simple_animal/drone")) ? 1 : 0)))) return f.dot;
	if (truthy((I = (yield* g.callName(f, live(L), "null_rod_check", []))))) {
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀'s ＀ ＀, protecting them from ＀'s effects!</span>", [live(L), rt.fv(f, "name", live(I)), rt.sv(f, "resist_string"), live(f.src)]), fmt("<span class='userdanger'>Your ＀ ＀, protecting you!</span>", [rt.fv(f, "name", live(I)), rt.sv(f, "resist_string")])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "sigil_effects", live(L));
	return f.dot;
}, true, { args: ["AM"] });

rt.type(11412, "/obj/effect/clockwork/sigil/transgression", "/obj/effect/clockwork/sigil", {
	clockwork_desc: "A sigil that will stun the next non-Servant to cross it.",
	light_range: 1.4,
	light_power: 1,
	light_color: "#FAE48C",
	sigil_name: "Sigil of Transgression",
	name: "dull sigil",
	desc: "A dull, barely-visible golden sigil. It's as though light was carved into the ground.",
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	icon_state: "sigildull",
	layer: 2.56,
	alpha: 75,
	color: "#FAE48C",
});

// /obj/effect/clockwork/sigil/transgression/proc/sigil_effects  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:65)  may sleep
rt.def("/obj/effect/clockwork/sigil/transgression/proc/sigil_effects", function* sigil_effects(f: Frame, L: Value) {
	let target_flashed: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [L, target_flashed, M, $0, $1, $2, $e];
	target_flashed = (yield* g.callName(f, live(L), "flash_act", []));
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [5, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)]))) && !isEqual(live(M), live(L)))) {
			yield* g.callName(f, live(M), "flash_act", []);
		}
	}
	rt.endFor(f, 0);
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(L)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='heavy_brass'>\"Watch your step, wretch.\"</span>"]);
		yield* g.callName(f, live(L), "adjustBruteLoss", [10]);
		yield* g.callName(f, live(L), "Knockdown", [140, 0]);
	}
	$0 = live(L);
	$1 = fmt("<span class='warning'>＀ appears around ＀ in a burst of light!</span>", [live(f.src), live(L)]);
	if (truthy(live(target_flashed))) {
		$2 = "An unseen force";
	} else {
		$2 = "The glowing sigil around you";
	}
	yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='userdanger'>＀ holds you in place!</span>", [$2])]);
	yield* g.callName(f, live(L), "Stun", [100]);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/sigil/transgression"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(11413, "/obj/effect/clockwork/sigil/submission", "/obj/effect/clockwork/sigil", {
	convert_time: 70,
	delete_on_finish: 1,
	glow_type: null,
	clockwork_desc: "A sigil that will enslave the first person to cross it, provided they remain on it for seven seconds.",
	light_range: 2,
	light_power: 0.9,
	light_color: "#FAE48C",
	stat_affected: 1,
	resist_string: "glows faintly yellow",
	sigil_name: "Sigil of Submission",
	name: "ominous sigil",
	desc: "A luminous golden sigil. Something about it really bothers you.",
	icon_state: "sigilsubmission",
	layer: 2.52,
	alpha: 125,
	color: "#FAE48C",
});

// /obj/effect/clockwork/sigil/submission/proc/post_channel  empty
rt.def("/obj/effect/clockwork/sigil/submission/proc/post_channel", undefined, false, { args: ["L"] });

// /obj/effect/clockwork/sigil/submission/proc/sigil_effects  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:102)  may sleep
rt.def("/obj/effect/clockwork/sigil/submission/proc/sigil_effects", function* sigil_effects(f: Frame, L: Value) {
	let oldcolor: Value = null, glow: Value = null, I: Value = null, C: Value = null, message: Value = null, M: Value = null, link: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [L, oldcolor, glow, I, C, message, M, link, $0, $1, $2, $e];
	yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ begins to glow a piercing magenta!</span>", [live(f.src)]), "<span class='sevtug'>You feel something start to invade your mind...</span>"]);
	oldcolor = rt.sv(f, "color");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", "#AF0AAF", "time", rt.sv(f, "convert_time")]);
	glow = null;
	if (truthy(rt.sv(f, "glow_type"))) {
		glow = (yield* g.new_(f, rt.sv(f, "glow_type"), [rt.getStep(f, live(f.src), 0)]));
		rt.op(f, "Animate", [2, 6], [null, live(glow), "alpha", 255, "time", rt.sv(f, "convert_time")]);
	}
	I = 0;
	while (rt.lt(live(I), rt.sv(f, "convert_time")) && isEqual(rt.getStep(f, live(L), 0), rt.getStep(f, live(f.src), 0))) {
		I = rt.inc(live(I), 1);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	if (!isEqual(rt.getStep(f, live(L), 0), rt.getStep(f, live(f.src), 0))) {
		if (truthy(live(glow))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(glow)]);
		}
		rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(oldcolor), "time", 20]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 20]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ slowly stops glowing!</span>", [live(f.src)]));
		return live(f.dot);
	}
	yield* g.srcCall(f, "post_channel", live(L));
	if (truthy((yield* g.call(f, P("/proc/is_eligible_servant"), null, [live(L)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='heavy_brass'>\"You belong to me now.\"</span>"]);
	}
	yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [live(L)]);
	yield* g.callName(f, live(L), "Knockdown", [60]);
	if (truthy((rt.istype(live(L), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.modField(f, (C = live(L)), "silent", 5, add);
	}
	$0 = rt.sv(f, "sigil_name");
	$1 = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) {
		$2 = "successfully converted";
	} else {
		$2 = "failed to convert";
	}
	message = fmt("＀ in ＀ <span class='sevtug'>＀</span>", [$0, $1, $2]);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(L)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ <span class='heavy_brass'>＀ ＀!</span>", [live(link), live(message), rt.fv(f, "real_name", live(L))])]);
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)])))) {
				if (isEqual(live(M), live(L))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='heavy_brass'>＀ you!</span>", [live(message)])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='heavy_brass'>＀ ＀!</span>", [live(message), rt.fv(f, "real_name", live(L))])]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "delete_on_finish"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(oldcolor), "time", 20]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 20]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ slowly stops glowing!</span>", [live(f.src)]));
	}
	return f.dot;
}, true);

rt.type(11414, "/obj/effect/clockwork/sigil/submission/accession", "/obj/effect/clockwork/sigil/submission", {
	clockwork_desc: "A sigil that will enslave any person who crosses it, provided they remain on it for seven seconds. \nIt can convert a mindshielded target once before disppearing, but can convert any number of non-implanted targets.",
	light_range: 3,
	light_power: 1,
	light_color: "#A97F1B",
	delete_on_finish: 0,
	sigil_name: "Sigil of Accession",
	resist_string: "glows bright orange",
	name: "terrifying sigil",
	desc: "A luminous brassy sigil. Something about it makes you want to flee.",
	icon_state: "sigiltransgression",
	alpha: 200,
	color: "#A97F1B",
	glow_type: rt.typePath("/obj/effect/temp_visual/ratvar/sigil/accession"),
});

// /obj/effect/clockwork/sigil/submission/accession/proc/post_channel  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:164)  may sleep
rt.def("/obj/effect/clockwork/sigil/submission/accession/proc/post_channel", function* post_channel(f: Frame, L: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [L, M, $e];
	if (!truthy((yield* g.callName(f, live(L), "isloyal", [])))) return f.dot;
	rt.setSv(f, "delete_on_finish", 1);
	yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ visibly trembles!</span>", [live(L)]), fmt("<span class='sevtug'>＀</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["You will be mine and his. This puny trinket will not stop me."]))])]);
	M = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(L)), T("/obj/item/weapon/implant/mindshield"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11415, "/obj/effect/clockwork/sigil/transmission", "/obj/effect/clockwork/sigil", {
	power_charge: 2500,
	clockwork_desc: "A sigil that will serve as a battery for clockwork structures.",
	light_color: "#EC8A2D",
	resist_string: "glows faintly",
	sigil_name: "Sigil of Transmission",
	affects_servants: 1,
	name: "suspicious sigil",
	desc: "A glowing orange sigil. The air around it feels staticky.",
	icon_state: "sigiltransmission",
	alpha: 50,
	color: "#EC8A2D",
});

// /obj/effect/clockwork/sigil/transmission/proc/ex_act  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:187)
rt.def("/obj/effect/clockwork/sigil/transmission/proc/ex_act", function ex_act(f: Frame) {
	if (isEqual(live(f.args[0]), 3)) {
		rt.callSrc(f, "modify_charge", [-500]);
		rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀ flares a brilliant orange!</span>", [live(f.src)])]);
	} else {
		rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["severity"], waitfor: false });

// /obj/effect/clockwork/sigil/transmission/proc/examine  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:194)
rt.def("/obj/effect/clockwork/sigil/transmission/proc/examine", function examine(f: Frame) {
	let structure_number: Value = null, _P: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $e: any;
	f.vars = () => [structure_number, _P, $0, $1, $2, $3, $4, $5, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	structure_number = 0;
	_P = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [2, live(f.src)]), T("/obj/structure/destructible/clockwork/powered"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		structure_number = rt.inc(live(structure_number), 1);
	}
	rt.endFor(f, 0);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "power_charge"))) {
		$1 = "brass";
	} else {
		$1 = "alloy";
	}
	if (truthy(rt.gl("ratvar_awakens"))) {
		$2 = "INFINITY";
	} else {
		$2 = fmt("＀", [rt.sv(f, "power_charge")]);
	}
	$3 = live(structure_number);
	if (isEqual(live(structure_number), 1)) {
		$4 = "";
	} else {
		$4 = "s";
	}
	if (isEqual(live(structure_number), 1)) {
		$5 = "is";
	} else {
		$5 = "are";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀'>It is storing <b>＀W</b> of power, and <b>＀</b> Clockwork Structure＀ ＀ in range.</span>", [$1, $2, $3, $4, $5])]);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='brass'>You can recharge from the ＀ by crossing it.</span>", [rt.sv(f, "sigil_name")])]);
	} else {
		if (!truthy(rt.gl("ratvar_awakens"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='brass'>Hitting the ＀ with brass sheets will convert them to power at a rate of <b>1</b> brass sheet to <b>＀W</b> power.</span>", [rt.sv(f, "sigil_name"), 250])]);
		}
	}
	if (truthy(rt.gl("ratvar_awakens"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='brass'>You can recharge Replica Fabricators from the ＀.</span>", [rt.sv(f, "sigil_name")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/effect/clockwork/sigil/transmission/proc/attackby  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:209)  may sleep
rt.def("/obj/effect/clockwork/sigil/transmission/proc/attackby", function* attackby(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))) && truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile/brass")) ? 1 : 0))) && !truthy(rt.gl("ratvar_awakens")))) {
		B = live(f.args[0]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ places ＀ on ＀, causing it to disintegrate into glowing orange energy!</span>", [live(f.args[1]), live(B), live(f.src)]), fmt("<span class='brass'>You charge the ＀ with ＀, providing it with <b>＀W</b> of power.</span>", [rt.sv(f, "sigil_name"), live(B), multiply(rt.fv(f, "amount", live(B)), 250)])]);
		yield* g.srcCall(f, "modify_charge", rt.neg(multiply(rt.fv(f, "amount", live(B)), 250)));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/light_flicker.ogg"), multiply(multiply(rt.fv(f, "amount", live(B)), 250), 0.009999999776482582), 1]);
		yield* g.call(f, P("/proc/qdel"), null, [live(B)]);
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/effect/clockwork/sigil/transmission/proc/sigil_effects  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:220)  may sleep
rt.def("/obj/effect/clockwork/sigil/transmission/proc/sigil_effects", function* sigil_effects(f: Frame, L: Value) {
	f.vars = () => [L];
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) {
		if (truthy((rt.istype(live(L), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			yield* g.srcCall(f, "charge_cyborg", live(L));
		}
	} else {
		if (!truthy(rt.sv(f, "power_charge"))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='brass'>You feel a slight, static shock.</span>"]);
	}
	return f.dot;
}, true);

// /obj/effect/clockwork/sigil/transmission/proc/charge_cyborg  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:227)  may sleep
rt.def("/obj/effect/clockwork/sigil/transmission/proc/charge_cyborg", function* charge_cyborg(f: Frame, cyborg: Value) {
	let giving_power: Value = null, previous_color: Value = null;
	f.vars = () => [cyborg, giving_power, previous_color];
	if (!truthy((yield* g.srcCall(f, "cyborg_checks", live(cyborg))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(cyborg), fmt("<span class='brass'>You start to charge from the ＀...</span>", [rt.sv(f, "sigil_name")])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(cyborg), null, 50, "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/clockwork/sigil/transmission/proc/cyborg_checks"), live(cyborg), 1]))], rt.Args.Named)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "modify_charge", (giving_power = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/Floor"), null, [subtract(rt.gv(f, "maxcharge", rt.fv(f, "cell", live(cyborg))), rt.gv(f, "charge", rt.fv(f, "cell", live(cyborg)))), 25])), rt.sv(f, "power_charge")]))))))) return f.dot;
	yield* g.callName(f, live(cyborg), "visible_message", [fmt("<span class='warning'>＀ glows a brilliant orange!</span>", [live(cyborg)])]);
	previous_color = rt.fv(f, "color", live(cyborg));
	rt.setFv(f, "color", live(cyborg), rt.list("#EC8A2D", "#EC8A2D", "#EC8A2D", "#000000"));
	yield* g.callName(f, live(cyborg), "apply_status_effect", [T("/datum/status_effect/cyborg_power_regen"), multiply(live(giving_power), 0.10000000149011612)]);
	rt.op(f, "Animate", [2, 6], [null, live(cyborg), "color", live(previous_color), "time", 100]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(cyborg), P("/atom/proc/update_atom_colour")])), 100]);
	return f.dot;
}, true);

// /obj/effect/clockwork/sigil/transmission/proc/cyborg_checks  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:242)
rt.def("/obj/effect/clockwork/sigil/transmission/proc/cyborg_checks", function cyborg_checks(f: Frame, cyborg: Value, silent: Value) {
	if (!truthy(rt.fv(f, "cell", live(cyborg)))) {
		if (!truthy(live(silent))) {
			rt.call(f, P("/proc/to_chat"), null, [live(cyborg), "<span class='warning'>You have no cell!</span>"]);
		}
		return 0;
	}
	if (!truthy(rt.sv(f, "power_charge"))) {
		if (!truthy(live(silent))) {
			rt.call(f, P("/proc/to_chat"), null, [live(cyborg), fmt("<span class='warning'>The ＀ has no stored power!</span>", [rt.sv(f, "sigil_name")])]);
		}
		return 0;
	}
	if (rt.gt(rt.gv(f, "charge", rt.fv(f, "cell", live(cyborg))), subtract(rt.gv(f, "maxcharge", rt.fv(f, "cell", live(cyborg))), 25))) {
		if (!truthy(live(silent))) {
			rt.call(f, P("/proc/to_chat"), null, [live(cyborg), "<span class='warning'>You are already at maximum charge!</span>"]);
		}
		return 0;
	}
	if (truthy(rt.callName(f, live(cyborg), "has_status_effect", [T("/datum/status_effect/cyborg_power_regen")]))) {
		if (!truthy(live(silent))) {
			rt.call(f, P("/proc/to_chat"), null, [live(cyborg), "<span class='warning'>You are already regenerating power!</span>"]);
		}
		return 0;
	}
	return 1;
}, false, { argTypes: [{ type: 8, path: "/mob/living/silicon/robot" }, {  }] });

// /obj/effect/clockwork/sigil/transmission/proc/Initialize  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:261)
rt.def("/obj/effect/clockwork/sigil/transmission/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_glow", []);
	return f.dot;
});

// /obj/effect/clockwork/sigil/transmission/proc/modify_charge  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:266)
rt.def("/obj/effect/clockwork/sigil/transmission/proc/modify_charge", function modify_charge(f: Frame, amount: Value) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.callSrc(f, "update_glow", []);
		return 1;
	}
	if (rt.lt(subtract(rt.sv(f, "power_charge"), live(amount)), 0)) {
		return 0;
	}
	(rt.modSrcVar(f, "power_charge", live(amount), subtract));
	rt.callSrc(f, "update_glow", []);
	return 1;
});

// /obj/effect/clockwork/sigil/transmission/proc/update_glow  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:276)
rt.def("/obj/effect/clockwork/sigil/transmission/proc/update_glow", function update_glow(f: Frame) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "alpha", 255);
	} else {
		rt.setSv(f, "alpha", rt.call(f, P("/proc/min"), null, [add(rt.initial(f, live(f.src), "alpha"), multiply(rt.sv(f, "power_charge"), 0.019999999552965164)), 255]));
	}
	if (!truthy(rt.sv(f, "power_charge"))) {
		rt.callSrc(f, "set_light", [0]);
	} else {
		rt.callSrc(f, "set_light", [rt.call(f, P("/proc/max"), null, [multiply(rt.sv(f, "alpha"), 0.019999999552965164), 1.399999976158142]), rt.call(f, P("/proc/max"), null, [multiply(rt.sv(f, "alpha"), 0.009999999776482582), 0.10000000149011612])]);
	}
	return f.dot;
});

rt.type(11416, "/obj/effect/clockwork/sigil/vitality", "/obj/effect/clockwork/sigil", {
	base_revive_cost: 20,
	sigil_active: 0,
	animation_number: 3,
	clockwork_desc: "A sigil that will drain non-Servants that remain on it. Servants that remain on it will be healed if it has any vitality drained.",
	affects_servants: 1,
	stat_affected: 2,
	resist_string: "glows shimmering yellow",
	sigil_name: "Vitality Matrix",
	name: "comforting sigil",
	desc: "A faint blue sigil. Looking at it makes you feel protected.",
	icon_state: "sigilvitality",
	layer: 2.54,
	alpha: 75,
	color: "#123456",
}, { global: { vitality: 776, damage_heal_order: 777 } });

// /obj/effect/clockwork/sigil/vitality/proc/examine  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:304)
rt.def("/obj/effect/clockwork/sigil/vitality/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	$0 = live(f.args[0]);
	if (truthy(rt.gl("vitality"))) {
		$1 = "inathneq_small";
	} else {
		$1 = "alloy";
	}
	if (truthy(rt.gl("ratvar_awakens"))) {
		$2 = "INFINITE";
	} else {
		$2 = fmt("＀", [rt.gl("vitality")]);
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀'>It has access to <b>＀</b> units of vitality.</span>", [$1, $2])]);
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='inathneq_small'>It can revive Servants at no cost!</span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='inathneq_small'>It can revive Servants at a cost of <b>＀</b> vitality plus vitality equal to the non-oxygen damage they have, in addition to being destroyed in the process.</span>", [rt.sv(f, "base_revive_cost")])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/effect/clockwork/sigil/vitality/proc/sigil_effects  (code/game/gamemodes/clock_cult/clock_effects/clock_sigils.dm:313)  may sleep
rt.def("/obj/effect/clockwork/sigil/vitality/proc/sigil_effects", function* sigil_effects(f: Frame, L: Value) {
	let vitality_drained: Value = null, V: Value = null, W: Value = null, revival_cost: Value = null, ghost: Value = null, V_2: Value = null, vitality_for_cycle: Value = null, vitality_used: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [L, vitality_drained, V, W, revival_cost, ghost, V_2, vitality_for_cycle, vitality_used, $0, $1, $2, $e];
	if (((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))) && truthy(rt.fv(f, "suiciding", live(L)))) || truthy(rt.sv(f, "sigil_active")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ begins to glow bright blue!</span>", [live(f.src)]));
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "alpha", 255, "time", 10, "flags", 1]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	while ((truthy(live(L)) && (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))) || (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))) && (truthy(rt.gl("ratvar_awakens")) || truthy(rt.gl("vitality")))))) && isEqual(rt.getStep(f, live(L), 0), rt.getStep(f, live(f.src), 0))) {
		rt.setSv(f, "sigil_active", 1);
		if (rt.ge(rt.sv(f, "animation_number"), 4)) {
			yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/sigil/vitality"), [rt.getStep(f, live(f.src), 0)]);
			rt.setSv(f, "animation_number", 0);
		}
		rt.incSrcVar(f, "animation_number", 1, true);
		if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) {
			vitality_drained = 0;
			if (isEqual(rt.fv(f, "stat", live(L)), 2)) {
				vitality_drained = rt.fv(f, "maxHealth", live(L));
				V = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/sigil/vitality"), [rt.getStep(f, live(f.src), 0)]));
				rt.op(f, "Animate", [2, 8], [null, live(V), "alpha", 0, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2), "time", 8]);
				yield* g.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/magic/wandodeath.ogg"), 50, 1]);
				yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ collapses in on ＀self as ＀ flares bright blue!</span>", [live(L), (yield* g.callName(f, live(L), "p_them", [])), live(f.src)])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='inathneq_large'>\"＀\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["Your life will not be wasted."]))])]);
				W = null;
				rt.forList(f, 0, live(L), T("/obj/item"));
				while (($e = rt.next(f, 0)) !== undefined) {
					W = $e;
					if (!truthy((yield* g.callName(f, live(L), "dropItemToGround", [live(W)])))) {
						yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
					}
				}
				rt.endFor(f, 0);
				yield* g.callName(f, live(L), "dust", []);
			} else {
				if ((!truthy(rt.gl("ratvar_awakens")) && isEqual(rt.fv(f, "stat", live(L)), 0))) {
					vitality_drained = (yield* g.callName(f, live(L), "adjustToxLoss", [1]));
				} else {
					vitality_drained = (yield* g.callName(f, live(L), "adjustToxLoss", [1.5]));
				}
			}
			if (truthy(live(vitality_drained))) {
				rt.modGl("vitality", live(vitality_drained), add);
			} else {
				break;
			}
		} else {
			if (isEqual(rt.fv(f, "stat", live(L)), 2)) {
				revival_cost = add(add(add(add(rt.sv(f, "base_revive_cost"), (yield* g.callName(f, live(L), "getCloneLoss", []))), (yield* g.callName(f, live(L), "getToxLoss", []))), (yield* g.callName(f, live(L), "getFireLoss", []))), (yield* g.callName(f, live(L), "getBruteLoss", [])));
				if (truthy(rt.gl("ratvar_awakens"))) {
					revival_cost = 0;
				}
				ghost = (yield* g.callName(f, live(L), "get_ghost", [1]));
				if ((rt.ge(rt.gl("vitality"), live(revival_cost)) && (truthy(live(ghost)) || (truthy(rt.fv(f, "mind", live(L))) && truthy(rt.gv(f, "active", rt.fv(f, "mind", live(L)))))))) {
					if (truthy(live(ghost))) {
						yield* g.callName(f, live(ghost), "reenter_corpse", []);
					}
					yield* g.callName(f, live(L), "revive", [1, 1]);
					V_2 = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/sigil/vitality"), [rt.getStep(f, live(f.src), 0)]));
					rt.op(f, "Animate", [2, 8], [null, live(V_2), "alpha", 0, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2), "time", 8]);
					yield* g.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/magic/staff_healing.ogg"), 50, 1]);
					$0 = live(L);
					$1 = live(L);
					if (truthy(rt.gl("ratvar_awakens"))) {
						$1 = $1;
						$2 = fmt("＀ body dripping blue ichor", [(yield* g.callName(f, live(L), "p_their", []))]);
					} else {
						$2 = fmt("even as ＀ scatters into blue sparks around ＀", [live(f.src), (yield* g.callName(f, live(L), "p_them", []))]);
					}
					yield* g.callName(f, $0, "visible_message", [fmt("<span class='warning'>＀ suddenly gets back up, ＀!</span>", [$1, $2]), fmt("<span class='inathneq'>\"＀\"</span>", [(yield* g.call(f, P("/proc/text2ratvar"), null, ["You will be okay, child."]))])]);
					(rt.modGl("vitality", live(revival_cost), subtract));
					if (!truthy(rt.gl("ratvar_awakens"))) {
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					}
				}
				break;
			}
			vitality_for_cycle = 3;
			if (!truthy(rt.gl("ratvar_awakens"))) {
				if (isEqual(rt.fv(f, "stat", live(L)), 0)) {
					vitality_for_cycle = 2;
				}
				vitality_for_cycle = (yield* g.call(f, P("/proc/min"), null, [rt.gl("vitality"), live(vitality_for_cycle)]));
			}
			if (!truthy((vitality_used = (yield* g.callName(f, live(L), "heal_ordered_damage", [live(vitality_for_cycle), rt.gl("damage_heal_order#6")]))))) {
				break;
			}
			if (!truthy(rt.gl("ratvar_awakens"))) {
				(rt.modGl("vitality", live(vitality_used), subtract));
			}
		}
		yield* g.call(f, P("/proc/sleep"), null, [2]);
	}
	if (truthy(rt.sv(f, "sigil_active"))) {
		rt.setSv(f, "animation_number", rt.initial(f, live(f.src), "animation_number"));
		rt.setSv(f, "sigil_active", 0);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ slowly stops glowing!</span>", [live(f.src)]));
	}
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "alpha", rt.initial(f, live(f.src), "alpha"), "time", 10, "flags", 1]);
	return f.dot;
}, true);
