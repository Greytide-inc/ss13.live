// Based on /tg/station's code/modules/spells/spell_types/devil.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(11303, "/obj/effect/proc_holder/spell/targeted/summon_contract", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 0,
	name: "Summon infernal contract",
	desc: "Skip making a contract by hand, just do it by magic.",
	invocation_type: "whisper",
	invocation: "Just sign on the dotted line.",
	range: 5,
	clothes_req: 0,
	school: "conjuration",
	charge_max: 150,
	cooldown_min: 10,
	action_icon_state: "spell_default",
	action_background_icon_state: "bg_demon",
});

// devil.dm:47
rt.def("/obj/effect/proc_holder/spell/targeted/summon_contract/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null, contract: Value = null, contractTypeName: Value = null;
	let $e: any;
	user ??= f.usr;
	for (C of each(targets, T("/mob/living/carbon"))) {
		if (C.mind && user.mind) {
			if (C.stat == 2) {
				if (yield* user.drop_item()) {
					contract = (yield* new_(T("/obj/item/weapon/paper/contract/infernal/revive"), user.loc, C.mind, user.mind));
					yield* user.put_in_hands(contract);
				}
			} else {
				contract = null;
				const subject = (contractTypeName = (yield* g.op(f, "Prompt", [0], [null, null, "What type of contract?", user, list("Power", "Wealth", "Prestige", "Magic", "Knowledge", "Friendship")])));
				if (subject === "Power") {
					contract = (yield* new_(T("/obj/item/weapon/paper/contract/infernal/power"), C.loc, C.mind, user.mind));
				} else if (subject === "Wealth") {
					contract = (yield* new_(T("/obj/item/weapon/paper/contract/infernal/wealth"), C.loc, C.mind, user.mind));
				} else if (subject === "Prestige") {
					contract = (yield* new_(T("/obj/item/weapon/paper/contract/infernal/prestige"), C.loc, C.mind, user.mind));
				} else if (subject === "Magic") {
					contract = (yield* new_(T("/obj/item/weapon/paper/contract/infernal/magic"), C.loc, C.mind, user.mind));
				} else if (subject === "Knowledge") {
					contract = (yield* new_(T("/obj/item/weapon/paper/contract/infernal/knowledge"), C.loc, C.mind, user.mind));
				} else if (subject === "Friendship") {
					contract = (yield* new_(T("/obj/item/weapon/paper/contract/infernal/friend"), C.loc, C.mind, user.mind));
				}
				yield* C.put_in_hands(contract);
			}
		} else {
			to_chat(user, `<span class='notice'>${C} seems to not be sentient.  You cannot summon a contract for ${C.p_them()}.</span>`);
		}
	}
	return f.dot;
}, true);

rt.type(11304, "/obj/effect/proc_holder/spell/targeted/infernal_jaunt", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 1,
	name: "Infernal Jaunt",
	desc: "Use hellfire to phase out of existence.",
	charge_max: 200,
	clothes_req: 0,
	selection_type: "range",
	range: -1,
	cooldown_min: 0,
	overlay: null,
	action_icon_state: "jaunt",
	action_background_icon_state: "bg_demon",
	phase_allowed: 1,
});

// devil.dm:104
rt.def("/obj/effect/proc_holder/spell/targeted/infernal_jaunt/proc/cast", function* cast(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = f.usr;
	}
	if (rt.istype(f.args[1], T("/mob/living"))) {
		if (rt.istype(f.args[1].loc, T("/obj/effect/dummy/slaughter"))) {
			if (this.valid_location(f.args[1])) {
				to_chat(f.args[1], "<span class='warning'>You are now phasing in.</span>");
				if (yield* do_mob(f.args[1], f.args[1], 150)) {
					if (this.valid_location(f.args[1])) {
						yield* f.args[1].infernalphasein();
					} else {
						to_chat(f.args[1], "<span class='warning'>You are no longer near a potential signer.</span>");
					}
				}
			} else {
				to_chat(f.args[1], "<span class='warning'>You can only re-appear near a potential signer.");
				yield* this.revert_cast();
				return (yield* parent_proc());
			}
		} else {
			f.args[1].notransform = 1;
			f.args[1].fakefire();
			to_chat(this, "<span class='warning'>You begin to phase back into sinful flames.</span>");
			if (yield* do_mob(f.args[1], f.args[1], 150)) {
				yield* f.args[1].infernalphaseout();
			} else {
				to_chat(f.args[1], "<span class='warning'>You must remain still while exiting.</span>");
				yield* f.args[1].ExtinguishMob();
			}
		}
		this.start_recharge();
		return f.dot;
	}
	yield* this.revert_cast();
	return f.dot;
}, true, { args: ["targets", "user"] });

// devil.dm:132
rt.def("/obj/effect/proc_holder/spell/targeted/infernal_jaunt/proc/valid_location", function valid_location(f: Frame, user: Value) {
	let C: Value = null;
	user ??= f.usr;
	if (rt.istype(get_area(user), T("/area/shuttle"))) {
		return 1;
	} else {
		for (C of each(orange(2, rt.getStep(f, user, 0)), T("/mob/living"))) {
			if (C.owns_soul()) {
				return 1;
			}
		}
	}
	return 0;
});

// devil.dm:141
rt.def("/mob/living/proc/infernalphaseout", function* infernalphaseout(f: Frame) {
	yield* this.dust_animation();
	yield* this.spawn_dust();
	this.visible_message(`<span class='warning'>${this} disappears in a flashfire!</span>`);
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/enter_blood.ogg"), 100, 1, -1);
	let holder: Value = (yield* new_(T("/obj/effect/dummy/slaughter"), this.loc));
	yield* this.ExtinguishMob();
	if (this.buckled) {
		yield* this.buckled.unbuckle_mob(this, { force: 1 });
	}
	if (this.has_buckled_mobs()) {
		yield* this.unbuckle_all_mobs({ force: 1 });
	}
	if (this.pulledby) {
		yield* this.pulledby.stop_pulling();
	}
	if (this.pulling) {
		yield* this.stop_pulling();
	}
	this.loc = holder;
	this.holder = holder;
	this.notransform = 0;
	this.fakefireextinguish();
	return f.dot;
}, true);

// devil.dm:161
rt.def("/mob/living/proc/infernalphasein", function* infernalphasein(f: Frame) {
	if (this.notransform) {
		to_chat(this, "<span class='warning'>You're too busy to jaunt in.</span>");
		return 0;
	}
	this.fakefire();
	this.loc = rt.getStep(f, this, 0);
	this.client.eye = this;
	this.visible_message(`<span class='warning'><B>${this} appears in a fiery blaze!</B>`);
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/exit_blood.ogg"), 100, 1, -1);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/proc/fakefireextinguish"))), 15, 1);
	return f.dot;
}, true);

rt.type(11305, "/obj/effect/proc_holder/spell/targeted/sintouch", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 0,
	random_target: 1,
	random_target_priority: 2,
	max_targets: 3,
	name: "Sin Touch",
	desc: "Subtly encourage someone to sin.",
	charge_max: 1800,
	clothes_req: 0,
	selection_type: "range",
	range: 2,
	cooldown_min: 0,
	overlay: null,
	action_icon_state: "sintouch",
	action_background_icon_state: "bg_demon",
	phase_allowed: 0,
	invocation: "TASTE SIN AND INDULGE!!",
	invocation_type: "shout",
});

// devil.dm:197
rt.def("/obj/effect/proc_holder/spell/targeted/sintouch/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let H: Value = null;
	user ??= f.usr;
	for (H of each(targets, T("/mob/living/carbon/human"))) {
		if (!H.mind) {
			continue;
		}
		if (rt.locateIn(f, T("/datum/objective/sintouched"), H.mind.objectives)) {
			continue;
		}
		H.influenceSin();
		yield* H.Knockdown(400);
	}
	return f.dot;
}, true);

rt.type(11307, "/obj/effect/proc_holder/spell/targeted/summon_dancefloor", "/obj/effect/proc_holder/spell/targeted", {
	dancefloor_turfs: null,
	dancefloor_turfs_types: null,
	dancefloor_exists: 0,
	smoke: null,
	include_user: 1,
	name: "Summon Dancefloor",
	desc: "When what a Devil really needs is funk.",
	range: -1,
	clothes_req: 0,
	school: "conjuration",
	charge_max: 10,
	cooldown_min: 50,
	action_icon_state: "funk",
	action_background_icon_state: "bg_demon",
});

// devil.dm:226
rt.def("/obj/effect/proc_holder/spell/targeted/summon_dancefloor/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let i: Value = null, _T: Value = null, funky_turfs: Value = null, solid: Value = null, i_1: Value = null, t: Value = null, _T_3: Value = null;
	let $0: any, $1: any, $e: any;
	user ??= f.usr;
	if (!this.dancefloor_turfs) {
		this.dancefloor_turfs = list();
	}
	if (!this.dancefloor_turfs_types) {
		this.dancefloor_turfs_types = list();
	}
	if (!this.smoke) {
		this.smoke = (yield* new_(T("/datum/effect_system/smoke_spread/transparent/dancefloor_devil")));
	}
	yield* this.smoke.set_up(0, rt.getStep(f, user, 0));
	yield* this.smoke.start();
	if (this.dancefloor_exists) {
		this.dancefloor_exists = 0;
		rt.forRange(f, 0, 1, rt.len(f, this.dancefloor_turfs), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* (_T = rt.index(this.dancefloor_turfs, i)).ChangeTurf(rt.index(this.dancefloor_turfs_types, i));
		}
		rt.endFor(f, 0);
	} else {
		funky_turfs = block(rt.locate(max(user.x - 1, 1), max(user.y - 1, 1), user.z), rt.locate(min(user.x + 1, rt.world().maxx), min(user.y + 1, rt.world().maxy), user.z));
		for (solid of each(funky_turfs, T("/turf/closed"))) {
			to_chat(user, "<span class='warning'>You're too close to a wall.</span>");
			return f.dot;
		}
		this.dancefloor_exists = 1;
		i_1 = 1;
		this.dancefloor_turfs.len = rt.len(f, funky_turfs);
		this.dancefloor_turfs_types.len = rt.len(f, funky_turfs);
		for (t of each(funky_turfs)) {
			_T_3 = t;
			rt.setAt(this.dancefloor_turfs, i_1, _T_3);
			rt.setAt(this.dancefloor_turfs_types, i_1, _T_3.type);
			$0 = _T_3;
			if (i_1 % 2 == 0) {
				$1 = T("/turf/open/floor/light/colour_cycle/dancefloor_a");
			} else {
				$1 = T("/turf/open/floor/light/colour_cycle/dancefloor_b");
			}
			yield* $0.ChangeTurf($1);
			i_1++;
		}
	}
	return f.dot;
}, true);
