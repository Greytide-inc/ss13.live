// From code/modules/mob/mob.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/Destroy  (code/modules/mob/mob.dm:2)  may sleep
rt.def("/mob/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null, observe: Value = null, infection: Value = null, cc: Value = null;
	let $e: any;
	f.vars = () => [M, observe, infection, cc, $e];
	yield* g.srcCall(f, "set_typing_indicator", 0);
	(rt.modGl("mob_list", live(f.src), subtract));
	(rt.modGl("dead_mob_list", live(f.src), subtract));
	(rt.modGl("living_mob_list", live(f.src), subtract));
	(rt.modGl("all_clockwork_mobs", live(f.src), subtract));
	(rt.modGl("mob_directory", rt.sv(f, "tag"), subtract));
	if ((truthy(rt.sv(f, "observers")) && truthy(rt.len(f, rt.sv(f, "observers"))))) {
		M = null;
		rt.forList(f, 0, rt.sv(f, "observers"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.callName(f, (observe = live(M)), "reset_perspective", [null]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "hud_used")]);
	if ((truthy(rt.sv(f, "mind")) && isEqual(rt.fv(f, "current", rt.sv(f, "mind")), live(f.src)))) {
		yield* g.srcCall(f, "spellremove", live(f.src));
	}
	infection = null;
	rt.forList(f, 0, rt.sv(f, "viruses"));
	while (($e = rt.next(f, 0)) !== undefined) {
		infection = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(infection)]);
	}
	rt.endFor(f, 0);
	cc = null;
	rt.forList(f, 0, rt.sv(f, "client_colours"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cc = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(cc)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "client_colours", null);
	yield* g.srcCall(f, "ghostize");
	yield* g.callSuper(f, [], rt.Args.Same);
	return 3;
}, true);

// /mob/proc/Initialize  (code/modules/mob/mob.dm:25)  may sleep
rt.def("/mob/proc/Initialize", function* Initialize(f: Frame) {
	let v: Value = null, AA: Value = null;
	let $e: any;
	f.vars = () => [v, AA, $e];
	rt.setSv(f, "tag", fmt("mob_＀", [rt.incGl("next_mob_id", 1, true)]));
	rt.modGl("mob_list", live(f.src), add);
	rt.setAt(rt.gl("mob_directory"), rt.sv(f, "tag"), live(f.src));
	if (isEqual(rt.sv(f, "stat"), 2)) {
		rt.modGl("dead_mob_list", live(f.src), add);
	} else {
		rt.modGl("living_mob_list", live(f.src), add);
	}
	yield* g.srcCall(f, "prepare_huds");
	rt.setSv(f, "can_ride_typecache", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "can_ride_typecache")])));
	v = null;
	rt.forList(f, 0, rt.gl("active_alternate_appearances"));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		if (!truthy(live(v))) {
			continue;
		}
		yield* g.callName(f, (AA = live(v)), "onNewMob", [live(f.src)]);
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /atom/proc/prepare_huds  (code/modules/mob/mob.dm:42)
rt.def("/atom/proc/prepare_huds", function prepare_huds(f: Frame) {
	let hud: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [hud, I, $e];
	rt.setSv(f, "hud_list", rt.list());
	hud = null;
	rt.forList(f, 0, rt.sv(f, "hud_possible"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hud = $e;
		rt.setFv(f, "appearance_flags", (I = rt.call(f, P("/proc/image"), null, [rt.rsc("icons/mob/hud.dmi"), live(f.src), ""])), 10);
		rt.setAt(rt.sv(f, "hud_list"), live(hud), live(I));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/proc/Cell  (code/modules/mob/mob.dm:52)
rt.def("/mob/proc/Cell", function Cell(f: Frame) {
	let environment: Value = null, t: Value = null, id: Value = null, gas: Value = null;
	let $e: any;
	f.vars = () => [environment, t, id, gas, $e];
	if (!truthy(rt.sv(f, "loc"))) {
		return 0;
	}
	environment = rt.callName(f, rt.sv(f, "loc"), "return_air", []);
	t = fmt("<span class='notice'>Coordinates: ＀,＀ \n</span>", [rt.sv(f, "x"), rt.sv(f, "y")]);
	t = rt.modify(live(t), fmt("<span class='danger'>Temperature: ＀ \n</span>", [rt.fv(f, "temperature", live(environment))]), add);
	id = null;
	rt.forList(f, 0, rt.fv(f, "gases", live(environment)));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		if (truthy(rt.index((gas = rt.index(rt.fv(f, "gases", live(environment)), live(id))), 1))) {
			t = rt.modify(live(t), fmt("<span class='notice'>＀: ＀ \n</span>", [rt.index(rt.index(live(gas), 3), 2), rt.index(live(gas), 1)]), add);
		}
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), live(t)]);
	return f.dot;
}, false, { hidden: true, verb: { category: "Admin" } });

// /mob/proc/show_message  (code/modules/mob/mob.dm:67)
rt.def("/mob/proc/show_message", function show_message(f: Frame, msg: Value, type: Value, alt_msg: Value, alt_type: Value) {
	f.vars = () => [msg, type];
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	msg = rt.call(f, P("/proc/copytext"), null, [live(msg), 1, 1024]);
	if (truthy(live(type))) {
		if ((truthy(rt.bitAnd(live(type), 1)) && truthy(rt.sv(f, "eye_blind")))) {
			if (!truthy(live(alt_msg))) {
				return live(f.dot);
			} else {
				msg = live(alt_msg);
				type = live(alt_type);
			}
		}
		if ((truthy(rt.bitAnd(live(type), 2)) && !truthy(rt.callSrc(f, "can_hear", [])))) {
			if (!truthy(live(alt_msg))) {
				return live(f.dot);
			} else {
				msg = live(alt_msg);
				if ((truthy(rt.bitAnd((type = live(alt_type)), 1)) && truthy(rt.sv(f, "eye_blind")))) {
					return live(f.dot);
				}
			}
		}
	}
	if (isEqual(rt.sv(f, "stat"), 1)) {
		if (truthy(rt.bitAnd(live(type), 2))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<I>... You can almost hear something ...</I>"]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), live(msg)]);
	}
	return f.dot;
});

// /atom/proc/visible_message  (code/modules/mob/mob.dm:105)
rt.def("/atom/proc/visible_message", function visible_message(f: Frame, message: Value, self_message: Value, blind_message: Value, vision_distance: Value, ignored_mob: Value) {
	let _T: Value = null, range: Value = null, M: Value = null, msg: Value = null, C: Value = null, MT: Value = null;
	let $e: any;
	f.vars = () => [_T, range, M, msg, C, MT, $e];
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	range = 7;
	if (truthy(live(vision_distance))) {
		range = live(vision_distance);
	}
	// stress2c: only mobs with a client get the message, and a hearer is never further than `range` tiles from _T. With no
	// player's mob that close, skip the view() and the hearer scan. TG_CHECK_VISMSG=1 scans anyway and counts any client
	// mob found after the pre-check said there was none.
	let near = 0;
	rt.forList(f, 0, rt.gl("clients"), T("/client"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		MT = truthy(rt.fv(f, "mob", live(C))) ? rt.getStep(f, rt.fv(f, "mob", live(C)), 0) : null;
		if (truthy(live(MT)) && isEqual(rt.fv(f, "z", live(MT)), rt.fv(f, "z", live(_T))) && rt.le(rt.call(f, P("/proc/get_dist"), null, [live(MT), live(_T)]), live(range))) {
			near = 1;
			break;
		}
	}
	rt.endFor(f, 0);
	const vchk = truthy(rt.call(f, P("/proc/vismsg_check_mode"), null, []));
	if (!near && !vchk) {
		return live(f.dot);
	}
	M = null;
	rt.forList(f, 0, rt.call(f, P("/proc/get_hearers_in_view"), null, [live(range), live(f.src)]), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy(rt.fv(f, "client", live(M)))) {
			continue;
		}
		if (vchk) rt.call(f, P("/proc/vismsg_check"), null, [near]);
		if (isEqual(live(M), live(ignored_mob))) {
			continue;
		}
		msg = live(message);
		if (isEqual(live(M), live(f.src))) {
			if (truthy(live(self_message))) {
				msg = live(self_message);
			}
		} else {
			if ((rt.lt(rt.fv(f, "see_invisible", live(M)), rt.sv(f, "invisibility")) || (!isEqual(live(_T), rt.sv(f, "loc")) && !isEqual(live(_T), live(f.src))))) {
				if (truthy(live(blind_message))) {
					msg = live(blind_message);
				} else {
					continue;
				}
			} else {
				if (truthy(rt.fv(f, "lighting_object", live(_T)))) {
					if ((rt.le(rt.gv(f, "invisibility", rt.fv(f, "lighting_object", live(_T))), rt.fv(f, "see_invisible", live(M))) && truthy(rt.callName(f, live(_T), "is_softly_lit", [])))) {
						if (truthy(live(blind_message))) {
							msg = live(blind_message);
						} else {
							continue;
						}
					}
				}
			}
		}
		rt.callName(f, live(M), "show_message", [live(msg), 1, live(blind_message), 2]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/proc/audible_message  (code/modules/mob/mob.dm:146)
rt.def("/mob/proc/audible_message", function audible_message(f: Frame, message: Value, deaf_message: Value, hearing_distance: Value, self_message: Value) {
	let range: Value = null, M: Value = null, msg: Value = null;
	let $e: any;
	f.vars = () => [range, M, msg, $e];
	range = 7;
	if (truthy(live(hearing_distance))) {
		range = live(hearing_distance);
	}
	M = null;
	rt.forList(f, 0, rt.call(f, P("/proc/get_hearers_in_view"), null, [live(range), live(f.src)]), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		msg = live(message);
		if ((truthy(live(self_message)) && isEqual(live(M), live(f.src)))) {
			msg = live(self_message);
		}
		rt.callName(f, live(M), "show_message", [live(msg), 2, live(deaf_message), 1]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /atom/proc/audible_message  (code/modules/mob/mob.dm:162)
rt.def("/atom/proc/audible_message", function audible_message(f: Frame, message: Value, deaf_message: Value, hearing_distance: Value) {
	let range: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [range, M, $e];
	range = 7;
	if (truthy(live(hearing_distance))) {
		range = live(hearing_distance);
	}
	M = null;
	rt.forList(f, 0, rt.call(f, P("/proc/get_hearers_in_view"), null, [live(range), live(f.src)]), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.callName(f, live(M), "show_message", [live(message), 2, live(deaf_message), 1]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/proc/get_item_by_slot  (code/modules/mob/mob.dm:174)
rt.def("/mob/proc/get_item_by_slot", function get_item_by_slot(f: Frame, slot_id: Value) {
	return null;
});

// /mob/proc/attack_ui  (code/modules/mob/mob.dm:184)  may sleep
rt.def("/mob/proc/attack_ui", function* attack_ui(f: Frame, slot: Value) {
	let W: Value = null, I: Value = null;
	f.vars = () => [slot, W, I];
	if (truthy((rt.istype((W = (yield* g.srcCall(f, "get_active_held_item"))), T("/obj/item")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "equip_to_slot_if_possible", live(W), live(slot), 0, 0, 0)))) {
			return 1;
		}
	}
	if (!truthy(live(W))) {
		if (truthy((rt.istype((I = (yield* g.srcCall(f, "get_item_by_slot", live(slot)))), T("/obj/item")) ? 1 : 0))) {
			yield* g.callName(f, live(I), "attack_hand", [live(f.src)]);
		}
	}
	return 0;
}, true);

// /mob/proc/equip_to_slot_if_possible  (code/modules/mob/mob.dm:203)  may sleep
rt.def("/mob/proc/equip_to_slot_if_possible", function* equip_to_slot_if_possible(f: Frame, W: Value, slot: Value, qdel_on_fail: Value, disable_warning: Value, redraw_mob: Value, bypass_equip_delay_self: Value) {
	f.vars = () => [W, slot, qdel_on_fail, disable_warning, redraw_mob, bypass_equip_delay_self];
	if (live(qdel_on_fail) === null) {
		qdel_on_fail = 0;
	}
	if (live(disable_warning) === null) {
		disable_warning = 0;
	}
	if (live(redraw_mob) === null) {
		redraw_mob = 1;
	}
	if (live(bypass_equip_delay_self) === null) {
		bypass_equip_delay_self = 0;
	}
	if (!truthy((rt.istype(live(W), T("/obj/item")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy((yield* g.callName(f, live(W), "mob_can_equip", [live(f.src), null, live(slot), live(disable_warning), live(bypass_equip_delay_self)])))) {
		if (truthy(live(qdel_on_fail))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
		} else {
			if (!truthy(live(disable_warning))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You are unable to equip that!</span>"]);
			}
		}
		return 0;
	}
	yield* g.srcCall(f, "equip_to_slot", live(W), live(slot), live(redraw_mob));
	return 1;
}, true);

// /mob/proc/equip_to_slot_or_del  (code/modules/mob/mob.dm:222)  may sleep
rt.def("/mob/proc/equip_to_slot_or_del", function* equip_to_slot_or_del(f: Frame, W: Value, slot: Value) {
	f.vars = () => [W, slot];
	return (yield* g.srcCall(f, "equip_to_slot_if_possible", live(W), live(slot), 1, 1, 0, 1));
}, true);

// /mob/proc/equip_to_appropriate_slot  (code/modules/mob/mob.dm:227)  may sleep
rt.def("/mob/proc/equip_to_appropriate_slot", function* equip_to_appropriate_slot(f: Frame, W: Value) {
	let slot_priority: Value = null, slot: Value = null;
	let $e: any;
	f.vars = () => [W, slot_priority, slot, $e];
	if (!truthy((rt.istype(live(W), T("/obj/item")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy((slot_priority = rt.fv(f, "slot_equipment_priority", live(W))))) {
		slot_priority = rt.list(1, 6, 14, 13, 2, 11, 10, 12, 9, 7, 8, 5, 17, 15, 16, 20);
	}
	slot = null;
	rt.forList(f, 0, live(slot_priority));
	while (($e = rt.next(f, 0)) !== undefined) {
		slot = $e;
		if (truthy((yield* g.srcCall(f, "equip_to_slot_if_possible", live(W), live(slot), 0, 1, 1)))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /mob/proc/reset_perspective  (code/modules/mob/mob.dm:250)
rt.def("/mob/proc/reset_perspective", function reset_perspective(f: Frame, A: Value) {
	if (!truthy(rt.sv(f, "client"))) return f.dot;
	if (truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0))) {
		rt.setFv(f, "perspective", rt.sv(f, "client"), 1);
		rt.setFv(f, "eye", rt.sv(f, "client"), live(A));
	} else {
		if (truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) {
			rt.setFv(f, "eye", rt.sv(f, "client"), rt.fv(f, "mob", rt.sv(f, "client")));
			rt.setFv(f, "perspective", rt.sv(f, "client"), 0);
		} else {
			rt.setFv(f, "perspective", rt.sv(f, "client"), 1);
			rt.setFv(f, "eye", rt.sv(f, "client"), rt.sv(f, "loc"));
		}
	}
	return 1;
});

// /mob/living/proc/reset_perspective  (code/modules/mob/mob.dm:263)  may sleep
rt.def("/mob/living/proc/reset_perspective", function* reset_perspective(f: Frame) {
	let AT: Value = null;
	f.vars = () => [AT];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "update_sight");
	if (!isEqual(rt.fv(f, "eye", rt.sv(f, "client")), live(f.src))) {
		yield* g.callName(f, (AT = rt.fv(f, "eye", rt.sv(f, "client"))), "get_remote_view_fullscreens", [live(f.src)]);
	} else {
		yield* g.srcCall(f, "clear_fullscreen", "remote_view", 0);
	}
	yield* g.srcCall(f, "update_pipe_vision");
	return f.dot;
}, true, { args: ["A"] });

// /mob/verb/examinate  (code/modules/mob/mob.dm:280)  may sleep
rt.def("/mob/verb/examinate", function* examinate(f: Frame, A: Value) {
	f.vars = () => [A];
	if (truthy((yield* g.call(f, P("/proc/is_blind"), null, [live(f.src)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Something is there but you can't see it.</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "face_atom", live(A));
	yield* g.callName(f, live(A), "examine", [live(f.src)]);
	return f.dot;
}, true, { verb: { name: "Examine", category: "IC" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });

// /mob/verb/pointed  (code/modules/mob/mob.dm:295)  may sleep
rt.def("/mob/verb/pointed", function* pointed(f: Frame, A: Value) {
	let tile: Value = null;
	f.vars = () => [A, tile];
	if (((!truthy(live(f.src)) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))])))) || !truthy((rt.isIn(f, live(A), (yield* g.call(f, P("/proc/view"), null, [rt.fv(f, "loc", live(f.src))]))) ? 1 : 0)))) {
		return 0;
	}
	if (truthy((rt.istype(live(A), T("/obj/effect/temp_visual/point")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy((tile = rt.getStep(f, live(A), 0)))) {
		return 0;
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/point"), [live(A), rt.sv(f, "invisibility")]);
	return 1;
}, true, { verb: { name: "Point To", category: "Object" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });

// /mob/proc/start_pulling  (code/modules/mob/mob.dm:310)  may sleep
rt.def("/mob/proc/start_pulling", function* start_pulling(f: Frame, AM: Value, supress_message: Value) {
	let M: Value = null;
	f.vars = () => [AM, supress_message, M];
	if (live(supress_message) === null) {
		supress_message = 0;
	}
	if ((!truthy(live(AM)) || !truthy(live(f.src)))) {
		return 0;
	}
	if (!truthy((yield* g.callName(f, live(AM), "can_be_pulled", [live(f.src)])))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "throwing")) || truthy((yield* g.srcCall(f, "incapacitated"))))) {
		return 0;
	}
	// tg_js, tg e165969821 (2021): a pull ring (A pulls B pulls A) made Move() recurse forever. Break the chain that leads back to us.
	// Only mobs pull here (2017 tg keeps `pulling` on /mob), so the chain is followed through mobs only.
	M = rt.istype(live(AM), T("/mob")) ? rt.fv(f, "pulling", live(AM)) : null;
	for (let hops = 0; truthy(live(M)) && hops < 50; hops++) {
		if (isEqual(live(M), live(f.src))) {
			yield* g.callName(f, live(AM), "stop_pulling", []);
			break;
		}
		M = rt.istype(live(M), T("/mob")) ? rt.fv(f, "pulling", live(M)) : null;
	}
	M = null;
	yield* g.callName(f, live(AM), "add_fingerprint", [live(f.src)]);
	if (truthy(rt.sv(f, "pulling"))) {
		if (isEqual(live(AM), rt.sv(f, "pulling"))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "stop_pulling");
	}
	yield* g.srcCall(f, "changeNext_move", 10);
	if (truthy(rt.fv(f, "pulledby", live(AM)))) {
		if (!truthy(live(supress_message))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has pulled ＀ from ＀'s grip.</span>", [live(f.src), live(AM), rt.fv(f, "pulledby", live(AM))]));
		}
		yield* g.callName(f, rt.fv(f, "pulledby", live(AM)), "stop_pulling", []);
	}
	rt.setSv(f, "pulling", live(AM));
	rt.setFv(f, "pulledby", live(AM), live(f.src));
	if (!truthy(live(supress_message))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
	}
	yield* g.srcCall(f, "update_pull_hud_icon");
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) return f.dot;
	M = live(AM);
	if (!truthy(live(supress_message))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ has grabbed ＀ passively!</span>", [live(f.src), live(M)]));
	}
	if (!truthy((rt.istype(live(f.src), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.setFv(f, "LAssailant", live(M), null);
	} else {
		rt.setFv(f, "LAssailant", live(M), live(f.usr));
	}
	return f.dot;
}, true);

// /mob/proc/spin  (code/modules/mob/mob.dm:350)  may sleep
rt.def("/mob/proc/spin", function* spin(f: Frame, spintime: Value, speed: Value) {
	let D: Value = null;
	let $0: any;
	f.vars = () => [spintime, speed, D, $0];
	D = rt.sv(f, "dir");
	if ((((rt.lt(live(spintime), 1) || rt.lt(live(speed), 1)) || !truthy(live(spintime))) || !truthy(live(speed)))) {
		return live(f.dot);
	}
	while (rt.ge(live(spintime), live(speed))) {
		yield* g.call(f, P("/proc/sleep"), null, [live(speed)]);
		$0 = live(D);
		if ($0 === 1) {
			D = 4;
		} else if ($0 === 2) {
			D = 8;
		} else if ($0 === 4) {
			D = 2;
		} else if ($0 === 8) {
			D = 1;
		}
		yield* g.srcCall(f, "setDir", live(D));
		(spintime = rt.modify(live(spintime), live(speed), subtract));
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/verb/stop_pulling  (code/modules/mob/mob.dm:372)  may sleep
rt.def("/mob/verb/stop_pulling", function* stop_pulling(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy(rt.sv(f, "pulling"))) return f.dot;
	rt.setFv(f, "pulledby", rt.sv(f, "pulling"), null);
	if (truthy((rt.istype(rt.sv(f, "pulling"), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, (L = rt.sv(f, "pulling")), "update_canmove", []);
	}
	rt.setSv(f, "pulling", null);
	rt.setSv(f, "grab_state", 0);
	yield* g.srcCall(f, "update_pull_hud_icon");
	return f.dot;
}, true, { verb: { name: "Stop Pulling", category: "IC" } });

// /mob/proc/update_pull_hud_icon  (code/modules/mob/mob.dm:382)
rt.def("/mob/proc/update_pull_hud_icon", function update_pull_hud_icon(f: Frame) {
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	if (!truthy(rt.fv(f, "pull_icon", rt.sv(f, "hud_used")))) return f.dot;
	rt.callName(f, rt.fv(f, "pull_icon", rt.sv(f, "hud_used")), "update_icon", [live(f.src)]);
	return f.dot;
});

// /mob/verb/mode  (code/modules/mob/mob.dm:390)  may sleep
rt.def("/mob/verb/mode", function* mode(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/mecha")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "incapacitated")))) {
		return live(f.dot);
	}
	if (!truthy((I = (yield* g.srcCall(f, "get_active_held_item"))))) return f.dot;
	yield* g.callName(f, live(I), "attack_self", [live(f.src)]);
	yield* g.srcCall(f, "update_inv_hands");
	return f.dot;
}, true, { verb: { name: "Activate Held Object", category: "Object", src: 10 } });

// /mob/verb/memory  (code/modules/mob/mob.dm:418)
rt.def("/mob/verb/memory", function memory(f: Frame) {
	if (truthy(rt.sv(f, "mind"))) {
		rt.callName(f, rt.sv(f, "mind"), "show_memory", [live(f.src)]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "You don't have a mind datum for some reason, so you can't look at your notes, if you had any."]);
	}
	return f.dot;
}, false, { verb: { name: "Notes", category: "IC", desc: "View your character's notes memory." } });

// /mob/verb/add_memory  (code/modules/mob/mob.dm:426)
rt.def("/mob/verb/add_memory", function add_memory(f: Frame, msg: Value) {
	f.vars = () => [msg];
	if (truthy(rt.sv(f, "mind"))) {
		// tg_js, tg 0fa87b7bbd (2019): one note per 5 seconds (notes were spammed to bloat the round).
		if (rt.lt(rt.worldTime(f), rt.sv(f, "memory_throttle_time"))) return f.dot;
		rt.setSv(f, "memory_throttle_time", add(rt.worldTime(f), 50));
		msg = rt.call(f, P("/proc/sanitize"), null, [(msg = rt.call(f, P("/proc/copytext"), null, [live(msg), 1, 1024]))]);
		rt.callName(f, rt.sv(f, "mind"), "store_memory", [live(msg)]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "You don't have a mind datum for some reason, so you can't add a note to it."]);
	}
	return f.dot;
}, false, { verb: { name: "Add Note", category: "IC" }, argTypes: [{ type: 64 }] });

// /mob/verb/abandon_mob  (code/modules/mob/mob.dm:438)  may sleep
rt.def("/mob/verb/abandon_mob", function* abandon_mob(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy(rt.gl("abandon_allowed"))) {
		return live(f.dot);
	}
	if ((!isEqual(rt.sv(f, "stat"), 2) || !truthy(rt.gl("SSticker")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='boldnotice'>You must be dead to use this!</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀/＀ used abandon mob.", [rt.fv(f, "name", live(f.usr)), rt.fv(f, "key", live(f.usr))])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='boldnotice'>Please roleplay correctly!</span>"]);
	if (!truthy(rt.sv(f, "client"))) {
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ AM failed due to disconnect.", [rt.fv(f, "key", live(f.usr))])]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "screen", rt.sv(f, "client")), "Cut", []);
	rt.modField(f, rt.sv(f, "client"), "screen", rt.gl("void"), add);
	if (!truthy(rt.sv(f, "client"))) {
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ AM failed due to disconnect.", [rt.fv(f, "key", live(f.usr))])]);
		return live(f.dot);
	}
	M = (yield* g.new_(f, T("/mob/dead/new_player"), []));
	if (!truthy(rt.sv(f, "client"))) {
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ AM failed due to disconnect.", [rt.fv(f, "key", live(f.usr))])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
		return live(f.dot);
	}
	rt.setFv(f, "key", live(M), rt.sv(f, "key"));
	return live(f.dot);
}, true, { verb: { name: "Respawn", category: "OOC" } });

// /mob/verb/cancel_camera  (code/modules/mob/mob.dm:472)  may sleep
rt.def("/mob/verb/cancel_camera", function* cancel_camera(f: Frame) {
	yield* g.srcCall(f, "reset_perspective", null);
	yield* g.srcCall(f, "unset_machine");
	return f.dot;
}, true, { verb: { name: "Cancel Camera View", category: "OOC" } });

// /mob/proc/Topic  (code/modules/mob/mob.dm:489)  may sleep
rt.def("/mob/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let t1: Value = null, slot: Value = null, hand_index: Value = null, what: Value = null;
	f.vars = () => [href, href_list, t1, slot, hand_index, what];
	// tg_js: only your own windows (every mach_close link names the reader's own mob); any player could unset another's machine
	if (truthy(rt.at(live(href_list), "mach_close")) && isEqual(live(f.usr), live(f.src))) {
		t1 = fmt("window=＀", [rt.at(live(href_list), "mach_close")]);
		yield* g.srcCall(f, "unset_machine");
		rt.op(f, "Browse", [], [live(f.src), null, live(t1)], false);
	}
	if (truthy(rt.at(live(href_list), "refresh"))) {
		// tg_js: only a mob can be shown an inventory (a console as machine was an undefined-proc runtime; no link sends refresh to a mob)
		if ((truthy((rt.istype(rt.sv(f, "machine"), T("/mob")) ? 1 : 0)) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1))) {
			yield* g.srcCall(f, "show_inv", rt.sv(f, "machine"));
		}
	}
	if (truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src), 1, 1])))) {
		if (truthy(rt.at(live(href_list), "item"))) {
			slot = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "item")]));
			hand_index = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "hand_index")]));
			what = null;
			// tg_js: a hand is a whole number the mob has (0.5 was a list-index runtime, 3 a hand that isn't there)
			if (truthy(live(hand_index)) && !(Number.isInteger(live(hand_index)) && rt.ge(live(hand_index), 1) && rt.le(live(hand_index), rt.len(f, rt.sv(f, "held_items"))))) return f.dot;
			if (truthy(live(hand_index))) {
				what = (yield* g.srcCall(f, "get_item_for_held_index", live(hand_index)));
				slot = rt.list(live(slot), live(hand_index));
			} else {
				what = (yield* g.srcCall(f, "get_item_by_slot", live(slot)));
			}
			if (truthy(live(what))) {
				if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(what)), 128))) {
					yield* g.callName(f, live(f.usr), "stripPanelUnequip", [live(what), live(f.src), live(slot)]);
				}
			} else {
				yield* g.callName(f, live(f.usr), "stripPanelEquip", [live(what), live(f.src), live(slot)]);
			}
		}
	}
	if (!isEqual(rt.fv(f, "machine", live(f.usr)), live(f.src))) return f.dot;
	if (truthy((yield* g.srcCall(f, "Adjacent", live(f.usr))))) {
		yield* g.srcCall(f, "show_inv", live(f.usr));
	} else {
		rt.op(f, "Browse", [], [live(f.usr), null, fmt("window=mob＃", [live(f.src)])], false);
	}
	return f.dot;
}, true);

// /mob/proc/MouseDrop  (code/modules/mob/mob.dm:531)  may sleep
rt.def("/mob/proc/MouseDrop", function* MouseDrop(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.args[0]), live(f.usr))) {
		return live(f.dot);
	}
	if (isEqual(live(f.usr), live(f.src))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(f.usr))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "show_inv", live(f.usr));
	return f.dot;
}, true, { args: ["M"] });

// /mob/proc/is_active  (code/modules/mob/mob.dm:543)
rt.def("/mob/proc/is_active", function is_active(f: Frame) {
	return (rt.ge(0, rt.fv(f, "stat", live(f.usr))) ? 1 : 0);
});

// /mob/proc/see  (code/modules/mob/mob.dm:549)
rt.def("/mob/proc/see", function see(f: Frame, message: Value) {
	if (!truthy(rt.callSrc(f, "is_active", []))) {
		return 0;
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), live(message)]);
	return 1;
});

// /mob/proc/Stat  (code/modules/mob/mob.dm:559)  may sleep
rt.def("/mob/proc/Stat", function* Stat(f: Frame) {
	let cached: Value = null, ETA: Value = null, _T: Value = null, SS: Value = null, overrides: Value = null, I: Value = null, A: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [cached, ETA, _T, SS, overrides, I, A, $0, $1, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) {
		if (truthy(rt.sv(f, "client"))) {
			yield* g.call(f, P("/proc/stat"), null, [null, fmt("Ping: ＀ms (Average: ＀ms)", [(yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "lastping", rt.sv(f, "client")), 1])), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "avgping", rt.sv(f, "client")), 1]))])]);
		}
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Map: ＀", [rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping")))])]);
		if (truthy((cached = rt.fv(f, "next_map_config", rt.gl("SSmapping"))))) {
			yield* g.call(f, P("/proc/stat"), null, [null, fmt("Next Map: ＀", [rt.fv(f, "map_name", live(cached))])]);
		}
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Server Time: ＀", [(yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "YYYY-MM-DD hh:mm:ss"]))])]);
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Station Time: ＀", [(yield* g.call(f, P("/proc/worldtime2text"), null, []))])]);
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Time Dilation: ＀% AVG:(＀%, ＀%, ＀%)", [(yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "time_dilation_current", rt.gl("SStime_track")), 1])), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "time_dilation_avg_fast", rt.gl("SStime_track")), 1])), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "time_dilation_avg", rt.gl("SStime_track")), 1])), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "time_dilation_avg_slow", rt.gl("SStime_track")), 1]))])]);
		if (truthy(rt.fv(f, "emergency", rt.gl("SSshuttle")))) {
			if (truthy((ETA = (yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "getModeStr", []))))) {
				yield* g.call(f, P("/proc/stat"), null, [null, fmt("＀ ＀", [live(ETA), (yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "getTimerStr", []))])]);
			}
		}
	}
	if ((truthy(rt.sv(f, "client")) && truthy(rt.fv(f, "holder", rt.sv(f, "client"))))) {
		if (truthy((yield* g.call(f, P("/proc/statpanel"), null, ["MC"])))) {
			_T = rt.getStep(f, rt.fv(f, "eye", rt.sv(f, "client")), 0);
			yield* g.call(f, P("/proc/stat"), null, ["Location:", fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
			yield* g.call(f, P("/proc/stat"), null, ["CPU:", fmt("＀", [rt.fv(f, "cpu", rt.world())])]);
			yield* g.call(f, P("/proc/stat"), null, ["Instances:", fmt("＀", [rt.getLen(f, rt.fv(f, "contents", rt.world()))])]);
			yield* g.callName(f, rt.gl("GLOB"), "stat_entry", []);
			yield* g.callName(f, rt.gl("config"), "stat_entry", []);
			yield* g.call(f, P("/proc/stat"), null, [null]);
			if (truthy(rt.gl("Master"))) {
				yield* g.callName(f, rt.gl("Master"), "stat_entry", []);
			} else {
				yield* g.call(f, P("/proc/stat"), null, ["Master Controller:", "ERROR"]);
			}
			if (truthy(rt.gl("Failsafe"))) {
				yield* g.callName(f, rt.gl("Failsafe"), "stat_entry", []);
			} else {
				yield* g.call(f, P("/proc/stat"), null, ["Failsafe Controller:", "ERROR"]);
			}
			if (truthy(rt.gl("Master"))) {
				yield* g.call(f, P("/proc/stat"), null, [null]);
				SS = null;
				rt.forList(f, 0, rt.fv(f, "subsystems", rt.gl("Master")), T("/datum/controller/subsystem"));
				while (($e = rt.next(f, 0)) !== undefined) {
					SS = $e;
					yield* g.callName(f, live(SS), "stat_entry", []);
				}
				rt.endFor(f, 0);
			}
			yield* g.callName(f, rt.gl("cameranet"), "stat_entry", []);
		}
		if (truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Tickets"])))) {
			yield* g.callName(f, rt.gl("ahelp_tickets"), "stat_entry", []);
		}
	}
	if ((truthy(rt.sv(f, "listed_turf")) && truthy(rt.sv(f, "client")))) {
		if (!truthy((yield* g.srcCall(f, "TurfAdjacent", rt.sv(f, "listed_turf"))))) {
			rt.setSv(f, "listed_turf", null);
		} else {
			yield* g.call(f, P("/proc/statpanel"), null, [rt.fv(f, "name", rt.sv(f, "listed_turf")), null, rt.sv(f, "listed_turf")]);
			overrides = rt.list();
			I = null;
			rt.forList(f, 0, rt.fv(f, "images", rt.sv(f, "client")), T("/image"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				if (((truthy(rt.fv(f, "loc", live(I))) && isEqual(rt.gv(f, "loc", rt.fv(f, "loc", live(I))), rt.sv(f, "listed_turf"))) && truthy(rt.fv(f, "override", live(I))))) {
					overrides = rt.modify(live(overrides), rt.fv(f, "loc", live(I)), add);
				}
			}
			rt.endFor(f, 0);
			A = null;
			rt.forList(f, 0, rt.sv(f, "listed_turf"), T("/atom"));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				if (!truthy(rt.fv(f, "mouse_opacity", live(A)))) {
					continue;
				}
				if (rt.gt(rt.fv(f, "invisibility", live(A)), rt.sv(f, "see_invisible"))) {
					continue;
				}
				if ((truthy(rt.len(f, live(overrides))) && truthy((rt.isIn(f, live(A), live(overrides)) ? 1 : 0)))) {
					continue;
				}
				yield* g.call(f, P("/proc/statpanel"), null, [rt.fv(f, "name", rt.sv(f, "listed_turf")), null, live(A)]);
			}
			rt.endFor(f, 0);
		}
	}
	if (truthy(rt.sv(f, "mind"))) {
		yield* g.srcCall(f, "add_spells_to_statpanel", rt.fv(f, "spell_list", rt.sv(f, "mind")));
		if (truthy(rt.fv(f, "changeling", rt.sv(f, "mind")))) {
			yield* g.srcCall(f, "add_stings_to_statpanel", rt.gv(f, "purchasedpowers", rt.fv(f, "changeling", rt.sv(f, "mind"))));
		}
	}
	yield* g.srcCall(f, "add_spells_to_statpanel", rt.sv(f, "mob_spell_list"));
	return f.dot;
}, true);

// /mob/proc/add_spells_to_statpanel  (code/modules/mob/mob.dm:628)
rt.def("/mob/proc/add_spells_to_statpanel", function add_spells_to_statpanel(f: Frame, spells: Value) {
	let S: Value = null;
	let $0: any, $e: any;
	f.vars = () => [S, $0, $e];
	S = null;
	rt.forList(f, 0, live(spells), T("/obj/effect/proc_holder/spell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (truthy(rt.callName(f, live(S), "can_be_cast_by", [live(f.src)]))) {
			$0 = rt.fv(f, "charge_type", live(S));
			if ($0 === "recharge") {
				rt.call(f, P("/proc/statpanel"), null, [fmt("＀", [rt.fv(f, "panel", live(S))]), fmt("＀/＀", [divide(rt.fv(f, "charge_counter", live(S)), 10), divide(rt.fv(f, "charge_max", live(S)), 10)]), live(S)]);
			} else if ($0 === "charges") {
				rt.call(f, P("/proc/statpanel"), null, [fmt("＀", [rt.fv(f, "panel", live(S))]), fmt("＀/＀", [rt.fv(f, "charge_counter", live(S)), rt.fv(f, "charge_max", live(S))]), live(S)]);
			} else if ($0 === "holdervar") {
				rt.call(f, P("/proc/statpanel"), null, [fmt("＀", [rt.fv(f, "panel", live(S))]), fmt("＀ ＀", [rt.fv(f, "holder_var_type", live(S)), rt.fv(f, "holder_var_amount", live(S))]), live(S)]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/proc/add_stings_to_statpanel  (code/modules/mob/mob.dm:639)
rt.def("/mob/proc/add_stings_to_statpanel", function add_stings_to_statpanel(f: Frame, stings: Value) {
	let S: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [S, $0, $1, $e];
	S = null;
	rt.forList(f, 0, live(stings), T("/obj/effect/proc_holder/changeling"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((rt.ge(rt.fv(f, "chemical_cost", live(S)), 0) && truthy(rt.callName(f, live(S), "can_be_used_by", [live(f.src)])))) {
			$0 = fmt("＀", [rt.fv(f, "panel", live(S))]);
			if (rt.gt(rt.fv(f, "chemical_cost", live(S)), 0)) {
				$1 = fmt("＀", [rt.fv(f, "chemical_cost", live(S))]);
			} else {
				$1 = "";
			}
			rt.call(f, P("/proc/statpanel"), null, [$0, $1, live(S)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/proc/canface  (code/modules/mob/mob.dm:645)
rt.def("/mob/proc/canface", function canface(f: Frame) {
	if (!truthy(rt.sv(f, "canmove"))) {
		return 0;
	}
	if (truthy(rt.fv(f, "moving", rt.sv(f, "client")))) {
		return 0;
	}
	if (rt.lt(rt.worldTime(f), rt.fv(f, "move_delay", rt.sv(f, "client")))) {
		return 0;
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return 0;
	}
	if (truthy(rt.sv(f, "anchored"))) {
		return 0;
	}
	if (truthy(rt.sv(f, "notransform"))) {
		return 0;
	}
	if (truthy(rt.callSrc(f, "restrained", []))) {
		return 0;
	}
	return 1;
});

// /mob/proc/fall  (code/modules/mob/mob.dm:662)  may sleep
rt.def("/mob/proc/fall", function* fall(f: Frame, forced: Value) {
	f.vars = () => [forced];
	yield* g.srcCall(f, "drop_all_held_items");
	return f.dot;
}, true);

// /mob/verb/eastface  (code/modules/mob/mob.dm:666)  may sleep
rt.def("/mob/verb/eastface", function* eastface(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "canface")))) {
		return 0;
	}
	yield* g.srcCall(f, "setDir", 4);
	rt.modField(f, rt.sv(f, "client"), "move_delay", (yield* g.srcCall(f, "movement_delay")), add);
	return 1;
}, true, { hidden: true });

// /mob/verb/westface  (code/modules/mob/mob.dm:675)  may sleep
rt.def("/mob/verb/westface", function* westface(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "canface")))) {
		return 0;
	}
	yield* g.srcCall(f, "setDir", 8);
	rt.modField(f, rt.sv(f, "client"), "move_delay", (yield* g.srcCall(f, "movement_delay")), add);
	return 1;
}, true, { hidden: true });

// /mob/verb/northface  (code/modules/mob/mob.dm:684)  may sleep
rt.def("/mob/verb/northface", function* northface(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "canface")))) {
		return 0;
	}
	yield* g.srcCall(f, "setDir", 1);
	rt.modField(f, rt.sv(f, "client"), "move_delay", (yield* g.srcCall(f, "movement_delay")), add);
	return 1;
}, true, { hidden: true });

// /mob/verb/southface  (code/modules/mob/mob.dm:693)  may sleep
rt.def("/mob/verb/southface", function* southface(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "canface")))) {
		return 0;
	}
	yield* g.srcCall(f, "setDir", 2);
	rt.modField(f, rt.sv(f, "client"), "move_delay", (yield* g.srcCall(f, "movement_delay")), add);
	return 1;
}, true, { hidden: true });

// /mob/proc/get_ghost  (code/modules/mob/mob.dm:713)
rt.def("/mob/proc/get_ghost", function get_ghost(f: Frame, even_if_they_cant_reenter: Value) {
	f.vars = () => [even_if_they_cant_reenter];
	if (live(even_if_they_cant_reenter) === null) {
		even_if_they_cant_reenter = 0;
	}
	if (!truthy(rt.sv(f, "mind"))) return f.dot;
	return rt.callName(f, rt.sv(f, "mind"), "get_ghost", [live(even_if_they_cant_reenter)]);
});

// /mob/proc/grab_ghost  (code/modules/mob/mob.dm:717)  may sleep
rt.def("/mob/proc/grab_ghost", function* grab_ghost(f: Frame, force: Value) {
	f.vars = () => [force];
	if (!truthy(rt.sv(f, "mind"))) return f.dot;
	return (yield* g.callName(f, rt.sv(f, "mind"), "grab_ghost", ["force", live(force)], rt.Args.Named));
}, true);

// /mob/proc/notify_ghost_cloning  (code/modules/mob/mob.dm:720)  may sleep
rt.def("/mob/proc/notify_ghost_cloning", function* notify_ghost_cloning(f: Frame, message: Value, sound: Value, source: Value, flashwindow: Value) {
	let ghost: Value = null;
	f.vars = () => [message, sound, source, flashwindow, ghost];
	if (live(message) === null) {
		message = "Someone is trying to revive you. Re-enter your corpse if you want to be revived!";
	}
	if (live(sound) === null) {
		sound = rt.rsc("sound/effects/genetics.ogg");
	}
	if (live(source) === null) {
		source = null;
	}
	if (!truthy((ghost = (yield* g.srcCall(f, "get_ghost"))))) return f.dot;
	yield* g.callName(f, live(ghost), "notify_cloning", [live(message), live(sound), live(source), live(flashwindow)]);
	return live(ghost);
}, true);

// /mob/proc/AddSpell  (code/modules/mob/mob.dm:726)  may sleep
rt.def("/mob/proc/AddSpell", function* AddSpell(f: Frame, S: Value) {
	f.vars = () => [S];
	rt.modSrcVar(f, "mob_spell_list", live(S), add);
	yield* g.callName(f, rt.fv(f, "action", live(S)), "Grant", [live(f.src)]);
	return f.dot;
}, true);

// /mob/proc/RemoveSpell  (code/modules/mob/mob.dm:730)  may sleep
rt.def("/mob/proc/RemoveSpell", function* RemoveSpell(f: Frame, spell: Value) {
	let X: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [spell, X, S, $e];
	if (!truthy(live(spell))) {
		return live(f.dot);
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "mob_spell_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy(rt.op(f, "IsType", [], [(S = live(X)), live(spell)]))) {
			(rt.modSrcVar(f, "mob_spell_list", live(S), subtract));
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/proc/shuttleRotate  (code/modules/mob/mob.dm:740)  may sleep
rt.def("/mob/proc/shuttleRotate", function* shuttleRotate(f: Frame, rotation: Value) {
	f.vars = () => [rotation];
	yield* g.srcCall(f, "setDir", (yield* g.call(f, P("/proc/angle2dir"), null, [add(live(rotation), (yield* g.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "dir")])))])));
	return f.dot;
}, true);

// /mob/proc/buckle_mob  (code/modules/mob/mob.dm:744)  may sleep
rt.def("/mob/proc/buckle_mob", function* buckle_mob(f: Frame) {
	let _T: Value = null, old_density: Value = null, can_step: Value = null;
	f.vars = () => [_T, old_density, can_step];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (truthy(rt.fv(f, "buckled", live(f.args[0])))) {
		return 0;
	}
	_T = rt.getStep(f, live(f.src), 0);
	if (!isEqual(rt.fv(f, "loc", live(f.args[0])), live(_T))) {
		old_density = rt.sv(f, "density");
		rt.setSv(f, "density", 0);
		can_step = (yield* g.call(f, P("/proc/step_towards"), null, [live(f.args[0]), live(_T)]));
		rt.setSv(f, "density", live(old_density));
		if (!truthy(live(can_step))) {
			return 0;
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "force", "check_loc"] });

// /mob/proc/post_buckle_mob  (code/modules/mob/mob.dm:758)
rt.def("/mob/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	let height: Value = null;
	f.vars = () => [height];
	if (truthy((rt.isIn(f, live(M), rt.sv(f, "buckled_mobs")) ? 1 : 0))) {
		height = rt.callName(f, live(M), "get_mob_buckling_height", [live(f.src)]);
		rt.setFv(f, "pixel_y", live(M), add(rt.initial(f, live(M), "pixel_y"), live(height)));
		if (rt.lt(rt.fv(f, "layer", live(M)), rt.sv(f, "layer"))) {
			rt.setFv(f, "layer", live(M), add(rt.sv(f, "layer"), 0.10000000149011612));
		}
	} else {
		rt.setFv(f, "layer", live(M), rt.initial(f, live(M), "layer"));
		rt.setFv(f, "pixel_y", live(M), rt.initial(f, live(M), "pixel_y"));
	}
	return f.dot;
});

// /mob/proc/get_mob_buckling_height  (code/modules/mob/mob.dm:769)
rt.def("/mob/proc/get_mob_buckling_height", function get_mob_buckling_height(f: Frame, seat: Value) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy((rt.istype(live(seat), T("/mob/living")) ? 1 : 0))) {
		if (rt.le(rt.gv(f, "mob_size", (L = live(seat))), 1)) {
			return 0;
		}
	}
	return 9;
});

// /mob/proc/can_see_reagents  (code/modules/mob/mob.dm:785)
rt.def("/mob/proc/can_see_reagents", function can_see_reagents(f: Frame) {
	let H: Value = null, CL: Value = null;
	f.vars = () => [H, CL];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return 1;
	}
	if (truthy(rt.sv(f, "has_unlimited_silicon_privilege"))) {
		return 1;
	}
	if (truthy((rt.istype(live(f.src), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "head", (H = live(f.src)))) && truthy((rt.istype(rt.fv(f, "head", live(H)), T("/obj/item/clothing")) ? 1 : 0)))) {
			if (truthy(rt.gv(f, "scan_reagents", (CL = rt.fv(f, "head", live(H)))))) {
				return 1;
			}
		}
		if ((truthy(rt.fv(f, "wear_mask", live(H))) && truthy(rt.gv(f, "scan_reagents", rt.fv(f, "wear_mask", live(H)))))) {
			return 1;
		}
		if ((truthy(rt.fv(f, "glasses", live(H))) && truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing")) ? 1 : 0)))) {
			if (truthy(rt.gv(f, "scan_reagents", (CL = rt.fv(f, "glasses", live(H)))))) {
				return 1;
			}
		}
	}
	return 0;
});

// /mob/proc/faction_check_mob  (code/modules/mob/mob.dm:809)
rt.def("/mob/proc/faction_check_mob", function faction_check_mob(f: Frame, target: Value, exact_match: Value) {
	let faction_src: Value = null, faction_target: Value = null;
	f.vars = () => [faction_src, faction_target];
	if (truthy(live(exact_match))) {
		faction_src = rt.callName(f, rt.sv(f, "faction"), "Copy", []);
		faction_target = rt.callName(f, rt.fv(f, "faction", live(target)), "Copy", []);
		if (!truthy((rt.isIn(f, fmt("＃", [live(f.src)]), live(faction_target)) ? 1 : 0))) {
			(faction_src = rt.modify(live(faction_src), fmt("＃", [live(f.src)]), subtract));
		}
		if (!truthy((rt.isIn(f, fmt("＃", [live(target)]), live(faction_src)) ? 1 : 0))) {
			(faction_target = rt.modify(live(faction_target), fmt("＃", [live(target)]), subtract));
		}
		return rt.call(f, P("/proc/faction_check"), null, [live(faction_src), live(faction_target), 1]);
	}
	return rt.call(f, P("/proc/faction_check"), null, [rt.sv(f, "faction"), rt.fv(f, "faction", live(target)), 0]);
});

// /proc/faction_check  (code/modules/mob/mob.dm:821)
rt.def("/proc/faction_check", function faction_check(f: Frame, faction_A: Value, faction_B: Value, exact_match: Value) {
	let match_list: Value = null, length: Value = null;
	f.vars = () => [match_list, length];
	match_list = null;
	if (truthy(live(exact_match))) {
		match_list = rt.bitAnd(live(faction_A), live(faction_B));
		if (truthy((length = rt.length(live(match_list))))) {
			return (isEqual(live(length), rt.length(live(faction_A))) ? 1 : 0);
		}
	} else {
		return rt.length((match_list = rt.bitAnd(live(faction_A), live(faction_B))));
	}
	return 0;
});

// /mob/proc/fully_replace_character_name  (code/modules/mob/mob.dm:834)
rt.def("/mob/proc/fully_replace_character_name", function fully_replace_character_name(f: Frame, oldname: Value, newname: Value) {
	let _T: Value = null, obj: Value = null;
	let $e: any;
	f.vars = () => [_T, obj, $e];
	if (!truthy(live(newname))) {
		return 0;
	}
	rt.setSv(f, "real_name", live(newname));
	rt.setSv(f, "name", live(newname));
	if (truthy(rt.sv(f, "mind"))) {
		rt.setFv(f, "name", rt.sv(f, "mind"), live(newname));
	}
	if (truthy(live(oldname))) {
		rt.callSrc(f, "replace_records_name", [live(oldname), live(newname)]);
		rt.callSrc(f, "replace_identification_name", [live(oldname), live(newname)]);
		_T = null;
		rt.forList(f, 0, rt.fv(f, "minds", rt.gl("SSticker")), T("/datum/mind"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			obj = null;
			rt.forList(f, 1, rt.fv(f, "objectives", live(_T)), T("/datum/objective"));
			while (($e = rt.next(f, 1)) !== undefined) {
				obj = $e;
				if (((truthy(rt.fv(f, "target", live(obj))) && truthy(rt.gv(f, "current", rt.fv(f, "target", live(obj))))) && isEqual(rt.gv(f, "real_name", rt.gv(f, "current", rt.fv(f, "target", live(obj)))), rt.sv(f, "name")))) {
					rt.callName(f, live(obj), "update_explanation_text", []);
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	return 1;
});

// /mob/proc/replace_identification_name  (code/modules/mob/mob.dm:860)
rt.def("/mob/proc/replace_identification_name", function replace_identification_name(f: Frame, oldname: Value, newname: Value) {
	let searching: Value = null, search_id: Value = null, search_pda: Value = null, A: Value = null, ID: Value = null, PDA: Value = null;
	let $e: any;
	f.vars = () => [searching, search_id, search_pda, A, ID, PDA, $e];
	searching = rt.callSrc(f, "GetAllContents", []);
	search_id = 1;
	search_pda = 1;
	A = null;
	rt.forList(f, 0, live(searching));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((truthy(live(search_id)) && truthy((rt.istype(live(A), T("/obj/item/weapon/card/id")) ? 1 : 0)))) {
			if (isEqual(rt.gv(f, "registered_name", (ID = live(A))), live(oldname))) {
				rt.setFv(f, "registered_name", live(ID), live(newname));
				rt.callName(f, live(ID), "update_label", []);
				if (!truthy(live(search_pda))) {
					break;
				}
				search_id = 0;
			}
		} else {
			if ((truthy(live(search_pda)) && truthy((rt.istype(live(A), T("/obj/item/device/pda")) ? 1 : 0)))) {
				if (isEqual(rt.gv(f, "owner", (PDA = live(A))), live(oldname))) {
					rt.setFv(f, "owner", live(PDA), live(newname));
					rt.callName(f, live(PDA), "update_label", []);
					if (!truthy(live(search_id))) {
						break;
					}
					search_pda = 0;
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/proc/update_sight  (code/modules/mob/mob.dm:890)
rt.def("/mob/proc/update_sight", function update_sight(f: Frame) {
	rt.callSrc(f, "sync_lighting_plane_alpha", []);
	return f.dot;
});

// /mob/proc/sync_lighting_plane_alpha  (code/modules/mob/mob.dm:894)
rt.def("/mob/proc/sync_lighting_plane_alpha", function sync_lighting_plane_alpha(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	if (!truthy((L = rt.index(rt.fv(f, "plane_masters", rt.sv(f, "hud_used")), fmt("＀", [15]))))) return f.dot;
	rt.setFv(f, "alpha", live(L), rt.sv(f, "lighting_alpha"));
	return f.dot;
});

// /mob/living/proc/vv_edit_var  (code/modules/mob/mob.dm:899)  may sleep
rt.def("/mob/living/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === "stat") {
		if ((isEqual(rt.sv(f, "stat"), 2) && rt.lt(live(f.args[1]), 2))) {
			(rt.modGl("dead_mob_list", live(f.src), subtract));
			rt.modGl("living_mob_list", live(f.src), add);
		}
		if ((rt.lt(rt.sv(f, "stat"), 2) && isEqual(live(f.args[1]), 2))) {
			(rt.modGl("living_mob_list", live(f.src), subtract));
			rt.modGl("dead_mob_list", live(f.src), add);
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	$0 = live(f.args[0]);
	if ($0 === "knockdown") {
		yield* g.srcCall(f, "SetKnockdown", live(f.args[1]));
	} else if ($0 === "stun") {
		yield* g.srcCall(f, "SetStun", live(f.args[1]));
	} else if ($0 === "unconscious") {
		yield* g.srcCall(f, "SetUnconscious", live(f.args[1]));
	} else if ($0 === "sleeping") {
		yield* g.srcCall(f, "SetSleeping", live(f.args[1]));
	} else if ($0 === "eye_blind") {
		yield* g.srcCall(f, "set_blindness", live(f.args[1]));
	} else if ($0 === "eye_damage") {
		yield* g.srcCall(f, "set_eye_damage", live(f.args[1]));
	} else if ($0 === "eye_blurry") {
		yield* g.srcCall(f, "set_blurriness", live(f.args[1]));
	} else if ($0 === "maxHealth") {
		yield* g.srcCall(f, "updatehealth");
	} else if ($0 === "resize") {
		yield* g.srcCall(f, "update_transform");
	} else if ($0 === "lighting_alpha") {
		yield* g.srcCall(f, "sync_lighting_plane_alpha");
	}
	return f.dot;
}, true, { args: ["var_name", "var_value"] });

// /mob/proc/vv_get_dropdown  (code/modules/mob/mob.dm:941)
rt.def("/mob/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setAt((f.dot = rt.modify(live(f.dot), "---", add)), "Gib", fmt("?_src_=vars;gib=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Give Spell", fmt("?_src_=vars;give_spell=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Remove Spell", fmt("?_src_=vars;remove_spell=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Give Disease", fmt("?_src_=vars;give_disease=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Toggle Godmode", fmt("?_src_=vars;godmode=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Drop Everything", fmt("?_src_=vars;drop_everything=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Regenerate Icons", fmt("?_src_=vars;regenerateicons=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Make Space Ninja", fmt("?_src_=vars;ninja=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Show player panel", fmt("?_src_=vars;mob_player_panel=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Toggle Build Mode", fmt("?_src_=vars;build_mode=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Assume Direct Control", fmt("?_src_=vars;direct_control=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Offer Control to Ghosts", fmt("?_src_=vars;offer_control=＃", [live(f.src)]));
	return f.dot;
});

// /mob/proc/vv_get_var  (code/modules/mob/mob.dm:957)
rt.def("/mob/proc/vv_get_var", function vv_get_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === "logging") {
		return rt.call(f, P("/proc/debug_variable"), null, [live(f.args[0]), rt.sv(f, "logging"), 0, live(f.src), 0]);
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["var_name"] });

// /mob/verb/open_language_menu  (code/modules/mob/mob.dm:966)  may sleep
rt.def("/mob/verb/open_language_menu", function* open_language_menu(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	yield* g.callName(f, (H = (yield* g.srcCall(f, "get_language_holder"))), "open_language_menu", [live(f.usr)]);
	return f.dot;
}, true, { verb: { name: "Open Language Menu", category: "IC" } });
