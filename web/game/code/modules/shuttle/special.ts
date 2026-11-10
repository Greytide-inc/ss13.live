// Based on /tg/station's code/modules/shuttle/special.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10309, "/obj/machinery/power/emitter/energycannon/magical", "/obj/machinery/power/emitter/energycannon", {
	active_tables: null,
	tables_required: 2,
	name: "wabbajack statue",
	desc: "Who am I? What is my purpose in life? What do I mean by who am I?",
	projectile_type: rt.typePath("/obj/item/projectile/magic/change"),
	icon: rt.rsc("icons/obj/machines/magic_emitter.dmi"),
	icon_state: "wabbajack_statue",
	icon_state_on: "wabbajack_statue_on",
	active: 0,
});

// special.dm:13
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.active_tables = list();
	return f.dot;
});

// special.dm:18
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (prob(50)) {
		this.desc = "Oh no, not again.";
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// special.dm:25
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/update_icon", function update_icon(f: Frame) {
	if (this.active) {
		this.icon_state = this.icon_state_on;
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
	}
	return f.dot;
});

// special.dm:30
rt.def("/obj/machinery/power/emitter/energycannon/magical/proc/process", function process(f: Frame) {
	f.dot = parent_proc();
	if (rt.len(f, this.active_tables) >= this.tables_required) {
		if (!this.active) {
			this.visible_message(`<span class='revenboldnotice'>${this} opens its eyes.</span>`);
		}
		this.active = 1;
	} else {
		if (this.active) {
			this.visible_message(`<span class='revenboldnotice'>${this} closes its eyes.</span>`);
		}
		this.active = 0;
	}
	this.update_icon();
	return f.dot;
}, false, { waitfor: false });

rt.type(12191, "/obj/structure/table/abductor/wabbajack", "/obj/structure/table/abductor", {
	our_statue: null,
	sleepers: null,
	never_spoken: 1,
	verb_say: "chants",
	flags: 128,
	name: "wabbajack altar",
	desc: "Whether you're sleeping or waking, it's going to be quite chaotic.",
	obj_integrity: 1000,
	max_integrity: 1000,
});

// special.dm:64
rt.def("/obj/structure/table/abductor/wabbajack/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.sleepers = list();
	return f.dot;
});

// special.dm:69
rt.def("/obj/structure/table/abductor/wabbajack/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	f.dot = parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, false);

// special.dm:73
rt.def("/obj/structure/table/abductor/wabbajack/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// special.dm:77
rt.def("/obj/structure/table/abductor/wabbajack/proc/process", function* process(f: Frame) {
	let M: Value = null, C: Value = null, i: Value = null, L: Value = null;
	let $e: any;
	let area: Value = orange(4, this);
	if (!this.our_statue) {
		rt.forList(f, 0, area, T("/obj/machinery/power/emitter/energycannon/magical"));
		if (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			this.our_statue = M;
		}
		rt.endFor(f, 0);
	}
	if (!this.our_statue) {
		this.name = `inert ${this.name}`;
		return f.dot;
	} else {
		this.name = rt.initial(f, this, "name");
	}
	let _T: Value = rt.getStep(f, this, 0);
	let found: Value = list();
	for (C of each(_T, T("/mob/living/carbon"))) {
		if (C.stat != 2) {
			found += C;
		}
	}
	for (i of each(found - this.sleepers)) {
		(L = i).add_atom_colour("#800080", 2);
		L.visible_message(`<span class='revennotice'>A strange purple glow wraps itself around ${L} as ${L.p_they()} suddenly fall${L.p_s()} unconscious.</span>`, `<span class='revendanger'>${this.desc}</span>`);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/table/abductor/wabbajack/proc/sleeper_dreams"), L)), 100);
	}
	i = null;
	for (i of each(found)) {
		yield* (L = i).SetSleeping(200);
	}
	i = null;
	for (i of each(this.sleepers - found)) {
		(L = i).remove_atom_colour(TEMPORARY_COLOUR_PRIORITY, "#800080");
		L.visible_message(`<span class='revennotice'>The glow from ${L} fades away.</span>`);
		yield* L.grab_ghost();
	}
	this.sleepers = found;
	if (rt.len(f, this.sleepers)) {
		(rt.modField(f, this.our_statue, "active_tables", this, rt.bitOr));
		if (this.never_spoken || prob(5)) {
			yield* this.say(this.desc);
			this.never_spoken = 0;
		}
	} else {
		this.our_statue.active_tables -= this;
	}
	return f.dot;
}, true, { waitfor: false });

// special.dm:128
rt.def("/obj/structure/table/abductor/wabbajack/proc/sleeper_dreams", function* sleeper_dreams(f: Frame, sleeper: Value) {
	if (!rt.isIn(f, sleeper, this.sleepers)) return f.dot;
	to_chat(sleeper, "<span class='revennotice'>While you slumber, you have the strangest dream, like you can see yourself from the outside.</span>");
	yield* sleeper.ghostize(1);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

rt.type(4848, "/mob/living/simple_animal/drone/snowflake/bardrone", "/mob/living/simple_animal/drone/snowflake", {
	seeStatic: 0,
	laws: "1. Serve drinks.\n2. Talk to patrons.\n3. Don't get messed up in their affairs.",
	initial_language_holder: rt.typePath("/datum/language_holder/universal"),
	name: "Bardrone",
	desc: "A barkeeping drone, an indestructible robot built to tend bars.",
	status_flags: 4096,
	unique_name: 0,
});

// special.dm:153
rt.def("/mob/living/simple_animal/drone/snowflake/bardrone/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	(rt.modField(f, this.access_card, "access", 110, rt.bitOr));
	return f.dot;
}, true);

rt.type(4949, "/mob/living/simple_animal/hostile/alien/maid/barmaid", "/mob/living/simple_animal/hostile/alien/maid", {
	pass_flags: 1,
	initial_language_holder: rt.typePath("/datum/language_holder/universal"),
	gold_core_spawnable: 0,
	name: "Barmaid",
	desc: "A barmaid, a maiden found in a bar.",
	status_flags: 4096,
	unique_name: 0,
	AIStatus: 3,
	stop_automated_movement: 1,
});

// special.dm:168
rt.def("/mob/living/simple_animal/hostile/alien/maid/barmaid/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.access_card = (yield* new_(T("/obj/item/weapon/card/id"), this));
	let C: Value = (yield* new_(T("/datum/job/captain")));
	this.access_card.access = C.get_access();
	(rt.modField(f, this.access_card, "access", 110, rt.bitOr));
	(rt.modField(f, this.access_card, "flags", NODROP, rt.bitOr));
	return f.dot;
}, true);

// special.dm:176
rt.def("/mob/living/simple_animal/hostile/alien/maid/barmaid/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.access_card);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(12201, "/obj/structure/table/wood/bar", "/obj/structure/table/wood", {
	boot_dir: 1,
	flags: 128,
	resistance_flags: 35,
	obj_integrity: 1000,
	max_integrity: 1000,
});

// special.dm:191
rt.def("/obj/structure/table/wood/bar/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let M: Value = null, throwtarget: Value = null;
	if (rt.istype(AM, T("/mob/living")) && !this.is_barstaff(AM)) {
		M = AM;
		throwtarget = get_edge_target_turf(this, this.boot_dir);
		yield* M.Knockdown(40);
		yield* M.throw_at(throwtarget, 5, 1, this);
		to_chat(M, "<span class='notice'>No climbing on the bar please.</span>");
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// special.dm:202
rt.def("/obj/structure/table/wood/bar/proc/shuttleRotate", function* shuttleRotate(f: Frame, rotation: Value) {
	f.dot = (yield* parent_proc());
	this.boot_dir = angle2dir(rotation + dir2angle(this.boot_dir));
	return f.dot;
}, true);

// special.dm:207
rt.def("/obj/structure/table/wood/bar/proc/is_barstaff", function is_barstaff(f: Frame, user: Value) {
	let H: Value = null, ID: Value = null;
	f.dot = 0;
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if ((H = user).mind && H.mind.assigned_role == "Bartender") {
			return 1;
		}
	}
	if (!((ID = user.get_idcard()) && rt.isIn(f, 110, ID.access))) return f.dot;
	return 1;
});

rt.type(11816, "/obj/effect/forcefield/luxury_shuttle", "/obj/effect/forcefield", {
	threshold: 500,
}, { global: { approved_passengers: 780 } });

// special.dm:223
rt.def("/obj/effect/forcefield/luxury_shuttle/proc/CanPass", function* CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let C: Value = null, S: Value = null, I: Value = null;
	height ??= 0;
	if (rt.isIn(f, mover, GLOB.approved_passengers)) {
		return 1;
	}
	if (!rt.istype(mover, T("/mob/living"))) {
		return 0;
	}
	let total_cash: Value = 0;
	let counted_money: Value = list();
	for (C of each(mover.GetAllContents(), T("/obj/item/weapon/coin"))) {
		total_cash += rt.fv(f, "value", C);
		counted_money += C;
		if (total_cash >= this.threshold) {
			break;
		}
	}
	for (S of each(mover.GetAllContents(), T("/obj/item/stack/spacecash"))) {
		total_cash += rt.fv(f, "value", S) * S.amount;
		counted_money += S;
		if (total_cash >= this.threshold) {
			break;
		}
	}
	if (total_cash >= this.threshold) {
		for (I of each(counted_money, T("/obj"))) {
			yield* qdel(I);
		}
		to_chat(mover, "Thank you for your payment! Please enjoy your flight.");
		GLOB.approved_passengers += mover;
		return 1;
	} else {
		to_chat(mover, "You don't have enough money to enter the main shuttle. You'll have to fly coach.");
		return 0;
	}
}, true);

rt.type(11772, "/obj/effect/decal/hammerandsickle", "/obj/effect/decal", {
	name: "hammer and sickle",
	desc: "Communism powerful force.",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	icon_state: "communist",
	layer: 2.04,
	pixel_x: -32,
	pixel_y: -32,
});

// special.dm:269
rt.def("/obj/effect/decal/hammerandsickle/proc/shuttleRotate", function shuttleRotate(f: Frame, rotation: Value) {
	this.setDir(angle2dir(rotation + dir2angle(this.dir)));
	return f.dot;
});
