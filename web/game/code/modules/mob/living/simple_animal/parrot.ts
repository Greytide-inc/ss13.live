// From code/modules/mob/living/simple_animal/parrot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5074, "/mob/living/simple_animal/parrot", "/mob/living/simple_animal", {
	parrot_damage_upper: 10,
	parrot_state: 4,
	parrot_sleep_max: 25,
	parrot_sleep_dur: 25,
	parrot_dam_zone: null,
	parrot_speed: 5,
	parrot_lastmove: null,
	parrot_stuck: 0,
	parrot_stuck_threshold: 10,
	speech_buffer: null,
	speech_shuffle_rate: 20,
	available_channels: null,
	ears: null,
	parrot_interest: null,
	parrot_perch: null,
	held_item: null,
	desired_perches: null,
	pass_flags: 17,
	name: "parrot",
	desc: "The parrot squaks, \"It's a Parrot! BAWWK!\"",
	icon: rt.rsc("icons/mob/animal.dmi"),
	icon_state: "parrot_fly",
	icon_living: "parrot_fly",
	icon_dead: "parrot_dead",
	density: 0,
	health: 80,
	maxHealth: 80,
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	butcher_results: null,
	melee_damage_upper: 10,
	melee_damage_lower: 5,
	response_help: "pets",
	response_disarm: "gently moves aside",
	response_harm: "swats",
	stop_automated_movement: 1,
	a_intent: "harm",
	attacktext: "chomps",
	friendly: "grooms",
	mob_size: 1,
	movement_type: 2,
	gold_core_spawnable: 2,
});

// /mob/living/simple_animal/parrot/proc/<init>  (code/modules/mob/living/simple_animal/parrot.dm:76)
rt.def("/mob/living/simple_animal/parrot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "parrot_dam_zone", rt.list("chest", "head", "l_arm", "l_leg", "r_arm", "r_leg"));
	$0 = $0;
	rt.setSv(f, "speech_buffer", rt.list());
	$0 = $0;
	rt.setSv(f, "available_channels", rt.list());
	rt.setSv(f, "speak", rt.list("Hi!", "Hello!", "Cracker?", "BAWWWWK george mellons griffing me!"));
	rt.setSv(f, "speak_emote", rt.list("squawks", "says", "yells"));
	rt.setSv(f, "emote_hear", rt.list("squawks.", "bawks!"));
	$0 = $0;
	rt.setSv(f, "emote_see", rt.list("flutters its wings."));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/cracker"), 1]));
	$0 = $0;
	rt.setSv(f, "desired_perches", rt.list(T("/obj/structure/frame/computer"), T("/obj/structure/displaycase"), T("/obj/structure/filingcabinet"), T("/obj/machinery/teleport"), T("/obj/machinery/computer"), T("/obj/machinery/clonepod"), T("/obj/machinery/dna_scannernew"), T("/obj/machinery/telecomms"), T("/obj/machinery/nuclearbomb"), T("/obj/machinery/particle_accelerator"), T("/obj/machinery/recharge_station"), T("/obj/machinery/smartfridge"), T("/obj/machinery/suit_storage_unit")));
	return f.dot;
});

// /mob/living/simple_animal/parrot/proc/Initialize  (code/modules/mob/living/simple_animal/parrot.dm:103)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/Initialize", function* Initialize(f: Frame) {
	let headset: Value = null;
	f.vars = () => [headset];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "ears"))) {
		headset = rt.op(f, "PickUnweighted", [5], [T("/obj/item/device/radio/headset/headset_sec"), T("/obj/item/device/radio/headset/headset_eng"), T("/obj/item/device/radio/headset/headset_med"), T("/obj/item/device/radio/headset/headset_sci"), T("/obj/item/device/radio/headset/headset_cargo")]);
		rt.setSv(f, "ears", (yield* g.new_(f, live(headset), [live(f.src)])));
	}
	rt.setSv(f, "parrot_sleep_dur", rt.sv(f, "parrot_sleep_max"));
	yield* g.callName(f, rt.sv(f, "verbs"), "Add", [P("/mob/living/simple_animal/parrot/proc/steal_from_ground"), P("/mob/living/simple_animal/parrot/proc/steal_from_mob"), P("/mob/living/simple_animal/parrot/verb/drop_held_item_player"), P("/mob/living/simple_animal/parrot/proc/perch_player"), P("/mob/living/simple_animal/parrot/proc/toggle_mode"), P("/mob/living/simple_animal/parrot/proc/perch_mob_player")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/parrot/proc/examine  (code/modules/mob/living/simple_animal/parrot.dm:123)
rt.def("/mob/living/simple_animal/parrot/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "stat"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), rt.op(f, "PickUnweighted", [3], ["This parrot is no more", "This is a late parrot", "This is an ex-parrot"])]);
	return f.dot;
}, false, { args: ["user"] });

// /mob/living/simple_animal/parrot/proc/death  (code/modules/mob/living/simple_animal/parrot.dm:129)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	if (truthy(rt.sv(f, "held_item"))) {
		rt.setFv(f, "loc", rt.sv(f, "held_item"), rt.fv(f, "loc", live(f.src)));
		rt.setSv(f, "held_item", null);
	}
	yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.callName(f, rt.sv(f, "buckled"), "unbuckle_mob", [null, live(f.src), "force", 1], rt.Args.Named);
	}
	rt.setSv(f, "buckled", null);
	rt.setSv(f, "pixel_x", rt.initial(f, live(f.src), "pixel_x"));
	rt.setSv(f, "pixel_y", rt.initial(f, live(f.src), "pixel_y"));
	yield* g.callSuper(f, [live(gibbed)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/parrot/proc/Stat  (code/modules/mob/living/simple_animal/parrot.dm:142)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, ["Held Item", rt.sv(f, "held_item")]);
	yield* g.call(f, P("/proc/stat"), null, ["Mode", rt.sv(f, "a_intent")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/parrot/proc/Hear  (code/modules/mob/living/simple_animal/parrot.dm:148)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/Hear", function* Hear(f: Frame) {
	if ((!isEqual(live(f.args[1]), live(f.src)) && truthy(rt.op(f, "Prob", [], [50])))) {
		if ((!truthy(live(f.args[4])) || truthy(rt.op(f, "Prob", [], [10])))) {
			if (rt.ge(rt.len(f, rt.sv(f, "speech_buffer")), 500)) {
				(rt.modSrcVar(f, "speech_buffer", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "speech_buffer")]), subtract));
			}
			(rt.modSrcVar(f, "speech_buffer", (yield* g.call(f, P("/proc/html_decode"), null, [live(f.args[3])])), rt.bitOr));
		}
	}
	if ((isEqual(live(f.args[1]), live(f.src)) && !truthy(rt.sv(f, "client")))) {
		return live(f.args[0]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["message", "speaker", "message_langs", "raw_message", "radio_freq", "spans", "message_mode"] });

// /mob/living/simple_animal/parrot/proc/radio  (code/modules/mob/living/simple_animal/parrot.dm:158)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/radio", function* radio(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.dot), 0)) {
		return live(f.dot);
	}
	$0 = live(f.args[1]);
	if ($0 === "headset") {
		if (truthy(rt.sv(f, "ears"))) {
			yield* g.callName(f, rt.sv(f, "ears"), "talk_into", [live(f.src), live(f.args[0]), null, live(f.args[2]), live(f.args[3])]);
		}
		return 3;
	} else if ($0 === "department") {
		if (truthy(rt.sv(f, "ears"))) {
			yield* g.callName(f, rt.sv(f, "ears"), "talk_into", [live(f.src), live(f.args[0]), live(f.args[1]), live(f.args[2]), live(f.args[3])]);
		}
		return 3;
	}
	if (truthy((rt.isIn(f, live(f.args[1]), rt.gl("radiochannels")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "ears"))) {
			yield* g.callName(f, rt.sv(f, "ears"), "talk_into", [live(f.src), live(f.args[0]), live(f.args[1]), live(f.args[2]), live(f.args[3])]);
			return 3;
		}
	}
	return 0;
}, true, { args: ["message", "message_mode", "spans", "language"] });

// /mob/living/simple_animal/parrot/proc/show_inv  (code/modules/mob/living/simple_animal/parrot.dm:184)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	// tg_js: one `strip` tgui window instead of the HTML popup (modules/mob/strip.ts)
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /mob/living/simple_animal/parrot/proc/Topic  (code/modules/mob/living/simple_animal/parrot.dm:198)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/Topic", function* Topic(f: Frame) {
	let remove_from: Value = null, possible_phrase: Value = null, add_to: Value = null, item_to_add: Value = null, headset_to_add: Value = null, ch: Value = null;
	let $0: any, $e: any;
	f.vars = () => [remove_from, possible_phrase, add_to, item_to_add, headset_to_add, ch, $0, $e];
	if ((truthy((yield* g.callName(f, live(f.usr), "incapacitated", []))) || !truthy((yield* g.callName(f, live(f.usr), "Adjacent", [rt.sv(f, "loc")]))))) {
		return live(f.dot);
	}
	if (!(((truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(f.usr), T("/mob/living/carbon/monkey")) ? 1 : 0))) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon/robot")) ? 1 : 0))) || truthy((rt.istype(live(f.usr), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0)))) return f.dot;
	if (truthy(rt.at(live(f.args[1]), "remove_inv"))) {
		$0 = (remove_from = rt.at(live(f.args[1]), "remove_inv"));
		if ($0 === "ears") {
			if (truthy(rt.sv(f, "ears"))) {
				if (!truthy(rt.sv(f, "stat"))) {
					if (truthy(rt.len(f, rt.sv(f, "available_channels")))) {
						yield* g.callName(f, live(f.src), "say", [fmt("＀ BAWWWWWK LEAVE THE HEADSET BAWKKKKK!", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "available_channels")])])]);
					} else {
						yield* g.callName(f, live(f.src), "say", ["BAWWWWWK LEAVE THE HEADSET BAWKKKKK!"]);
					}
				}
				rt.setFv(f, "loc", rt.sv(f, "ears"), rt.fv(f, "loc", live(f.src)));
				rt.setSv(f, "ears", null);
				possible_phrase = null;
				rt.forList(f, 0, rt.sv(f, "speak"));
				while (($e = rt.next(f, 0)) !== undefined) {
					possible_phrase = $e;
					if (truthy((rt.isIn(f, (yield* g.call(f, P("/proc/copytext"), null, [live(possible_phrase), 1, 3])), rt.gl("department_radio_keys")) ? 1 : 0))) {
						possible_phrase = (yield* g.call(f, P("/proc/copytext"), null, [live(possible_phrase), 3]));
					}
				}
				rt.endFor(f, 0);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>There is nothing to remove from its ＀!</span>", [live(remove_from)])]);
				return live(f.dot);
			}
		}
	} else {
		if (truthy(rt.at(live(f.args[1]), "add_inv"))) {
			add_to = rt.at(live(f.args[1]), "add_inv");
			if (!truthy((yield* g.callName(f, live(f.usr), "get_active_held_item", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You have nothing in your hand to put on its ＀!</span>", [live(add_to)])]);
				return live(f.dot);
			}
			$0 = live(add_to);
			if ($0 === "ears") {
				if (truthy(rt.sv(f, "ears"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>It's already wearing something!</span>"]);
					return live(f.dot);
				} else {
					if (!truthy((item_to_add = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))))) {
						return live(f.dot);
					}
					if (!truthy((rt.istype(live(item_to_add), T("/obj/item/device/radio/headset")) ? 1 : 0))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This object won't fit!</span>"]);
						return live(f.dot);
					}
					headset_to_add = live(item_to_add);
					yield* g.callName(f, live(f.usr), "drop_item", []);
					rt.setFv(f, "loc", live(headset_to_add), live(f.src));
					rt.setFv(f, "ears", live(f.src), live(headset_to_add));
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You fit the headset onto ＀.</span>", [live(f.src)])]);
					yield* g.call(f, P("/proc/clearlist"), null, [rt.sv(f, "available_channels")]);
					ch = null;
					rt.forList(f, 0, rt.fv(f, "channels", live(headset_to_add)));
					while (($e = rt.next(f, 0)) !== undefined) {
						ch = $e;
						$0 = live(ch);
						if ($0 === "Engineering") {
							yield* g.callName(f, rt.sv(f, "available_channels"), "Add", [":e"]);
						} else if ($0 === "Command") {
							yield* g.callName(f, rt.sv(f, "available_channels"), "Add", [":c"]);
						} else if ($0 === "Security") {
							yield* g.callName(f, rt.sv(f, "available_channels"), "Add", [":s"]);
						} else if ($0 === "Science") {
							yield* g.callName(f, rt.sv(f, "available_channels"), "Add", [":n"]);
						} else if ($0 === "Medical") {
							yield* g.callName(f, rt.sv(f, "available_channels"), "Add", [":m"]);
						} else if ($0 === "Supply") {
							yield* g.callName(f, rt.sv(f, "available_channels"), "Add", [":u"]);
						} else if ($0 === "Service") {
							yield* g.callName(f, rt.sv(f, "available_channels"), "Add", [":v"]);
						}
					}
					rt.endFor(f, 0);
					if (truthy(rt.fv(f, "translate_binary", live(headset_to_add)))) {
						yield* g.callName(f, rt.sv(f, "available_channels"), "Add", [":b"]);
					}
				}
			}
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /mob/living/simple_animal/parrot/proc/attack_hand  (code/modules/mob/living/simple_animal/parrot.dm:280)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "stat")) && isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm"))) {
		rt.setSv(f, "icon_state", "parrot_fly");
		if (isEqual(rt.sv(f, "parrot_state"), 1)) {
			rt.setSv(f, "parrot_sleep_dur", rt.sv(f, "parrot_sleep_max"));
		}
		rt.setSv(f, "parrot_interest", live(f.args[0]));
		rt.setSv(f, "parrot_state", 2);
		if (rt.gt(rt.sv(f, "health"), 30)) {
			(rt.modSrcVar(f, "parrot_state", 16, rt.bitOr));
		} else {
			(rt.modSrcVar(f, "parrot_state", 64, rt.bitOr));
			yield* g.srcCall(f, "drop_held_item", 0);
		}
	}
	if ((!truthy(rt.sv(f, "stat")) && isEqual(rt.fv(f, "a_intent", live(f.args[0])), "help"))) {
		yield* g.srcCall(f, "handle_automated_speech", 1);
	}
	return live(f.dot);
}, true, { args: ["M"] });

// /mob/living/simple_animal/parrot/proc/attack_paw  (code/modules/mob/living/simple_animal/parrot.dm:303)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.srcCall(f, "attack_hand", live(M));
	return f.dot;
}, true);

// /mob/living/simple_animal/parrot/proc/attack_alien  (code/modules/mob/living/simple_animal/parrot.dm:306)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.srcCall(f, "attack_hand", live(M));
	return f.dot;
}, true);

// /mob/living/simple_animal/parrot/proc/attack_animal  (code/modules/mob/living/simple_animal/parrot.dm:310)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/attack_animal", function* attack_animal(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "parrot_state"), 1)) {
		rt.setSv(f, "parrot_sleep_dur", rt.sv(f, "parrot_sleep_max"));
	}
	if (!(rt.gt(rt.fv(f, "melee_damage_upper", live(f.args[0])), 0) && !truthy(rt.sv(f, "stat")))) return f.dot;
	rt.setSv(f, "parrot_interest", live(f.args[0]));
	rt.setSv(f, "parrot_state", 18);
	rt.setSv(f, "icon_state", "parrot_fly");
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/parrot/proc/attackby  (code/modules/mob/living/simple_animal/parrot.dm:325)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/attackby", function* attackby(f: Frame) {
	if ((((!truthy(rt.sv(f, "stat")) && !truthy(rt.sv(f, "client"))) && !truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/medical")) ? 1 : 0))) && !truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/cracker")) ? 1 : 0)))) {
		if (truthy(rt.fv(f, "force", live(f.args[0])))) {
			if (isEqual(rt.sv(f, "parrot_state"), 1)) {
				rt.setSv(f, "parrot_sleep_dur", rt.sv(f, "parrot_sleep_max"));
			}
			rt.setSv(f, "parrot_interest", live(f.args[1]));
			rt.setSv(f, "parrot_state", 2);
			if (rt.gt(rt.sv(f, "health"), 30)) {
				(rt.modSrcVar(f, "parrot_state", 16, rt.bitOr));
			} else {
				(rt.modSrcVar(f, "parrot_state", 64, rt.bitOr));
			}
			rt.setSv(f, "icon_state", "parrot_fly");
			yield* g.srcCall(f, "drop_held_item", 0);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/cracker")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.callName(f, live(f.args[1]), "drop_item", []);
			if (rt.lt(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
				yield* g.srcCall(f, "adjustBruteLoss", -10);
			}
			(rt.modSrcVar(f, "speak_chance", 1.2699999809265137, multiply));
			rt.modSrcVar(f, "speech_shuffle_rate", 10, add);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ eagerly devours the cracker.</span>", [live(f.src)])]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true, { args: ["O", "user", "params"] });

// /mob/living/simple_animal/parrot/proc/bullet_act  (code/modules/mob/living/simple_animal/parrot.dm:351)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!truthy(rt.sv(f, "stat")) && !truthy(rt.sv(f, "client")))) {
		if (isEqual(rt.sv(f, "parrot_state"), 1)) {
			rt.setSv(f, "parrot_sleep_dur", rt.sv(f, "parrot_sleep_max"));
		}
		rt.setSv(f, "parrot_interest", null);
		rt.setSv(f, "parrot_state", 68);
		rt.setSv(f, "icon_state", "parrot_fly");
		yield* g.srcCall(f, "drop_held_item", 0);
	}
	return live(f.dot);
}, true, { args: ["Proj"] });

// /mob/living/simple_animal/parrot/proc/Life  (code/modules/mob/living/simple_animal/parrot.dm:368)
rt.def("/mob/living/simple_animal/parrot/proc/Life", function Life(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "pulledby")) && isEqual(rt.sv(f, "stat"), 0))) return f.dot;
	rt.setSv(f, "icon_state", "parrot_fly");
	if (!truthy(rt.sv(f, "client"))) {
		rt.setSv(f, "parrot_state", 4);
	}
	return live(f.dot);
}, false, { waitfor: false });

// /mob/living/simple_animal/parrot/proc/handle_automated_speech  (code/modules/mob/living/simple_animal/parrot.dm:383)
rt.def("/mob/living/simple_animal/parrot/proc/handle_automated_speech", function handle_automated_speech(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.len(f, rt.sv(f, "speech_buffer"))) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "speech_shuffle_rate")])))) return f.dot;
	if (truthy(rt.len(f, rt.sv(f, "speak")))) {
		rt.callName(f, rt.sv(f, "speak"), "Remove", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "speak")])]);
	}
	rt.callName(f, rt.sv(f, "speak"), "Add", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "speech_buffer")])]);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/simple_animal/parrot/proc/handle_automated_movement  (code/modules/mob/living/simple_animal/parrot.dm:392)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/handle_automated_movement", function* handle_automated_movement(f: Frame) {
	let newspeak: Value = null, possible_phrase: Value = null, useradio: Value = null, AM: Value = null, L: Value = null;
	let $0: any, $e: any;
	f.vars = () => [newspeak, possible_phrase, useradio, AM, L, $0, $e];
	if (((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))]))) || !truthy(rt.sv(f, "canmove"))) || truthy(rt.sv(f, "buckled")))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "parrot_state"), 1)) {
		if ((truthy(rt.sv(f, "parrot_perch")) && !isEqual(rt.fv(f, "loc", rt.sv(f, "parrot_perch")), rt.fv(f, "loc", live(f.src))))) {
			if (truthy((rt.isIn(f, rt.sv(f, "parrot_perch"), (yield* g.call(f, P("/proc/view"), null, [live(f.src)]))) ? 1 : 0))) {
				rt.setSv(f, "parrot_state", 34);
				rt.setSv(f, "icon_state", "parrot_fly");
				return live(f.dot);
			} else {
				rt.setSv(f, "parrot_state", 4);
				rt.setSv(f, "icon_state", "parrot_fly");
				return live(f.dot);
			}
		}
		if (truthy(rt.incSrcVar(f, "parrot_sleep_dur", -1, false))) {
			return live(f.dot);
		} else {
			rt.setSv(f, "parrot_sleep_dur", rt.sv(f, "parrot_sleep_max"));
			if (truthy(rt.len(f, rt.sv(f, "speak")))) {
				newspeak = rt.list();
				if ((truthy(rt.len(f, rt.sv(f, "available_channels"))) && truthy(rt.fv(f, "ears", live(f.src))))) {
					possible_phrase = null;
					rt.forList(f, 0, rt.sv(f, "speak"));
					while (($e = rt.next(f, 0)) !== undefined) {
						possible_phrase = $e;
						useradio = 0;
						if (truthy(rt.op(f, "Prob", [], [50]))) {
							useradio = 1;
						}
						if ((truthy((rt.isIn(f, (yield* g.call(f, P("/proc/copytext"), null, [live(possible_phrase), 1, 2])), rt.gl("department_radio_prefixes")) ? 1 : 0)) && truthy((rt.isIn(f, (yield* g.call(f, P("/proc/copytext"), null, [live(possible_phrase), 2, 3])), rt.gl("department_radio_keys")) ? 1 : 0)))) {
							if (truthy(live(useradio))) {
								$0 = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "available_channels")]);
							} else {
								$0 = "";
							}
							possible_phrase = fmt("＀＀", [$0, (yield* g.call(f, P("/proc/copytext"), null, [live(possible_phrase), 3]))]);
						} else {
							if (truthy(live(useradio))) {
								$0 = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "available_channels")]);
							} else {
								$0 = "";
							}
							possible_phrase = fmt("＀＀", [$0, live(possible_phrase)]);
						}
						yield* g.callName(f, live(newspeak), "Add", [live(possible_phrase)]);
					}
					rt.endFor(f, 0);
				} else {
					possible_phrase = null;
					rt.forList(f, 0, rt.sv(f, "speak"));
					while (($e = rt.next(f, 0)) !== undefined) {
						possible_phrase = $e;
						if ((truthy((rt.isIn(f, (yield* g.call(f, P("/proc/copytext"), null, [live(possible_phrase), 1, 2])), rt.gl("department_radio_prefixes")) ? 1 : 0)) && truthy((rt.isIn(f, (yield* g.call(f, P("/proc/copytext"), null, [live(possible_phrase), 2, 3])), rt.gl("department_radio_keys")) ? 1 : 0)))) {
							possible_phrase = (yield* g.call(f, P("/proc/copytext"), null, [live(possible_phrase), 3]));
						}
						yield* g.callName(f, live(newspeak), "Add", [live(possible_phrase)]);
					}
					rt.endFor(f, 0);
				}
				rt.setSv(f, "speak", live(newspeak));
			}
			rt.setSv(f, "parrot_interest", (yield* g.srcCall(f, "search_for_item")));
			if (truthy(rt.sv(f, "parrot_interest"))) {
				yield* g.srcCall(f, "emote", "me", 1, fmt("looks in ＀'s direction and takes flight.", [rt.sv(f, "parrot_interest")]));
				rt.setSv(f, "parrot_state", 10);
				rt.setSv(f, "icon_state", "parrot_fly");
			}
			return live(f.dot);
		}
	} else {
		if (isEqual(rt.sv(f, "parrot_state"), 4)) {
			yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
			rt.setSv(f, "parrot_interest", null);
			if (truthy(rt.op(f, "Prob", [], [90]))) {
				yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
				return live(f.dot);
			}
			if ((!truthy(rt.sv(f, "held_item")) && !truthy(rt.sv(f, "parrot_perch")))) {
				if (truthy((AM = (yield* g.srcCall(f, "search_for_perch_and_item"))))) {
					if ((truthy((rt.istype(live(AM), T("/obj/item")) ? 1 : 0)) || truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0)))) {
						rt.setSv(f, "parrot_interest", live(AM));
						yield* g.srcCall(f, "emote", "me", 1, fmt("turns and flies towards ＀.", [rt.sv(f, "parrot_interest")]));
						rt.setSv(f, "parrot_state", 10);
						return live(f.dot);
					} else {
						rt.setSv(f, "parrot_perch", live(AM));
						rt.setSv(f, "parrot_state", 34);
						return live(f.dot);
					}
				}
				return live(f.dot);
			}
			if (truthy((rt.isIn(f, (rt.sv(f, "parrot_interest") && rt.sv(f, "parrot_interest")), (yield* g.call(f, P("/proc/view"), null, [live(f.src)]))) ? 1 : 0))) {
				rt.setSv(f, "parrot_state", 10);
				return live(f.dot);
			}
			if (truthy((rt.isIn(f, (rt.sv(f, "parrot_perch") && rt.sv(f, "parrot_perch")), (yield* g.call(f, P("/proc/view"), null, [live(f.src)]))) ? 1 : 0))) {
				rt.setSv(f, "parrot_state", 34);
				return live(f.dot);
			} else {
				rt.setSv(f, "parrot_perch", (yield* g.srcCall(f, "search_for_perch")));
				if (truthy(rt.sv(f, "parrot_perch"))) {
					rt.setSv(f, "parrot_state", 34);
					return live(f.dot);
				}
			}
		} else {
			if (isEqual(rt.sv(f, "parrot_state"), 10)) {
				yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
				if ((!truthy(rt.sv(f, "parrot_interest")) || truthy(rt.sv(f, "held_item")))) {
					rt.setSv(f, "parrot_state", 34);
					return live(f.dot);
				}
				if (!truthy((rt.isIn(f, rt.sv(f, "parrot_interest"), (yield* g.call(f, P("/proc/view"), null, [live(f.src)]))) ? 1 : 0))) {
					rt.setSv(f, "parrot_state", 34);
					return live(f.dot);
				}
				if (truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "parrot_interest"))))) {
					if (truthy((rt.istype(rt.sv(f, "parrot_interest"), T("/mob/living")) ? 1 : 0))) {
						yield* g.srcCall(f, "steal_from_mob");
					} else {
						if ((!truthy(rt.sv(f, "parrot_perch")) || !isEqual(rt.fv(f, "loc", rt.sv(f, "parrot_interest")), rt.fv(f, "loc", rt.sv(f, "parrot_perch"))))) {
							rt.setSv(f, "held_item", rt.sv(f, "parrot_interest"));
							rt.setFv(f, "loc", rt.sv(f, "parrot_interest"), live(f.src));
							yield* g.srcCall(f, "visible_message", fmt("＀ grabs ＀!", [live(f.src), rt.sv(f, "held_item")]), fmt("<span class='notice'>You grab ＀!</span>", [rt.sv(f, "held_item")]), "<span class='italics'>You hear the sounds of wings flapping furiously.</span>");
						}
					}
					rt.setSv(f, "parrot_interest", null);
					rt.setSv(f, "parrot_state", 34);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), rt.sv(f, "parrot_interest"), 1, rt.sv(f, "parrot_speed")]);
				if (truthy((yield* g.srcCall(f, "isStuck")))) {
					return live(f.dot);
				}
				return live(f.dot);
			} else {
				if (isEqual(rt.sv(f, "parrot_state"), 34)) {
					yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
					if ((!truthy(rt.sv(f, "parrot_perch")) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "parrot_perch"))]))))) {
						rt.setSv(f, "parrot_perch", null);
						rt.setSv(f, "parrot_state", 4);
						return live(f.dot);
					}
					if (truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "parrot_perch"))))) {
						rt.setFv(f, "loc", live(f.src), rt.fv(f, "loc", rt.sv(f, "parrot_perch")));
						yield* g.srcCall(f, "drop_held_item");
						rt.setSv(f, "parrot_state", 1);
						rt.setSv(f, "icon_state", "parrot_sit");
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), rt.sv(f, "parrot_perch"), 1, rt.sv(f, "parrot_speed")]);
					if (truthy((yield* g.srcCall(f, "isStuck")))) {
						return live(f.dot);
					}
					return live(f.dot);
				} else {
					if (isEqual(rt.sv(f, "parrot_state"), 66)) {
						yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
						if ((!truthy(rt.sv(f, "parrot_interest")) || !truthy((rt.istype(rt.sv(f, "parrot_interest"), T("/mob/living")) ? 1 : 0)))) {
							rt.setSv(f, "parrot_state", 4);
						}
						yield* g.call(f, P("/proc/walk_away"), null, [live(f.src), rt.sv(f, "parrot_interest"), 1, rt.sv(f, "parrot_speed")]);
						if (truthy((yield* g.srcCall(f, "isStuck")))) {
							return live(f.dot);
						}
						return live(f.dot);
					} else {
						if (isEqual(rt.sv(f, "parrot_state"), 18)) {
							if ((!truthy(rt.sv(f, "parrot_interest")) || !truthy((rt.istype(rt.sv(f, "parrot_interest"), T("/mob/living")) ? 1 : 0)))) {
								rt.setSv(f, "parrot_interest", null);
								rt.setSv(f, "parrot_state", 4);
								return live(f.dot);
							}
							L = rt.sv(f, "parrot_interest");
							if (isEqual(rt.sv(f, "melee_damage_upper"), 0)) {
								rt.setSv(f, "melee_damage_upper", rt.sv(f, "parrot_damage_upper"));
								rt.setSv(f, "a_intent", "harm");
							}
							if (truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "parrot_interest"))))) {
								if (truthy(rt.fv(f, "stat", live(L)))) {
									rt.setSv(f, "parrot_interest", null);
									if (!truthy(rt.sv(f, "held_item"))) {
										rt.setSv(f, "held_item", (yield* g.srcCall(f, "steal_from_ground")));
										if (!truthy(rt.sv(f, "held_item"))) {
											rt.setSv(f, "held_item", (yield* g.srcCall(f, "steal_from_mob")));
										}
									}
									if (truthy((rt.isIn(f, rt.sv(f, "parrot_perch"), (yield* g.call(f, P("/proc/view"), null, [live(f.src)]))) ? 1 : 0))) {
										rt.setSv(f, "parrot_state", 34);
									} else {
										rt.setSv(f, "parrot_state", 4);
									}
									return live(f.dot);
								}
								rt.setSv(f, "attacktext", rt.op(f, "PickUnweighted", [2], ["claws at", "chomps"]));
								yield* g.callName(f, live(L), "attack_animal", [live(f.src)]);
							} else {
								yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), rt.sv(f, "parrot_interest"), 1, rt.sv(f, "parrot_speed")]);
								if (truthy((yield* g.srcCall(f, "isStuck")))) {
									return live(f.dot);
								}
							}
							return live(f.dot);
						} else {
							yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
							rt.setSv(f, "parrot_interest", null);
							rt.setSv(f, "parrot_perch", null);
							yield* g.srcCall(f, "drop_held_item");
							rt.setSv(f, "parrot_state", 4);
							return live(f.dot);
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/parrot/proc/movement_delay  (code/modules/mob/living/simple_animal/parrot.dm:604)
rt.def("/mob/living/simple_animal/parrot/proc/movement_delay", function movement_delay(f: Frame) {
	if (((truthy(rt.sv(f, "client")) && isEqual(rt.sv(f, "stat"), 0)) && !isEqual(rt.sv(f, "parrot_state"), "parrot_fly"))) {
		rt.setSv(f, "icon_state", "parrot_fly");
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /mob/living/simple_animal/parrot/proc/isStuck  (code/modules/mob/living/simple_animal/parrot.dm:612)
rt.def("/mob/living/simple_animal/parrot/proc/isStuck", function isStuck(f: Frame) {
	if (truthy(rt.sv(f, "parrot_lastmove"))) {
		if (isEqual(rt.sv(f, "parrot_lastmove"), rt.fv(f, "loc", live(f.src)))) {
			if (rt.ge(rt.sv(f, "parrot_stuck_threshold"), rt.incSrcVar(f, "parrot_stuck", 1, false))) {
				rt.setSv(f, "parrot_state", 4);
				rt.setSv(f, "parrot_stuck", 0);
				rt.setSv(f, "parrot_lastmove", null);
				return 1;
			}
		} else {
			rt.setSv(f, "parrot_lastmove", null);
		}
	} else {
		rt.setSv(f, "parrot_lastmove", rt.fv(f, "loc", live(f.src)));
	}
	return 0;
});

// /mob/living/simple_animal/parrot/proc/search_for_item  (code/modules/mob/living/simple_animal/parrot.dm:626)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/search_for_item", function* search_for_item(f: Frame) {
	let item: Value = null, AM: Value = null, I: Value = null, C: Value = null, I_3: Value = null;
	let $e: any;
	f.vars = () => [item, AM, I, C, I_3, $e];
	item = null;
	AM = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(f.src)])), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (((truthy(rt.sv(f, "parrot_perch")) && isEqual(rt.fv(f, "loc", live(AM)), rt.fv(f, "loc", rt.sv(f, "parrot_perch")))) || isEqual(rt.fv(f, "loc", live(AM)), live(f.src)))) {
			continue;
		}
		if (truthy((rt.istype(live(AM), T("/obj/item")) ? 1 : 0))) {
			if (rt.lt(rt.gv(f, "w_class", (I = live(AM))), 2)) {
				item = live(I);
			}
		} else {
			if (truthy((rt.istype(live(AM), T("/mob/living/carbon")) ? 1 : 0))) {
				C = live(AM);
				I_3 = null;
				rt.forList(f, 1, rt.fv(f, "held_items", live(C)), T("/obj/item"));
				while (($e = rt.next(f, 1)) !== undefined) {
					I_3 = $e;
					if (rt.le(rt.fv(f, "w_class", live(I_3)), 2)) {
						item = live(I_3);
						break;
					}
				}
				rt.endFor(f, 1);
			}
		}
		if (truthy(live(item))) {
			if (!truthy((yield* g.call(f, P("/proc/AStar"), null, [live(f.src), rt.getStep(f, live(item), 0), P("/turf/proc/Distance_cardinal")])))) {
				item = null;
				continue;
			}
			return live(item);
		}
	}
	rt.endFor(f, 0);
	return null;
}, true);

// /mob/living/simple_animal/parrot/proc/search_for_perch  (code/modules/mob/living/simple_animal/parrot.dm:649)
rt.def("/mob/living/simple_animal/parrot/proc/search_for_perch", function search_for_perch(f: Frame) {
	let O: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [O, path, $e];
	O = null;
	rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [live(f.src)]), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		path = null;
		rt.forList(f, 1, rt.sv(f, "desired_perches"));
		while (($e = rt.next(f, 1)) !== undefined) {
			path = $e;
			if (truthy(rt.op(f, "IsType", [], [live(O), live(path)]))) {
				return live(O);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return null;
});

// /mob/living/simple_animal/parrot/proc/search_for_perch_and_item  (code/modules/mob/living/simple_animal/parrot.dm:657)
rt.def("/mob/living/simple_animal/parrot/proc/search_for_perch_and_item", function search_for_perch_and_item(f: Frame) {
	let AM: Value = null, perch_path: Value = null, I: Value = null, C: Value = null, I_2: Value = null;
	let $e: any;
	f.vars = () => [AM, perch_path, I, C, I_2, $e];
	AM = null;
	rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [live(f.src)]), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		perch_path = null;
		rt.forList(f, 1, rt.sv(f, "desired_perches"));
		while (($e = rt.next(f, 1)) !== undefined) {
			perch_path = $e;
			if (truthy(rt.op(f, "IsType", [], [live(AM), live(perch_path)]))) {
				return live(AM);
			}
		}
		rt.endFor(f, 1);
		if (((truthy(rt.sv(f, "parrot_perch")) && isEqual(rt.fv(f, "loc", live(AM)), rt.fv(f, "loc", rt.sv(f, "parrot_perch")))) || isEqual(rt.fv(f, "loc", live(AM)), live(f.src)))) {
			continue;
		}
		if (truthy((rt.istype(live(AM), T("/obj/item")) ? 1 : 0))) {
			if (rt.le(rt.gv(f, "w_class", (I = live(AM))), 2)) {
				return live(I);
			}
		}
		if (truthy((rt.istype(live(AM), T("/mob/living/carbon")) ? 1 : 0))) {
			C = live(AM);
			I_2 = null;
			rt.forList(f, 1, rt.fv(f, "held_items", live(C)), T("/obj/item"));
			while (($e = rt.next(f, 1)) !== undefined) {
				I_2 = $e;
				if (rt.le(rt.fv(f, "w_class", live(I_2)), 2)) {
					return live(C);
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /mob/living/simple_animal/parrot/proc/steal_from_ground  (code/modules/mob/living/simple_animal/parrot.dm:691)
rt.def("/mob/living/simple_animal/parrot/proc/steal_from_ground", function steal_from_ground(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (truthy(rt.sv(f, "stat"))) {
		return -1;
	}
	if (truthy(rt.sv(f, "held_item"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You are already holding ＀!</span>", [rt.sv(f, "held_item")])]);
		return 1;
	}
	I = null;
	rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [1, live(f.src)]), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if ((!isEqual(rt.fv(f, "loc", live(I)), live(f.src)) && rt.le(rt.fv(f, "w_class", live(I)), 2))) {
			if (((!truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "parrot_perch"))) && isEqual(rt.fv(f, "loc", live(I)), rt.fv(f, "loc", rt.sv(f, "parrot_perch"))))) {
				continue;
			}
			rt.setSv(f, "held_item", live(I));
			rt.setFv(f, "loc", live(I), live(f.src));
			rt.callSrc(f, "visible_message", [fmt("＀ grabs ＀!", [live(f.src), rt.sv(f, "held_item")]), fmt("<span class='notice'>You grab ＀!</span>", [rt.sv(f, "held_item")]), "<span class='italics'>You hear the sounds of wings flapping furiously.</span>"]);
			return rt.sv(f, "held_item");
		}
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is nothing of interest to take!</span>"]);
	return 0;
}, false, { verb: { name: "Steal from ground", category: "Parrot", desc: "Grabs a nearby item." } });

// /mob/living/simple_animal/parrot/proc/steal_from_mob  (code/modules/mob/living/simple_animal/parrot.dm:719)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/steal_from_mob", function* steal_from_mob(f: Frame) {
	let stolen_item: Value = null, C: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [stolen_item, C, I, $e];
	if (truthy(rt.sv(f, "stat"))) {
		return -1;
	}
	if (truthy(rt.sv(f, "held_item"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You are already holding ＀!</span>", [rt.sv(f, "held_item")])]);
		return 1;
	}
	stolen_item = null;
	C = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [1, live(f.src)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		I = null;
		rt.forList(f, 1, rt.fv(f, "held_items", live(C)), T("/obj/item"));
		while (($e = rt.next(f, 1)) !== undefined) {
			I = $e;
			if (rt.le(rt.fv(f, "w_class", live(I)), 2)) {
				stolen_item = live(I);
				break;
			}
		}
		rt.endFor(f, 1);
		if (truthy(live(stolen_item))) {
			yield* g.callName(f, live(C), "transferItemToLoc", [live(stolen_item), live(f.src), 1]);
			rt.setSv(f, "held_item", live(stolen_item));
			yield* g.srcCall(f, "visible_message", fmt("＀ grabs ＀ out of ＀'s hand!", [live(f.src), rt.sv(f, "held_item"), live(C)]), fmt("<span class='notice'>You snag ＀ out of ＀'s hand!</span>", [rt.sv(f, "held_item"), live(C)]), "<span class='italics'>You hear the sounds of wings flapping furiously.</span>");
			return rt.sv(f, "held_item");
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is nothing of interest to take!</spawn>"]);
	return 0;
}, true, { verb: { name: "Steal from mob", category: "Parrot", desc: "Steals an item right out of a person's hand!" } });

// /mob/living/simple_animal/parrot/verb/drop_held_item_player  (code/modules/mob/living/simple_animal/parrot.dm:747)  may sleep
rt.def("/mob/living/simple_animal/parrot/verb/drop_held_item_player", function* drop_held_item_player(f: Frame) {
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "drop_held_item", []);
	return live(f.dot);
}, true, { verb: { name: "Drop held item", category: "Parrot", desc: "Drop the item you're holding." } });

// /mob/living/simple_animal/parrot/proc/drop_held_item  (code/modules/mob/living/simple_animal/parrot.dm:759)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/drop_held_item", function* drop_held_item(f: Frame, drop_gently: Value) {
	let G: Value = null;
	f.vars = () => [drop_gently, G];
	if (live(drop_gently) === null) {
		drop_gently = 1;
	}
	if (truthy(rt.sv(f, "stat"))) {
		return -1;
	}
	if (!truthy(rt.sv(f, "held_item"))) {
		if (isEqual(live(f.src), live(f.usr))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You have nothing to drop!</span>"]);
		}
		return 0;
	}
	if ((truthy((rt.istype(rt.sv(f, "held_item"), T("/obj/item/weapon/reagent_containers/food/snacks/cracker")) ? 1 : 0)) && truthy(live(drop_gently)))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "held_item")]);
		rt.setSv(f, "held_item", null);
		if (rt.lt(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
			yield* g.srcCall(f, "adjustBruteLoss", -10);
		}
		yield* g.srcCall(f, "emote", "me", 1, fmt("＀ eagerly downs the cracker.", [live(f.src)]));
		return 1;
	}
	if (!truthy(live(drop_gently))) {
		if (truthy((rt.istype(rt.sv(f, "held_item"), T("/obj/item/weapon/grenade")) ? 1 : 0))) {
			rt.setFv(f, "loc", (G = rt.sv(f, "held_item")), rt.fv(f, "loc", live(f.src)));
			yield* g.callName(f, live(G), "prime", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("You let go of ＀!", [rt.sv(f, "held_item")])]);
			rt.setSv(f, "held_item", null);
			return 1;
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("You drop ＀.", [rt.sv(f, "held_item")])]);
	rt.setFv(f, "loc", rt.sv(f, "held_item"), rt.fv(f, "loc", live(f.src)));
	rt.setSv(f, "held_item", null);
	return 1;
}, true, { verb: { name: "Drop held item", category: "Parrot", desc: "Drop the item you're holding." } });

// /mob/living/simple_animal/parrot/proc/perch_player  (code/modules/mob/living/simple_animal/parrot.dm:795)
rt.def("/mob/living/simple_animal/parrot/proc/perch_player", function perch_player(f: Frame) {
	let AM: Value = null, perch_path: Value = null;
	let $e: any;
	f.vars = () => [AM, perch_path, $e];
	if ((truthy(rt.sv(f, "stat")) || !truthy(rt.sv(f, "client")))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "icon_state"), "parrot_fly")) {
		AM = null;
		rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [live(f.src), 1]), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			AM = $e;
			perch_path = null;
			rt.forList(f, 1, rt.sv(f, "desired_perches"));
			while (($e = rt.next(f, 1)) !== undefined) {
				perch_path = $e;
				if (truthy(rt.op(f, "IsType", [], [live(AM), live(perch_path)]))) {
					rt.setFv(f, "loc", live(f.src), rt.fv(f, "loc", live(AM)));
					rt.setSv(f, "icon_state", "parrot_sit");
					return live(f.dot);
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is no perch nearby to sit on!</span>"]);
	return live(f.dot);
}, false, { verb: { name: "Sit", category: "Parrot", desc: "Sit on a nice comfy perch." } });

// /mob/living/simple_animal/parrot/proc/perch_mob_player  (code/modules/mob/living/simple_animal/parrot.dm:814)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/perch_mob_player", function* perch_mob_player(f: Frame) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [H, $e];
	if ((truthy(rt.sv(f, "stat")) || !truthy(rt.sv(f, "client")))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "icon_state"), "parrot_fly")) {
		H = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(f.src), 1])), T("/mob/living/carbon/human"));
		while (($e = rt.next(f, 0)) !== undefined) {
			H = $e;
			if ((truthy((yield* g.callName(f, live(H), "has_buckled_mobs", []))) && rt.ge(rt.getLen(f, rt.fv(f, "buckled_mobs", live(H))), rt.fv(f, "max_buckled_mobs", live(H))))) {
				continue;
			}
			yield* g.srcCall(f, "perch_on_human", live(H));
			return live(f.dot);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is nobody nearby that you can sit on!</span>"]);
	} else {
		rt.setSv(f, "icon_state", "parrot_fly");
		rt.setSv(f, "parrot_state", 4);
		if (truthy(rt.sv(f, "buckled"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>You are no longer sitting on ＀'s shoulder.</span>", [rt.sv(f, "buckled")])]);
			yield* g.callName(f, rt.sv(f, "buckled"), "unbuckle_mob", [null, live(f.src), "force", 1], rt.Args.Named);
		}
		rt.setSv(f, "buckled", null);
		rt.setSv(f, "pixel_x", rt.initial(f, live(f.src), "pixel_x"));
		rt.setSv(f, "pixel_y", rt.initial(f, live(f.src), "pixel_y"));
	}
	return f.dot;
}, true, { verb: { name: "Sit on Human's Shoulder", category: "Parrot", desc: "Sit on a nice comfy human being!" } });

// /mob/living/simple_animal/parrot/proc/perch_on_human  (code/modules/mob/living/simple_animal/parrot.dm:837)  may sleep
rt.def("/mob/living/simple_animal/parrot/proc/perch_on_human", function* perch_on_human(f: Frame, H: Value) {
	f.vars = () => [H];
	if (!truthy(live(H))) {
		return live(f.dot);
	}
	rt.setSv(f, "loc", rt.getStep(f, live(H), 0));
	yield* g.callName(f, live(H), "buckle_mob", [null, live(f.src), "force", 1], rt.Args.Named);
	rt.setSv(f, "pixel_y", 9);
	rt.setSv(f, "pixel_x", rt.op(f, "PickUnweighted", [2], [-8, 8]));
	rt.setSv(f, "icon_state", "parrot_sit");
	rt.setSv(f, "parrot_state", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>You sit on ＀'s shoulder.</span>", [live(H)])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/parrot/proc/toggle_mode  (code/modules/mob/living/simple_animal/parrot.dm:853)
rt.def("/mob/living/simple_animal/parrot/proc/toggle_mode", function toggle_mode(f: Frame) {
	if ((truthy(rt.sv(f, "stat")) || !truthy(rt.sv(f, "client")))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "melee_damage_upper"))) {
		rt.setSv(f, "melee_damage_upper", 0);
		rt.setSv(f, "a_intent", "help");
	} else {
		rt.setSv(f, "melee_damage_upper", rt.sv(f, "parrot_damage_upper"));
		rt.setSv(f, "a_intent", "harm");
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("You will now ＀ others...", [rt.sv(f, "a_intent")])]);
	return live(f.dot);
}, false, { verb: { name: "Toggle mode", category: "Parrot", desc: "Time to bear those claws!" } });

rt.type(5075, "/mob/living/simple_animal/parrot/Poly", "/mob/living/simple_animal/parrot", {
	memory_saved: 0,
	rounds_survived: 0,
	longest_survival: 0,
	longest_deathstreak: 0,
	name: "Poly",
	desc: "Poly the Parrot. An expert on quantum cracker theory.",
	speak: null,
	gold_core_spawnable: 0,
	speak_chance: 3,
});

// /mob/living/simple_animal/parrot/Poly/proc/Initialize  (code/modules/mob/living/simple_animal/parrot.dm:880)  may sleep
rt.def("/mob/living/simple_animal/parrot/Poly/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "ears", (yield* g.new_(f, T("/obj/item/device/radio/headset/headset_eng"), [live(f.src)])));
	rt.setSv(f, "available_channels", rt.list(":e"));
	yield* g.srcCall(f, "Read_Memory");
	if (isEqual(rt.sv(f, "rounds_survived"), rt.sv(f, "longest_survival"))) {
		rt.modSrcVar(f, "speak", rt.op(f, "PickUnweighted", [4], [fmt("...＀.", [rt.sv(f, "longest_survival")]), "The things I've seen!", "I have lived many lives!", "What are you before me?"]), add);
		rt.modSrcVar(f, "desc", fmt(" Old as sin, and just as loud. Claimed to be ＀.", [rt.sv(f, "rounds_survived")]), add);
		rt.setSv(f, "speak_chance", 20);
		yield* g.srcCall(f, "add_atom_colour", "#EEEE22", 4);
	} else {
		if (isEqual(rt.sv(f, "rounds_survived"), rt.sv(f, "longest_deathstreak"))) {
			rt.modSrcVar(f, "speak", rt.op(f, "PickUnweighted", [4], ["What are you waiting for!", "Violence breeds violence!", "Blood! Blood!", "Strike me down if you dare!"]), add);
			rt.modSrcVar(f, "desc", fmt(" The squawks of ＀ dead parrots ring out in your ears...", [rt.neg(rt.sv(f, "rounds_survived"))]), add);
			yield* g.srcCall(f, "add_atom_colour", "#BB7777", 4);
		} else {
			if (rt.gt(rt.sv(f, "rounds_survived"), 0)) {
				rt.modSrcVar(f, "speak", rt.op(f, "PickUnweighted", [4], ["...again?", "No, It was over!", "Let me out!", "It never ends!"]), add);
				rt.modSrcVar(f, "desc", fmt(" Over ＀ shifts without a \"terrible\" \"accident\"!", [rt.sv(f, "rounds_survived")]), add);
			} else {
				rt.modSrcVar(f, "speak", rt.op(f, "PickUnweighted", [4], ["...alive?", "This isn't parrot heaven!", "I live, I die, I live again!", "The void fades!"]), add);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/parrot/Poly/proc/Life  (code/modules/mob/living/simple_animal/parrot.dm:901)
rt.def("/mob/living/simple_animal/parrot/Poly/proc/Life", function Life(f: Frame) {
	if (((!truthy(rt.sv(f, "stat")) && isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 4)) && !truthy(rt.sv(f, "memory_saved")))) {
		rt.setSv(f, "rounds_survived", rt.call(f, P("/proc/max"), null, [rt.incSrcVar(f, "rounds_survived", 1, false), 1]));
		if (rt.gt(rt.sv(f, "rounds_survived"), rt.sv(f, "longest_survival"))) {
			rt.setSv(f, "longest_survival", rt.sv(f, "rounds_survived"));
		}
		rt.callSrc(f, "Write_Memory", []);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/simple_animal/parrot/Poly/proc/death  (code/modules/mob/living/simple_animal/parrot.dm:909)  may sleep
rt.def("/mob/living/simple_animal/parrot/Poly/proc/death", function* death(f: Frame, gibbed: Value) {
	let go_ghost: Value = null, G: Value = null;
	f.vars = () => [gibbed, go_ghost, G];
	if (!truthy(rt.sv(f, "memory_saved"))) {
		go_ghost = 0;
		if (((isEqual(rt.sv(f, "rounds_survived"), rt.sv(f, "longest_survival")) || isEqual(rt.sv(f, "rounds_survived"), rt.sv(f, "longest_deathstreak"))) || truthy(rt.op(f, "Prob", [], [0.6660000085830688])))) {
			go_ghost = 1;
		}
		rt.setSv(f, "rounds_survived", (yield* g.call(f, P("/proc/min"), null, [rt.incSrcVar(f, "rounds_survived", -1, false), 0])));
		if (rt.lt(rt.sv(f, "rounds_survived"), rt.sv(f, "longest_deathstreak"))) {
			rt.setSv(f, "longest_deathstreak", rt.sv(f, "rounds_survived"));
		}
		yield* g.srcCall(f, "Write_Memory");
		if (truthy(live(go_ghost))) {
			G = (yield* g.new_(f, T("/mob/living/simple_animal/parrot/Poly/ghost"), [rt.sv(f, "loc")]));
			if (truthy(rt.sv(f, "mind"))) {
				yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(G)]);
			} else {
				rt.setFv(f, "key", live(G), rt.sv(f, "key"));
			}
		}
	}
	yield* g.callSuper(f, [live(gibbed)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/parrot/Poly/proc/Read_Memory  (code/modules/mob/living/simple_animal/parrot.dm:926)
rt.def("/mob/living/simple_animal/parrot/Poly/proc/Read_Memory", function Read_Memory(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setSv(f, "speech_buffer", rt.input(f, rt.R.index, null, [(S = rt.new_(f, T("/savefile"), ["data/npc_saves/Poly.sav"])), "phrases"]));
	rt.setSv(f, "rounds_survived", rt.input(f, rt.R.index, null, [live(S), "roundssurvived"]));
	rt.setSv(f, "longest_survival", rt.input(f, rt.R.index, null, [live(S), "longestsurvival"]));
	rt.setSv(f, "longest_deathstreak", rt.input(f, rt.R.index, null, [live(S), "longestdeathstreak"]));
	if (truthy((rt.istype(rt.sv(f, "speech_buffer"), T("/list")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "speech_buffer", rt.list());
	return f.dot;
});

// /mob/living/simple_animal/parrot/Poly/proc/Write_Memory  (code/modules/mob/living/simple_animal/parrot.dm:936)
rt.def("/mob/living/simple_animal/parrot/Poly/proc/Write_Memory", function Write_Memory(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	S = rt.new_(f, T("/savefile"), ["data/npc_saves/Poly.sav"]);
	if (truthy((rt.istype(rt.sv(f, "speech_buffer"), T("/list")) ? 1 : 0))) {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "phrases", rt.sv(f, "speech_buffer")], false);
	}
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "roundssurvived", rt.sv(f, "rounds_survived")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "longestsurvival", rt.sv(f, "longest_survival")], false);
	rt.op(f, "OutputReference", [rt.R.index], [live(S), "longestdeathstreak", rt.sv(f, "longest_deathstreak")], false);
	rt.setSv(f, "memory_saved", 1);
	return f.dot;
});

rt.type(5076, "/mob/living/simple_animal/parrot/Poly/ghost", "/mob/living/simple_animal/parrot/Poly", {
	name: "The Ghost of Poly",
	desc: "Doomed to squawk the earth.",
	color: "#FFFFFF77",
	speak_chance: 20,
	status_flags: 4096,
	incorporeal_move: 1,
	butcher_results: null,
});

// /mob/living/simple_animal/parrot/Poly/ghost/proc/<init>  (code/modules/mob/living/simple_animal/parrot.dm:951)
rt.def("/mob/living/simple_animal/parrot/Poly/ghost/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/ectoplasm"), 1]));
	return f.dot;
});

// /mob/living/simple_animal/parrot/Poly/ghost/proc/Initialize  (code/modules/mob/living/simple_animal/parrot.dm:955)  may sleep
rt.def("/mob/living/simple_animal/parrot/Poly/ghost/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "memory_saved", 1);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/parrot/Poly/ghost/proc/handle_automated_speech  (code/modules/mob/living/simple_animal/parrot.dm:958)
rt.def("/mob/living/simple_animal/parrot/Poly/ghost/proc/handle_automated_speech", function handle_automated_speech(f: Frame) {
	if (truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/simple_animal/parrot/Poly/ghost/proc/handle_automated_movement  (code/modules/mob/living/simple_animal/parrot.dm:963)  may sleep
rt.def("/mob/living/simple_animal/parrot/Poly/ghost/proc/handle_automated_movement", function* handle_automated_movement(f: Frame) {
	if (truthy((rt.istype(rt.sv(f, "parrot_interest"), T("/mob/living")) ? 1 : 0))) {
		if (!truthy((rt.istype(rt.sv(f, "parrot_interest"), T("/mob/living/carbon/human")) ? 1 : 0))) {
			rt.setSv(f, "parrot_interest", null);
		} else {
			if ((isEqual(rt.sv(f, "parrot_state"), 18) && truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "parrot_interest")))))) {
				yield* g.call(f, P("/proc/walk_to"), null, [live(f.src), rt.sv(f, "parrot_interest"), 0, rt.sv(f, "parrot_speed")]);
				yield* g.srcCall(f, "Possess", rt.sv(f, "parrot_interest"));
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/parrot/Poly/ghost/proc/Possess  (code/modules/mob/living/simple_animal/parrot.dm:972)  may sleep
rt.def("/mob/living/simple_animal/parrot/Poly/ghost/proc/Possess", function* Possess(f: Frame, H: Value) {
	let _P: Value = null;
	f.vars = () => [H, _P];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setFv(f, "parrot", (_P = (yield* g.new_(f, T("/datum/disease/parrot_possession"), []))), live(f.src));
	rt.setSv(f, "loc", live(H));
	yield* g.callName(f, live(H), "ContractDisease", [live(_P)]);
	rt.setSv(f, "parrot_interest", null);
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ dive bombs into ＀'s chest and vanishes!</span>", [live(f.src), live(H)]), fmt("<span class='userdanger'>＀ dive bombs into your chest, vanishing! This can't be good!</span>", [live(f.src)])]);
	return f.dot;
}, true);
