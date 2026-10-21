// From code/game/objects/items/cardboard_cutouts.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9659, "/obj/item/cardboard_cutout", "/obj/item", {
	possible_appearances: null,
	pushed_over: 0,
	deceptive: 0,
	lastattacker: null,
	w_class: 4,
	name: "cardboard cutout",
	desc: "A vaguely humanoid cardboard cutout. It's completely blank.",
	icon: rt.rsc("icons/obj/cardboard_cutout.dmi"),
	icon_state: "cutout_basic",
	resistance_flags: 4,
});

// /obj/item/cardboard_cutout/proc/attack_hand  (code/game/objects/items/cardboard_cutouts.dm:22)  may sleep
rt.def("/obj/item/cardboard_cutout/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "help") || truthy(rt.sv(f, "pushed_over")))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ pushes over ＀!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='danger'>You push over ＀!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/genhit.ogg"), 50, 1]);
	yield* g.srcCall(f, "push_over");
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/cardboard_cutout/proc/push_over  (code/game/objects/items/cardboard_cutouts.dm:29)
rt.def("/obj/item/cardboard_cutout/proc/push_over", function push_over(f: Frame) {
	rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
	rt.setSv(f, "desc", fmt("＀ It's been pushed over.", [rt.initial(f, live(f.src), "desc")]));
	rt.setSv(f, "icon", rt.initial(f, live(f.src), "icon"));
	rt.setSv(f, "icon_state", "cutout_pushed_over");
	rt.callSrc(f, "remove_atom_colour", [4]);
	rt.setSv(f, "alpha", rt.initial(f, live(f.src), "alpha"));
	rt.setSv(f, "pushed_over", 1);
	return f.dot;
});

// /obj/item/cardboard_cutout/proc/attack_self  (code/game/objects/items/cardboard_cutouts.dm:38)
rt.def("/obj/item/cardboard_cutout/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!truthy(rt.sv(f, "pushed_over"))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You right ＀.</span>", [live(f.src)])]);
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	rt.setSv(f, "icon", rt.initial(f, live(f.src), "icon"));
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	rt.setSv(f, "pushed_over", 0);
	return f.dot;
});

// /obj/item/cardboard_cutout/proc/attackby  (code/game/objects/items/cardboard_cutouts.dm:47)  may sleep
rt.def("/obj/item/cardboard_cutout/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if (truthy((rt.istype(live(I), T("/obj/item/toy/crayon")) ? 1 : 0))) {
		yield* g.srcCall(f, "change_appearance", live(I), live(user));
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 4))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "force", live(I)))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), (yield* g.srcCall(f, "get_clamped_volume")), 1, -1]);
	} else {
		if (truthy(rt.fv(f, "hitsound", live(I)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "hitsound", live(I)), (yield* g.srcCall(f, "get_clamped_volume")), 1, -1]);
		}
	}
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src)]);
	if (!truthy(rt.fv(f, "force", live(I)))) return f.dot;
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ has hit ＀ with ＀!</span>", [live(user), live(f.src), live(I)]), fmt("<span class='danger'>You hit ＀ with ＀!</span>", [live(f.src), live(I)])]);
	if (!truthy(rt.op(f, "Prob", [], [rt.fv(f, "force", live(I))]))) return f.dot;
	yield* g.srcCall(f, "push_over");
	return f.dot;
}, true);

// /obj/item/cardboard_cutout/proc/bullet_act  (code/game/objects/items/cardboard_cutouts.dm:70)
rt.def("/obj/item/cardboard_cutout/proc/bullet_act", function bullet_act(f: Frame, _P: Value) {
	rt.callSrc(f, "visible_message", [fmt("<span class='danger'>＀ has been hit by ＀!</span>", [live(f.src), live(_P)])]);
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/slice.ogg"), 50, 1]);
	if (!truthy(rt.op(f, "Prob", [], [rt.fv(f, "damage", live(_P))]))) return f.dot;
	rt.callSrc(f, "push_over", []);
	return f.dot;
});

// /obj/item/cardboard_cutout/proc/change_appearance  (code/game/objects/items/cardboard_cutouts.dm:76)  may sleep
rt.def("/obj/item/cardboard_cutout/proc/change_appearance", function* change_appearance(f: Frame, crayon: Value, user: Value) {
	let new_appearance: Value = null;
	let $0: any;
	f.vars = () => [crayon, user, new_appearance, $0];
	if ((!truthy(live(crayon)) || !truthy(live(user)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "pushed_over"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Right ＀ first!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(crayon), "check_empty", [live(user)])))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "is_capped", live(crayon)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Take the cap off first!</span>"]);
		return live(f.dot);
	}
	if (((!truthy((new_appearance = (yield* g.op(f, "Prompt", [1], [null, "26th Century Deception", fmt("Choose a new appearance for ＀.", [live(f.src)]), live(user), rt.sv(f, "possible_appearances")])))) || !truthy(live(crayon))) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)]))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [live(user), 10, 0, live(f.src), 1])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ gives ＀ a new look.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>Voila! You give ＀ a new look.</span>", [live(f.src)])]);
	yield* g.callName(f, live(crayon), "use_charges", [1]);
	yield* g.callName(f, live(crayon), "check_empty", [live(user)]);
	rt.setSv(f, "alpha", 255);
	rt.setSv(f, "icon", rt.initial(f, live(f.src), "icon"));
	if (!truthy(rt.sv(f, "deceptive"))) {
		yield* g.srcCall(f, "add_atom_colour", "#FFD7A7", 4);
	}
	$0 = live(new_appearance);
	if ($0 === "Assistant") {
		rt.setSv(f, "name", fmt("＀ ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]), rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]));
		rt.setSv(f, "desc", "A cardboat cutout of an assistant.");
		rt.setSv(f, "icon_state", "cutout_greytide");
	} else if ($0 === "Clown") {
		rt.setSv(f, "name", rt.op(f, "PickUnweighted", [1], [rt.gl("clown_names")]));
		rt.setSv(f, "desc", "A cardboard cutout of a clown. You get the feeling that it should be in a corner.");
		rt.setSv(f, "icon_state", "cutout_clown");
	} else if ($0 === "Mime") {
		rt.setSv(f, "name", rt.op(f, "PickUnweighted", [1], [rt.gl("mime_names")]));
		rt.setSv(f, "desc", "...(A cardboard cutout of a mime.)");
		rt.setSv(f, "icon_state", "cutout_mime");
	} else if ($0 === "Traitor") {
		rt.setSv(f, "name", fmt("＀", [rt.op(f, "PickUnweighted", [2], ["Unknown", "Captain"])]));
		rt.setSv(f, "desc", "A cardboard cutout of a traitor.");
		rt.setSv(f, "icon_state", "cutout_traitor");
	} else if ($0 === "Nuke Op") {
		rt.setSv(f, "name", fmt("＀", [rt.op(f, "PickUnweighted", [9], ["Unknown", "COMMS", "Telecomms", "AI", "stealthy op", "STEALTH", "sneakybeaky", "MEDIC", "Medic"])]));
		rt.setSv(f, "desc", "A cardboard cutout of a nuclear operative.");
		rt.setSv(f, "icon_state", "cutout_fluke");
	} else if ($0 === "Cultist") {
		rt.setSv(f, "name", "Unknown");
		rt.setSv(f, "desc", "A cardboard cutout of a cultist.");
		rt.setSv(f, "icon_state", "cutout_cultist");
	} else if ($0 === "Clockwork Cultist") {
		rt.setSv(f, "name", fmt("＀ ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]), rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]));
		rt.setSv(f, "desc", "A cardboard cutout of a servant of Ratvar.");
		rt.setSv(f, "icon_state", "cutout_servant");
	} else if ($0 === "Revolutionary") {
		rt.setSv(f, "name", "Unknown");
		rt.setSv(f, "desc", "A cardboard cutout of a revolutionary.");
		rt.setSv(f, "icon_state", "cutout_viva");
	} else if ($0 === "Wizard") {
		rt.setSv(f, "name", fmt("＀, ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("wizard_first")]), rt.op(f, "PickUnweighted", [1], [rt.gl("wizard_second")])]));
		rt.setSv(f, "desc", "A cardboard cutout of a wizard.");
		rt.setSv(f, "icon_state", "cutout_wizard");
	} else if ($0 === "Shadowling") {
		rt.setSv(f, "name", "Unknown");
		rt.setSv(f, "desc", "A cardboard cutout of a shadowling.");
		rt.setSv(f, "icon_state", "cutout_shadowling");
	} else if ($0 === "Xenomorph") {
		rt.setSv(f, "name", fmt("alien hunter (＀)", [(yield* g.call(f, P("/proc/rand"), null, [1, 999]))]));
		rt.setSv(f, "desc", "A cardboard cutout of a xenomorph.");
		rt.setSv(f, "icon_state", "cutout_fukken_xeno");
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			rt.setSv(f, "alpha", 75);
		}
	} else if ($0 === "Xenomorph Maid") {
		rt.setSv(f, "name", fmt("lusty xenomorph maid (＀)", [(yield* g.call(f, P("/proc/rand"), null, [1, 999]))]));
		rt.setSv(f, "desc", "A cardboard cutout of a xenomorph maid.");
		rt.setSv(f, "icon_state", "cutout_lusty");
	} else if ($0 === "Swarmer") {
		rt.setSv(f, "name", fmt("Swarmer (＀)", [(yield* g.call(f, P("/proc/rand"), null, [1, 999]))]));
		rt.setSv(f, "desc", "A cardboard cutout of a swarmer.");
		rt.setSv(f, "icon_state", "cutout_swarmer");
	} else if ($0 === "Ash Walker") {
		rt.setSv(f, "name", (yield* g.call(f, P("/proc/lizard_name"), null, [rt.op(f, "PickUnweighted", [2], ["male", "female"])])));
		rt.setSv(f, "desc", "A cardboard cutout of an ash walker.");
		rt.setSv(f, "icon_state", "cutout_free_antag");
	} else if ($0 === "Deathsquad Officer") {
		rt.setSv(f, "name", rt.op(f, "PickUnweighted", [1], [rt.gl("commando_names")]));
		rt.setSv(f, "desc", "A cardboard cutout of a death commando.");
		rt.setSv(f, "icon_state", "cutout_deathsquad");
	} else if ($0 === "Ian") {
		rt.setSv(f, "name", "Ian");
		rt.setSv(f, "desc", "A cardboard cutout of the HoP's beloved corgi.");
		rt.setSv(f, "icon_state", "cutout_ian");
	} else if ($0 === "Slaughter Demon") {
		rt.setSv(f, "name", "slaughter demon");
		rt.setSv(f, "desc", "A cardboard cutout of a slaughter demon.");
		rt.setSv(f, "icon", rt.rsc("icons/mob/mob.dmi"));
		rt.setSv(f, "icon_state", "daemon");
	} else if ($0 === "Laughter Demon") {
		rt.setSv(f, "name", "laughter demon");
		rt.setSv(f, "desc", "A cardboard cutout of a laughter demon.");
		rt.setSv(f, "icon", rt.rsc("icons/mob/mob.dmi"));
		rt.setSv(f, "icon_state", "bowmon");
	} else if ($0 === "Private Security Officer") {
		rt.setSv(f, "name", "Private Security Officer");
		rt.setSv(f, "desc", "A cardboard cutout of a private security officer.");
		rt.setSv(f, "icon_state", "cutout_ntsec");
	}
	return 1;
}, true);
