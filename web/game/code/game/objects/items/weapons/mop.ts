// Based on /tg/station's code/game/objects/items/weapons/mop.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7309, "/obj/item/weapon/mop", "/obj/item/weapon", {
	mopping: 0,
	mopcount: 0,
	mopcap: 5,
	mopspeed: 30,
	throw_speed: 3,
	throw_range: 7,
	desc: "The world of janitalia wouldn't be complete without a mop.",
	name: "mop",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "mop",
	force: 3,
	throwforce: 5,
	w_class: 3,
	attack_verb: null,
	resistance_flags: 4,
	force_string: "robust... against germs",
});

// mop.dm:20
rt.def("/obj/item/weapon/mop/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(this.mopcap);
	return f.dot;
}, true);

// mop.dm:25
rt.def("/obj/item/weapon/mop/proc/clean", function* clean(f: Frame, A: Value) {
	let O: Value = null, C: Value = null;
	if (this.reagents.has_reagent("water", 1) || this.reagents.has_reagent("holywater", 1) || this.reagents.has_reagent("vodka", 1) || this.reagents.has_reagent("cleaner", 1)) {
		A.clean_blood();
		for (O of each(A, T("/obj/effect"))) {
			if (rt.istype(O, T("/obj/effect/decal/cleanable")) || rt.istype(O, T("/obj/effect/rune"))) {
				yield* qdel(O);
			}
		}
		if (rt.istype(A, T("/turf/closed"))) {
			(C = A).thermite = 0;
		}
	}
	yield* this.reagents.reaction(A, TOUCH, 10);
	yield* this.reagents.remove_any(1);
	return f.dot;
}, true);

// mop.dm:38
rt.def("/obj/item/weapon/mop/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (this.reagents.total_volume < 1) {
		to_chat(user, "<span class='warning'>Your mop is dry!</span>");
		return f.dot;
	}
	let _T: Value = rt.getStep(f, A, 0);
	if (rt.istype(A, T("/obj/item/weapon/reagent_containers/glass/bucket")) || rt.istype(A, T("/obj/structure/janitorialcart"))) {
		return f.dot;
	}
	if (!_T) return f.dot;
	user.visible_message(fmt("＀ begins to clean ％！ with ＀.", [user, _T, this]), fmt("<span class='notice'>You begin to clean ％！ with ＀...</span>", [_T, this]));
	if (!(yield* do_after(user, this.mopspeed, { target: _T }))) return f.dot;
	to_chat(user, "<span class='notice'>You finish mopping.</span>");
	yield* this.clean(_T);
	return f.dot;
}, true);

// mop.dm:58
rt.def("/obj/effect/proc/attackby", function attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/mop")) || rt.istype(I, T("/obj/item/weapon/soap"))) {
		return f.dot;
	} else {
		return parent_proc();
	}
}, false);

// mop.dm:65
rt.def("/obj/item/weapon/mop/proc/janicart_insert", function* janicart_insert(f: Frame, user: Value, J: Value) {
	yield* J.put_in_cart(this, user);
	J.mymop = this;
	yield* J.update_icon();
	return f.dot;
}, true);

rt.type(7311, "/obj/item/weapon/mop/advanced", "/obj/item/weapon/mop", {
	refill_enabled: 1,
	refill_rate: 1,
	refill_reagent: "water",
	mopcap: 10,
	throw_range: 4,
	mopspeed: 20,
	desc: "The most advanced tool in a custodian's arsenal, complete with a condenser for self-wetting! Just think of all the viscera you will clean up with this!",
	name: "advanced mop",
	icon_state: "advmop",
	item_state: "mop",
	origin_tech: "materials=3;engineering=3",
	force: 6,
	throwforce: 8,
});

// mop.dm:90
rt.def("/obj/item/weapon/mop/advanced/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// mop.dm:94
rt.def("/obj/item/weapon/mop/advanced/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $1: any;
	this.refill_enabled = (!this.refill_enabled ? 1 : 0);
	if (this.refill_enabled) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	} else {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	let $0: any = user;
	if (this.refill_enabled) {
		$1 = "ON";
	} else {
		$1 = "OFF";
	}
	to_chat($0, `<span class='notice'>You set the condenser switch to the '${$1}' position.</span>`);
	playsound(user, rt.rsc("sound/machines/click.ogg"), 30, 1);
	return f.dot;
});

// mop.dm:104
rt.def("/obj/item/weapon/mop/advanced/proc/process", function* process(f: Frame) {
	if (!(this.reagents.total_volume < this.mopcap)) return f.dot;
	yield* this.reagents.add_reagent(this.refill_reagent, this.refill_rate);
	return f.dot;
}, true, { waitfor: false });

// mop.dm:108
rt.def("/obj/item/weapon/mop/advanced/proc/examine", function examine(f: Frame, user: Value) {
	let $1: any;
	parent_proc();
	let $0: any = user;
	if (this.refill_enabled) {
		$1 = "ON";
	} else {
		$1 = "OFF";
	}
	to_chat($0, `<span class='notice'>The condenser switch is set to <b>${$1}</b>.</span>`);
	return f.dot;
}, false);

// mop.dm:113
rt.def("/obj/item/weapon/mop/advanced/proc/Destroy", function* Destroy(f: Frame) {
	if (this.refill_enabled) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	return (yield* parent_proc());
}, true);
