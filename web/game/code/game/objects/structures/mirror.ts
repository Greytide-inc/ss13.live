// From code/game/objects/structures/mirror.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12806, "/obj/structure/mirror", "/obj/structure", {
	anchored: 1,
	name: "mirror",
	desc: "Mirror mirror on the wall, who's the most robust of them all?",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "mirror",
	density: 0,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 100,
});

// /obj/structure/mirror/proc/attack_hand  (code/game/objects/structures/mirror.dm:15)  may sleep
rt.def("/obj/structure/mirror/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null, userloc: Value = null, new_style: Value = null;
	f.vars = () => [user, H, userloc, new_style];
	if ((truthy(rt.sv(f, "broken")) || !truthy((yield* g.srcCall(f, "Adjacent", live(user)))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	H = live(user);
	userloc = rt.fv(f, "loc", live(H));
	if (isEqual(rt.fv(f, "gender", live(H)), "male")) {
		new_style = (yield* g.op(f, "Prompt", [1], [null, "Grooming", "Select a facial hair style", live(user), rt.gl("facial_hair_styles_list")]));
		if (!isEqual(live(userloc), rt.fv(f, "loc", live(H)))) {
			return live(f.dot);
		}
		if (truthy(live(new_style))) {
			rt.setFv(f, "facial_hair_style", live(H), live(new_style));
		}
	} else {
		rt.setFv(f, "facial_hair_style", live(H), "Shaved");
	}
	new_style = (yield* g.op(f, "Prompt", [1], [null, "Grooming", "Select a hair style", live(user), rt.gl("hair_styles_list")]));
	if (!isEqual(live(userloc), rt.fv(f, "loc", live(H)))) {
		return live(f.dot);
	}
	if (truthy(live(new_style))) {
		rt.setFv(f, "hair_style", live(H), live(new_style));
	}
	yield* g.callName(f, live(H), "update_hair", []);
	return f.dot;
}, true);

// /obj/structure/mirror/proc/examine_status  (code/game/objects/structures/mirror.dm:48)
rt.def("/obj/structure/mirror/proc/examine_status", function examine_status(f: Frame) {
	if (truthy(rt.sv(f, "broken"))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/mirror/proc/obj_break  (code/game/objects/structures/mirror.dm:51)
rt.def("/obj/structure/mirror/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!truthy(rt.sv(f, "broken")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	rt.setSv(f, "icon_state", "mirror_broke");
	rt.call(f, P("/proc/playsound"), null, [live(f.src), "shatter", 70, 1]);
	rt.setSv(f, "desc", "Oh no, seven years of bad luck!");
	rt.setSv(f, "broken", 1);
	return f.dot;
});

// /obj/structure/mirror/proc/deconstruct  (code/game/objects/structures/mirror.dm:58)  may sleep
rt.def("/obj/structure/mirror/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (!truthy(live(disassembled))) {
			yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.fv(f, "loc", live(f.src))]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/mirror/proc/attackby  (code/game/objects/structures/mirror.dm:64)  may sleep
rt.def("/obj/structure/mirror/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	f.vars = () => [WT];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
		WT = live(f.args[0]);
		if (truthy(rt.sv(f, "broken"))) {
			yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
			if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin repairing ＀...</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(10, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if (((!truthy(live(f.args[1])) || !truthy(live(WT))) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You repair ＀.</span>", [live(f.src)])]);
					rt.setSv(f, "broken", 0);
					rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
					rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
				}
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/mirror/proc/play_attack_sound  (code/game/objects/structures/mirror.dm:82)
rt.def("/obj/structure/mirror/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
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
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 70, 1]);
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 70, 1]);
	}
	return f.dot;
});

rt.type(12807, "/obj/structure/mirror/magic", "/obj/structure/mirror", {
	races_blacklist: null,
	choosable_races: null,
	name: "magic mirror",
	desc: "Turn and face the strange... face.",
	icon_state: "magic_mirror",
});

// /obj/structure/mirror/magic/proc/<init>  (code/game/objects/structures/mirror.dm:94)
rt.def("/obj/structure/mirror/magic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "races_blacklist", rt.list("skeleton", "agent", "angel", "military_synth", "memezombie"));
	$0 = $0;
	rt.setSv(f, "choosable_races", rt.list());
	return f.dot;
});

// /obj/structure/mirror/magic/proc/New  (code/game/objects/structures/mirror.dm:97)  may sleep
rt.def("/obj/structure/mirror/magic/proc/New", function* New(f: Frame) {
	let speciestype: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [speciestype, S, $e];
	if (!truthy(rt.len(f, rt.sv(f, "choosable_races")))) {
		speciestype = null;
		rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/species")])), T("/datum/species")));
		while (($e = rt.next(f, 0)) !== undefined) {
			speciestype = $e;
			if (!truthy((rt.isIn(f, rt.gv(f, "id", (S = (yield* g.new_(f, live(speciestype), [])))), rt.sv(f, "races_blacklist")) ? 1 : 0))) {
				rt.modSrcVar(f, "choosable_races", rt.fv(f, "id", live(S)), add);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(12808, "/obj/structure/mirror/magic/lesser", "/obj/structure/mirror/magic", {});

// /obj/structure/mirror/magic/lesser/proc/New  (code/game/objects/structures/mirror.dm:105)  may sleep
rt.def("/obj/structure/mirror/magic/lesser/proc/New", function* New(f: Frame) {
	rt.setSv(f, "choosable_races", rt.gl("roundstart_species"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(12809, "/obj/structure/mirror/magic/badmin", "/obj/structure/mirror/magic", {});

// /obj/structure/mirror/magic/badmin/proc/New  (code/game/objects/structures/mirror.dm:109)  may sleep
rt.def("/obj/structure/mirror/magic/badmin/proc/New", function* New(f: Frame) {
	let speciestype: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [speciestype, S, $e];
	speciestype = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/species")])), T("/datum/species")));
	while (($e = rt.next(f, 0)) !== undefined) {
		speciestype = $e;
		rt.modSrcVar(f, "choosable_races", rt.gv(f, "id", (S = (yield* g.new_(f, live(speciestype), [])))), add);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/mirror/magic/proc/attack_hand  (code/game/objects/structures/mirror.dm:115)  may sleep
rt.def("/obj/structure/mirror/magic/proc/attack_hand", function* attack_hand(f: Frame) {
	let H: Value = null, choice: Value = null, newname: Value = null, newrace: Value = null, racechoice: Value = null, new_s_tone: Value = null, new_mutantcolor: Value = null, temp_hsv: Value = null, hairchoice: Value = null, new_hair_color: Value = null, new_face_color: Value = null, new_eye_color: Value = null;
	let $0: any;
	f.vars = () => [H, choice, newname, newrace, racechoice, new_s_tone, new_mutantcolor, temp_hsv, hairchoice, new_hair_color, new_face_color, new_eye_color, $0];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	H = live(f.args[0]);
	choice = (yield* g.op(f, "Prompt", [1], [null, "Magical Grooming", "Something to change?", live(f.args[0]), rt.list("name", "race", "gender", "hair", "eyes")]));
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[0]))))) {
		return live(f.dot);
	}
	$0 = live(choice);
	if ($0 === "name") {
		if (!truthy((newname = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [rt.fv(f, "name", live(H)), "Name change", "Who are we again?", live(H), null]))])), 1, 42]))))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[0]))))) {
			return live(f.dot);
		}
		rt.setFv(f, "real_name", live(H), live(newname));
		rt.setFv(f, "name", live(H), live(newname));
		if (truthy(rt.fv(f, "dna", live(H)))) {
			rt.setFv(f, "real_name", rt.fv(f, "dna", live(H)), live(newname));
		}
		if (truthy(rt.fv(f, "mind", live(H)))) {
			rt.setFv(f, "name", rt.fv(f, "mind", live(H)), live(newname));
		}
	} else if ($0 === "race") {
		newrace = null;
		racechoice = (yield* g.op(f, "Prompt", [1], [null, "Race change", "What are we again?", live(H), rt.sv(f, "choosable_races")]));
		if (!truthy((newrace = rt.index(rt.gl("species_list"), live(racechoice))))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[0]))))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(H), "set_species", [null, live(newrace), "icon_update", 0], rt.Args.Named);
		if (truthy(rt.gv(f, "use_skintones", rt.gv(f, "species", rt.fv(f, "dna", live(H)))))) {
			if (truthy((new_s_tone = (yield* g.op(f, "Prompt", [1], [null, "Race change", "Choose your skin tone:", live(f.args[0]), rt.gl("skin_tones")]))))) {
				rt.setFv(f, "skin_tone", live(H), live(new_s_tone));
				yield* g.callName(f, rt.fv(f, "dna", live(H)), "update_ui_block", [3]);
			}
		}
		if (truthy((rt.isIn(f, 1, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
			if (truthy((new_mutantcolor = (yield* g.op(f, "Prompt", [257], [null, "Race change", "Choose your skin color:", live(f.args[0]), null]))))) {
				if (rt.ge(rt.index((yield* g.call(f, P("/proc/ReadHSV"), null, [(temp_hsv = (yield* g.call(f, P("/proc/RGBtoHSV"), null, [live(new_mutantcolor)])))])), 3), rt.index((yield* g.call(f, P("/proc/ReadHSV"), null, ["#7F7F7F"])), 3))) {
					rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [live(new_mutantcolor)])));
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Invalid color. Your color is not bright enough.</span>"]);
				}
			}
		}
		yield* g.callName(f, live(H), "update_body", []);
		yield* g.callName(f, live(H), "update_hair", []);
		yield* g.callName(f, live(H), "update_body_parts", []);
		yield* g.callName(f, live(H), "update_mutations_overlay", []);
	} else if ($0 === "gender") {
		if (!truthy((rt.isIn(f, rt.fv(f, "gender", live(H)), rt.list("male", "female")) ? 1 : 0))) {
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[0]))))) {
			return live(f.dot);
		}
		if (isEqual(rt.fv(f, "gender", live(H)), "male")) {
			if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(H), "Become a Witch?", "Confirmation", "Yes", "No"])), "Yes")) {
				rt.setFv(f, "gender", live(H), "female");
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Man, you feel like a woman!</span>"]);
			} else {
				return live(f.dot);
			}
		} else {
			if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(H), "Become a Warlock?", "Confirmation", "Yes", "No"])), "Yes")) {
				rt.setFv(f, "gender", live(H), "male");
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>Whoa man, you feel like a man!</span>"]);
			} else {
				return live(f.dot);
			}
		}
		yield* g.callName(f, rt.fv(f, "dna", live(H)), "update_ui_block", [5]);
		yield* g.callName(f, live(H), "update_body", []);
		yield* g.callName(f, live(H), "update_mutations_overlay", []);
	} else if ($0 === "hair") {
		hairchoice = (yield* g.call(f, P("/proc/alert"), null, [live(H), "Hair style or hair color?", "Change Hair", "Style", "Color"]));
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[0]))))) {
			return live(f.dot);
		}
		if (isEqual(live(hairchoice), "Style")) {
			yield* g.callSuper(f, [], rt.Args.Same);
		} else {
			if (truthy((new_hair_color = (yield* g.op(f, "Prompt", [257], [null, "Hair Color", "Choose your hair color", live(H), null]))))) {
				rt.setFv(f, "hair_color", live(H), (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [live(new_hair_color)])));
				yield* g.callName(f, rt.fv(f, "dna", live(H)), "update_ui_block", [1]);
			}
			if (isEqual(rt.fv(f, "gender", live(H)), "male")) {
				if (truthy((new_face_color = (yield* g.op(f, "Prompt", [257], [null, "Hair Color", "Choose your facial hair color", live(H), null]))))) {
					rt.setFv(f, "facial_hair_color", live(H), (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [live(new_face_color)])));
					yield* g.callName(f, rt.fv(f, "dna", live(H)), "update_ui_block", [2]);
				}
			}
			yield* g.callName(f, live(H), "update_hair", []);
		}
	} else if ($0 === "eyes") {
		new_eye_color = (yield* g.op(f, "Prompt", [257], [null, "Eye Color", "Choose your eye color", live(H), null]));
		if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.args[0]))))) {
			return live(f.dot);
		}
		if (truthy(live(new_eye_color))) {
			rt.setFv(f, "eye_color", live(H), (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [live(new_eye_color)])));
			yield* g.callName(f, rt.fv(f, "dna", live(H)), "update_ui_block", [4]);
			yield* g.callName(f, live(H), "update_body", []);
		}
	}
	if (!truthy(live(choice))) return f.dot;
	yield* g.srcCall(f, "curse", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });
