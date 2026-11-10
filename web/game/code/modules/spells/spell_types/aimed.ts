// Based on /tg/station's code/modules/spells/spell_types/aimed.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11377, "/obj/effect/proc_holder/spell/aimed", "/obj/effect/proc_holder/spell", {
	projectile_type: rt.typePath("/obj/item/projectile/magic/teleport"),
	deactive_msg: "You discharge your projectile...",
	active_msg: "You charge your projectile!",
	base_icon_state: "projectile",
	active_icon_state: "projectile",
	projectile_var_overrides: null,
	projectile_amount: 1,
	current_amount: 0,
	name: "aimed projectile spell",
});

// aimed.dm:9
rt.def("/obj/effect/proc_holder/spell/aimed/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.projectile_var_overrides = list();
	return f.dot;
});

// aimed.dm:14
rt.def("/obj/effect/proc_holder/spell/aimed/proc/Click", function* Click(f: Frame) {
	let user: Value = null, msg: Value = null, refund_percent: Value = null;
	if (!rt.istype((user = f.usr), T("/mob/living"))) {
		return f.dot;
	}
	if (!this.can_cast(user)) {
		yield* this.remove_ranged_ability((msg = `<span class='warning'>You can no longer cast ${this.name}!</span>`));
		return f.dot;
	}
	if (this.active) {
		msg = `<span class='notice'>${this.deactive_msg}</span>`;
		if (this.charge_type == "recharge") {
			refund_percent = this.current_amount / this.projectile_amount;
			this.charge_counter = this.charge_max * refund_percent;
			this.start_recharge();
		}
		yield* this.remove_ranged_ability(msg);
	} else {
		msg = `<span class='notice'>${this.active_msg}<B>Left-click to shoot it at a target!</B></span>`;
		this.current_amount = this.projectile_amount;
		yield* this.add_ranged_ability(user, msg, 1);
	}
	return f.dot;
}, true);

// aimed.dm:35
rt.def("/obj/effect/proc_holder/spell/aimed/proc/update_icon", function* update_icon(f: Frame) {
	if (!this.action) {
		return f.dot;
	}
	this.action.button_icon_state = `${this.base_icon_state}${this.active}`;
	yield* this.action.UpdateButtonIcon();
	return f.dot;
}, true);

// aimed.dm:41
rt.def("/obj/effect/proc_holder/spell/aimed/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, target: Value) {
	let ran_out: Value = null;
	if (yield* parent_proc()) {
		return 0;
	}
	if (!(yield* this.cast_check((!(ran_out = (this.current_amount <= 0 ? 1 : 0)) ? 1 : 0), this.ranged_ability_user))) {
		yield* this.remove_ranged_ability();
		return 0;
	}
	let targets: Value = list(target);
	yield* this.perform(targets, ran_out, { user: this.ranged_ability_user });
	return 1;
}, true);

// aimed.dm:52
rt.def("/obj/effect/proc_holder/spell/aimed/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let U: Value = null;
	let target: Value = rt.index(targets, 1);
	let _T: Value = user.loc;
	if (!isturf((U = rt.getStep(f, user, user.dir))) || !isturf(_T)) {
		return 0;
	}
	yield* this.fire_projectile(user, target);
	yield* user.newtonian_move(rt.getDir(f, U, _T));
	if (this.current_amount <= 0) {
		yield* this.remove_ranged_ability();
		this.charge_counter = 0;
		this.start_recharge();
	}
	return 1;
}, true);

// aimed.dm:66
rt.def("/obj/effect/proc_holder/spell/aimed/proc/fire_projectile", function* fire_projectile(f: Frame, user: Value, target: Value) {
	let _P: Value = null, V: Value = null;
	this.current_amount--;
	(_P = (yield* new_(this.projectile_type, user.loc))).current = rt.getStep(f, user, 0);
	_P.firer = user;
	yield* _P.preparePixelProjectile(target, rt.getStep(f, target, 0), user);
	for (V of each(this.projectile_var_overrides)) {
		if (rt.index(_P.vars, V)) {
			rt.setAt(_P.vars, V, rt.index(this.projectile_var_overrides, V));
		}
	}
	yield* _P.fire();
	return 1;
}, true);

rt.type(11378, "/obj/effect/proc_holder/spell/aimed/lightningbolt", "/obj/effect/proc_holder/spell/aimed", {
	school: "evocation",
	charge_max: 200,
	clothes_req: 1,
	invocation: "UN'LTD P'WAH",
	invocation_type: "shout",
	cooldown_min: 30,
	active_icon_state: "lightning",
	base_icon_state: "lightning",
	sound: rt.rsc("sound/magic/lightningbolt.ogg"),
	projectile_var_overrides: null,
	active_msg: "You energize your hand with arcane lightning!",
	deactive_msg: "You let the energy flow out of your hands back into yourself...",
	projectile_type: rt.typePath("/obj/item/projectile/magic/aoe/lightning"),
	name: "Lightning Bolt",
	desc: "Fire a high powered lightning bolt at your foes!",
	active: 0,
});

// aimed.dm:90
rt.def("/obj/effect/proc_holder/spell/aimed/lightningbolt/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.projectile_var_overrides = rt.alist(f, ["tesla_range", 15, "tesla_power", 20000, "tesla_boom", 0]);
	return f.dot;
});
