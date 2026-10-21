// From code/modules/spells/spell_types/lichdom.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11325, "/obj/effect/proc_holder/spell/targeted/lichdom", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 1,
	name: "Bind Soul",
	desc: "A dark necromantic pact that can forever bind your soul to an item of your choosing. So long as both your body and the item remain intact and on the same plane you can revive from death, though the time between reincarnations grows steadily with use, along with the weakness that the new skeleton body will experience upon 'birth'. Note that becoming a lich destroys all internal organs except the brain.",
	school: "necromancy",
	charge_max: 10,
	clothes_req: 0,
	centcom_cancast: 0,
	invocation: "NECREM IMORTIUM!",
	invocation_type: "shout",
	range: -1,
	level_max: 0,
	cooldown_min: 10,
	action_icon_state: "skeleton",
});

// /obj/effect/proc_holder/spell/targeted/lichdom/proc/cast  (code/modules/spells/spell_types/lichdom.dm:23)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/lichdom/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let M: Value = null, hand_items: Value = null, marked_item: Value = null, item: Value = null, H: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [targets, user, M, hand_items, marked_item, item, H, $0, $1, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	M = null;
	rt.forList(f, 0, live(targets), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		hand_items = rt.list();
		if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
			hand_items = rt.list((yield* g.callName(f, live(M), "get_active_held_item", [])), (yield* g.callName(f, live(M), "get_inactive_held_item", [])));
		}
		if (!truthy(rt.len(f, live(hand_items)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='caution'>You must hold an item you wish to make your phylactery...</span>"]);
			return live(f.dot);
		}
		marked_item = null;
		item = null;
		rt.forList(f, 1, live(hand_items), T("/obj"));
		while (($e = rt.next(f, 1)) !== undefined) {
			item = $e;
			$0 = (rt.isIn(f, 128, (rt.fv(f, "flags", live(item)) || 2)) ? 1 : 0);
			$1 = rt.fv(f, "flags", live(item));
			if (!truthy($1)) {
				if (truthy(rt.fv(f, "secondary_flags", live(item)))) {
					$1 = rt.index(rt.fv(f, "secondary_flags", live(item)), "stationloving");
				} else {
					$1 = 0;
				}
			}
			if (truthy((rt.isIn(f, $0, $1) ? 1 : 0))) {
				continue;
			}
			marked_item = live(item);
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>You begin to focus your very being into ＀...</span>", [live(item)])]);
			break;
		}
		rt.endFor(f, 1);
		if (!truthy(live(marked_item))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>None of the items you hold are suitable for emplacement of your fragile soul.</span>"]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/effects/pope_entry.ogg"), 100]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(M), null, 50, "needhand", 0, "target", live(marked_item)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>Your soul snaps back to your body as you stop ensouling ＀!</span>", [live(marked_item)])]);
			return live(f.dot);
		}
		rt.setFv(f, "name", live(marked_item), fmt("ensouled ＀", [rt.fv(f, "name", live(marked_item))]));
		rt.modField(f, live(marked_item), "desc", "\nA terrible aura surrounds this item, its very existence is offensive to life itself...", add);
		yield* g.callName(f, live(marked_item), "add_atom_colour", ["#003300", 1]);
		yield* g.new_(f, T("/obj/item/phylactery"), [live(marked_item), rt.fv(f, "mind", live(M))]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='userdanger'>With a hideous feeling of emptiness you watch in horrified fascination as skin sloughs off bone! Blood boils, nerves disintegrate, eyes boil in their sockets! As your organs crumble to dust in your fleshless chest you come to terms with your choice. You're a lich!</span>"]);
		yield* g.callName(f, live(M), "set_species", [T("/datum/species/skeleton")]);
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.callName(f, (H = live(M)), "dropItemToGround", [rt.fv(f, "w_uniform", live(H))]);
			yield* g.callName(f, live(H), "dropItemToGround", [rt.fv(f, "wear_suit", live(H))]);
			yield* g.callName(f, live(H), "dropItemToGround", [rt.fv(f, "head", live(H))]);
			yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/wizrobe/black"), [live(H)])), 13]);
			yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/wizard/black"), [live(H)])), 11]);
			yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/color/black"), [live(H)])), 14]);
		}
		yield* g.callName(f, rt.fv(f, "mind", live(M)), "RemoveSpell", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(10162, "/obj/item/phylactery", "/obj/item", {
	lon_range: 3,
	resurrections: 0,
	mind: null,
	respawn_time: 1800,
	light_color: "#003300",
	name: "phylactery",
	desc: "Stores souls. Revives liches. Also repels mosquitos.",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	icon_state: "bluespace",
	color: "#003300",
}, { global: { active_phylacteries: 744 } });

// /obj/item/phylactery/proc/Initialize  (code/modules/spells/spell_types/lichdom.dm:88)  may sleep
rt.def("/obj/item/phylactery/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "mind", live(f.args[1]));
	rt.setSv(f, "name", fmt("phylactery of ＀", [rt.fv(f, "name", rt.sv(f, "mind"))]));
	rt.incGl("active_phylacteries", 1, true);
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.srcCall(f, "set_light", rt.sv(f, "lon_range"));
	if (!truthy(rt.initial(f, rt.fv(f, "mode", rt.gl("SSticker")), "round_ends_with_antag_death"))) return f.dot;
	rt.setFv(f, "round_ends_with_antag_death", rt.fv(f, "mode", rt.gl("SSticker")), 0);
	return f.dot;
}, true, { args: ["mapload", "newmind"] });

// /obj/item/phylactery/proc/Destroy  (code/modules/spells/spell_types/lichdom.dm:100)  may sleep
rt.def("/obj/item/phylactery/proc/Destroy", function* Destroy(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	rt.incGl("active_phylacteries", -1, true);
	(rt.modGl("poi_list", live(f.src), subtract));
	if (!truthy(rt.gl("active_phylacteries"))) {
		rt.setFv(f, "round_ends_with_antag_death", rt.fv(f, "mode", rt.gl("SSticker")), rt.initial(f, rt.fv(f, "mode", rt.gl("SSticker")), "round_ends_with_antag_death"));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["force"] });

// /obj/item/phylactery/proc/process  (code/modules/spells/spell_types/lichdom.dm:108)  may sleep
rt.def("/obj/item/phylactery/proc/process", function* process(f: Frame) {
	if ((!truthy(rt.sv(f, "mind")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "mind"))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (!(!truthy(rt.fv(f, "current", rt.sv(f, "mind"))) || (truthy(rt.fv(f, "current", rt.sv(f, "mind"))) && isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "mind"))), 2)))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/phylactery/proc/rise")])), rt.sv(f, "respawn_time"), 1]);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/phylactery/proc/rise  (code/modules/spells/spell_types/lichdom.dm:116)  may sleep
rt.def("/obj/item/phylactery/proc/rise", function* rise(f: Frame) {
	let item_turf: Value = null, old_body: Value = null, lich: Value = null, body_turf: Value = null, C: Value = null, W: Value = null, X: Value = null, I: Value = null, wheres_wizdo: Value = null;
	let $e: any;
	f.vars = () => [item_turf, old_body, lich, body_turf, C, W, X, I, wheres_wizdo, $e];
	if ((truthy(rt.fv(f, "current", rt.sv(f, "mind"))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "mind"))), 2))) {
		return fmt("＀ already has a living body: ＀", [rt.sv(f, "mind"), rt.fv(f, "current", rt.sv(f, "mind"))]);
	}
	if (!truthy((item_turf = rt.getStep(f, live(f.src), 0)))) {
		return fmt("＀ is not at a turf? NULLSPACE!?", [live(f.src)]);
	}
	old_body = rt.fv(f, "current", rt.sv(f, "mind"));
	yield* g.callName(f, (lich = (yield* g.new_(f, T("/mob/living/carbon/human"), [live(item_turf)]))), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sandal/magic"), [live(lich)])), 12]);
	yield* g.callName(f, live(lich), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/color/black"), [live(lich)])), 14]);
	yield* g.callName(f, live(lich), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/wizrobe/black"), [live(lich)])), 13]);
	yield* g.callName(f, live(lich), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/wizard/black"), [live(lich)])), 11]);
	rt.setFv(f, "real_name", live(lich), rt.fv(f, "name", rt.sv(f, "mind")));
	yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(lich)]);
	yield* g.callName(f, rt.sv(f, "mind"), "grab_ghost", ["force", 1], rt.Args.Named);
	yield* g.callName(f, live(lich), "hardset_dna", [null, null, rt.fv(f, "real_name", live(lich)), null, T("/datum/species/skeleton")]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(lich), "<span class='warning'>Your bones clatter and shutter as you are pulled back into this world!</span>"]);
	body_turf = rt.getStep(f, live(old_body), 0);
	yield* g.callName(f, live(lich), "Knockdown", [add(200, multiply(200, rt.sv(f, "resurrections")))]);
	rt.incSrcVar(f, "resurrections", 1, true);
	if ((truthy(live(old_body)) && truthy(rt.fv(f, "loc", live(old_body))))) {
		if (truthy((rt.istype(live(old_body), T("/mob/living/carbon")) ? 1 : 0))) {
			C = live(old_body);
			W = null;
			rt.forList(f, 0, live(C), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				W = $e;
				yield* g.callName(f, live(C), "dropItemToGround", [live(W)]);
			}
			rt.endFor(f, 0);
			X = null;
			rt.forList(f, 0, rt.fv(f, "internal_organs", live(C)));
			while (($e = rt.next(f, 0)) !== undefined) {
				X = $e;
				yield* g.callName(f, (I = live(X)), "Remove", [live(C)]);
				yield* g.callName(f, live(I), "forceMove", [live(body_turf)]);
			}
			rt.endFor(f, 0);
		}
		if (truthy((wheres_wizdo = (yield* g.call(f, P("/proc/dir2text"), null, [rt.getDir(f, live(body_turf), live(item_turf))]))))) {
			yield* g.callName(f, live(old_body), "visible_message", [fmt("<span class='warning'>Suddenly ＀'s corpse falls to pieces! You see a strange energy rise from the remains, and speed off towards the ＀!</span>", [rt.fv(f, "name", live(old_body)), live(wheres_wizdo)])]);
			yield* g.callName(f, live(body_turf), "Beam", [null, live(item_turf), "icon_state", "lichbeam", "time", add(10, multiply(10, rt.sv(f, "resurrections"))), "maxdistance", 9.999999848243207e+30], rt.Args.Named);
		}
		yield* g.callName(f, live(old_body), "dust", []);
	}
	return fmt("Respawn of ＀ successful.", [rt.sv(f, "mind")]);
}, true);
