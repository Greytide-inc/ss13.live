// Based on /tg/station's code/modules/projectiles/guns/magic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5111, "/obj/item/weapon/gun/magic", "/obj/item/weapon/gun", {
	max_charges: 6,
	charges: 0,
	recharge_rate: 4,
	charge_tick: 0,
	can_charge: 1,
	ammo_type: null,
	no_den_usage: null,
	flags: 64,
	name: "staff of nothing",
	desc: "This staff is boring to watch because even though it came first you've seen everything it can do in other staves for years.",
	icon: rt.rsc("icons/obj/guns/magic.dmi"),
	icon_state: "staffofnothing",
	item_state: "staff",
	fire_sound: rt.rsc("sound/weapons/emitter.ogg"),
	w_class: 5,
	origin_tech: null,
	clumsy_check: 0,
	trigger_guard: -1,
	lefthand_file: rt.rsc("icons/mob/inhands/items_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/items_righthand.dmi"),
	pin: rt.typePath("/obj/item/device/firing_pin/magic"),
});

// magic.dm:27
rt.def("/obj/item/weapon/gun/magic/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	let A: Value = null;
	if (this.no_den_usage) {
		if (rt.istype((A = get_area(user)), T("/area/wizard_station"))) {
			to_chat(user, `<span class='warning'>You know better than to violate the security of The Den, best wait until you leave to use ${this}.<span>`);
			return f.dot;
		} else {
			this.no_den_usage = 0;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// magic.dm:39
rt.def("/obj/item/weapon/gun/magic/proc/recharge_newshot", function* recharge_newshot(f: Frame) {
	if (!(this.charges && this.chambered && !this.chambered.BB)) return f.dot;
	yield* this.chambered.newshot();
	return f.dot;
}, true);

// magic.dm:43
rt.def("/obj/item/weapon/gun/magic/proc/process_chamber", function* process_chamber(f: Frame) {
	if (!(this.chambered && !this.chambered.BB)) return f.dot;
	this.charges--;
	yield* this.recharge_newshot();
	return f.dot;
}, true);

// magic.dm:48
rt.def("/obj/item/weapon/gun/magic/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.charges = this.max_charges;
	this.chambered = (yield* new_(this.ammo_type, this));
	if (!this.can_charge) return f.dot;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// magic.dm:57
rt.def("/obj/item/weapon/gun/magic/proc/Destroy", function* Destroy(f: Frame) {
	if (this.can_charge) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	return (yield* parent_proc());
}, true);

// magic.dm:62
rt.def("/obj/item/weapon/gun/magic/proc/process", function* process(f: Frame) {
	this.charge_tick++;
	if (this.charge_tick < this.recharge_rate || this.charges >= this.max_charges) {
		return 0;
	}
	this.charge_tick = 0;
	this.charges++;
	if (this.charges == 1) {
		yield* this.recharge_newshot();
	}
	return 1;
}, true, { waitfor: false });

// magic.dm:75
rt.def("/obj/item/weapon/gun/magic/proc/shoot_with_empty_chamber", function shoot_with_empty_chamber(f: Frame, user: Value) {
	to_chat(user, `<span class='warning'>The ${this.name} whizzles quietly.<span>`);
	return f.dot;
});

// magic.dm:78
rt.def("/obj/item/weapon/gun/magic/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is twisting ${this} above ${user.p_their()} head, releasing a magical blast! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, this.fire_sound, 50, 1, -1);
	return 2;
});

// magic.dm:83
rt.def("/obj/item/weapon/gun/magic/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	f.dot = (yield* parent_proc());
	if (var_name === "charges") {
		yield* this.recharge_newshot();
	}
	return f.dot;
}, true);
