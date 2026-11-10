// Based on /tg/station's code/game/gamemodes/miniantags/revenant/revenant_abilities.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


// revenant_abilities.dm:4
rt.def("/mob/living/simple_animal/revenant/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	yield* A.examine(this);
	if (!rt.istype(A, T("/mob/living/carbon/human"))) return f.dot;
	if (rt.isIn(f, A, this.drained_mobs)) {
		to_chat(this, `<span class='revenwarning'>${A}'s soul is dead and empty.</span>`);
	} else {
		if (!(get_dist(this, A) <= 1)) return f.dot;
		yield* this.Harvest(A);
	}
	return f.dot;
}, true);

// revenant_abilities.dm:12
rt.def("/mob/living/simple_animal/revenant/proc/Harvest", function* Harvest(f: Frame, target: Value) {
	let B: Value = null;
	let $0: any, $1: any;
	if (!(yield* this.castcheck(0))) {
		return f.dot;
	}
	if (this.draining) {
		to_chat(this, "<span class='revenwarning'>You are already siphoning the essence of a soul!</span>");
		return f.dot;
	}
	if (!target.stat) {
		to_chat(this, `<span class='revennotice'>${target.p_their(1)} soul is too strong to harvest.</span>`);
		if (prob(10)) {
			to_chat(target, "You feel as if you are being watched.");
		}
		return f.dot;
	}
	this.draining = 1;
	this.essence_drained += rand(15, 20);
	to_chat(this, `<span class='revennotice'>You search for the soul of ${target}.</span>`);
	if (yield* do_after(this, rand(10, 20), 0, target)) {
		if (target.ckey) {
			to_chat(this, `<span class='revennotice'>${target.p_their(1)} soul burns with intelligence.</span>`);
			this.essence_drained += rand(20, 30);
		}
		if (target.stat != 2) {
			to_chat(this, `<span class='revennotice'>${target.p_their(1)} soul blazes with life!</span>`);
			this.essence_drained += rand(40, 50);
		} else {
			to_chat(this, `<span class='revennotice'>${target.p_their(1)} soul is weak and faltering.</span>`);
		}
		if (yield* do_after(this, rand(15, 20), 0, target)) {
			if (rt.inRange(this.essence_drained, 1, 30)) {
				to_chat(this, `<span class='revennotice'>${target} will not yield much essence. Still, every bit counts.</span>`);
			} else if (rt.inRange(this.essence_drained, 30, 70)) {
				to_chat(this, `<span class='revennotice'>${target} will yield an average amount of essence.</span>`);
			} else if (rt.inRange(this.essence_drained, 70, 90)) {
				to_chat(this, `<span class='revenboldnotice'>Such a feast! ${target} will yield much essence to you.</span>`);
			} else if (rt.inRange(this.essence_drained, 90, 1e+31)) {
				to_chat(this, `<span class='revenbignotice'>Ah, the perfect soul. ${target} will yield massive amounts of essence to you.</span>`);
			}
			if (yield* do_after(this, rand(15, 25), 0, target)) {
				if (!target.stat) {
					to_chat(this, `<span class='revenwarning'>${target.p_they(1)} ${target.p_are()} now powerful enough to fight off your draining.</span>`);
					to_chat(target, "<span class='boldannounce'>You feel something tugging across your body before subsiding.</span>");
					this.draining = 0;
					this.essence_drained = 0;
					return f.dot;
				}
				to_chat(this, `<span class='revenminor'>You begin siphoning essence from ${target}'s soul.</span>`);
				if (target.stat != 2) {
					to_chat(target, "<span class='warning'>You feel a horribly unpleasant draining sensation as your grip on life weakens...</span>");
				}
				this.reveal(46);
				this.stun(46);
				target.visible_message(`<span class='warning'>${target} suddenly rises slightly into the air, ${target.p_their()} skin turning an ashy gray.</span>`);
				B = (yield* this.Beam(target, { icon_state: "drain_life", time: 1e+31 }));
				if (yield* do_after(this, 46, 0, target)) {
					yield* this.change_essence_amount(this.essence_drained, 0, target);
					if (this.essence_drained <= 90 && target.stat != 2) {
						this.essence_regen_cap += 5;
						to_chat(this, `<span class='revenboldnotice'>The absorption of ${target}'s living soul has increased your maximum essence level. Your new maximum essence is ${this.essence_regen_cap}.</span>`);
					}
					if (this.essence_drained > 90) {
						this.essence_regen_cap += 15;
						this.perfectsouls++;
						to_chat(this, `<span class='revenboldnotice'>The perfection of ${target}'s soul has increased your maximum essence level. Your new maximum essence is ${this.essence_regen_cap}.</span>`);
					}
					to_chat(this, `<span class='revennotice'>${target}'s soul has been considerably weakened and will yield no more essence for the time being.</span>`);
					target.visible_message(`<span class='warning'>${target} slumps onto the ground.</span>`, "<span class='revenwarning'>Violets lights, dancing in your vision, getting clo--</span>");
					this.drained_mobs.Add(target);
					yield* target.death(0);
				} else {
					$0 = this;
					if (target) {
						$1 = `${target} has`;
					} else {
						$1 = "They have";
					}
					to_chat($0, `<span class='revenwarning'>${$1} been drawn out of your grasp. The link has been broken.</span>`);
					if (target) {
						target.visible_message(`<span class='warning'>${target} slumps onto the ground.</span>`, "<span class='revenwarning'>Violets lights, dancing in your vision, receding--</span>");
					}
				}
				yield* qdel(B);
			} else {
				$0 = this;
				if (target) {
					$1 = `${target}'s`;
				} else {
					$1 = "their";
				}
				to_chat($0, `<span class='revenwarning'>You are not close enough to siphon ${$1} soul. The link has been broken.</span>`);
			}
		}
	}
	this.draining = 0;
	this.essence_drained = 0;
	return f.dot;
}, true);

rt.type(11278, "/obj/effect/proc_holder/spell/targeted/revenant_transmit", "/obj/effect/proc_holder/spell/targeted", {
	name: "Transmit",
	desc: "Telepathically transmits a message to the target.",
	panel: "Revenant Abilities",
	charge_max: 0,
	clothes_req: 0,
	range: 7,
	include_user: 0,
	action_icon_state: "r_transmit",
	action_background_icon_state: "bg_revenant",
});

// revenant_abilities.dm:104
rt.def("/obj/effect/proc_holder/spell/targeted/revenant_transmit/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let M: Value = null, msg: Value = null, ded: Value = null, follow_rev: Value = null, follow_whispee: Value = null;
	user ??= f.usr;
	for (M of each(targets, T("/mob/living"))) {
		if (!(msg = (yield* stripped_input(f.usr, `What do you wish to tell ${M}?`, null, "")))) {
			this.charge_counter = this.charge_max;
			return f.dot;
		}
		log_say(`RevenantTransmit: ${key_name(user)}->${key_name(M)} : ${msg}`);
		to_chat(user, `<span class='revenboldnotice'>You transmit to ${M}:</span> <span class='revennotice'>${msg}</span>`);
		to_chat(M, `<span class='revenboldnotice'>You hear something behind you talking...</span> <span class='revennotice'>${msg}</span>`);
		ded = null;
		for (ded of each(GLOB.dead_mob_list)) {
			if (!rt.istype(ded, T("/mob/dead/observer"))) {
				continue;
			}
			follow_rev = fmt("<a href=?src=＃;follow=＃>(F)</a>", [ded, user]);
			follow_whispee = fmt("<a href=?src=＃;follow=＃>(F)</a>", [ded, M]);
			to_chat(ded, `${follow_rev} <span class='revenboldnotice'>${user} Revenant Transmit:</span> <span class='revennotice'>"${msg}" to</span> ${follow_whispee} <span class='name'>${M}</span>`);
		}
	}
	return f.dot;
}, true);

rt.type(11345, "/obj/effect/proc_holder/spell/aoe_turf/revenant", "/obj/effect/proc_holder/spell/aoe_turf", {
	reveal: 80,
	stun: 20,
	locked: 1,
	unlock_amount: 100,
	cast_amount: 50,
	clothes_req: 0,
	action_background_icon_state: "bg_revenant",
	panel: "Revenant Abilities (Locked)",
	name: "Report this to a coder",
});

// revenant_abilities.dm:133
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.locked) {
		this.name = `${rt.initial(f, this, "name")} (${this.unlock_amount}E)`;
	} else {
		this.name = `${rt.initial(f, this, "name")} (${this.cast_amount}E)`;
	}
	return f.dot;
}, true);

// revenant_abilities.dm:140
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/proc/can_cast", function can_cast(f: Frame, user: Value) {
	user ??= f.usr;
	if (this.charge_counter < this.charge_max) {
		return 0;
	}
	if (!rt.istype(user, T("/mob/living/simple_animal/revenant"))) {
		return 1;
	}
	if (user.inhibited) {
		return 0;
	}
	if (this.locked) {
		if (user.essence <= this.unlock_amount) {
			return 0;
		}
	}
	if (user.essence <= this.cast_amount) {
		return 0;
	}
	return 1;
});

// revenant_abilities.dm:154
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/proc/attempt_cast", function* attempt_cast(f: Frame, user: Value) {
	user ??= f.usr;
	if (!rt.istype(user, T("/mob/living/simple_animal/revenant"))) {
		this.name = `${rt.initial(f, this, "name")}`;
		if (this.locked) {
			this.panel = "Revenant Abilities";
			this.locked = 0;
		}
		return 1;
	}
	if (this.locked) {
		if (!(yield* user.castcheck(-this.unlock_amount))) {
			this.charge_counter = this.charge_max;
			return 0;
		}
		this.name = `${rt.initial(f, this, "name")} (${this.cast_amount}E)`;
		to_chat(user, `<span class='revennotice'>You have unlocked ${rt.initial(f, this, "name")}!</span>`);
		this.panel = "Revenant Abilities";
		this.locked = 0;
		this.charge_counter = this.charge_max;
		return 0;
	}
	if (!(yield* user.castcheck(-this.cast_amount))) {
		this.charge_counter = this.charge_max;
		return 0;
	}
	this.name = `${rt.initial(f, this, "name")} (${this.cast_amount}E)`;
	user.reveal(this.reveal);
	user.stun(this.stun);
	if (this.action) {
		yield* this.action.UpdateButtonIcon();
	}
	return 1;
}, true);

rt.type(11346, "/obj/effect/proc_holder/spell/aoe_turf/revenant/overload", "/obj/effect/proc_holder/spell/aoe_turf/revenant", {
	shock_range: 2,
	shock_damage: 15,
	stun: 30,
	cast_amount: 40,
	name: "Overload Lights",
	desc: "Directs a large amount of essence into nearby electrical lights, causing lights to shock those nearby.",
	charge_max: 200,
	range: 5,
	action_icon_state: "overload_lights",
});

// revenant_abilities.dm:193
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/overload/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null;
	user ??= f.usr;
	if (!(yield* this.attempt_cast(user))) return f.dot;
	for (_T of each(targets, T("/turf"))) {
		yield* ImmediateInvokeAsync(this, P("/obj/effect/proc_holder/spell/aoe_turf/revenant/overload/proc/overload"), _T, user);
	}
	return f.dot;
}, true);

// revenant_abilities.dm:198
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/overload/proc/overload", function* overload(f: Frame, _T: Value, user: Value) {
	let L: Value = null, s: Value = null, M: Value = null, z: Value = null;
	for (L of each(_T, T("/obj/machinery/light"))) {
		if (!L.on) {
			return f.dot;
		}
		L.visible_message(fmt("<span class='warning'><b>＄！ suddenly flares brightly and begins to spark!</span>", [L]));
		yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(4, 0, L);
		yield* s.start();
		yield* new_(T("/obj/effect/temp_visual/revenant"), L.loc);
		yield* sleep(20);
		if (!L.on) {
			return f.dot;
		}
		flick(`${L.base_state}2`, L);
		M = null;
		for (M of each(view(this.shock_range, L), T("/mob/living/carbon/human"))) {
			if (M == user) {
				continue;
			}
			yield* L.Beam(M, { icon_state: "purple_lightning", time: 5 });
			yield* M.electrocute_act(this.shock_damage, L, { safety: 1 });
			yield* (z = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(4, 0, M);
			yield* z.start();
			playsound(M, rt.rsc("sound/machines/defib_zap.ogg"), 50, 1, -1);
		}
	}
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob" }] });

rt.type(11347, "/obj/effect/proc_holder/spell/aoe_turf/revenant/defile", "/obj/effect/proc_holder/spell/aoe_turf/revenant", {
	stun: 20,
	reveal: 40,
	unlock_amount: 75,
	cast_amount: 30,
	name: "Defile",
	desc: "Twists and corrupts the nearby area as well as dispelling holy auras on floors.",
	charge_max: 150,
	range: 4,
	action_icon_state: "defile",
});

// revenant_abilities.dm:233
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/defile/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null;
	user ??= f.usr;
	if (!(yield* this.attempt_cast(user))) return f.dot;
	for (_T of each(targets, T("/turf"))) {
		yield* ImmediateInvokeAsync(this, P("/obj/effect/proc_holder/spell/aoe_turf/revenant/defile/proc/defile"), _T);
	}
	return f.dot;
}, true);

// revenant_abilities.dm:238
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/defile/proc/defile", function* defile(f: Frame, _T: Value) {
	let floor: Value = null, closet: Value = null, corpseholder: Value = null, dna: Value = null, window: Value = null, light: Value = null;
	if (rt.bitAnd(_T.flags, 1)) {
		_T.flags -= 1;
		yield* new_(T("/obj/effect/temp_visual/revenant"), _T);
	}
	if (!rt.istype(_T, T("/turf/open/floor/plating")) && !rt.istype(_T, T("/turf/open/floor/engine/cult")) && rt.istype(_T, T("/turf/open/floor")) && prob(15)) {
		if ((floor = _T).intact && floor.floor_tile) {
			yield* new_(floor.floor_tile, floor);
		}
		floor.broken = 0;
		floor.burnt = 0;
		yield* floor.make_plating(1);
	}
	if (_T.type == T("/turf/closed/wall") && prob(15)) {
		yield* new_(T("/obj/effect/temp_visual/revenant"), _T);
		yield* _T.ChangeTurf(T("/turf/closed/wall/rust"));
	}
	if (_T.type == T("/turf/closed/wall/r_wall") && prob(10)) {
		yield* new_(T("/obj/effect/temp_visual/revenant"), _T);
		yield* _T.ChangeTurf(T("/turf/closed/wall/r_wall/rust"));
	}
	for (closet of each(_T.contents, T("/obj/structure/closet"))) {
		yield* closet.open();
	}
	for (corpseholder of each(_T, T("/obj/structure/bodycontainer"))) {
		if (corpseholder.connected.loc == corpseholder) {
			yield* corpseholder.open();
		}
	}
	for (dna of each(_T, T("/obj/machinery/dna_scannernew"))) {
		yield* dna.open_machine();
	}
	for (window of each(_T, T("/obj/structure/window"))) {
		yield* window.take_damage(rand(30, 80));
		if (window && window.fulltile) {
			yield* new_(T("/obj/effect/temp_visual/revenant/cracks"), window.loc);
		}
	}
	for (light of each(_T, T("/obj/machinery/light"))) {
		yield* light.flicker(20);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

rt.type(11348, "/obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction", "/obj/effect/proc_holder/spell/aoe_turf/revenant", {
	cast_amount: 60,
	unlock_amount: 200,
	name: "Malfunction",
	desc: "Corrupts and damages nearby machines and mechanical objects.",
	charge_max: 200,
	range: 4,
	action_icon_state: "malfunction",
});

// revenant_abilities.dm:280
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null;
	user ??= f.usr;
	if (!(yield* this.attempt_cast(user))) return f.dot;
	for (_T of each(targets, T("/turf"))) {
		yield* ImmediateInvokeAsync(this, P("/obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction/proc/malfunction"), _T, user);
	}
	return f.dot;
}, true);

// revenant_abilities.dm:285
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/malfunction/proc/malfunction", function* malfunction(f: Frame, _T: Value, user: Value) {
	let bot: Value = null, human: Value = null, thing: Value = null, S: Value = null;
	for (bot of each(_T, T("/mob/living/simple_animal/bot"))) {
		if (!bot.emagged) {
			yield* new_(T("/obj/effect/temp_visual/revenant"), bot.loc);
			bot.locked = 0;
			bot.open = 1;
			yield* bot.emag_act();
		}
	}
	for (human of each(_T, T("/mob/living/carbon/human"))) {
		if (human == user) {
			continue;
		}
		to_chat(human, `<span class='revenwarning'>You feel ${pick("your sense of direction flicker out", "a stabbing pain in your head", "your mind fill with static")}.</span>`);
		yield* new_(T("/obj/effect/temp_visual/revenant"), human.loc);
		yield* human.emp_act(1);
	}
	for (thing of each(_T, T("/obj"))) {
		if (rt.istype(thing, T("/obj/machinery/dominator")) || rt.istype(thing, T("/obj/machinery/power/apc")) || rt.istype(thing, T("/obj/machinery/power/smes"))) {
			continue;
		}
		if (prob(20)) {
			if (prob(50)) {
				yield* new_(T("/obj/effect/temp_visual/revenant"), thing.loc);
			}
			yield* thing.emag_act(null);
		} else if (!rt.istype(thing, T("/obj/machinery/clonepod"))) {
			yield* thing.emp_act(1);
		}
	}
	for (S of each(_T, T("/mob/living/silicon/robot"))) {
		playsound(S, rt.rsc("sound/machines/warning-buzzer.ogg"), 50, 1);
		yield* new_(T("/obj/effect/temp_visual/revenant"), S.loc);
		yield* S.spark_system.start();
		yield* S.emp_act(1);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob" }] });

rt.type(11349, "/obj/effect/proc_holder/spell/aoe_turf/revenant/blight", "/obj/effect/proc_holder/spell/aoe_turf/revenant", {
	cast_amount: 50,
	unlock_amount: 200,
	name: "Blight",
	desc: "Causes nearby living things to waste away.",
	charge_max: 200,
	range: 3,
	action_icon_state: "blight",
});

// revenant_abilities.dm:324
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/blight/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let _T: Value = null;
	user ??= f.usr;
	if (!(yield* this.attempt_cast(user))) return f.dot;
	for (_T of each(targets, T("/turf"))) {
		yield* ImmediateInvokeAsync(this, P("/obj/effect/proc_holder/spell/aoe_turf/revenant/blight/proc/blight"), _T, user);
	}
	return f.dot;
}, true);

// revenant_abilities.dm:329
rt.def("/obj/effect/proc_holder/spell/aoe_turf/revenant/blight/proc/blight", function* blight(f: Frame, _T: Value, user: Value) {
	let mob: Value = null, H: Value = null, blightfound: Value = null, blight: Value = null, vine: Value = null, shroom: Value = null, tray: Value = null;
	for (mob of each(_T, T("/mob/living"))) {
		if (mob == user) {
			continue;
		}
		yield* new_(T("/obj/effect/temp_visual/revenant"), mob.loc);
		if (rt.istype(mob, T("/mob/living/carbon"))) {
			if (rt.istype(mob, T("/mob/living/carbon/human"))) {
				if ((H = mob).dna && H.dna.species) {
					yield* H.dna.species.handle_hair(H, "#1d2953");
				}
				blightfound = 0;
				blight = null;
				for (blight of each(H.viruses, T("/datum/disease/revblight"))) {
					blightfound = 1;
					if (blight.stage < 5) {
						blight.stage++;
					}
				}
				if (!blightfound) {
					yield* H.AddDisease((yield* new_(T("/datum/disease/revblight"))));
					to_chat(H, `<span class='revenminor'>You feel ${pick("suddenly sick", "a surge of nausea", "like your skin is <i>wrong</i>")}.</span>`);
				}
			} else if (mob.reagents) {
				yield* mob.reagents.add_reagent("plasma", 5);
			}
		} else {
			yield* mob.adjustToxLoss(5);
		}
	}
	for (vine of each(_T, T("/obj/structure/spacevine"))) {
		vine.add_atom_colour("#823abb", TEMPORARY_COLOUR_PRIORITY);
		yield* new_(T("/obj/effect/temp_visual/revenant"), vine.loc);
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), vine)), 10, 8);
	}
	for (shroom of each(_T, T("/obj/structure/glowshroom"))) {
		shroom.add_atom_colour("#823abb", 2);
		yield* new_(T("/obj/effect/temp_visual/revenant"), shroom.loc);
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), shroom)), 10, 8);
	}
	for (tray of each(_T, T("/obj/machinery/hydroponics"))) {
		yield* new_(T("/obj/effect/temp_visual/revenant"), tray.loc);
		tray.pestlevel = rand(8, 10);
		tray.weedlevel = rand(8, 10);
		tray.toxic = rand(45, 55);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, { type: 8, path: "/mob" }] });
