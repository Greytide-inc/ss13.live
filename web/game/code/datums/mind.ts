// From code/datums/mind.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(587, "/datum/mind", "/datum", {
	key: null,
	name: null,
	current: null,
	active: 0,
	memory: null,
	assigned_role: null,
	special_role: null,
	restricted_roles: null,
	assigned_job: null,
	objectives: null,
	spell_list: null,
	faction: null,
	changeling: null,
	linglink: null,
	martial_art: null,
	miming: 0,
	antag_datums: null,
	antag_hud_icon_state: null,
	antag_hud: null,
	gang_datum: null,
	damnation_type: 0,
	soulOwner: null,
	hasSoul: 1,
	isholy: 0,
	enslaved_to: null,
	language_holder: null,
}, { global: { default_martial_art: 636 } });

// /datum/mind/proc/<init>  (code/datums/mind.dm:42)
rt.def("/datum/mind/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "restricted_roles", rt.list());
	$0 = $0;
	rt.setSv(f, "objectives", rt.list());
	$0 = $0;
	rt.setSv(f, "spell_list", rt.list());
	return f.dot;
});

// /datum/mind/proc/New  (code/datums/mind.dm:70)
rt.def("/datum/mind/proc/New", function New(f: Frame, key: Value) {
	rt.setFv(f, "key", live(f.src), live(key));
	rt.setSv(f, "soulOwner", live(f.src));
	rt.setSv(f, "martial_art", rt.gl("default_martial_art"));
	return f.dot;
});

// /datum/mind/proc/Destroy  (code/datums/mind.dm:74)  may sleep
rt.def("/datum/mind/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null, antag_datum: Value = null;
	let $e: any;
	f.vars = () => [i, antag_datum, $e];
	(rt.modField(f, rt.gl("SSticker"), "minds", live(f.src), subtract));
	if (truthy((rt.istype(rt.sv(f, "antag_datums"), T("/list")) ? 1 : 0))) {
		i = null;
		rt.forList(f, 0, rt.sv(f, "antag_datums"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (truthy(rt.gv(f, "delete_on_death", (antag_datum = live(i))))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(i)]);
			}
		}
		rt.endFor(f, 0);
		rt.setSv(f, "antag_datums", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/mind/proc/get_language_holder  (code/datums/mind.dm:84)  may sleep
rt.def("/datum/mind/proc/get_language_holder", function* get_language_holder(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy(rt.sv(f, "language_holder"))) {
		rt.setSv(f, "language_holder", (yield* g.callName(f, (L = (yield* g.callName(f, rt.sv(f, "current"), "get_language_holder", ["shadow", 0], rt.Args.Named))), "copy", [live(f.src)])));
	}
	return rt.sv(f, "language_holder");
}, true);

// /datum/mind/proc/transfer_to  (code/datums/mind.dm:92)  may sleep
rt.def("/datum/mind/proc/transfer_to", function* transfer_to(f: Frame, new_character: Value, force_key_move: Value) {
	let mob_holder: Value = null, hud_to_transfer: Value = null, old_current: Value = null, a: Value = null, A: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [new_character, force_key_move, mob_holder, hud_to_transfer, old_current, a, A, C, $e];
	if (live(force_key_move) === null) {
		force_key_move = 0;
	}
	if (truthy(rt.sv(f, "current"))) {
		rt.setFv(f, "mind", rt.sv(f, "current"), null);
		yield* g.callName(f, rt.gl("SStgui"), "on_transfer", [rt.sv(f, "current"), live(new_character)]);
	}
	if (!truthy(rt.sv(f, "language_holder"))) {
		rt.setSv(f, "language_holder", (yield* g.callName(f, (mob_holder = (yield* g.callName(f, live(new_character), "get_language_holder", ["shadow", 0], rt.Args.Named))), "copy", [live(f.src)])));
	}
	if (truthy(rt.sv(f, "key"))) {
		if (!isEqual(rt.fv(f, "key", live(new_character)), rt.sv(f, "key"))) {
			yield* g.callName(f, live(new_character), "ghostize", [1]);
		}
	} else {
		rt.setSv(f, "key", rt.fv(f, "key", live(new_character)));
	}
	if (truthy(rt.fv(f, "mind", live(new_character)))) {
		rt.setFv(f, "current", rt.fv(f, "mind", live(new_character)), null);
	}
	hud_to_transfer = rt.sv(f, "antag_hud");
	old_current = rt.sv(f, "current");
	rt.setSv(f, "current", live(new_character));
	rt.setFv(f, "mind", live(new_character), live(f.src));
	a = null;
	rt.forList(f, 0, rt.sv(f, "antag_datums"));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		yield* g.callName(f, (A = live(a)), "on_body_transfer", [live(old_current), rt.sv(f, "current")]);
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype(live(new_character), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.setFv(f, "last_mind", (C = live(new_character)), live(f.src));
	}
	yield* g.srcCall(f, "transfer_antag_huds", live(hud_to_transfer));
	yield* g.srcCall(f, "transfer_actions", live(new_character));
	if (!(truthy(rt.sv(f, "active")) || truthy(live(force_key_move)))) return f.dot;
	rt.setFv(f, "key", live(new_character), rt.sv(f, "key"));
	return f.dot;
}, true);

// /datum/mind/proc/store_memory  (code/datums/mind.dm:125)
rt.def("/datum/mind/proc/store_memory", function store_memory(f: Frame, new_text: Value) {
	// tg_js, tg 0fa87b7bbd (2019): the notes keep the last ~100 messages' worth, older text drops off.
	if (rt.gt(add(rt.length(rt.sv(f, "memory")), rt.length(live(new_text))), 102400)) {
		rt.setSv(f, "memory", rt.call(f, P("/proc/copytext"), null, [rt.sv(f, "memory"), -102400]));
	}
	rt.modSrcVar(f, "memory", fmt("＀<BR>", [live(new_text)]), add);
	return f.dot;
});

// /datum/mind/proc/wipe_memory  (code/datums/mind.dm:128)
rt.def("/datum/mind/proc/wipe_memory", function wipe_memory(f: Frame) {
	rt.setSv(f, "memory", null);
	return f.dot;
});

// /datum/mind/proc/add_antag_datum  (code/datums/mind.dm:132)  may sleep
rt.def("/datum/mind/proc/add_antag_datum", function* add_antag_datum(f: Frame, datum_type: Value) {
	let A: Value = null;
	f.vars = () => [datum_type, A];
	if (!truthy(live(datum_type))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, (A = (yield* g.new_(f, live(datum_type), [live(f.src)]))), "can_be_owned", [live(f.src)])))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "antag_datums"))) {
		rt.setSv(f, "antag_datums", rt.list());
	}
	rt.modSrcVar(f, "antag_datums", live(A), add);
	yield* g.callName(f, live(A), "on_gain", []);
	return live(A);
}, true);

// /datum/mind/proc/remove_antag_datum  (code/datums/mind.dm:143)  may sleep
rt.def("/datum/mind/proc/remove_antag_datum", function* remove_antag_datum(f: Frame, datum_type: Value) {
	let A: Value = null;
	f.vars = () => [datum_type, A];
	if (!truthy(live(datum_type))) {
		return live(f.dot);
	}
	if (!truthy((A = (yield* g.srcCall(f, "has_antag_datum", live(datum_type)))))) return f.dot;
	yield* g.callName(f, live(A), "on_removal", []);
	return 1;
}, true);

// /datum/mind/proc/remove_all_antag_datums  (code/datums/mind.dm:152)  may sleep
rt.def("/datum/mind/proc/remove_all_antag_datums", function* remove_all_antag_datums(f: Frame) {
	let a: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [a, A, $e];
	a = null;
	rt.forList(f, 0, rt.sv(f, "antag_datums"));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		yield* g.callName(f, (A = live(a)), "on_removal", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/mind/proc/has_antag_datum  (code/datums/mind.dm:157)
rt.def("/datum/mind/proc/has_antag_datum", function has_antag_datum(f: Frame, datum_type: Value, check_subtypes: Value) {
	let a: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [check_subtypes, a, A, $e];
	if (live(check_subtypes) === null) {
		check_subtypes = 1;
	}
	if (!truthy(live(datum_type))) {
		return live(f.dot);
	}
	f.dot = 0;
	a = null;
	rt.forList(f, 0, rt.sv(f, "antag_datums"));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		A = live(a);
		if ((truthy(live(check_subtypes)) && truthy(rt.op(f, "IsType", [], [live(A), live(datum_type)])))) {
			return live(A);
		} else {
			if (isEqual(rt.fv(f, "type", live(A)), live(datum_type))) {
				return live(A);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/mind/proc/remove_objectives  (code/datums/mind.dm:173)  may sleep
rt.def("/datum/mind/proc/remove_objectives", function* remove_objectives(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	if (!truthy(rt.len(f, rt.sv(f, "objectives")))) return f.dot;
	O = null;
	rt.forList(f, 0, rt.sv(f, "objectives"), T("/datum/objective"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		(rt.modSrcVar(f, "objectives", live(O), subtract));
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/mind/proc/remove_changeling  (code/datums/mind.dm:179)  may sleep
rt.def("/datum/mind/proc/remove_changeling", function* remove_changeling(f: Frame) {
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "changelings", live(f.src), subtract));
		yield* g.callName(f, rt.sv(f, "current"), "remove_changeling_powers", []);
		if (truthy(rt.sv(f, "changeling"))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "changeling")]);
			rt.setSv(f, "changeling", null);
		}
	}
	rt.setSv(f, "special_role", null);
	yield* g.srcCall(f, "remove_antag_equip");
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_changeling_icons_removed", [live(f.src)]);
	return f.dot;
}, true);

// /datum/mind/proc/remove_traitor  (code/datums/mind.dm:190)  may sleep
rt.def("/datum/mind/proc/remove_traitor", function* remove_traitor(f: Frame) {
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		yield* g.callName(f, live(f.src), "remove_antag_datum", [T("/datum/antagonist/traitor")]);
	}
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_traitor_icons_removed", [live(f.src)]);
	return f.dot;
}, true);

// /datum/mind/proc/remove_nukeop  (code/datums/mind.dm:195)  may sleep
rt.def("/datum/mind/proc/remove_nukeop", function* remove_nukeop(f: Frame) {
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "syndicates", live(f.src), subtract));
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_synd_icons_removed", [live(f.src)]);
	}
	rt.setSv(f, "special_role", null);
	yield* g.srcCall(f, "remove_objectives");
	yield* g.srcCall(f, "remove_antag_equip");
	return f.dot;
}, true);

// /datum/mind/proc/remove_wizard  (code/datums/mind.dm:203)  may sleep
rt.def("/datum/mind/proc/remove_wizard", function* remove_wizard(f: Frame) {
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "wizards", live(f.src), subtract));
		yield* g.callName(f, rt.sv(f, "current"), "spellremove", [rt.sv(f, "current")]);
	}
	rt.setSv(f, "special_role", null);
	yield* g.srcCall(f, "remove_antag_equip");
	return f.dot;
}, true);

// /datum/mind/proc/remove_cultist  (code/datums/mind.dm:210)  may sleep
rt.def("/datum/mind/proc/remove_cultist", function* remove_cultist(f: Frame) {
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_cultist", [live(f.src), 0, 0]);
	}
	rt.setSv(f, "special_role", null);
	yield* g.srcCall(f, "remove_objectives");
	yield* g.srcCall(f, "remove_antag_equip");
	return f.dot;
}, true);

// /datum/mind/proc/remove_rev  (code/datums/mind.dm:217)  may sleep
rt.def("/datum/mind/proc/remove_rev", function* remove_rev(f: Frame) {
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "revolutionaries", live(f.src), subtract));
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_rev_icons_removed", [live(f.src)]);
	}
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "head_revolutionaries", live(f.src), subtract));
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_rev_icons_removed", [live(f.src)]);
	}
	rt.setSv(f, "special_role", null);
	yield* g.srcCall(f, "remove_objectives");
	yield* g.srcCall(f, "remove_antag_equip");
	return f.dot;
}, true);

// /datum/mind/proc/remove_gang  (code/datums/mind.dm:229)  may sleep
rt.def("/datum/mind/proc/remove_gang", function* remove_gang(f: Frame) {
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_gangster", [live(f.src), 0, 1, 1]);
	yield* g.srcCall(f, "remove_objectives");
	return f.dot;
}, true);

// /datum/mind/proc/remove_antag_equip  (code/datums/mind.dm:233)
rt.def("/datum/mind/proc/remove_antag_equip", function remove_antag_equip(f: Frame) {
	let Mob_Contents: Value = null, I: Value = null, _P: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [Mob_Contents, I, _P, R, $e];
	Mob_Contents = rt.callName(f, rt.sv(f, "current"), "get_contents", []);
	I = null;
	rt.forList(f, 0, live(Mob_Contents), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/device/pda")) ? 1 : 0))) {
			rt.setFv(f, "lock_code", (_P = live(I)), "");
		} else {
			if (truthy((rt.istype(live(I), T("/obj/item/device/radio")) ? 1 : 0))) {
				rt.setFv(f, "traitor_frequency", (R = live(I)), 0);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/mind/proc/remove_all_antag  (code/datums/mind.dm:244)  may sleep
rt.def("/datum/mind/proc/remove_all_antag", function* remove_all_antag(f: Frame) {
	yield* g.srcCall(f, "remove_changeling");
	yield* g.srcCall(f, "remove_traitor");
	yield* g.srcCall(f, "remove_nukeop");
	yield* g.srcCall(f, "remove_wizard");
	yield* g.srcCall(f, "remove_cultist");
	yield* g.srcCall(f, "remove_rev");
	yield* g.srcCall(f, "remove_gang");
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_changeling_icons_removed", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_traitor_icons_removed", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_wiz_icons_removed", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_cult_icons_removed", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_rev_icons_removed", [live(f.src)]);
	if (!truthy(rt.sv(f, "gang_datum"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "gang_datum"), "remove_gang_hud", [live(f.src)]);
	return f.dot;
}, true);

// /datum/mind/proc/equip_traitor  (code/datums/mind.dm:260)  may sleep
rt.def("/datum/mind/proc/equip_traitor", function* equip_traitor(f: Frame, employer: Value, silent: Value) {
	let traitor_mob: Value = null, all_contents: Value = null, PDA: Value = null, R: Value = null, _P: Value = null, uplink_loc: Value = null, U: Value = null;
	let $0: any;
	f.vars = () => [employer, silent, traitor_mob, all_contents, PDA, R, _P, uplink_loc, U, $0];
	if (live(employer) === null) {
		employer = "The Syndicate";
	}
	if (live(silent) === null) {
		silent = 0;
	}
	if (!truthy(rt.sv(f, "current"))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((traitor_mob = rt.sv(f, "current")), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	f.dot = 1;
	all_contents = (yield* g.callName(f, live(traitor_mob), "GetAllContents", []));
	PDA = rt.locateIn(f, T("/obj/item/device/pda"), live(all_contents));
	R = rt.locateIn(f, T("/obj/item/device/radio"), live(all_contents));
	_P = rt.locateIn(f, T("/obj/item/weapon/pen"), live(all_contents));
	uplink_loc = null;
	if ((truthy(rt.fv(f, "client", live(traitor_mob))) && truthy(rt.gv(f, "prefs", rt.fv(f, "client", live(traitor_mob)))))) {
		$0 = rt.gv(f, "uplink_spawn_loc", rt.gv(f, "prefs", rt.fv(f, "client", live(traitor_mob))));
		if ($0 === "PDA") {
			if (!truthy((uplink_loc = live(PDA)))) {
				uplink_loc = live(R);
			}
			if (!truthy(live(uplink_loc))) {
				uplink_loc = live(_P);
			}
		} else if ($0 === "Radio") {
			if (!truthy((uplink_loc = live(R)))) {
				uplink_loc = live(PDA);
			}
			if (!truthy(live(uplink_loc))) {
				uplink_loc = live(_P);
			}
		} else if ($0 === "Pen") {
			if (!truthy((uplink_loc = live(_P)))) {
				uplink_loc = live(PDA);
			}
			if (!truthy(live(uplink_loc))) {
				uplink_loc = live(R);
			}
		}
	}
	if (!truthy(live(uplink_loc))) {
		if (!truthy(live(silent))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(traitor_mob), fmt("Unfortunately, ＀ wasn't able to get you an Uplink.", [live(employer)])]);
		}
		f.dot = 0;
	} else {
		rt.setFv(f, "owner", (U = (yield* g.new_(f, T("/obj/item/device/uplink"), [live(uplink_loc)]))), fmt("＀", [rt.fv(f, "key", live(traitor_mob))]));
		rt.setFv(f, "hidden_uplink", live(uplink_loc), live(U));
		if (isEqual(live(uplink_loc), live(R))) {
			rt.setFv(f, "traitor_frequency", live(R), (yield* g.call(f, P("/proc/sanitize_frequency"), null, [(yield* g.call(f, P("/proc/rand"), null, [1441, 1489]))])));
			if (!truthy(live(silent))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(traitor_mob), fmt("＀ has cunningly disguised a Syndicate Uplink as your ＀. Simply dial the frequency ＀ to unlock its hidden features.", [live(employer), rt.fv(f, "name", live(R)), (yield* g.call(f, P("/proc/format_frequency"), null, [rt.fv(f, "traitor_frequency", live(R))]))])]);
			}
			yield* g.callName(f, rt.fv(f, "mind", live(traitor_mob)), "store_memory", [fmt("<B>Radio Frequency:</B> ＀ (＀).", [(yield* g.call(f, P("/proc/format_frequency"), null, [rt.fv(f, "traitor_frequency", live(R))])), rt.fv(f, "name", live(R))])]);
		} else {
			if (isEqual(live(uplink_loc), live(PDA))) {
				rt.setFv(f, "lock_code", live(PDA), fmt("＀ ＀", [(yield* g.call(f, P("/proc/rand"), null, [100, 999])), rt.op(f, "PickUnweighted", [26], ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"])]));
				if (!truthy(live(silent))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(traitor_mob), fmt("＀ has cunningly disguised a Syndicate Uplink as your ＀. Simply enter the code \"＀\" into the ringtone select to unlock its hidden features.", [live(employer), rt.fv(f, "name", live(PDA)), rt.fv(f, "lock_code", live(PDA))])]);
				}
				yield* g.callName(f, rt.fv(f, "mind", live(traitor_mob)), "store_memory", [fmt("<B>Uplink Passcode:</B> ＀ (＀).", [rt.fv(f, "lock_code", live(PDA)), rt.fv(f, "name", live(PDA))])]);
			} else {
				if (!isEqual(live(uplink_loc), live(_P))) return f.dot;
				rt.setFv(f, "traitor_unlock_degrees", live(_P), (yield* g.call(f, P("/proc/rand"), null, [1, 360])));
				if (!truthy(live(silent))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(traitor_mob), fmt("＀ has cunningly disguised a Syndicate Uplink as your ＀. Simply twist the top of the pen ＀ from its starting position to unlock its hidden features.", [live(employer), rt.fv(f, "name", live(_P)), rt.fv(f, "traitor_unlock_degrees", live(_P))])]);
				}
				yield* g.callName(f, rt.fv(f, "mind", live(traitor_mob)), "store_memory", [fmt("<B>Uplink Degrees:</B> ＀ (＀).", [rt.fv(f, "traitor_unlock_degrees", live(_P)), rt.fv(f, "name", live(_P))])]);
			}
		}
	}
	return f.dot;
}, true);

// /datum/mind/proc/enslave_mind_to_creator  (code/datums/mind.dm:324)  may sleep
rt.def("/datum/mind/proc/enslave_mind_to_creator", function* enslave_mind_to_creator(f: Frame, creator: Value) {
	f.vars = () => [creator];
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(creator)])))) {
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_cultist", [live(f.src)]);
	} else {
		if (truthy((yield* g.call(f, P("/proc/is_gangster"), null, [live(creator)])))) {
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_gangster", [live(f.src), rt.gv(f, "gang_datum", rt.fv(f, "mind", live(creator))), 1]);
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_revolutionary_in_general"), null, [live(creator)])))) {
				yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_revolutionary", [live(f.src)]);
			} else {
				if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(creator)])))) {
					yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [rt.sv(f, "current")]);
				} else {
					if (truthy((yield* g.call(f, P("/proc/is_nuclear_operative"), null, [live(creator)])))) {
						yield* g.srcCall(f, "make_Nuke", null, null, 0, 0);
					}
				}
			}
		}
	}
	rt.setSv(f, "enslaved_to", live(creator));
	(rt.modField(f, rt.sv(f, "current"), "faction", rt.fv(f, "faction", live(creator)), rt.bitOr));
	(rt.modField(f, live(creator), "faction", rt.fv(f, "faction", rt.sv(f, "current")), rt.bitOr));
	if (!truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(creator))))) return f.dot;
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been created by ＀, an antagonist.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "current")])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.sv(f, "current")]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.sv(f, "current")])]), fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(creator)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(creator)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(creator)])])])]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), fmt("<span class='userdanger'>Despite your creators current allegiances, your true master remains ＀. If their loyalities change, so do yours. This will never change unless your creator's body is destroyed.</span>", [rt.fv(f, "real_name", live(creator))])]);
	return f.dot;
}, true);

// /datum/mind/proc/show_memory  (code/datums/mind.dm:349)
rt.def("/datum/mind/proc/show_memory", function show_memory(f: Frame, recipient: Value, window: Value) {
	let output: Value = null, obj_count: Value = null, objective: Value = null;
	let $e: any, $t: any;
	f.vars = () => [recipient, window, output, obj_count, objective, $e, $t];
	if (live(window) === null) {
		window = 1;
	}
	if (!truthy(live(recipient))) {
		recipient = rt.sv(f, "current");
	}
	output = fmt("<B>＀'s Memories:</B><br>", [rt.fv(f, "real_name", rt.sv(f, "current"))]);
	output = rt.modify(live(output), rt.sv(f, "memory"), add);
	if (truthy(rt.len(f, rt.sv(f, "objectives")))) {
		output = rt.modify(live(output), "<B>Objectives:</B>", add);
		obj_count = 1;
		objective = null;
		rt.forList(f, 0, rt.sv(f, "objectives"), T("/datum/objective"));
		while (($e = rt.next(f, 0)) !== undefined) {
			objective = $e;
			output = rt.modify(live(output), fmt("<br><B>Objective #＀</B>: ＀", [($t = live(obj_count), obj_count = rt.inc($t, 1), $t), rt.fv(f, "explanation_text", live(objective))]), add);
		}
		rt.endFor(f, 0);
	}
	if (truthy(live(window))) {
		rt.op(f, "Browse", [], [live(recipient), live(output), "window=memory"], false);
	} else {
		if (!(truthy(rt.len(f, rt.sv(f, "objectives"))) || truthy(rt.sv(f, "memory")))) return f.dot;
		rt.call(f, P("/proc/to_chat"), null, [live(recipient), fmt("<i>＀</i>", [live(output)])]);
	}
	return f.dot;
});

// /datum/mind/proc/edit_memory  (code/datums/mind.dm:366)  may sleep
rt.def("/datum/mind/proc/edit_memory", function* edit_memory(f: Frame) {
	let out: Value = null, sections: Value = null, text: Value = null, L: Value = null, flash: Value = null, G: Value = null, L_4: Value = null, gangtool: Value = null, code: Value = null, bombue: Value = null, found: Value = null, D: Value = null, devilinfo: Value = null, ninjainfo: Value = null, robot: Value = null, ai: Value = null, n_e_robots: Value = null, R: Value = null, i: Value = null, U: Value = null, obj_count: Value = null, objective: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $e: any;
	f.vars = () => [out, sections, text, L, flash, G, L_4, gangtool, code, bombue, found, D, devilinfo, ninjainfo, robot, ai, n_e_robots, R, i, U, obj_count, objective, $0, $1, $2, $3, $4, $5, $6, $7, $8, $e];
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/alert"), null, ["Not before round-start!", "Alert"]);
		return live(f.dot);
	}
	$0 = rt.sv(f, "name");
	if ((truthy(rt.sv(f, "current")) && !isEqual(rt.fv(f, "real_name", rt.sv(f, "current")), rt.sv(f, "name")))) {
		$1 = fmt(" (as ＀)", [rt.fv(f, "real_name", rt.sv(f, "current"))]);
	} else {
		$1 = "";
	}
	out = fmt("<B>＀</B>＀<br>", [$0, $1]);
	$0 = rt.sv(f, "key");
	if (truthy(rt.sv(f, "active"))) {
		$1 = "(synced)";
	} else {
		$1 = "(not synced)";
	}
	out = rt.modify(live(out), fmt("Mind currently owned by key: ＀ ＀<br>", [$0, $1]), add);
	out = rt.modify(live(out), fmt("Assigned role: ＀. <a href='?src=＃;role_edit=1'>Edit</a><br>", [rt.sv(f, "assigned_role"), live(f.src)]), add);
	out = rt.modify(live(out), fmt("Faction and special role: <b><font color='red'>＀</font></b><br>", [rt.sv(f, "special_role")]), add);
	sections = rt.list("revolution", "gang", "cult", "wizard", "changeling", "nuclear", "traitor", "monkey", "clockcult", "devil", "ninja");
	text = "";
	if (truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		text = "revolution";
		if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "revolution")) {
			text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
		}
		text = fmt("<i><b>＀</b></i>: ", [live(text)]);
		if (truthy((rt.isIn(f, rt.sv(f, "assigned_role"), rt.gl("command_positions")) ? 1 : 0))) {
			text = rt.modify(live(text), "<b>HEAD</b>|loyal|employee|headrev|rev", add);
		} else {
			if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
				text = rt.modify(live(text), fmt("head|loyal|<a href='?src=＃;revolution=clear'>employee</a>|<b>HEADREV</b>|<a href='?src=＃;revolution=rev'>rev</a>", [live(f.src), live(f.src)]), add);
				text = rt.modify(live(text), fmt("<br>Flash: <a href='?src=＃;revolution=flash'>give</a>", [live(f.src)]), add);
				L = (yield* g.callName(f, rt.sv(f, "current"), "get_contents", []));
				if (truthy((flash = rt.locateIn(f, T("/obj/item/device/assembly/flash"), live(L))))) {
					if (!truthy(rt.fv(f, "crit_fail", live(flash)))) {
						text = rt.modify(live(text), fmt("|<a href='?src=＃;revolution=takeflash'>take</a>.", [live(f.src)]), add);
					} else {
						text = rt.modify(live(text), fmt("|<a href='?src=＃;revolution=takeflash'>take</a>|<a href='?src=＃;revolution=repairflash'>repair</a>.", [live(f.src), live(f.src)]), add);
					}
				} else {
					text = rt.modify(live(text), ".", add);
				}
				text = rt.modify(live(text), fmt(" <a href='?src=＃;revolution=reequip'>Reequip</a> (gives traitor uplink).", [live(f.src)]), add);
				if (isEqual(rt.len(f, rt.sv(f, "objectives")), 0)) {
					text = rt.modify(live(text), fmt("<br>Objectives are empty! <a href='?src=＃;revolution=autoobjectives'>Set to kill all heads</a>.", [live(f.src)]), add);
				}
			} else {
				if (truthy((yield* g.callName(f, rt.sv(f, "current"), "isloyal", [])))) {
					text = rt.modify(live(text), fmt("head|<b>LOYAL</b>|employee|<a href='?src=＃;revolution=headrev'>headrev</a>|rev", [live(f.src)]), add);
				} else {
					if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
						text = rt.modify(live(text), fmt("head|loyal|<a href='?src=＃;revolution=clear'>employee</a>|<a href='?src=＃;revolution=headrev'>headrev</a>|<b>REV</b>", [live(f.src), live(f.src)]), add);
					} else {
						text = rt.modify(live(text), fmt("head|loyal|<b>EMPLOYEE</b>|<a href='?src=＃;revolution=headrev'>headrev</a>|<a href='?src=＃;revolution=rev'>rev</a>", [live(f.src), live(f.src)]), add);
					}
				}
			}
		}
		if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "revolutionary", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
			text = rt.modify(live(text), "|Enabled in Prefs", add);
		} else {
			text = rt.modify(live(text), "|Disabled in Prefs", add);
		}
		rt.setAt(live(sections), "revolution", live(text));
		text = "gang";
		if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "gang")) {
			text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
		}
		text = fmt("<i><b>＀</b></i>: ", [live(text)]);
		if (truthy((yield* g.callName(f, rt.sv(f, "current"), "isloyal", [])))) {
			$0 = "<B>LOYAL</B>";
		} else {
			$0 = "loyal";
		}
		text = rt.modify(live(text), fmt("＀|", [$0]), add);
		if (truthy((rt.isIn(f, live(f.src), (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_all_gangsters", []))) ? 1 : 0))) {
			text = rt.modify(live(text), fmt("<a href='?src=＃;gang=clear'>none</a>", [live(f.src)]), add);
		} else {
			text = rt.modify(live(text), "<B>NONE</B>", add);
		}
		if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "gangster", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
			text = rt.modify(live(text), "|Enabled in Prefs<BR>", add);
		} else {
			text = rt.modify(live(text), "|Disabled in Prefs<BR>", add);
		}
		G = null;
		rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			text = rt.modify(live(text), fmt("<i>＀</i>: ", [rt.fv(f, "name", live(G))]), add);
			if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "gangsters", live(G))) ? 1 : 0))) {
				text = rt.modify(live(text), "<B>GANGSTER</B>", add);
			} else {
				text = rt.modify(live(text), fmt("<a href='?src=＃;gangster=＃'>gangster</a>", [live(f.src), live(G)]), add);
			}
			text = rt.modify(live(text), "|", add);
			if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "bosses", live(G))) ? 1 : 0))) {
				text = rt.modify(live(text), "<B>GANG LEADER</B>", add);
				text = rt.modify(live(text), fmt("|Equipment: <a href='?src=＃;gang=equip'>give</a>", [live(f.src)]), add);
				L_4 = (yield* g.callName(f, rt.sv(f, "current"), "get_contents", []));
				if (truthy((gangtool = rt.locateIn(f, T("/obj/item/device/gangtool"), live(L_4))))) {
					text = rt.modify(live(text), fmt("|<a href='?src=＃;gang=takeequip'>take</a>", [live(f.src)]), add);
				}
			} else {
				text = rt.modify(live(text), fmt("<a href='?src=＃;gangboss=＃'>gang leader</a>", [live(f.src), live(G)]), add);
			}
			text = rt.modify(live(text), "<BR>", add);
		}
		rt.endFor(f, 0);
		if (truthy(rt.len(f, rt.gl("gang_colors_pool")))) {
			text = rt.modify(live(text), fmt("<a href='?src=＃;gang=new'>Create New Gang</a>", [live(f.src)]), add);
		}
		rt.setAt(live(sections), "gang", live(text));
		text = "Abductor";
		if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "abductor")) {
			text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
		}
		text = fmt("<i><b>＀</b></i>: ", [live(text)]);
		if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "abductors", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
			text = rt.modify(live(text), fmt("<b>Abductor</b>|<a href='?src=＃;abductor=clear'>human</a>", [live(f.src)]), add);
			text = rt.modify(live(text), fmt("|<a href='?src=＃;common=undress'>undress</a>|<a href='?src=＃;abductor=equip'>equip</a>", [live(f.src), live(f.src)]), add);
		} else {
			text = rt.modify(live(text), fmt("<a href='?src=＃;abductor=abductor'>Abductor</a>|<b>human</b>", [live(f.src)]), add);
		}
		if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "abductor", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
			text = rt.modify(live(text), "|Enabled in Prefs", add);
		} else {
			text = rt.modify(live(text), "|Disabled in Prefs", add);
		}
		rt.setAt(live(sections), "abductor", live(text));
		text = "nuclear";
		if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "nuclear")) {
			text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
		}
		text = fmt("<i><b>＀</b></i>: ", [live(text)]);
		if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
			text = rt.modify(live(text), fmt("<b>OPERATIVE</b>|<a href='?src=＃;nuclear=clear'>nanotrasen</a>", [live(f.src)]), add);
			text = rt.modify(live(text), fmt("<br><a href='?src=＃;nuclear=lair'>To shuttle</a>, <a href='?src=＃;common=undress'>undress</a>, <a href='?src=＃;nuclear=dressup'>dress up</a>.", [live(f.src), live(f.src), live(f.src)]), add);
			code = null;
			bombue = null;
			rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/nuclearbomb"));
			while (($e = rt.next(f, 0)) !== undefined) {
				bombue = $e;
				if (((rt.le(rt.length(rt.fv(f, "r_code", live(bombue))), 5) && !isEqual(rt.fv(f, "r_code", live(bombue)), "LOLNO")) && !isEqual(rt.fv(f, "r_code", live(bombue)), "ADMIN"))) {
					code = rt.fv(f, "r_code", live(bombue));
					break;
				}
			}
			rt.endFor(f, 0);
			if (truthy(live(code))) {
				text = rt.modify(live(text), fmt(" Code is ＀. <a href='?src=＃;nuclear=tellcode'>tell the code.</a>", [live(code), live(f.src)]), add);
			}
		} else {
			text = rt.modify(live(text), fmt("<a href='?src=＃;nuclear=nuclear'>operative</a>|<b>NANOTRASEN</b>", [live(f.src)]), add);
		}
		if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "operative", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
			text = rt.modify(live(text), "|Enabled in Prefs", add);
		} else {
			text = rt.modify(live(text), "|Disabled in Prefs", add);
		}
		rt.setAt(live(sections), "nuclear", live(text));
		text = "wizard";
		if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "wizard")) {
			text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
		}
		text = fmt("<i><b>＀</b></i>: ", [live(text)]);
		if ((truthy((rt.isIn(f, live(f.src), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)) || truthy((rt.isIn(f, live(f.src), rt.gv(f, "apprentices", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)))) {
			text = rt.modify(live(text), fmt("<b>YES</b>|<a href='?src=＃;wizard=clear'>no</a>", [live(f.src)]), add);
			text = rt.modify(live(text), fmt("<br><a href='?src=＃;wizard=lair'>To lair</a>, <a href='?src=＃;common=undress'>undress</a>, <a href='?src=＃;wizard=dressup'>dress up</a>, <a href='?src=＃;wizard=name'>let choose name</a>.", [live(f.src), live(f.src), live(f.src), live(f.src)]), add);
			if (isEqual(rt.len(f, rt.sv(f, "objectives")), 0)) {
				text = rt.modify(live(text), fmt("<br>Objectives are empty! <a href='?src=＃;wizard=autoobjectives'>Randomize!</a>", [live(f.src)]), add);
			}
		} else {
			text = rt.modify(live(text), fmt("<a href='?src=＃;wizard=wizard'>yes</a>|<b>NO</b>", [live(f.src)]), add);
		}
		if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "wizard", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
			text = rt.modify(live(text), "|Enabled in Prefs", add);
		} else {
			text = rt.modify(live(text), "|Disabled in Prefs", add);
		}
		rt.setAt(live(sections), "wizard", live(text));
	}
	text = "cult";
	if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "cult")) {
		text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
	}
	text = fmt("<i><b>＀</b></i>: ", [live(text)]);
	if (truthy((yield* g.call(f, P("/proc/iscultist"), null, [rt.sv(f, "current")])))) {
		text = rt.modify(live(text), fmt("loyal|<a href='?src=＃;cult=clear'>employee</a>|<b>CULTIST</b>", [live(f.src)]), add);
		text = rt.modify(live(text), fmt("<br>Give <a href='?src=＃;cult=tome'>tome</a>|<a href='?src=＃;cult=amulet'>amulet</a>.", [live(f.src), live(f.src)]), add);
	} else {
		if (truthy((yield* g.callName(f, rt.sv(f, "current"), "isloyal", [])))) {
			text = rt.modify(live(text), fmt("<b>LOYAL</b>|employee|<a href='?src=＃;cult=cultist'>cultist</a>", [live(f.src)]), add);
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_convertable_to_cult"), null, [rt.sv(f, "current")])))) {
				text = rt.modify(live(text), fmt("loyal|<b>EMPLOYEE</b>|<a href='?src=＃;cult=cultist'>cultist</a>", [live(f.src)]), add);
			} else {
				text = rt.modify(live(text), "loyal|<b>EMPLOYEE</b>|<i>cannot serve Nar-Sie</i>", add);
			}
		}
	}
	if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "cultist", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
		text = rt.modify(live(text), "|Enabled in Prefs", add);
	} else {
		text = rt.modify(live(text), "|Disabled in Prefs", add);
	}
	rt.setAt(live(sections), "cult", live(text));
	text = "clockwork cult";
	if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "clockwork cult")) {
		text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
	}
	text = fmt("<i><b>＀</b></i>: ", [live(text)]);
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "current")])))) {
		text = rt.modify(live(text), fmt("loyal|<a href='?src=＃;clockcult=clear'>employee</a>|<b>SERVANT</b>", [live(f.src)]), add);
		text = rt.modify(live(text), fmt("<br><a href='?src=＃;clockcult=slab'>Give slab</a>", [live(f.src)]), add);
	} else {
		if (truthy((yield* g.callName(f, rt.sv(f, "current"), "isloyal", [])))) {
			text = rt.modify(live(text), fmt("<b>LOYAL</b>|employee|<a href='?src=＃;clockcult=servant'>servant</a>", [live(f.src)]), add);
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_eligible_servant"), null, [rt.sv(f, "current")])))) {
				text = rt.modify(live(text), fmt("loyal|<b>EMPLOYEE</b>|<a href='?src=＃;clockcult=servant'>servant</a>", [live(f.src)]), add);
			} else {
				text = rt.modify(live(text), "loyal|<b>EMPLOYEE</b>|<i>cannot serve Ratvar</i>", add);
			}
		}
	}
	if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "servant of Ratvar", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
		text = rt.modify(live(text), "|Enabled in Prefs", add);
	} else {
		text = rt.modify(live(text), "|Disabled in Prefs", add);
	}
	rt.setAt(live(sections), "clockcult", live(text));
	text = "traitor";
	if ((isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "traitor") || isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "traitorchan"))) {
		text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
	}
	text = fmt("<i><b>＀</b></i>: ", [live(text)]);
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		text = rt.modify(live(text), fmt("<b>TRAITOR</b>|<a href='?src=＃;traitor=clear'>loyal</a>", [live(f.src)]), add);
		if (isEqual(rt.len(f, rt.sv(f, "objectives")), 0)) {
			text = rt.modify(live(text), fmt("<br>Objectives are empty! <a href='?src=＃;traitor=autoobjectives'>Randomize</a>!", [live(f.src)]), add);
		}
	} else {
		text = rt.modify(live(text), fmt("<a href='?src=＃;traitor=traitor'>traitor</a>|<b>LOYAL</b>", [live(f.src)]), add);
	}
	if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "traitor", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
		text = rt.modify(live(text), "|Enabled in Prefs", add);
	} else {
		text = rt.modify(live(text), "|Disabled in Prefs", add);
	}
	rt.setAt(live(sections), "traitor", live(text));
	if ((truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
		text = "changeling";
		if ((isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "changeling") || isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "traitorchan"))) {
			text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
		}
		text = fmt("<i><b>＀</b></i>: ", [live(text)]);
		if ((truthy((rt.isIn(f, live(f.src), rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)) && truthy(rt.sv(f, "special_role")))) {
			text = rt.modify(live(text), fmt("<b>YES</b>|<a href='?src=＃;changeling=clear'>no</a>", [live(f.src)]), add);
			if (isEqual(rt.len(f, rt.sv(f, "objectives")), 0)) {
				text = rt.modify(live(text), fmt("<br>Objectives are empty! <a href='?src=＃;changeling=autoobjectives'>Randomize!</a>", [live(f.src)]), add);
			}
			if (((truthy(rt.sv(f, "changeling")) && truthy(rt.getLen(f, rt.fv(f, "stored_profiles", rt.sv(f, "changeling"))))) && !isEqual(rt.fv(f, "real_name", rt.sv(f, "current")), rt.gv(f, "name", rt.fv(f, "first_prof", rt.sv(f, "changeling")))))) {
				text = rt.modify(live(text), fmt("<br><a href='?src=＃;changeling=initialdna'>Transform to initial appearance.</a>", [live(f.src)]), add);
			}
		} else {
			if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
				text = rt.modify(live(text), fmt("<b>YES (but not an antag)</b>|<a href='?src=＃;changeling=clear'>no</a>", [live(f.src)]), add);
				if (isEqual(rt.len(f, rt.sv(f, "objectives")), 0)) {
					text = rt.modify(live(text), fmt("<br>Objectives are empty! <a href='?src=＃;changeling=autoobjectives'>Randomize!</a>", [live(f.src)]), add);
				}
				if (((truthy(rt.sv(f, "changeling")) && truthy(rt.getLen(f, rt.fv(f, "stored_profiles", rt.sv(f, "changeling"))))) && !isEqual(rt.fv(f, "real_name", rt.sv(f, "current")), rt.gv(f, "name", rt.fv(f, "first_prof", rt.sv(f, "changeling")))))) {
					text = rt.modify(live(text), fmt("<br><a href='?src=＃;changeling=initialdna'>Transform to initial appearance.</a>", [live(f.src)]), add);
				}
			} else {
				text = rt.modify(live(text), fmt("<a href='?src=＃;changeling=changeling'>yes</a>|<b>NO</b>", [live(f.src)]), add);
			}
		}
		if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "changeling", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
			text = rt.modify(live(text), "|Enabled in Prefs", add);
		} else {
			text = rt.modify(live(text), "|Disabled in Prefs", add);
		}
		rt.setAt(live(sections), "changeling", live(text));
		text = "monkey";
		if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "monkey")) {
			text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
		}
		text = fmt("<i><b>＀</b></i>: ", [live(text)]);
		if (truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0))) {
			text = rt.modify(live(text), fmt("<a href='?src=＃;monkey=healthy'>healthy</a>|<a href='?src=＃;monkey=infected'>infected</a>|<b>HUMAN</b>|other", [live(f.src), live(f.src)]), add);
		} else {
			if (truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
				found = 0;
				D = null;
				rt.forList(f, 0, rt.fv(f, "viruses", rt.sv(f, "current")), T("/datum/disease"));
				while (($e = rt.next(f, 0)) !== undefined) {
					D = $e;
					if (truthy((rt.istype(live(D), T("/datum/disease/transformation/jungle_fever")) ? 1 : 0))) {
						found = 1;
					}
				}
				rt.endFor(f, 0);
				if (truthy(live(found))) {
					text = rt.modify(live(text), fmt("<a href='?src=＃;monkey=healthy'>healthy</a>|<b>INFECTED</b>|<a href='?src=＃;monkey=human'>human</a>|other", [live(f.src), live(f.src)]), add);
				} else {
					text = rt.modify(live(text), fmt("<b>HEALTHY</b>|<a href='?src=＃;monkey=infected'>infected</a>|<a href='?src=＃;monkey=human'>human</a>|other", [live(f.src), live(f.src)]), add);
				}
			} else {
				text = rt.modify(live(text), "healthy|infected|human|<b>OTHER</b>", add);
			}
		}
		if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "monkey", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
			text = rt.modify(live(text), "|Enabled in Prefs", add);
		} else {
			text = rt.modify(live(text), "|Disabled in Prefs", add);
		}
		rt.setAt(live(sections), "monkey", live(text));
	}
	text = "devil";
	if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "devil")) {
		text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
	}
	text = fmt("<i><b>＀</b></i>: ", [live(text)]);
	if (truthy((devilinfo = (yield* g.srcCall(f, "has_antag_datum", T("/datum/antagonist/devil")))))) {
		if (!truthy(rt.fv(f, "ascendable", live(devilinfo)))) {
			text = rt.modify(live(text), fmt("<b>DEVIL</b>|<a href='?src=＃;devil=ascendable_devil'>Ascendable Devil</a>|sintouched|<a href='?src=＃;devil=clear'>human</a>", [live(f.src), live(f.src)]), add);
		} else {
			text = rt.modify(live(text), fmt("<a href='?src=＃;devil=devil'>DEVIL</a>|<b>ASCENDABLE DEVIL</b>|sintouched|<a href='?src=＃;devil=clear'>human</a>", [live(f.src), live(f.src)]), add);
		}
	} else {
		if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "sintouched", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
			text = rt.modify(live(text), fmt("devil|Ascendable Devil|<b>SINTOUCHED</b>|<a href='?src=＃;devil=clear'>human</a>", [live(f.src)]), add);
		} else {
			text = rt.modify(live(text), fmt("<a href='?src=＃;devil=devil'>devil</a>|<a href='?src=＃;devil=ascendable_devil'>Ascendable Devil</a>|<a href='?src=＃;devil=sintouched'>sintouched</a>|<b>HUMAN</b>", [live(f.src), live(f.src), live(f.src)]), add);
		}
	}
	if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "devil", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
		text = rt.modify(live(text), "|Enabled in Prefs", add);
	} else {
		text = rt.modify(live(text), "|Disabled in Prefs", add);
	}
	rt.setAt(live(sections), "devil", live(text));
	text = "ninja";
	if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "ninja")) {
		text = (yield* g.call(f, P("/proc/uppertext"), null, [live(text)]));
	}
	text = fmt("<i><b>＀</b></i>: ", [live(text)]);
	if (truthy((ninjainfo = (yield* g.srcCall(f, "has_antag_datum", T("/datum/antagonist/ninja")))))) {
		if (truthy(rt.fv(f, "helping_station", live(ninjainfo)))) {
			text = rt.modify(live(text), fmt("<a href='?src=＃;ninja=clear'>employee</a> | syndicate | <b>NANOTRASEN</b> | <b><a href='?src=＃;ninja=equip'>EQUIP</a></b>", [live(f.src), live(f.src)]), add);
		} else {
			text = rt.modify(live(text), fmt("<a href='?src=＃;ninja=clear'>employee</a> | <b>SYNDICATE</b> | nanotrasen | <b><a href='?src=＃;ninja=equip'>EQUIP</a></b>", [live(f.src), live(f.src)]), add);
		}
	} else {
		text = rt.modify(live(text), fmt("<b>EMPLOYEE</b> | <a href='?src=＃;ninja=syndicate'>syndicate</a> | <a href='?src=＃;ninja=nanotrasen'>nanotrasen</a> | <a href='?src=＃;ninja=random'>random allegiance</a>", [live(f.src), live(f.src), live(f.src)]), add);
	}
	if (((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "client", rt.sv(f, "current")))) && truthy((rt.isIn(f, "space ninja", rt.gv(f, "be_special", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "current"))))) ? 1 : 0)))) {
		text = rt.modify(live(text), " | Enabled in Prefs", add);
	} else {
		text = rt.modify(live(text), " | Disabled in Prefs", add);
	}
	rt.setAt(live(sections), "ninja", live(text));
	if (truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/silicon")) ? 1 : 0))) {
		text = "silicon";
		if ((truthy((rt.istype((robot = rt.sv(f, "current")), T("/mob/living/silicon/robot")) ? 1 : 0)) && truthy(rt.fv(f, "emagged", live(robot))))) {
			text = rt.modify(live(text), fmt("<br>Cyborg: Is emagged! <a href='?src=＃;silicon=unemag'>Unemag!</a><br>0th law: ＀", [live(f.src), rt.gv(f, "zeroth", rt.fv(f, "laws", live(robot)))]), add);
		}
		if ((truthy((rt.istype((ai = rt.sv(f, "current")), T("/mob/living/silicon/ai")) ? 1 : 0)) && truthy(rt.getLen(f, rt.fv(f, "connected_robots", live(ai)))))) {
			n_e_robots = 0;
			R = null;
			rt.forList(f, 0, rt.fv(f, "connected_robots", live(ai)), T("/mob/living/silicon/robot"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				if (truthy(rt.fv(f, "emagged", live(R)))) {
					n_e_robots = rt.inc(live(n_e_robots), 1);
				}
			}
			rt.endFor(f, 0);
			text = rt.modify(live(text), fmt("<br>＀ of ＀ slaved cyborgs are emagged. <a href='?src=＃;silicon=unemagcyborgs'>Unemag</a>", [live(n_e_robots), rt.getLen(f, rt.fv(f, "connected_robots", live(ai))), live(f.src)]), add);
		}
	}
	if (isEqual(rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), "traitorchan")) {
		if (truthy(rt.at(live(sections), "traitor"))) {
			out = rt.modify(live(out), add(rt.at(live(sections), "traitor"), "<br>"), add);
		}
		if (truthy(rt.at(live(sections), "changeling"))) {
			out = rt.modify(live(out), add(rt.at(live(sections), "changeling"), "<br><br>"), add);
		}
		(sections = rt.modify(live(sections), "traitor", subtract));
		(sections = rt.modify(live(sections), "changeling", subtract));
	} else {
		if (truthy(rt.index(live(sections), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))))) {
			out = rt.modify(live(out), add(rt.index(live(sections), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker")))), "<br><br>"), add);
		}
		(sections = rt.modify(live(sections), rt.gv(f, "config_tag", rt.fv(f, "mode", rt.gl("SSticker"))), subtract));
	}
	i = null;
	rt.forList(f, 0, live(sections));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(rt.index(live(sections), live(i)))) {
			out = rt.modify(live(out), add(rt.index(live(sections), live(i)), "<br>"), add);
		}
	}
	rt.endFor(f, 0);
	if ((((truthy((rt.isIn(f, live(f.src), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)) || truthy((rt.isIn(f, live(f.src), rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) || truthy((rt.isIn(f, live(f.src), rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) && truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		text = fmt("Uplink: <a href='?src=＃;common=uplink'>give</a>", [live(f.src)]);
		if (truthy((U = (yield* g.srcCall(f, "find_syndicate_uplink"))))) {
			text = rt.modify(live(text), fmt("|<a href='?src=＃;common=takeuplink'>take</a>", [live(f.src)]), add);
			if (truthy((yield* g.call(f, P("/proc/check_rights"), null, [8, 0])))) {
				text = rt.modify(live(text), fmt(", <a href='?src=＃;common=crystals'>＀</a> TC", [live(f.src), rt.fv(f, "telecrystals", live(U))]), add);
			} else {
				text = rt.modify(live(text), fmt(", ＀ TC", [rt.fv(f, "telecrystals", live(U))]), add);
			}
		}
		out = rt.modify(live(out), (text = rt.modify(live(text), ".", add)), add);
	}
	out = rt.modify(live(out), "<br><br>", add);
	out = rt.modify(live(out), "<b>Memory:</b><br>", add);
	out = rt.modify(live(out), rt.sv(f, "memory"), add);
	out = rt.modify(live(out), fmt("<br><a href='?src=＃;memory_edit=1'>Edit memory</a><br>", [live(f.src)]), add);
	out = rt.modify(live(out), "Objectives:<br>", add);
	if (isEqual(rt.len(f, rt.sv(f, "objectives")), 0)) {
		out = rt.modify(live(out), "EMPTY<br>", add);
	} else {
		obj_count = 1;
		objective = null;
		rt.forList(f, 0, rt.sv(f, "objectives"), T("/datum/objective"));
		while (($e = rt.next(f, 0)) !== undefined) {
			objective = $e;
			$0 = live(obj_count);
			$1 = rt.fv(f, "explanation_text", live(objective));
			$2 = live(f.src);
			$3 = live(objective);
			$4 = live(f.src);
			$5 = live(objective);
			$6 = live(f.src);
			$7 = live(objective);
			if (truthy(rt.fv(f, "completed", live(objective)))) {
				$8 = "green";
			} else {
				$8 = "red";
			}
			out = rt.modify(live(out), fmt("<B>＀</B>: ＀ <a href='?src=＃;obj_edit=＃'>Edit</a> <a href='?src=＃;obj_delete=＃'>Delete</a> <a href='?src=＃;obj_completed=＃'><font color=＀>Toggle Completion</font></a><br>", [$0, $1, $2, $3, $4, $5, $6, $7, $8]), add);
			obj_count = rt.inc(live(obj_count), 1);
		}
		rt.endFor(f, 0);
	}
	out = rt.modify(live(out), fmt("<a href='?src=＃;obj_add=1'>Add objective</a><br><br>", [live(f.src)]), add);
	out = rt.modify(live(out), fmt("<a href='?src=＃;obj_announce=1'>Announce objectives</a><br><br>", [live(f.src)]), add);
	rt.op(f, "Browse", [], [live(f.usr), live(out), fmt("window=edit_memory＀;size=500x600", [live(f.src)])], false);
	return f.dot;
}, true);

// /datum/mind/proc/Topic  (code/datums/mind.dm:757)  may sleep
rt.def("/datum/mind/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let new_role: Value = null, new_memo: Value = null, objective: Value = null, objective_pos: Value = null, def_value: Value = null, temp_obj_type: Value = null, new_obj_type: Value = null, new_objective: Value = null, possible_targets: Value = null, possible_target: Value = null, def_target: Value = null, objective_list: Value = null, new_target: Value = null, objective_path: Value = null, new_target_6: Value = null, steal: Value = null, def_num: Value = null, target_number: Value = null, expl: Value = null, valid_head: Value = null, O: Value = null, rev_obj: Value = null, L: Value = null, flash: Value = null, pen: Value = null, gangtool: Value = null, SC: Value = null, names: Value = null, gangname: Value = null, newgang: Value = null, G: Value = null, C: Value = null, H: Value = null, code: Value = null, bombue: Value = null, traitordatum: Value = null, devilinfo: Value = null, H_1: Value = null, ninjainfo: Value = null, gear: Value = null, M: Value = null, D: Value = null, R: Value = null, ai: Value = null, R_1: Value = null, W: Value = null, U: Value = null, crystals: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [href, href_list, new_role, new_memo, objective, objective_pos, def_value, temp_obj_type, new_obj_type, new_objective, possible_targets, possible_target, def_target, objective_list, new_target, objective_path, new_target_6, steal, def_num, target_number, expl, valid_head, O, rev_obj, L, flash, pen, gangtool, SC, names, gangname, newgang, G, C, H, code, bombue, traitordatum, devilinfo, H_1, ninjainfo, gear, M, D, R, ai, R_1, W, U, crystals, $0, $1, $2, $3, $e];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(href_list), "role_edit"))) {
		if (!truthy((new_role = (yield* g.op(f, "Prompt", [1], [null, rt.sv(f, "assigned_role"), "Assigned role", "Select new role", (yield* g.call(f, P("/proc/get_all_jobs"), null, []))]))))) {
			return live(f.dot);
		}
		rt.setSv(f, "assigned_role", live(new_role));
	} else {
		if (truthy(rt.at(live(href_list), "memory_edit"))) {
			if ((new_memo = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [65], [null, rt.sv(f, "memory"), "Memory", "Write new memory", null]))])), 1, 1024]))) === null) {
				return live(f.dot);
			}
			rt.setSv(f, "memory", live(new_memo));
		} else {
			if ((truthy(rt.at(live(href_list), "obj_edit")) || truthy(rt.at(live(href_list), "obj_add")))) {
				objective = null;
				objective_pos = null;
				def_value = null;
				if (truthy(rt.at(live(href_list), "obj_edit"))) {
					if (!truthy((objective = rt.locateIn(f, rt.at(live(href_list), "obj_edit"), rt.world())))) {
						return live(f.dot);
					}
					objective_pos = (yield* g.callName(f, rt.sv(f, "objectives"), "Find", [live(objective)]));
					if (!truthy((def_value = (yield* g.call(f, P("/proc/copytext"), null, [(temp_obj_type = fmt("＀", [rt.fv(f, "type", live(objective))])), 19]))))) {
						def_value = "custom";
					}
				}
				if (!truthy((new_obj_type = (yield* g.op(f, "Prompt", [1], [null, live(def_value), "Objective type", "Select objective type:", rt.list("assassinate", "maroon", "debrain", "protect", "destroy", "prevent", "hijack", "escape", "survive", "martyr", "steal", "download", "nuclear", "capture", "absorb", "custom")]))))) {
					return live(f.dot);
				}
				new_objective = null;
				$0 = live(new_obj_type);
				if ($0 === "assassinate" || $0 === "protect" || $0 === "debrain" || $0 === "maroon") {
					possible_targets = rt.list("Free objective");
					possible_target = null;
					rt.forList(f, 0, rt.fv(f, "minds", rt.gl("SSticker")), T("/datum/mind"));
					while (($e = rt.next(f, 0)) !== undefined) {
						possible_target = $e;
						if ((!isEqual(live(possible_target), live(f.src)) && truthy((rt.istype(rt.fv(f, "current", live(possible_target)), T("/mob/living/carbon/human")) ? 1 : 0)))) {
							possible_targets = rt.modify(live(possible_targets), rt.fv(f, "current", live(possible_target)), add);
						}
					}
					rt.endFor(f, 0);
					def_target = null;
					objective_list = rt.list(T("/datum/objective/assassinate"), T("/datum/objective/protect"), T("/datum/objective/debrain"), T("/datum/objective/maroon"));
					if (((truthy(live(objective)) && truthy((rt.isIn(f, rt.fv(f, "type", live(objective)), live(objective_list)) ? 1 : 0))) && truthy(rt.fv(f, "target", live(objective))))) {
						def_target = rt.gv(f, "current", rt.fv(f, "target", live(objective)));
					}
					if (!truthy((new_target = (yield* g.op(f, "Prompt", [1], [null, live(def_target), "Objective target", "Select target:", live(possible_targets)]))))) {
						return live(f.dot);
					}
					objective_path = (yield* g.call(f, P("/proc/text2path"), null, [fmt("/datum/objective/＀", [live(new_obj_type)])]));
					if (isEqual(live(new_target), "Free objective")) {
						rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, live(objective_path), []))), live(f.src));
						rt.setFv(f, "target", live(new_objective), null);
						rt.setFv(f, "explanation_text", live(new_objective), "Free objective");
					} else {
						rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, live(objective_path), []))), live(f.src));
						rt.setFv(f, "target", live(new_objective), rt.fv(f, "mind", live(new_target)));
						yield* g.callName(f, live(new_objective), "update_explanation_text", []);
					}
				} else if ($0 === "destroy") {
					if (truthy(rt.getLen(f, (possible_targets = (yield* g.call(f, P("/proc/active_ais"), null, [1])))))) {
						new_target_6 = (yield* g.op(f, "Prompt", [1], [null, null, "Objective target", "Select target:", live(possible_targets)]));
						rt.setFv(f, "target", (new_objective = (yield* g.new_(f, T("/datum/objective/destroy"), []))), rt.fv(f, "mind", live(new_target_6)));
						rt.setFv(f, "owner", live(new_objective), live(f.src));
						yield* g.callName(f, live(new_objective), "update_explanation_text", []);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "No active AIs with minds"]);
					}
				} else if ($0 === "prevent") {
					rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective/block"), []))), live(f.src));
				} else if ($0 === "hijack") {
					rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective/hijack"), []))), live(f.src));
				} else if ($0 === "escape") {
					rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective/escape"), []))), live(f.src));
				} else if ($0 === "survive") {
					rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective/survive"), []))), live(f.src));
				} else if ($0 === "martyr") {
					rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective/martyr"), []))), live(f.src));
				} else if ($0 === "nuclear") {
					rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective/nuclear"), []))), live(f.src));
				} else if ($0 === "steal") {
					if (!truthy((rt.istype(live(objective), T("/datum/objective/steal")) ? 1 : 0))) {
						rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective/steal"), []))), live(f.src));
					} else {
						new_objective = live(objective);
					}
					if (!truthy((yield* g.callName(f, (steal = live(new_objective)), "select_target", [])))) {
						return live(f.dot);
					}
				} else if ($0 === "download" || $0 === "capture" || $0 === "absorb") {
					def_num = null;
					if ((truthy(live(objective)) && isEqual(rt.fv(f, "type", live(objective)), (yield* g.call(f, P("/proc/text2path"), null, [fmt("/datum/objective/＀", [live(new_obj_type)])]))))) {
						def_num = rt.fv(f, "target_amount", live(objective));
					}
					if ((target_number = (yield* g.op(f, "Prompt", [33], [null, live(def_num), "Objective", "Input target number:", null]))) === null) {
						return live(f.dot);
					}
					$0 = live(new_obj_type);
					if ($0 === "download") {
						rt.setFv(f, "explanation_text", (new_objective = (yield* g.new_(f, T("/datum/objective/download"), []))), fmt("Download ＀ research levels.", [live(target_number)]));
					} else if ($0 === "capture") {
						rt.setFv(f, "explanation_text", (new_objective = (yield* g.new_(f, T("/datum/objective/capture"), []))), fmt("Capture ＀ lifeforms with an energy net. Live, rare specimens are worth more.", [live(target_number)]));
					} else if ($0 === "absorb") {
						rt.setFv(f, "explanation_text", (new_objective = (yield* g.new_(f, T("/datum/objective/absorb"), []))), fmt("Absorb ＀ compatible genomes.", [live(target_number)]));
					}
					rt.setFv(f, "owner", live(new_objective), live(f.src));
					rt.setFv(f, "target_amount", live(new_objective), live(target_number));
				} else if ($0 === "custom") {
					$0 = live(f.usr);
					$1 = "Custom objective:";
					$2 = "Objective";
					if (truthy(live(objective))) {
						$3 = rt.fv(f, "explanation_text", live(objective));
					} else {
						$3 = "";
					}
					if (!truthy((expl = (yield* g.call(f, P("/proc/stripped_input"), null, [$0, $1, $2, $3]))))) {
						return live(f.dot);
					}
					rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective"), []))), live(f.src));
					rt.setFv(f, "explanation_text", live(new_objective), live(expl));
				}
				if (!truthy(live(new_objective))) {
					return live(f.dot);
				}
				if (truthy(live(objective))) {
					(rt.modSrcVar(f, "objectives", live(objective), subtract));
					yield* g.callName(f, rt.sv(f, "objectives"), "Insert", [live(objective_pos), live(new_objective)]);
					yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ edited ＀'s objective to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "explanation_text", live(new_objective))])]);
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ edited ＀'s objective to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "explanation_text", live(new_objective))])]);
				} else {
					rt.modSrcVar(f, "objectives", live(new_objective), add);
					yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ added a new objective for ＀: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "explanation_text", live(new_objective))])]);
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ added a new objective for ＀: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "explanation_text", live(new_objective))])]);
				}
			} else {
				if (truthy(rt.at(live(href_list), "obj_delete"))) {
					if (!truthy((rt.istype((objective = rt.locateIn(f, rt.at(live(href_list), "obj_delete"), rt.world())), T("/datum/objective")) ? 1 : 0))) {
						return live(f.dot);
					}
					(rt.modSrcVar(f, "objectives", live(objective), subtract));
					yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ removed an objective for ＀: ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "explanation_text", live(objective))])]);
					yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ removed an objective for ＀: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "explanation_text", live(objective))])]);
				} else {
					if (truthy(rt.at(live(href_list), "obj_completed"))) {
						if (!truthy((rt.istype((objective = rt.locateIn(f, rt.at(live(href_list), "obj_completed"), rt.world())), T("/datum/objective")) ? 1 : 0))) {
							return live(f.dot);
						}
						rt.setFv(f, "completed", live(objective), (!truthy(rt.fv(f, "completed", live(objective))) ? 1 : 0));
						yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled the win state for ＀'s objective: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "explanation_text", live(objective))])]);
					} else {
						if (truthy(rt.at(live(href_list), "revolution"))) {
							$0 = rt.at(live(href_list), "revolution");
							if ($0 === "clear") {
								yield* g.srcCall(f, "remove_rev");
								yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='userdanger'>You have been brainwashed! You are no longer a revolutionary!</span>"]);
								yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has de-rev'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
								yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has de-rev'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
							} else if ($0 === "rev") {
								if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
									(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "head_revolutionaries", live(f.src), subtract));
									yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_rev_icons_removed", [live(f.src)]);
									yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='userdanger'>Revolution has been disappointed of your leader traits! You are a regular revolutionary now!</span>"]);
								} else {
									if (!truthy((rt.isIn(f, live(f.src), rt.gv(f, "revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
										yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='danger'><FONT size = 3> You are now a revolutionary! Help your cause. Do not harm your fellow freedom fighters. You can identify your comrades by the red \"R\" icons, and your leaders by the blue \"R\" icons. Help them kill the heads to win the revolution!</FONT></span>"]);
									} else {
										return live(f.dot);
									}
								}
								rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "revolutionaries", live(f.src), add);
								yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_rev_icons_added", [live(f.src)]);
								rt.setSv(f, "special_role", "Revolutionary");
								yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has rev'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
								yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has rev'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
							} else if ($0 === "headrev") {
								if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
									(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "revolutionaries", live(f.src), subtract));
									yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_rev_icons_removed", [live(f.src)]);
									yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='userdanger'>You have proved your devotion to revoltion! Yea are a head revolutionary now!</span>"]);
								} else {
									if (!truthy((rt.isIn(f, live(f.src), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
										yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='userdanger'>You are a member of the revolutionaries' leadership now!</span>"]);
									} else {
										return live(f.dot);
									}
								}
								if (rt.gt(rt.getLen(f, rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))), 0)) {
									if (truthy((valid_head = rt.locateIn(f, T("/datum/mind"), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker"))))))) {
										O = null;
										rt.forList(f, 0, rt.fv(f, "objectives", live(valid_head)), T("/datum/objective/mutiny"));
										while (($e = rt.next(f, 0)) !== undefined) {
											O = $e;
											rt.setFv(f, "owner", (rev_obj = (yield* g.new_(f, T("/datum/objective/mutiny"), []))), live(f.src));
											rt.setFv(f, "target", live(rev_obj), rt.fv(f, "target", live(O)));
											rt.setFv(f, "explanation_text", live(rev_obj), fmt("Assassinate ＀, the ＀.", [rt.gv(f, "name", rt.fv(f, "target", live(O))), rt.gv(f, "assigned_role", rt.fv(f, "target", live(O)))]));
											rt.modSrcVar(f, "objectives", live(rev_obj), add);
										}
										rt.endFor(f, 0);
										yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_revolutionary", [live(f.src), 0]);
									}
								}
								rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "head_revolutionaries", live(f.src), add);
								yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_rev_icons_added", [live(f.src)]);
								rt.setSv(f, "special_role", "Head Revolutionary");
								yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has head-rev'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
								yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has head-rev'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
							} else if ($0 === "autoobjectives") {
								yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_revolutionary_objectives", [live(f.src)]);
								yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_revolutionary", [live(f.src), 0]);
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>The objectives for revolution have been generated and shown to ＀</span>", [rt.sv(f, "key")])]);
							} else if ($0 === "flash") {
								if (!truthy((yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_revolutionary", [rt.sv(f, "current")])))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Spawning flash failed!</span>"]);
								}
							} else if ($0 === "takeflash") {
								L = (yield* g.callName(f, rt.sv(f, "current"), "get_contents", []));
								if (!truthy((flash = rt.locateIn(f, T("/obj/item/device/assembly/flash"), live(L))))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Deleting flash failed!</span>"]);
								}
								yield* g.call(f, P("/proc/qdel"), null, [live(flash)]);
							} else if ($0 === "repairflash") {
								L = (yield* g.callName(f, rt.sv(f, "current"), "get_contents", []));
								if (!truthy((flash = rt.locateIn(f, T("/obj/item/device/assembly/flash"), live(L))))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Repairing flash failed!</span>"]);
								} else {
									rt.setFv(f, "crit_fail", live(flash), 0);
									yield* g.callName(f, live(flash), "update_icon", []);
								}
							}
						} else {
							if (truthy(rt.at(live(href_list), "gang"))) {
								$0 = rt.at(live(href_list), "gang");
								if ($0 === "clear") {
									yield* g.srcCall(f, "remove_gang");
									yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has de-gang'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
									yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has de-gang'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
								} else if ($0 === "equip") {
									$0 = (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_gang", [rt.sv(f, "current"), rt.sv(f, "gang_datum")]));
									if ($0 === 1) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Unable to equip territory spraycan!</span>"]);
									} else if ($0 === 2) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Unable to equip recruitment pen and spraycan!</span>"]);
									} else if ($0 === 3) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Unable to equip gangtool, pen, and spraycan!</span>"]);
									}
								} else if ($0 === "takeequip") {
									L = (yield* g.callName(f, rt.sv(f, "current"), "get_contents", []));
									pen = null;
									rt.forList(f, 0, live(L), T("/obj/item/weapon/pen/gang"));
									while (($e = rt.next(f, 0)) !== undefined) {
										pen = $e;
										yield* g.call(f, P("/proc/qdel"), null, [live(pen)]);
									}
									rt.endFor(f, 0);
									gangtool = null;
									rt.forList(f, 0, live(L), T("/obj/item/device/gangtool"));
									while (($e = rt.next(f, 0)) !== undefined) {
										gangtool = $e;
										yield* g.call(f, P("/proc/qdel"), null, [live(gangtool)]);
									}
									rt.endFor(f, 0);
									SC = null;
									rt.forList(f, 0, live(L), T("/obj/item/toy/crayon/spraycan/gang"));
									while (($e = rt.next(f, 0)) !== undefined) {
										SC = $e;
										yield* g.call(f, P("/proc/qdel"), null, [live(SC)]);
									}
									rt.endFor(f, 0);
								} else if ($0 === "new") {
									if (truthy(rt.len(f, rt.gl("gang_colors_pool")))) {
										names = add(rt.list("Random"), rt.gl("gang_name_pool"));
										if ((truthy((gangname = (yield* g.op(f, "Prompt", [1], [null, null, "Select Name", "Pick a gang name.", live(names)])))) && truthy(rt.len(f, rt.gl("gang_colors_pool"))))) {
											if (!truthy((rt.isIn(f, live(gangname), rt.gl("gang_name_pool")) ? 1 : 0))) {
												gangname = null;
											}
											newgang = (yield* g.new_(f, T("/datum/gang"), [null, live(gangname)]));
											rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "gangs", live(newgang), add);
											yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has created the ＀ Gang.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "name", live(newgang))])]);
											yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has created the ＀ Gang.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.fv(f, "name", live(newgang))])]);
										}
									}
								}
							} else {
								if (truthy(rt.at(live(href_list), "gangboss"))) {
									if ((!truthy((G = rt.locateIn(f, rt.at(live(href_list), "gangboss"), rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker")))))) || truthy((rt.isIn(f, live(f.src), rt.fv(f, "bosses", live(G))) ? 1 : 0)))) {
										return live(f.dot);
									}
									yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_gangster", [live(f.src), 0, 2, 1]);
									rt.setAt(rt.fv(f, "bosses", live(G)), live(f.src), 20);
									rt.setSv(f, "gang_datum", live(G));
									rt.setSv(f, "special_role", fmt("＀ Gang Boss", [rt.fv(f, "name", live(G))]));
									yield* g.callName(f, live(G), "add_gang_hud", [live(f.src)]);
									yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), fmt("<FONT size=3 color=red><B>You are a ＀ Gang Boss!</B></FONT>", [rt.fv(f, "name", live(G))])]);
									yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has added ＀ to the ＀ Gang leadership.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "name", live(G))])]);
									yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has added ＀ to the ＀ Gang leadership.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "name", live(G))])]);
									yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_gang_objectives", [live(f.src)]);
									yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_gang", [live(f.src), 0]);
								} else {
									if (truthy(rt.at(live(href_list), "gangster"))) {
										if ((!truthy((G = rt.locateIn(f, rt.at(live(href_list), "gangster"), rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker")))))) || truthy((rt.isIn(f, live(f.src), rt.fv(f, "gangsters", live(G))) ? 1 : 0)))) {
											return live(f.dot);
										}
										yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_gangster", [live(f.src), 0, 2, 1]);
										yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_gangster", [live(f.src), live(G), 0]);
										yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has added ＀ to the ＀ Gang (A).", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "name", live(G))])]);
										yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has added ＀ to the ＀ Gang (A).", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current"), rt.fv(f, "name", live(G))])]);
									} else {
										if (truthy(rt.at(live(href_list), "cult"))) {
											$0 = rt.at(live(href_list), "cult");
											if ($0 === "clear") {
												yield* g.srcCall(f, "remove_cultist");
												yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has de-cult'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
												yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has de-cult'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
											} else if ($0 === "cultist") {
												if (!truthy((rt.isIn(f, live(f.src), rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
													yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_cultist", [live(f.src), 0]);
													yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has cult'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
													yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has cult'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
												}
											} else if ($0 === "tome") {
												if (!truthy((yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_cultist", [rt.sv(f, "current"), 1])))) {
													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Spawning tome failed!</span>"]);
												}
											} else if ($0 === "amulet") {
												if (!truthy((yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_cultist", [rt.sv(f, "current")])))) {
													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Spawning amulet failed!</span>"]);
												}
											}
										} else {
											if (truthy(rt.at(live(href_list), "clockcult"))) {
												$0 = rt.at(live(href_list), "clockcult");
												if ($0 === "clear") {
													yield* g.call(f, P("/proc/remove_servant_of_ratvar"), null, [rt.sv(f, "current"), 1]);
													yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has removed clockwork servant status from ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
													yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has removed clockwork servant status from ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
												} else if ($0 === "servant") {
													if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "current")])))) {
														yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [rt.sv(f, "current"), 1]);
														yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has made ＀ into a servant of Ratvar.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
														yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has made ＀ into a servant of Ratvar.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
													}
												} else if ($0 === "slab") {
													if (!truthy((yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_servant", [rt.sv(f, "current")])))) {
														yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>Failed to outfit ＀ with a slab!</span>", [rt.sv(f, "current")])]);
													} else {
														yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>Successfully gave ＀ a clockwork slab!</span>", [rt.sv(f, "current")])]);
													}
												}
											} else {
												if (truthy(rt.at(live(href_list), "wizard"))) {
													$0 = rt.at(live(href_list), "wizard");
													if ($0 === "clear") {
														yield* g.srcCall(f, "remove_wizard");
														yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='userdanger'>You have been brainwashed! You are no longer a wizard!</span>"]);
														yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has de-wizard'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
														yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_wiz_icons_removed", [live(f.src)]);
													} else if ($0 === "wizard") {
														if (!truthy((rt.isIn(f, live(f.src), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
															rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "wizards", live(f.src), add);
															rt.setSv(f, "special_role", "Wizard");
															yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='boldannounce'>You are the Space Wizard!</span>"]);
															yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has wizard'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
															yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has wizard'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
															yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_wiz_icons_added", [live(f.src)]);
														}
													} else if ($0 === "lair") {
														rt.setFv(f, "loc", rt.sv(f, "current"), rt.op(f, "PickUnweighted", [1], [rt.gl("wizardstart")]));
													} else if ($0 === "dressup") {
														yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_wizard", [rt.sv(f, "current")]);
													} else if ($0 === "name") {
														yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "name_wizard", [rt.sv(f, "current")]);
													} else if ($0 === "autoobjectives") {
														yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_wizard_objectives", [live(f.src)]);
														yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>The objectives for wizard ＀ have been generated. You can edit them and anounce manually.</span>", [rt.sv(f, "key")])]);
													}
												} else {
													if (truthy(rt.at(live(href_list), "changeling"))) {
														$0 = rt.at(live(href_list), "changeling");
														if ($0 === "clear") {
															yield* g.srcCall(f, "remove_changeling");
															yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='userdanger'>You grow weak and lose your powers! You are no longer a changeling and are stuck in your current form!</span>"]);
															yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has de-changeling'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
															yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has de-changeling'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
														} else if ($0 === "changeling") {
															if (!truthy((rt.isIn(f, live(f.src), rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
																rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "changelings", live(f.src), add);
																yield* g.callName(f, rt.sv(f, "current"), "make_changeling", []);
																rt.setSv(f, "special_role", "Changeling");
																yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), fmt("<span class='boldannounce'>Your powers are awoken. A flash of memory returns to us...we are ＀, a changeling!</span>", [rt.fv(f, "changelingID", rt.sv(f, "changeling"))])]);
																yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has changeling'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has changeling'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_changeling_icons_added", [live(f.src)]);
															}
														} else if ($0 === "autoobjectives") {
															yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_changeling_objectives", [live(f.src)]);
															yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>The objectives for changeling ＀ have been generated. You can edit them and anounce manually.</span>", [rt.sv(f, "key")])]);
														} else if ($0 === "initialdna") {
															if (((!truthy(rt.sv(f, "changeling")) || !truthy(rt.getLen(f, rt.fv(f, "stored_profiles", rt.sv(f, "changeling"))))) || !truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon")) ? 1 : 0)))) {
																yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Resetting DNA failed!</span>"]);
															} else {
																C = rt.sv(f, "current");
																yield* g.callName(f, rt.gv(f, "dna", rt.fv(f, "first_prof", rt.sv(f, "changeling"))), "transfer_identity", [null, live(C), "transfer_SE", 1], rt.Args.Named);
																rt.setFv(f, "real_name", live(C), rt.gv(f, "name", rt.fv(f, "first_prof", rt.sv(f, "changeling"))));
																yield* g.callName(f, live(C), "updateappearance", ["mutcolor_update", 1], rt.Args.Named);
																yield* g.callName(f, live(C), "domutcheck", []);
															}
														}
													} else {
														if (truthy(rt.at(live(href_list), "nuclear"))) {
															$0 = rt.at(live(href_list), "nuclear");
															if ($0 === "clear") {
																yield* g.srcCall(f, "remove_nukeop");
																yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='userdanger'>You have been brainwashed! You are no longer a syndicate operative!</span>"]);
																yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has de-nuke op'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has de-nuke op'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
															} else if ($0 === "nuclear") {
																if (!truthy((rt.isIn(f, live(f.src), rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
																	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "syndicates", live(f.src), add);
																	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_synd_icons_added", [live(f.src)]);
																	if (isEqual(rt.getLen(f, rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))), 1)) {
																		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "prepare_syndicate_leader", [live(f.src)]);
																	} else {
																		rt.setFv(f, "real_name", rt.sv(f, "current"), fmt("＀ Operative #＀", [(yield* g.call(f, P("/proc/syndicate_name"), null, [])), subtract(rt.getLen(f, rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))), 1)]));
																	}
																	rt.setSv(f, "special_role", "Syndicate");
																	rt.setSv(f, "assigned_role", "Syndicate");
																	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), fmt("<span class='notice'>You are a ＀ agent!</span>", [(yield* g.call(f, P("/proc/syndicate_name"), null, []))])]);
																	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_syndicate_objectives", [live(f.src)]);
																	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_syndicate", [live(f.src)]);
																	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has nuke op'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has nuke op'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																}
															} else if ($0 === "lair") {
																rt.setFv(f, "loc", rt.sv(f, "current"), rt.getStep(f, rt.locateIn(f, "landmark*Syndicate-Spawn", rt.world()), 0));
															} else if ($0 === "dressup") {
																yield* g.call(f, P("/proc/qdel"), null, [rt.gv(f, "belt", (H = rt.sv(f, "current")))]);
																yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "back", live(H))]);
																yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "ears", live(H))]);
																yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "gloves", live(H))]);
																yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "head", live(H))]);
																yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "shoes", live(H))]);
																yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "wear_id", live(H))]);
																yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "wear_suit", live(H))]);
																yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "w_uniform", live(H))]);
																if (!truthy((yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_syndicate", [rt.sv(f, "current")])))) {
																	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Equipping a syndicate failed!</span>"]);
																}
															} else if ($0 === "tellcode") {
																code = null;
																bombue = null;
																rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/nuclearbomb"));
																while (($e = rt.next(f, 0)) !== undefined) {
																	bombue = $e;
																	if (((rt.le(rt.length(rt.fv(f, "r_code", live(bombue))), 5) && !isEqual(rt.fv(f, "r_code", live(bombue)), "LOLNO")) && !isEqual(rt.fv(f, "r_code", live(bombue)), "ADMIN"))) {
																		code = rt.fv(f, "r_code", live(bombue));
																		break;
																	}
																}
																rt.endFor(f, 0);
																if (truthy(live(code))) {
																	yield* g.srcCall(f, "store_memory", fmt("<B>Syndicate Nuclear Bomb Code</B>: ＀", [live(code)]), 0, 0);
																	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), fmt("The nuclear authorization code is: <B>＀</B>", [live(code)])]);
																} else {
																	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>No valid nuke found!</span>"]);
																}
															}
														} else {
															if (truthy(rt.at(live(href_list), "traitor"))) {
																$0 = rt.at(live(href_list), "traitor");
																if ($0 === "clear") {
																	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='userdanger'>You have been brainwashed!</span>"]);
																	yield* g.srcCall(f, "remove_traitor");
																	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has de-traitor'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has de-traitor'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_traitor_icons_removed", [live(f.src)]);
																} else if ($0 === "traitor") {
																	if (!truthy((rt.isIn(f, live(f.src), rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
																		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has traitor'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has traitor'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		yield* g.srcCall(f, "make_Traitor");
																	}
																} else if ($0 === "autoobjectives") {
																	if (!truthy((traitordatum = (yield* g.srcCall(f, "has_antag_datum", T("/datum/antagonist/traitor")))))) {
																		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has traitor'ed ＀ as part of autoobjectives.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has traitor'ed ＀ as part of autoobjectives.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		yield* g.srcCall(f, "make_Traitor");
																	} else {
																		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has forged objectives for ＀ as part of autoobjectives.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		yield* g.callName(f, live(traitordatum), "forge_traitor_objectives", []);
																		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>The objectives for traitor ＀ have been generated. You can edit them and anounce manually.</span>", [rt.sv(f, "key")])]);
																	}
																}
															} else {
																if (truthy(rt.at(live(href_list), "devil"))) {
																	devilinfo = (yield* g.srcCall(f, "has_antag_datum", T("/datum/antagonist/devil")));
																	$0 = rt.at(live(href_list), "devil");
																	if ($0 === "clear") {
																		if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "devils", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
																			yield* g.call(f, P("/proc/remove_devil"), null, [rt.sv(f, "current")]);
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has de-devil'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has de-devil'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		}
																		if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "sintouched", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
																			(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "sintouched", live(f.src), subtract));
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has de-sintouch'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has de-sintouch'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		}
																	} else if ($0 === "devil") {
																		if (truthy(live(devilinfo))) {
																			rt.setFv(f, "ascendable", live(devilinfo), 0);
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has made ＀ unable to ascend as a devil.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has made ＀ unable to ascend as a devil.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																			return live(f.dot);
																		}
																		if ((!truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/silicon/robot")) ? 1 : 0)))) {
																			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This only works on humans and cyborgs!</span>"]);
																			return live(f.dot);
																		}
																		yield* g.call(f, P("/proc/add_devil"), null, [rt.sv(f, "current"), 0]);
																		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has devil'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has devil'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																	} else if ($0 === "ascendable_devil") {
																		if (truthy(live(devilinfo))) {
																			rt.setFv(f, "ascendable", live(devilinfo), 1);
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has made ＀ able to ascend as a devil.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has made ＀ able to ascend as a devil.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																			return live(f.dot);
																		}
																		if ((!truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/silicon/robot")) ? 1 : 0)))) {
																			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This only works on humans and cyborgs!</span>"]);
																			return live(f.dot);
																		}
																		yield* g.call(f, P("/proc/add_devil"), null, [rt.sv(f, "current"), 1]);
																		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has devil'ed ＀.  The devil has been marked as ascendable.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has devil'ed ＀. The devil has been marked as ascendable.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																	} else if ($0 === "sintouched") {
																		if (truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0))) {
																			yield* g.callName(f, (H_1 = rt.sv(f, "current")), "influenceSin", []);
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has sintouch'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		} else {
																			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This only works on humans!</span>"]);
																			return live(f.dot);
																		}
																	}
																} else {
																	if (truthy(rt.at(live(href_list), "ninja"))) {
																		ninjainfo = (yield* g.srcCall(f, "has_antag_datum", T("/datum/antagonist/ninja")));
																		$0 = rt.at(live(href_list), "ninja");
																		if ($0 === "clear") {
																			yield* g.call(f, P("/proc/remove_ninja"), null, [rt.sv(f, "current")]);
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has de-ninja'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has de-ninja'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		} else if ($0 === "equip") {
																			yield* g.callName(f, live(ninjainfo), "equip_space_ninja", []);
																			return live(f.dot);
																		} else if ($0 === "nanotrasen") {
																			yield* g.call(f, P("/proc/add_ninja"), null, [rt.sv(f, "current"), T("/datum/antagonist/ninja/friendly")]);
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has friendly ninja'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has friendly ninja'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		} else if ($0 === "syndicate") {
																			yield* g.call(f, P("/proc/add_ninja"), null, [rt.sv(f, "current"), T("/datum/antagonist/ninja")]);
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has syndie ninja'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has syndie ninja'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		} else if ($0 === "random") {
																			yield* g.call(f, P("/proc/add_ninja"), null, [rt.sv(f, "current")]);
																			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has random ninja'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has random ninja'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																		}
																	} else {
																		if (truthy(rt.at(live(href_list), "abductor"))) {
																			$0 = rt.at(live(href_list), "abductor");
																			if ($0 === "clear") {
																				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Not implemented yet. Sorry!"]);
																			} else if ($0 === "abductor") {
																				if (!truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0))) {
																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This only works on humans!</span>"]);
																					return live(f.dot);
																				}
																				yield* g.srcCall(f, "make_Abductor");
																				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ turned ＀ into abductor.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																				yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_abductor_icons_added", [live(f.src)]);
																			} else if ($0 === "equip") {
																				if (!truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0))) {
																					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This only works on humans!</span>"]);
																					return live(f.dot);
																				}
																				H = rt.sv(f, "current");
																				if (truthy((gear = (yield* g.call(f, P("/proc/alert"), null, ["Agent or Scientist Gear", "Gear", "Agent", "Scientist"]))))) {
																					if (isEqual(live(gear), "Agent")) {
																						yield* g.callName(f, live(H), "equipOutfit", [T("/datum/outfit/abductor/agent")]);
																					} else {
																						yield* g.callName(f, live(H), "equipOutfit", [T("/datum/outfit/abductor/scientist")]);
																					}
																				}
																			}
																		} else {
																			if (truthy(rt.at(live(href_list), "monkey"))) {
																				if (truthy(rt.gv(f, "notransform", (L = rt.sv(f, "current"))))) {
																					return live(f.dot);
																				}
																				$0 = rt.at(live(href_list), "monkey");
																				if ($0 === "healthy") {
																					if (truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
																						H_1 = rt.sv(f, "current");
																						M = rt.sv(f, "current");
																						if (truthy((rt.istype(live(H_1), T("/mob/living/carbon/human")) ? 1 : 0))) {
																							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ attempting to monkeyize ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.sv(f, "current")]))])]);
																							yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='notice'>＀ attempting to monkeyize ＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "current")]))])]);
																							f.src = null;
																							f.src = rt.gv(f, "mind", (M = (yield* g.callName(f, live(H_1), "monkeyize", []))));
																						} else {
																							if ((truthy((rt.istype(live(M), T("/mob/living/carbon/monkey")) ? 1 : 0)) && truthy(rt.length(rt.fv(f, "viruses", live(M)))))) {
																								D = null;
																								rt.forList(f, 0, rt.fv(f, "viruses", live(M)), T("/datum/disease"));
																								while (($e = rt.next(f, 0)) !== undefined) {
																									D = $e;
																									yield* g.callName(f, live(D), "cure", [0]);
																								}
																								rt.endFor(f, 0);
																							}
																						}
																					}
																				} else if ($0 === "infected") {
																					if (truthy((yield* g.call(f, P("/proc/check_rights"), null, [2, 0])))) {
																						H_1 = rt.sv(f, "current");
																						M = rt.sv(f, "current");
																						if (truthy((rt.istype(live(H_1), T("/mob/living/carbon/human")) ? 1 : 0))) {
																							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ attempting to monkeyize and infect ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.sv(f, "current")]))])]);
																							yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='notice'>＀ attempting to monkeyize and infect ＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "current")]))])]);
																							f.src = null;
																							f.src = rt.gv(f, "mind", (M = (yield* g.callName(f, live(H_1), "monkeyize", []))));
																							yield* g.callName(f, rt.sv(f, "current"), "ForceContractDisease", [(yield* g.new_(f, T("/datum/disease/transformation/jungle_fever"), []))]);
																						} else {
																							if (truthy((rt.istype(live(M), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
																								yield* g.callName(f, rt.sv(f, "current"), "ForceContractDisease", [(yield* g.new_(f, T("/datum/disease/transformation/jungle_fever"), []))]);
																							}
																						}
																					}
																				} else if ($0 === "human") {
																					if (truthy((yield* g.call(f, P("/proc/check_rights"), null, [2, 0])))) {
																						H_1 = rt.sv(f, "current");
																						if (truthy((rt.istype((M = rt.sv(f, "current")), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
																							D = null;
																							rt.forList(f, 0, rt.fv(f, "viruses", live(M)), T("/datum/disease"));
																							while (($e = rt.next(f, 0)) !== undefined) {
																								D = $e;
																								if (truthy((rt.istype(live(D), T("/datum/disease/transformation/jungle_fever")) ? 1 : 0))) {
																									yield* g.callName(f, live(D), "cure", [0]);
																									yield* g.call(f, P("/proc/sleep"), null, [0]);
																								}
																							}
																							rt.endFor(f, 0);
																							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ attempting to humanize ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [rt.sv(f, "current")]))])]);
																							yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='notice'>＀ attempting to humanize ＀</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "current")]))])]);
																							if (truthy((H_1 = (yield* g.callName(f, live(M), "humanize", [343]))))) {
																								f.src = rt.fv(f, "mind", live(H_1));
																							}
																						}
																					}
																				}
																			} else {
																				if (truthy(rt.at(live(href_list), "silicon"))) {
																					$0 = rt.at(live(href_list), "silicon");
																					if ($0 === "unemag") {
																						if (truthy((rt.istype((R = rt.sv(f, "current")), T("/mob/living/silicon/robot")) ? 1 : 0))) {
																							yield* g.callName(f, live(R), "SetEmagged", [0]);
																							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has unemag'ed ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(R)])]);
																							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has unemag'ed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(R)])]);
																						}
																					} else if ($0 === "unemagcyborgs") {
																						if (truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/silicon/ai")) ? 1 : 0))) {
																							ai = rt.sv(f, "current");
																							R_1 = null;
																							rt.forList(f, 0, rt.fv(f, "connected_robots", live(ai)), T("/mob/living/silicon/robot"));
																							while (($e = rt.next(f, 0)) !== undefined) {
																								R_1 = $e;
																								yield* g.callName(f, live(R_1), "SetEmagged", [0]);
																							}
																							rt.endFor(f, 0);
																							yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has unemag'ed ＀'s Cyborgs.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(ai)])]);
																							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has unemag'ed ＀'s Cyborgs.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(ai)])]);
																						}
																					}
																				} else {
																					if (truthy(rt.at(live(href_list), "common"))) {
																						$0 = rt.at(live(href_list), "common");
																						if ($0 === "undress") {
																							W = null;
																							rt.forList(f, 0, rt.sv(f, "current"), T("/obj/item"));
																							while (($e = rt.next(f, 0)) !== undefined) {
																								W = $e;
																								yield* g.callName(f, rt.sv(f, "current"), "dropItemToGround", [live(W), 1]);
																							}
																							rt.endFor(f, 0);
																						} else if ($0 === "takeuplink") {
																							yield* g.srcCall(f, "take_uplink");
																							rt.setSv(f, "memory", null);
																							yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ removed ＀'s uplink.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																						} else if ($0 === "crystals") {
																							if (truthy((yield* g.call(f, P("/proc/check_rights"), null, [8, 0])))) {
																								if (truthy((U = (yield* g.srcCall(f, "find_syndicate_uplink"))))) {
																									if ((crystals = (yield* g.op(f, "Prompt", [33], [null, rt.fv(f, "telecrystals", live(U)), "Syndicate uplink", fmt("Amount of telecrystals for ＀", [rt.sv(f, "key")]), null]))) !== null) {
																										rt.setFv(f, "telecrystals", live(U), live(crystals));
																										yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ changed ＀'s telecrystal count to ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "current"), live(crystals)])]);
																										yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ changed ＀'s telecrystal count to ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current"), live(crystals)])]);
																									}
																								}
																							}
																						} else if ($0 === "uplink") {
																							if (!truthy((yield* g.srcCall(f, "equip_traitor")))) {
																								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Equipping a syndicate failed!</span>"]);
																								yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ tried and failed to give ＀ an uplink.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																							} else {
																								yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ gave ＀ an uplink.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), rt.sv(f, "current")])]);
																							}
																						}
																					} else {
																						if (truthy(rt.at(live(href_list), "obj_announce"))) {
																							yield* g.srcCall(f, "announce_objectives");
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "edit_memory");
	return f.dot;
}, true);

// /datum/mind/proc/announce_objectives  (code/datums/mind.dm:1424)
rt.def("/datum/mind/proc/announce_objectives", function announce_objectives(f: Frame) {
	let obj_count: Value = null, objective: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [obj_count, objective, O, $e];
	obj_count = 1;
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<span class='notice'>Your current objectives:</span>"]);
	objective = null;
	rt.forList(f, 0, rt.sv(f, "objectives"));
	while (($e = rt.next(f, 0)) !== undefined) {
		objective = $e;
		O = live(objective);
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), fmt("<B>Objective #＀</B>: ＀", [live(obj_count), rt.fv(f, "explanation_text", live(O))])]);
		obj_count = rt.inc(live(obj_count), 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/mind/proc/find_syndicate_uplink  (code/datums/mind.dm:1431)
rt.def("/datum/mind/proc/find_syndicate_uplink", function find_syndicate_uplink(f: Frame) {
	let L: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [L, I, $e];
	L = rt.callName(f, rt.sv(f, "current"), "GetAllContents", []);
	I = null;
	rt.forList(f, 0, live(L), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.fv(f, "hidden_uplink", live(I)))) {
			return rt.fv(f, "hidden_uplink", live(I));
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /datum/mind/proc/take_uplink  (code/datums/mind.dm:1438)  may sleep
rt.def("/datum/mind/proc/take_uplink", function* take_uplink(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((H = (yield* g.srcCall(f, "find_syndicate_uplink"))))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
	return f.dot;
}, true);

// /datum/mind/proc/make_Traitor  (code/datums/mind.dm:1443)  may sleep
rt.def("/datum/mind/proc/make_Traitor", function* make_Traitor(f: Frame) {
	let traitordatum: Value = null;
	f.vars = () => [traitordatum];
	if (truthy((yield* g.srcCall(f, "has_antag_datum", T("/datum/antagonist/traitor"))))) return f.dot;
	return (traitordatum = (yield* g.srcCall(f, "add_antag_datum", T("/datum/antagonist/traitor"))));
}, true);

// /datum/mind/proc/make_Nuke  (code/datums/mind.dm:1449)  may sleep
rt.def("/datum/mind/proc/make_Nuke", function* make_Nuke(f: Frame, spawnloc: Value, nuke_code: Value, leader: Value, telecrystals: Value) {
	let H: Value = null, nuke: Value = null;
	f.vars = () => [spawnloc, nuke_code, leader, telecrystals, H, nuke];
	if (live(leader) === null) {
		leader = 0;
	}
	if (live(telecrystals) === null) {
		telecrystals = 1;
	}
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) return f.dot;
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "syndicates", live(f.src), add);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_synd_icons_added", [live(f.src)]);
	rt.setSv(f, "special_role", "Syndicate");
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_syndicate_objectives", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_syndicate", [live(f.src)]);
	(rt.modField(f, rt.sv(f, "current"), "faction", "syndicate", rt.bitOr));
	if (truthy(live(spawnloc))) {
		rt.setFv(f, "loc", rt.sv(f, "current"), live(spawnloc));
	}
	if (truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.gv(f, "belt", (H = rt.sv(f, "current")))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "back", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "ears", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "gloves", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "head", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "shoes", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "wear_id", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "wear_suit", live(H))]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "w_uniform", live(H))]);
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_syndicate", [rt.sv(f, "current"), live(telecrystals)]);
	}
	if (truthy(live(nuke_code))) {
		yield* g.srcCall(f, "store_memory", fmt("<B>Syndicate Nuclear Bomb Code</B>: ＀", [live(nuke_code)]), 0, 0);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), fmt("The nuclear authorization code is: <B>＀</B>", [live(nuke_code)])]);
	} else {
		if (truthy((nuke = rt.locateIn(f, "syndienuke", rt.gl("nuke_list"))))) {
			yield* g.srcCall(f, "store_memory", fmt("<B>Syndicate Nuclear Bomb Code</B>: ＀", [rt.fv(f, "r_code", live(nuke))]), 0, 0);
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "The nuclear authorization code is: <B>nuke.r_code</B>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "You were not provided with a nuclear code. Trying asking your team leader or contacting syndicate command.</B>"]);
		}
	}
	if (truthy(live(leader))) {
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "prepare_syndicate_leader", [live(f.src), live(nuke_code)]);
	} else {
		rt.setFv(f, "real_name", rt.sv(f, "current"), fmt("＀ Operative #＀", [(yield* g.call(f, P("/proc/syndicate_name"), null, [])), subtract(rt.getLen(f, rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))), 1)]));
	}
	return f.dot;
}, true);

// /datum/mind/proc/make_Changling  (code/datums/mind.dm:1491)  may sleep
rt.def("/datum/mind/proc/make_Changling", function* make_Changling(f: Frame) {
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "changelings", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) return f.dot;
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "changelings", live(f.src), add);
	yield* g.callName(f, rt.sv(f, "current"), "make_changeling", []);
	rt.setSv(f, "special_role", "Changeling");
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_changeling_objectives", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_changeling", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_changeling_icons_added", [live(f.src)]);
	return f.dot;
}, true);

// /datum/mind/proc/make_Wizard  (code/datums/mind.dm:1500)  may sleep
rt.def("/datum/mind/proc/make_Wizard", function* make_Wizard(f: Frame) {
	if (truthy((rt.isIn(f, live(f.src), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) return f.dot;
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "wizards", live(f.src), add);
	rt.setSv(f, "special_role", "Wizard");
	rt.setSv(f, "assigned_role", "Wizard");
	if (!truthy(rt.len(f, rt.gl("wizardstart")))) {
		yield* g.callName(f, rt.gl("SSjob"), "SendToLateJoin", [rt.sv(f, "current")]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "HOT INSERTION, GO GO GO"]);
	} else {
		rt.setFv(f, "loc", rt.sv(f, "current"), rt.op(f, "PickUnweighted", [1], [rt.gl("wizardstart")]));
	}
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_wizard", [rt.sv(f, "current")]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "name_wizard", [rt.sv(f, "current")]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_wizard_objectives", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_wizard", [live(f.src)]);
	return f.dot;
}, true);

// /datum/mind/proc/make_Cultist  (code/datums/mind.dm:1517)  may sleep
rt.def("/datum/mind/proc/make_Cultist", function* make_Cultist(f: Frame) {
	let C: Value = null, H: Value = null;
	f.vars = () => [C, H];
	if (!truthy((rt.isIn(f, live(f.src), rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_cultist", [live(f.src), 0]);
		rt.setSv(f, "special_role", "Cultist");
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<font color=\"purple\"><b><i>You catch a glimpse of the Realm of Nar-Sie, The Geometer of Blood. You now see how flimsy your world is, you see that it should be open to the knowledge of Nar-Sie.</b></i></font>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "current"), "<font color=\"purple\"><b><i>Assist your new bretheren in their dark dealings. Their goal is yours, and yours is theirs. You serve the Dark One above all else. Bring It back.</b></i></font>"]);
		C = null;
		yield* g.callName(f, live(C), "cult_memorization", [live(f.src)]);
	}
	H = rt.sv(f, "current");
	if (truthy((yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_cultist", [rt.sv(f, "current")])))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(H), "Spawning an amulet from your Master failed."]);
	return f.dot;
}, true);

// /datum/mind/proc/make_Rev  (code/datums/mind.dm:1529)  may sleep
rt.def("/datum/mind/proc/make_Rev", function* make_Rev(f: Frame) {
	let valid_head: Value = null, O: Value = null, rev_obj: Value = null, L: Value = null, flash: Value = null, fail: Value = null;
	let $e: any;
	f.vars = () => [valid_head, O, rev_obj, L, flash, fail, $e];
	if (rt.gt(rt.getLen(f, rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))), 0)) {
		if (truthy((valid_head = rt.locateIn(f, T("/datum/mind"), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker"))))))) {
			O = null;
			rt.forList(f, 0, rt.fv(f, "objectives", live(valid_head)), T("/datum/objective/mutiny"));
			while (($e = rt.next(f, 0)) !== undefined) {
				O = $e;
				rt.setFv(f, "owner", (rev_obj = (yield* g.new_(f, T("/datum/objective/mutiny"), []))), live(f.src));
				rt.setFv(f, "target", live(rev_obj), rt.fv(f, "target", live(O)));
				rt.setFv(f, "explanation_text", live(rev_obj), fmt("Assassinate ＀, the ＀.", [rt.gv(f, "real_name", rt.gv(f, "current", rt.fv(f, "target", live(O)))), rt.gv(f, "assigned_role", rt.fv(f, "target", live(O)))]));
				rt.modSrcVar(f, "objectives", live(rev_obj), add);
			}
			rt.endFor(f, 0);
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_revolutionary", [live(f.src), 0]);
		}
	}
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "head_revolutionaries", live(f.src), add);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_rev_icons_added", [live(f.src)]);
	rt.setSv(f, "special_role", "Head Revolutionary");
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_revolutionary_objectives", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_revolutionary", [live(f.src), 0]);
	L = (yield* g.callName(f, rt.sv(f, "current"), "get_contents", []));
	yield* g.call(f, P("/proc/qdel"), null, [(flash = rt.locateIn(f, T("/obj/item/device/assembly/flash"), live(L)))]);
	yield* g.srcCall(f, "take_uplink");
	fail = 0;
	(fail = rt.modify(live(fail), (!truthy((yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_revolutionary", [rt.sv(f, "current")]))) ? 1 : 0), rt.bitOr));
	return f.dot;
}, true);

// /datum/mind/proc/make_Gang  (code/datums/mind.dm:1556)  may sleep
rt.def("/datum/mind/proc/make_Gang", function* make_Gang(f: Frame, G: Value) {
	f.vars = () => [G];
	rt.setSv(f, "special_role", fmt("＀ Gang Boss", [rt.fv(f, "name", live(G))]));
	rt.modField(f, live(G), "bosses", live(f.src), add);
	rt.setSv(f, "gang_datum", live(G));
	yield* g.callName(f, live(G), "add_gang_hud", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "forge_gang_objectives", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "greet_gang", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "equip_gang", [rt.sv(f, "current"), live(G)]);
	return f.dot;
}, true);

// /datum/mind/proc/make_Abductor  (code/datums/mind.dm:1565)  may sleep
rt.def("/datum/mind/proc/make_Abductor", function* make_Abductor(f: Frame) {
	let role: Value = null, team: Value = null, teleport: Value = null, O: Value = null, H: Value = null, S: Value = null, agent_landmarks: Value = null, scientist_landmarks: Value = null, A: Value = null, L: Value = null;
	let $0: any, $e: any;
	f.vars = () => [role, team, teleport, O, H, S, agent_landmarks, scientist_landmarks, A, L, $0, $e];
	role = (yield* g.call(f, P("/proc/alert"), null, ["Abductor Role ?", "Role", "Agent", "Scientist"]));
	team = (yield* g.op(f, "Prompt", [0], [null, null, "Team ?", "Abductor Team ?", rt.list(1, 2, 3, 4)]));
	teleport = (yield* g.call(f, P("/proc/alert"), null, ["Teleport to ship ?", "Teleport", "Yes", "No"]));
	if (((!truthy(live(role)) || !truthy(live(team))) || !truthy(live(teleport)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "abductors", live(f.src), rt.bitOr));
	rt.setFv(f, "owner", (O = (yield* g.new_(f, T("/datum/objective/experiment"), []))), live(f.src));
	rt.modSrcVar(f, "objectives", live(O), add);
	yield* g.callName(f, (H = rt.sv(f, "current")), "set_species", [T("/datum/species/abductor")]);
	S = rt.gv(f, "species", rt.fv(f, "dna", live(H)));
	if (isEqual(live(role), "Scientist")) {
		rt.setFv(f, "scientist", live(S), 1);
	}
	rt.setFv(f, "team", live(S), live(team));
	agent_landmarks = (yield* g.new_(f, T("/list"), []));
	scientist_landmarks = (yield* g.new_(f, T("/list"), []));
	rt.setFv(f, "len", live(agent_landmarks), 4);
	rt.setFv(f, "len", live(scientist_landmarks), 4);
	A = null;
	rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark/abductor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.istype(live(A), T("/obj/effect/landmark/abductor/agent")) ? 1 : 0))) {
			rt.setAt(live(agent_landmarks), (yield* g.call(f, P("/proc/text2num"), null, [rt.fv(f, "team", live(A))])), live(A));
		} else {
			if (truthy((rt.istype(live(A), T("/obj/effect/landmark/abductor/scientist")) ? 1 : 0))) {
				rt.setAt(live(scientist_landmarks), (yield* g.call(f, P("/proc/text2num"), null, [rt.fv(f, "team", live(A))])), live(A));
			}
		}
	}
	rt.endFor(f, 0);
	L = null;
	if (!isEqual(live(teleport), "Yes")) return f.dot;
	$0 = live(role);
	if ($0 === "Agent") {
		L = rt.index(live(agent_landmarks), live(team));
	} else if ($0 === "Scientist") {
		L = rt.index(live(scientist_landmarks), live(team));
	}
	yield* g.callName(f, live(H), "forceMove", [rt.fv(f, "loc", live(L))]);
	return f.dot;
}, true);

// /datum/mind/proc/AddSpell  (code/datums/mind.dm:1610)  may sleep
rt.def("/datum/mind/proc/AddSpell", function* AddSpell(f: Frame, S: Value) {
	f.vars = () => [S];
	rt.modSrcVar(f, "spell_list", live(S), add);
	yield* g.callName(f, rt.fv(f, "action", live(S)), "Grant", [rt.sv(f, "current")]);
	return f.dot;
}, true);

// /datum/mind/proc/owns_soul  (code/datums/mind.dm:1614)
rt.def("/datum/mind/proc/owns_soul", function owns_soul(f: Frame) {
	return (isEqual(rt.sv(f, "soulOwner"), live(f.src)) ? 1 : 0);
});

// /datum/mind/proc/RemoveSpell  (code/datums/mind.dm:1618)  may sleep
rt.def("/datum/mind/proc/RemoveSpell", function* RemoveSpell(f: Frame, spell: Value) {
	let X: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [spell, X, S, $e];
	if (!truthy(live(spell))) {
		return live(f.dot);
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "spell_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy(rt.op(f, "IsType", [], [(S = live(X)), live(spell)]))) {
			(rt.modSrcVar(f, "spell_list", live(S), subtract));
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/mind/proc/transfer_actions  (code/datums/mind.dm:1627)  may sleep
rt.def("/datum/mind/proc/transfer_actions", function* transfer_actions(f: Frame, new_character: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [new_character, A, $e];
	if ((truthy(rt.sv(f, "current")) && truthy(rt.fv(f, "actions", rt.sv(f, "current"))))) {
		A = null;
		rt.forList(f, 0, rt.fv(f, "actions", rt.sv(f, "current")), T("/datum/action"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			yield* g.callName(f, live(A), "Grant", [live(new_character)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "transfer_mindbound_actions", live(new_character));
	return f.dot;
}, true);

// /datum/mind/proc/transfer_mindbound_actions  (code/datums/mind.dm:1633)  may sleep
rt.def("/datum/mind/proc/transfer_mindbound_actions", function* transfer_mindbound_actions(f: Frame, new_character: Value) {
	let X: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [new_character, X, S, $e];
	X = null;
	rt.forList(f, 0, rt.sv(f, "spell_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, rt.gv(f, "action", (S = live(X))), "Grant", [live(new_character)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/mind/proc/disrupt_spells  (code/datums/mind.dm:1638)  may sleep
rt.def("/datum/mind/proc/disrupt_spells", function* disrupt_spells(f: Frame, delay: Value, exceptions: Value) {
	let X: Value = null, S: Value = null, type: Value = null;
	let $e: any;
	f.vars = () => [delay, exceptions, X, S, type, $e];
	if (live(exceptions) === null) {
		exceptions = (yield* g.srcCall(f, "New"));
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "spell_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		S = live(X);
		type = null;
		rt.forList(f, 1, live(exceptions));
		while (($e = rt.next(f, 1)) !== undefined) {
			type = $e;
			if (truthy(rt.op(f, "IsType", [], [live(S), live(type)]))) {
				continue;
			}
		}
		rt.endFor(f, 1);
		rt.setFv(f, "charge_counter", live(S), live(delay));
		yield* g.callName(f, live(S), "updateButtonIcon", []);
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(S), P("/obj/effect/proc_holder/spell/proc/start_recharge")]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/mind/proc/get_ghost  (code/datums/mind.dm:1648)
rt.def("/datum/mind/proc/get_ghost", function get_ghost(f: Frame, even_if_they_cant_reenter: Value) {
	let G: Value = null;
	let $e: any;
	f.vars = () => [G, $e];
	G = null;
	rt.forList(f, 0, rt.gl("dead_mob_list"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (isEqual(rt.fv(f, "mind", live(G)), live(f.src))) {
			if ((truthy(rt.fv(f, "can_reenter_corpse", live(G))) || truthy(live(even_if_they_cant_reenter)))) {
				return live(G);
			}
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/mind/proc/grab_ghost  (code/datums/mind.dm:1655)  may sleep
rt.def("/datum/mind/proc/grab_ghost", function* grab_ghost(f: Frame, force: Value) {
	let G: Value = null;
	f.vars = () => [force, G];
	f.dot = (G = (yield* g.callSrc(f, "get_ghost", ["even_if_they_cant_reenter", live(force)], rt.Args.Named)));
	if (!truthy(live(G))) return f.dot;
	yield* g.callName(f, live(G), "reenter_corpse", []);
	return f.dot;
}, true);

// /mob/proc/sync_mind  (code/datums/mind.dm:1661)
rt.def("/mob/proc/sync_mind", function sync_mind(f: Frame) {
	rt.callSrc(f, "mind_initialize", []);
	rt.setFv(f, "active", rt.sv(f, "mind"), 1);
	return f.dot;
});

// /mob/proc/mind_initialize  (code/datums/mind.dm:1673)
rt.def("/mob/proc/mind_initialize", function mind_initialize(f: Frame) {
	if (truthy(rt.sv(f, "mind"))) {
		rt.setFv(f, "key", rt.sv(f, "mind"), rt.sv(f, "key"));
	} else {
		rt.setSv(f, "mind", rt.new_(f, T("/datum/mind"), [rt.sv(f, "key")]));
		if (truthy(rt.gl("SSticker"))) {
			rt.modField(f, rt.gl("SSticker"), "minds", rt.sv(f, "mind"), add);
		} else {
			rt.call(f, P("/proc/stack_trace"), null, ["mind_initialize(): No SSticker ready"]);
		}
	}
	if (!truthy(rt.fv(f, "name", rt.sv(f, "mind")))) {
		rt.setFv(f, "name", rt.sv(f, "mind"), rt.sv(f, "real_name"));
	}
	rt.setFv(f, "current", rt.sv(f, "mind"), live(f.src));
	return f.dot;
});

// /mob/living/carbon/proc/mind_initialize  (code/datums/mind.dm:1686)
rt.def("/mob/living/carbon/proc/mind_initialize", function mind_initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "last_mind", rt.sv(f, "mind"));
	return f.dot;
});

// /mob/living/carbon/human/proc/mind_initialize  (code/datums/mind.dm:1691)
rt.def("/mob/living/carbon/human/proc/mind_initialize", function mind_initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "assigned_role", rt.sv(f, "mind")))) return f.dot;
	rt.setFv(f, "assigned_role", rt.sv(f, "mind"), "Assistant");
	return f.dot;
});

// /mob/living/carbon/alien/proc/mind_initialize  (code/datums/mind.dm:1697)
rt.def("/mob/living/carbon/alien/proc/mind_initialize", function mind_initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "special_role", rt.sv(f, "mind"), "Alien");
	return f.dot;
});

// /mob/living/silicon/ai/proc/mind_initialize  (code/datums/mind.dm:1702)
rt.def("/mob/living/silicon/ai/proc/mind_initialize", function mind_initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "assigned_role", rt.sv(f, "mind"), "AI");
	return f.dot;
});

// /mob/living/silicon/robot/proc/mind_initialize  (code/datums/mind.dm:1707)
rt.def("/mob/living/silicon/robot/proc/mind_initialize", function mind_initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "assigned_role", rt.sv(f, "mind"), "Cyborg");
	return f.dot;
});

// /mob/living/silicon/pai/proc/mind_initialize  (code/datums/mind.dm:1712)
rt.def("/mob/living/silicon/pai/proc/mind_initialize", function mind_initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "assigned_role", rt.sv(f, "mind"), "pAI");
	rt.setFv(f, "special_role", rt.sv(f, "mind"), "");
	return f.dot;
});
