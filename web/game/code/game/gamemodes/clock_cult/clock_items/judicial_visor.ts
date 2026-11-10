// Based on /tg/station's code/game/gamemodes/clock_cult/clock_items/judicial_visor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(8206, "/obj/item/clothing/glasses/judicial_visor", "/obj/item/clothing/glasses", {
	active: 0,
	recharging: 0,
	blaster: null,
	recharge_cooldown: 300,
	name: "judicial visor",
	desc: "A strange purple-lensed visor. Looking at it inspires an odd sense of guilt.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "judicial_visor_0",
	item_state: "sunglasses",
	resistance_flags: 34,
	flash_protect: 1,
	actions_types: null,
});

// judicial_visor.dm:14
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/clock/toggle_visor"));
	return f.dot;
});

// judicial_visor.dm:17
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.all_clockwork_objects += this;
	this.blaster = (yield* new_(T("/obj/effect/proc_holder/judicial_visor"), this));
	this.blaster.visor = this;
	return f.dot;
}, true);

// judicial_visor.dm:23
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.all_clockwork_objects -= this;
	if (this.blaster.ranged_ability_user) {
		yield* this.blaster.remove_ranged_ability();
	}
	this.blaster.visor = null;
	yield* qdel(this.blaster);
	return (yield* parent_proc());
}, true);

// judicial_visor.dm:31
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (slot != slot_glasses) {
		return 0;
	}
	return parent_proc();
}, false);

// judicial_visor.dm:36
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (slot != slot_glasses) {
		yield* this.update_status(0);
		if (this.blaster.ranged_ability_user) {
			yield* this.blaster.remove_ranged_ability();
		}
		return 0;
	}
	if (is_servant_of_ratvar(user)) {
		yield* this.update_status(1);
	} else {
		yield* this.update_status(0);
	}
	if (iscultist(user)) {
		to_chat(user, "<span class='heavy_brass'>\"Consider yourself judged, whelp.\"</span>");
		to_chat(user, "<span class='userdanger'>You suddenly catch fire!</span>");
		yield* user.adjust_fire_stacks(5);
		yield* user.IgniteMob();
	}
	return 1;
}, true);

// judicial_visor.dm:54
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/dropped", function* dropped(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/glasses/judicial_visor/proc/check_on_mob"), user)), 1);
	return f.dot;
}, true);

// judicial_visor.dm:58
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/check_on_mob", function* check_on_mob(f: Frame, user: Value) {
	if (!(user && this != user.get_item_by_slot(slot_glasses))) return f.dot;
	yield* this.update_status(0);
	if (!this.blaster.ranged_ability_user) return f.dot;
	yield* this.blaster.remove_ranged_ability();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// judicial_visor.dm:64
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!(is_servant_of_ratvar(user) && this == user.get_item_by_slot(slot_glasses))) return f.dot;
	yield* this.blaster.toggle(user);
	return f.dot;
}, true);

// judicial_visor.dm:68
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/update_status", function* update_status(f: Frame, change_to: Value) {
	if (this.recharging || !rt.istype(this.loc, T("/mob/living"))) {
		this.icon_state = "judicial_visor_0";
		return 0;
	}
	if (this.active == change_to) {
		return 0;
	}
	let L: Value = this.loc;
	this.active = change_to;
	this.icon_state = `judicial_visor_${this.active}`;
	yield* L.update_action_buttons_icon();
	L.update_inv_glasses();
	if (!is_servant_of_ratvar(L) || L.stat) {
		return 0;
	}
	if (this.active === 1) {
		to_chat(L, `<span class='notice'>As you put on ${this}, its lens begins to glow, information flashing before your eyes.</span>\n<span class='heavy_brass'>Judicial visor active. Use the action button to gain the ability to smite the unworthy.</span>`);
	} else if (this.active === 0) {
		to_chat(L, `<span class='notice'>As you take off ${this}, its lens darkens once more.</span>`);
	}
	return 1;
}, true);

// judicial_visor.dm:89
rt.def("/obj/item/clothing/glasses/judicial_visor/proc/recharge_visor", function* recharge_visor(f: Frame, user: Value) {
	if (!this) {
		return 0;
	}
	this.recharging = 0;
	if (user && this == user.get_item_by_slot(slot_glasses)) {
		to_chat(user, `<span class='brass'>Your ${this.name} hums. It is ready.</span>`);
	} else {
		this.active = 0;
	}
	this.icon_state = `judicial_visor_${this.active}`;
	if (!user) return f.dot;
	yield* user.update_action_buttons_icon();
	user.update_inv_glasses();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

rt.type(11268, "/obj/effect/proc_holder/judicial_visor", "/obj/effect/proc_holder", {
	visor: null,
	active: 0,
	ranged_mousepointer: rt.rsc("icons/effects/visor_reticule.dmi"),
});

// judicial_visor.dm:109
rt.def("/obj/effect/proc_holder/judicial_visor/proc/toggle", function* toggle(f: Frame, user: Value) {
	let message: Value = null;
	if (this.active) {
		yield* this.remove_ranged_ability((message = `<span class='brass'>You dispel the power of ${this.visor}.</span>`));
	} else {
		message = `<span class='brass'><i>You harness ${this.visor}'s power.</i> <b>Left-click to place a judicial marker!</b></span>`;
		yield* this.add_ranged_ability(user, message);
	}
	return f.dot;
}, true);

// judicial_visor.dm:116
rt.def("/obj/effect/proc_holder/judicial_visor/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	let _T: Value = null, V: Value = null, targetturf: Value = null;
	let $0: any, $1: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.ranged_ability_user.incapacitated() || !this.visor || this.visor != this.ranged_ability_user.get_item_by_slot(slot_glasses)) {
		yield* this.remove_ranged_ability();
		return f.dot;
	}
	if (!isturf((_T = this.ranged_ability_user.loc))) {
		return 0;
	}
	if (rt.isIn(f, target, view(7, rt.getStep(f, this.ranged_ability_user, 0)))) {
		this.visor.recharging = 1;
		yield* this.visor.update_status();
		for (V of each(this.ranged_ability_user.GetAllContents(), T("/obj/item/clothing/glasses/judicial_visor"))) {
			if (V == this.visor) {
				continue;
			}
			V.recharging = 1;
			yield* V.update_status();
			$0 = (yield* new_(T("/datum/callback"), V, P("/obj/item/clothing/glasses/judicial_visor/proc/recharge_visor"), this.ranged_ability_user));
			if (GLOB.ratvar_awakens) {
				$1 = this.visor.recharge_cooldown * 0.1;
			} else {
				$1 = this.visor.recharge_cooldown;
			}
			yield* addtimer($0, $1 * 2);
		}
		yield* clockwork_say(this.ranged_ability_user, text2ratvar("Kneel, heathens!"));
		this.ranged_ability_user.visible_message(`<span class='warning'>${this.ranged_ability_user}'s judicial visor fires a stream of energy at ${target}, creating a strange mark!</span>`, `<span class='heavy_brass'>You direct ${this.visor}'s power to ${target}. You must wait for some time before doing this again.</span>`);
		yield* new_(T("/obj/effect/clockwork/judicial_marker"), (targetturf = rt.getStep(f, target, 0)), this.ranged_ability_user);
		add_logs(this.ranged_ability_user, targetturf, "created a judicial marker");
		yield* this.ranged_ability_user.update_action_buttons_icon();
		this.ranged_ability_user.update_inv_glasses();
		$0 = (yield* new_(T("/datum/callback"), this.visor, P("/obj/item/clothing/glasses/judicial_visor/proc/recharge_visor"), this.ranged_ability_user));
		if (GLOB.ratvar_awakens) {
			$1 = this.visor.recharge_cooldown * 0.1;
		} else {
			$1 = this.visor.recharge_cooldown;
		}
		yield* addtimer($0, $1);
		yield* this.remove_ranged_ability();
		return 1;
	}
	return 0;
}, true);

rt.type(11423, "/obj/effect/clockwork/judicial_marker", "/obj/effect/clockwork", {
	user: null,
	clockwork_desc: "A sigil that will soon erupt and smite any unenlightened nearby.",
	name: "judicial marker",
	desc: "You get the feeling that you shouldn't be standing here.",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	pixel_x: -32,
	pixel_y: -32,
	layer: 3.7,
});

// judicial_visor.dm:160
rt.def("/obj/effect/clockwork/judicial_marker/proc/Initialize", function Initialize(f: Frame, mapload: Value, caster: Value) {
	f.dot = parent_proc();
	this.set_light(1.4, 2, "#FE9C11");
	this.user = caster;
	ImmediateInvokeAsync(this, P("/obj/effect/clockwork/judicial_marker/proc/judicialblast"));
	return f.dot;
}, false);

// judicial_visor.dm:166
rt.def("/obj/effect/clockwork/judicial_marker/proc/judicialblast", function* judicialblast(f: Frame) {
	let L: Value = null, I: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	playsound(this, rt.rsc("sound/magic/magic_missile.ogg"), 50, 1, 1, 1);
	flick("judicial_marker", this);
	yield* sleep(16);
	this.layer = ABOVE_ALL_MOB_LAYER;
	flick("judicial_explosion", this);
	this.set_light(1.4, 2, "#B451A1");
	yield* sleep(13);
	let targetsjudged: Value = 0;
	playsound(this, rt.rsc("sound/effects/explosionfar.ogg"), 100, 1, 1, 1);
	this.set_light(0);
	for (L of each(range(1, this), T("/mob/living"))) {
		if (is_servant_of_ratvar(L)) {
			continue;
		}
		if (L.null_rod_check()) {
			I = L.null_rod_check();
			L.visible_message(`<span class='warning'>Strange energy flows into ${L}'s ${I.name}!</span>`, `<span class='userdanger'>Your ${I.name} shields you from ${this}!</span>`);
			continue;
		}
		if (!iscultist(L)) {
			$0 = L;
			$1 = `<span class='warning'>${L} is struck by a judicial explosion!</span>`;
			if (!rt.istype(L, T("/mob/living/silicon"))) {
				$2 = "An unseen force slams you into the ground!";
			} else {
				$2 = "ERROR: Motor servos disabled by external source!";
			}
			$0.visible_message($1, `<span class='userdanger'>${$2}</span>`);
			yield* L.Knockdown(160);
		} else {
			L.visible_message(`<span class='warning'>${L} is struck by a judicial explosion!</span>`, "<span class='heavy_brass'>\"Keep an eye out, filth.\"</span>\n<span class='userdanger'>A burst of heat crushes you against the ground!</span>");
			yield* L.Knockdown(80);
			yield* L.adjust_fire_stacks(2);
			yield* L.IgniteMob();
		}
		if (rt.istype(L, T("/mob/living/carbon"))) {
			(C = L).silent += 6;
		}
		targetsjudged++;
		yield* L.adjustBruteLoss(10);
		add_logs(this.user, L, "struck with a judicial blast");
	}
	$0 = this.user;
	if (targetsjudged) {
		$1 = `Successfully judged <span class='neovgre'>${targetsjudged}</span>`;
	} else {
		$1 = "Judged no";
	}
	to_chat($0, `<span class='brass'><b>${$1} heretic${targetsjudged == 1 ? "" : "s"}.</b></span>`);
	yield* sleep(3);
	yield* qdel(this);
	return f.dot;
}, true);
