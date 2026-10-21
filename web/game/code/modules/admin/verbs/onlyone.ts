// From code/modules/admin/verbs/onlyone.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalhighlander  (code/modules/admin/verbs/onlyone.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalhighlander", function InitGlobalhighlander(f: Frame) {
	rt.setGl("highlander", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "highlander", add);
	return f.dot;
});

// /client/proc/only_one  (code/modules/admin/verbs/onlyone.dm:3)  may sleep
rt.def("/client/proc/only_one", function* only_one(f: Frame) {
	let N: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [N, H, $e];
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/alert"), null, ["The game hasn't started yet!"]);
		return live(f.dot);
	}
	rt.setGl("highlander", 1);
	yield* g.call(f, P("/proc/send_to_playing_players"), null, ["<span class='boldannounce'><font size=6>THERE CAN BE ONLY ONE</font></span>"]);
	N = null;
	rt.forList(f, 0, rt.gl("poi_list"), T("/obj/item/weapon/disk/nuclear"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		yield* g.callName(f, live(N), "relocate", []);
	}
	rt.endFor(f, 0);
	H = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if ((isEqual(rt.fv(f, "stat", live(H)), 2) || !truthy(rt.fv(f, "client", live(H))))) {
			continue;
		}
		yield* g.callName(f, live(H), "make_scottish", []);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ used THERE CAN BE ONLY ONE!</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ used THERE CAN BE ONLY ONE.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.fv(f, "emergency", rt.gl("SSshuttle")), P("/obj/docking_port/mobile/emergency/proc/request"), null, 1])), 50]);
	return f.dot;
}, true);

// /client/proc/only_one_delayed  (code/modules/admin/verbs/onlyone.dm:23)  may sleep
rt.def("/client/proc/only_one_delayed", function* only_one_delayed(f: Frame) {
	yield* g.call(f, P("/proc/send_to_playing_players"), null, ["<span class='userdanger'>Bagpipes begin to blare. You feel Scottish pride coming over you.</span>"]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ used (delayed) THERE CAN BE ONLY ONE!</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ used delayed THERE CAN BE ONLY ONE.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/client/proc/only_one")])), 420]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/make_scottish  (code/modules/admin/verbs/onlyone.dm:29)  may sleep
rt.def("/mob/living/carbon/human/proc/make_scottish", function* make_scottish(f: Frame) {
	let steal_objective: Value = null, hijack_objective: Value = null, I: Value = null, _P: Value = null, W: Value = null, H1: Value = null, antiwelder: Value = null;
	let $e: any;
	f.vars = () => [steal_objective, hijack_objective, I, _P, W, H1, antiwelder, $e];
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.sv(f, "mind"), add);
	rt.setFv(f, "special_role", rt.sv(f, "mind"), "highlander");
	(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "species_traits", 11, rt.bitOr));
	rt.setFv(f, "owner", (steal_objective = (yield* g.new_(f, T("/datum/objective/steal"), []))), rt.sv(f, "mind"));
	yield* g.callName(f, live(steal_objective), "set_target", [(yield* g.new_(f, T("/datum/objective_item/steal/nukedisc"), []))]);
	rt.modField(f, rt.sv(f, "mind"), "objectives", live(steal_objective), add);
	rt.setFv(f, "explanation_text", (hijack_objective = (yield* g.new_(f, T("/datum/objective/hijack"), []))), "Escape on the shuttle alone. Ensure that nobody else makes it out.");
	rt.setFv(f, "owner", live(hijack_objective), rt.sv(f, "mind"));
	rt.modField(f, rt.sv(f, "mind"), "objectives", live(hijack_objective), add);
	yield* g.callName(f, rt.sv(f, "mind"), "announce_objectives", []);
	I = null;
	rt.forList(f, 0, (yield* g.srcCall(f, "get_equipped_items")), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "equip_to_slot_or_del", (yield* g.new_(f, T("/obj/item/clothing/under/kilt/highlander"), [live(f.src)])), 14);
	yield* g.srcCall(f, "equip_to_slot_or_del", (yield* g.new_(f, T("/obj/item/device/radio/headset/heads/captain"), [live(f.src)])), 7);
	yield* g.srcCall(f, "equip_to_slot_or_del", (yield* g.new_(f, T("/obj/item/clothing/head/beret/highlander"), [live(f.src)])), 11);
	yield* g.srcCall(f, "equip_to_slot_or_del", (yield* g.new_(f, T("/obj/item/clothing/shoes/combat"), [live(f.src)])), 12);
	yield* g.srcCall(f, "equip_to_slot_or_del", (yield* g.new_(f, T("/obj/item/weapon/pinpointer"), [live(f.src)])), 15);
	_P = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/weapon/pinpointer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		yield* g.callName(f, live(_P), "attack_self", [live(f.src)]);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "icon_state", (W = (yield* g.new_(f, T("/obj/item/weapon/card/id"), [live(f.src)]))), "centcom");
	rt.setFv(f, "access", live(W), (yield* g.call(f, P("/proc/get_all_accesses"), null, [])));
	rt.modField(f, live(W), "access", (yield* g.call(f, P("/proc/get_all_centcom_access"), null, [])), add);
	rt.setFv(f, "assignment", live(W), "Highlander");
	rt.setFv(f, "registered_name", live(W), rt.sv(f, "real_name"));
	(rt.modField(f, live(W), "flags", 2, rt.bitOr));
	yield* g.callName(f, live(W), "update_label", [rt.sv(f, "real_name")]);
	yield* g.srcCall(f, "equip_to_slot_or_del", live(W), 6);
	H1 = (yield* g.new_(f, T("/obj/item/weapon/claymore/highlander"), [live(f.src)]));
	if (!truthy(rt.gl("highlander"))) {
		rt.setFv(f, "admin_spawned", live(H1), 1);
	}
	yield* g.srcCall(f, "put_in_hands", live(H1));
	yield* g.callName(f, live(H1), "pickup", [live(f.src)]);
	rt.setFv(f, "name", (antiwelder = (yield* g.new_(f, T("/obj/item/weapon/bloodcrawl"), [live(f.src)]))), "compulsion of honor");
	rt.setFv(f, "desc", live(antiwelder), "You are unable to hold anything in this hand until you're the last one left!");
	rt.setFv(f, "icon_state", live(antiwelder), "bloodhand_right");
	yield* g.srcCall(f, "put_in_hands", live(antiwelder));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='boldannounce'>Your ＀ cries out for blood. Claim the lives of others, and your own will be restored!\nActivate it in your hand, and it will lead to the nearest target. Attack the nuclear authentication disk with it, and you will store it.</span>", [rt.fv(f, "name", live(H1))])]);
	return f.dot;
}, true);

// /proc/only_me  (code/modules/admin/verbs/onlyone.dm:82)  may sleep
rt.def("/proc/only_me", function* only_me(f: Frame) {
	let H: Value = null, hijack_objective: Value = null, G: Value = null, slot_item_ID: Value = null, slot_item_hand: Value = null, multi: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [H, hijack_objective, G, slot_item_ID, slot_item_hand, multi, W, $e];
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/alert"), null, ["The game hasn't started yet!"]);
		return live(f.dot);
	}
	H = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if ((isEqual(rt.fv(f, "stat", live(H)), 2) || !truthy(rt.fv(f, "client", live(H))))) {
			continue;
		}
		if (truthy((yield* g.call(f, P("/proc/is_special_character"), null, [live(H)])))) {
			continue;
		}
		rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(H)), add);
		rt.setFv(f, "special_role", rt.fv(f, "mind", live(H)), fmt("＀ Prime", [rt.fv(f, "real_name", live(H))]));
		rt.setFv(f, "owner", (hijack_objective = (yield* g.new_(f, T("/datum/objective/hijackclone"), []))), rt.fv(f, "mind", live(H)));
		rt.modField(f, rt.fv(f, "mind", live(H)), "objectives", live(hijack_objective), add);
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<B>You are the multiverse summoner. Activate your blade to summon copies of yourself from another universe to fight by your side.</B>"]);
		yield* g.callName(f, rt.fv(f, "mind", live(H)), "announce_objectives", []);
		G = (yield* g.new_(f, T("/datum/gang/multiverse"), [live(f.src), fmt("＀", [rt.fv(f, "real_name", live(H))])]));
		rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "gangs", live(G), add);
		rt.setAt(rt.fv(f, "bosses", live(G)), rt.fv(f, "mind", live(H)), 0);
		yield* g.callName(f, live(G), "add_gang_hud", [rt.fv(f, "mind", live(H))]);
		rt.setFv(f, "gang_datum", rt.fv(f, "mind", live(H)), live(G));
		yield* g.call(f, P("/proc/qdel"), null, [(slot_item_ID = (yield* g.callName(f, live(H), "get_item_by_slot", [6])))]);
		slot_item_hand = (yield* g.callName(f, live(H), "get_item_for_held_index", [2]));
		yield* g.callName(f, live(H), "dropItemToGround", [live(slot_item_hand)]);
		multi = (yield* g.new_(f, T("/obj/item/weapon/multisword"), [live(H)]));
		yield* g.callName(f, live(H), "put_in_hands_or_del", [live(multi)]);
		rt.setFv(f, "icon_state", (W = (yield* g.new_(f, T("/obj/item/weapon/card/id"), [live(H)]))), "centcom");
		rt.setFv(f, "access", live(W), (yield* g.call(f, P("/proc/get_all_accesses"), null, [])));
		rt.modField(f, live(W), "access", (yield* g.call(f, P("/proc/get_all_centcom_access"), null, [])), add);
		rt.setFv(f, "assignment", live(W), "Multiverse Summoner");
		rt.setFv(f, "registered_name", live(W), rt.fv(f, "real_name", live(H)));
		yield* g.callName(f, live(W), "update_label", [rt.fv(f, "real_name", live(H))]);
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [live(W), 6]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ used THERE CAN BE ONLY ME!</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]))])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ used there can be only me.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))])]);
	return f.dot;
}, true);
