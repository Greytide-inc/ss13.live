// Based on /tg/station's code/modules/power/rtg.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(10317, "/obj/machinery/power/rtg", "/obj/machinery/power", {
	power_gen: 1000,
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/rtg"),
	irradiate: 1,
	anchored: 1,
	can_buckle: 1,
	buckle_lying: 0,
	buckle_requires_restraints: 1,
	name: "radioisotope thermoelectric generator",
	desc: "A simple nuclear power generator, used in small outposts to reliably provide power for decades.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "rtg",
	density: 1,
	use_power: 0,
});

// rtg.dm:23
rt.def("/obj/machinery/power/rtg/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(this.board_path, null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6767, "/obj/item/weapon/circuitboard/machine/rtg", "/obj/item/weapon/circuitboard/machine", {
	name: "RTG (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/rtg"),
	origin_tech: "programming=2;materials=4;powerstorage=3;engineering=2",
	req_components: null,
});

// rtg.dm:31
rt.def("/obj/item/weapon/circuitboard/machine/rtg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/stack/cable_coil"), 5, T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/stack/sheet/mineral/uranium"), 10]);
	return f.dot;
});

// rtg.dm:37
rt.def("/obj/machinery/power/rtg/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.connect_to_network();
	return f.dot;
}, true);

// rtg.dm:41
rt.def("/obj/machinery/power/rtg/proc/process", function* process(f: Frame) {
	yield* parent_proc();
	this.add_avail(this.power_gen);
	if (!(this.panel_open && this.irradiate)) return f.dot;
	yield* radiation_pulse(rt.getStep(f, this, 0), 2, 3, 6);
	return f.dot;
}, true, { waitfor: false });

// rtg.dm:48
rt.def("/obj/machinery/power/rtg/proc/RefreshParts", function RefreshParts(f: Frame) {
	let SP: Value = null;
	let part_level: Value = 0;
	for (SP of each(this.component_parts, T("/obj/item/weapon/stock_parts"))) {
		part_level += SP.rating;
	}
	this.power_gen = rt.initial(f, this, "power_gen") * part_level;
	return f.dot;
});

// rtg.dm:54
rt.def("/obj/machinery/power/rtg/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	} else if (this.default_deconstruction_screwdriver(user, `${rt.initial(f, this, "icon_state")}-open`, rt.initial(f, this, "icon_state"), I)) {
		return f.dot;
	} else if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// rtg.dm:63
rt.def("/obj/machinery/power/rtg/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.a_intent == "grab" && (yield* this.user_buckle_mob(user.pulling, user, { check_loc: 0 }))) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(6768, "/obj/item/weapon/circuitboard/machine/rtg/advanced", "/obj/item/weapon/circuitboard/machine/rtg", {
	name: "Advanced RTG (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/rtg/advanced"),
	origin_tech: "programming=3;materials=5;powerstorage=4;engineering=3;plasmatech=3",
	req_components: null,
});

// rtg.dm:77
rt.def("/obj/item/weapon/circuitboard/machine/rtg/advanced/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/stack/cable_coil"), 5, T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/stack/sheet/mineral/uranium"), 10, T("/obj/item/stack/sheet/mineral/plasma"), 5]);
	return f.dot;
});

rt.type(6718, "/obj/item/weapon/circuitboard/machine/abductor/core", "/obj/item/weapon/circuitboard/machine/abductor", {
	req_components: null,
	def_components: null,
	name: "alien board (Void Core)",
	build_path: rt.typePath("/obj/machinery/power/rtg/abductor"),
	origin_tech: "programming=5;abductor=5;powerstorage=8;engineering=8",
});

// rtg.dm:105
rt.def("/obj/item/weapon/circuitboard/machine/abductor/core/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/cell/infinite/abductor"), 1]);

	this.def_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor"), T("/obj/item/weapon/stock_parts/capacitor/quadratic"), T("/obj/item/weapon/stock_parts/micro_laser"), T("/obj/item/weapon/stock_parts/micro_laser/quadultra")]);
	return f.dot;
});

rt.type(10319, "/obj/machinery/power/rtg/abductor", "/obj/machinery/power/rtg", {
	going_kaboom: 0,
	board_path: rt.typePath("/obj/item/weapon/circuitboard/machine/abductor/core"),
	power_gen: 20000,
	irradiate: 0,
	can_buckle: 0,
	name: "Void Core",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "core",
	desc: "An alien power source that produces energy seemingly out of nowhere.",
	pixel_y: 7,
});

// rtg.dm:117
rt.def("/obj/machinery/power/rtg/abductor/proc/overload", function* overload(f: Frame) {
	if (this.going_kaboom) {
		return f.dot;
	}
	this.going_kaboom = 1;
	this.visible_message(fmt("<span class='danger'>＄！ lets out an shower of sparks as it starts to lose stability!</span>", [this]), "<span class='italics'>You hear a loud electrical crack!</span>");
	yield* playsound(this.loc, rt.rsc("sound/magic/lightningshock.ogg"), 100, 1, { extrarange: 5 });
	yield* tesla_zap(this, 5, this.power_gen * 0.05);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/explosion"), rt.getStep(f, this, 0), 2, 3, 4, 8)), 100);
	return f.dot;
}, true);

// rtg.dm:124
rt.def("/obj/machinery/power/rtg/abductor/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	yield* parent_proc();
	if (!(!this.going_kaboom && rt.istype(Proj, T("/obj/item/projectile")) && !Proj.nodamage && (Proj.damage_type == "fire" || Proj.damage_type == "brute"))) return f.dot;
	message_admins(`${key_name_admin(Proj.firer)} triggered an Abductor Core explosion via projectile.`);
	log_game(`${key_name(Proj.firer)} triggered an Abductor Core explosion via projectile.`);
	yield* this.overload();
	return f.dot;
}, true);

// rtg.dm:131
rt.def("/obj/machinery/power/rtg/abductor/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	yield* this.overload();
	return f.dot;
}, true);

// rtg.dm:135
rt.def("/obj/machinery/power/rtg/abductor/proc/ex_act", function* ex_act(f: Frame) {
	if (this.going_kaboom) {
		yield* qdel(this);
	} else {
		yield* this.overload();
	}
	return f.dot;
}, true, { waitfor: false });

// rtg.dm:140
rt.def("/obj/machinery/power/rtg/abductor/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	yield* this.overload();
	return f.dot;
}, true);

// rtg.dm:143
rt.def("/obj/machinery/power/rtg/abductor/proc/tesla_act", function* tesla_act(f: Frame) {
	yield* parent_proc();
	yield* this.overload();
	return f.dot;
}, true);
