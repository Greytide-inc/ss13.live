// Based on /tg/station's code/game/objects/items/weapons/RCD.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(7327, "/obj/item/weapon/construction", "/obj/item/weapon", {
	spark_system: null,
	matter: 0,
	max_matter: 100,
	sheetmultiplier: 4,
	plasteelmultiplier: 3,
	no_ammo_message: "<span class='warning'>The 'Low Ammo' light on the device blinks yellow.</span>",
	anchored: 0,
	flags: 68,
	throw_speed: 3,
	throw_range: 5,
	opacity: 0,
	density: 0,
	force: 0,
	throwforce: 10,
	w_class: 3,
	materials: null,
	origin_tech: "engineering=4;materials=2",
	req_access_txt: "11",
	armor: null,
	resistance_flags: 2,
});

// RCD.dm:21
rt.def("/obj/item/weapon/construction/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 100000]);
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 50]);
	return f.dot;
});

// RCD.dm:34
rt.def("/obj/item/weapon/construction/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.desc = `A ${this}. It currently holds ${this.matter}/${this.max_matter} matter-units.`;
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(5, 0, this);
	yield* this.spark_system.attach(this);
	return f.dot;
}, true);

// RCD.dm:42
rt.def("/obj/item/weapon/construction/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.spark_system);
	this.spark_system = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// RCD.dm:46
rt.def("/obj/item/weapon/construction/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let R: Value = null;
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		return f.dot;
	}
	let loaded: Value = 0;
	if (rt.istype(W, T("/obj/item/weapon/rcd_ammo"))) {
		R = W;
		if (this.matter + R.ammoamt > this.max_matter) {
			to_chat(user, `<span class='warning'>The ${this} can't hold any more matter-units!</span>`);
			return f.dot;
		}
		yield* qdel(W);
		this.matter += R.ammoamt;
		playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
		loaded = 1;
	} else if (rt.istype(W, T("/obj/item/stack/sheet/metal")) || rt.istype(W, T("/obj/item/stack/sheet/glass"))) {
		loaded = (yield* this.loadwithsheets(W, this.sheetmultiplier, user));
	} else if (rt.istype(W, T("/obj/item/stack/sheet/plasteel"))) {
		loaded = (yield* this.loadwithsheets(W, this.plasteelmultiplier * this.sheetmultiplier, user));
	}
	if (loaded) {
		to_chat(user, `<span class='notice'>The ${this} now holds ${this.matter}/${this.max_matter} matter-units.</span>`);
		this.desc = `A RCD. It currently holds ${this.matter}/${this.max_matter} matter-units.`;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// RCD.dm:69
rt.def("/obj/item/weapon/construction/proc/loadwithsheets", function* loadwithsheets(f: Frame, S: Value, value: Value, user: Value) {
	let maxsheets: Value = null, amount_to_use: Value = null;
	if ((maxsheets = round((this.max_matter - this.matter) / value)) > 0) {
		amount_to_use = min(S.amount, maxsheets);
		yield* S.use(amount_to_use);
		this.matter += value * amount_to_use;
		playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
		to_chat(user, `<span class='notice'>You insert ${amount_to_use} ${S.name} sheets into the ${this}. </span>`);
		return 1;
	}
	to_chat(user, `<span class='warning'>You can't insert any more ${S.name} sheets into the ${this}!`);
	return 0;
}, true);

// RCD.dm:81
rt.def("/obj/item/weapon/construction/proc/activate", function activate(f: Frame) {
	playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
	return f.dot;
});

// RCD.dm:84
rt.def("/obj/item/weapon/construction/proc/attack_self", function attack_self(f: Frame, user: Value) {
	playsound(this.loc, rt.rsc("sound/effects/pop.ogg"), 50, 0);
	if (!prob(20)) return f.dot;
	this.spark_system.start();
	return f.dot;
});

// RCD.dm:89
rt.def("/obj/item/weapon/construction/proc/useResource", function useResource(f: Frame, amount: Value, user: Value) {
	if (this.matter < amount) {
		if (user) {
			to_chat(user, this.no_ammo_message);
		}
		return 0;
	}
	this.matter -= amount;
	this.desc = `A ${this}. It currently holds ${this.matter}/${this.max_matter} matter-units.`;
	this.update_icon();
	return 1;
});

// RCD.dm:99
rt.def("/obj/item/weapon/construction/proc/checkResource", function checkResource(f: Frame, amount: Value, user: Value) {
	f.dot = (this.matter >= amount ? 1 : 0);
	if (!f.dot && user) {
		to_chat(user, this.no_ammo_message);
	}
	return f.dot;
});

// RCD.dm:105
rt.def("/obj/item/weapon/construction/proc/range_check", function range_check(f: Frame, A: Value, user: Value) {
	if (!rt.isIn(f, A, view(7, rt.getStep(f, user, 0)))) {
		to_chat(user, `<span class='warning'>The 'Out of Range' light on the ${this} blinks red.</span>`);
		return 0;
	} else {
		return 1;
	}
});

// RCD.dm:113
rt.def("/obj/item/weapon/construction/proc/prox_check", function prox_check(f: Frame, proximity: Value) {
	if (proximity) {
		return 1;
	} else {
		return 0;
	}
});

rt.type(7328, "/obj/item/weapon/construction/rcd", "/obj/item/weapon/construction", {
	mode: 1,
	canRturf: 0,
	ranged: 0,
	airlock_glass: 0,
	advanced_airlock_setting: 1,
	conf_access: null,
	use_one_access: 0,
	delay_mod: 1,
	airlock_type: rt.typePath("/obj/machinery/door/airlock"),
	window_type: rt.typePath("/obj/structure/window/fulltile"),
	max_matter: 160,
	name: "rapid-construction-device (RCD)",
	desc: "A device used to rapidly build and deconstruct walls and floors.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "rcd",
});

// RCD.dm:137
rt.def("/obj/item/weapon/construction/rcd/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} sets the RCD to 'Wall' and points it down ${user.p_their()} throat! It looks like ${user.p_theyre()} trying to commit suicide..</span>`);
	return 1;
});

// RCD.dm:147
rt.def("/obj/item/weapon/construction/rcd/verb/toggle_window_type", function toggle_window_type(f: Frame) {
	let window_type_name: Value = null;
	if (this.window_type == T("/obj/structure/window/fulltile")) {
		this.window_type = T("/obj/structure/window/reinforced/fulltile");
		window_type_name = "reinforced glass";
	} else {
		this.window_type = T("/obj/structure/window/fulltile");
		window_type_name = "glass";
	}
	to_chat(f.usr, fmt("<span class='notice'>You change ％！'s window mode to ＀.</span>", [this, window_type_name]));
	return f.dot;
}, false, { verb: { name: "Toggle Window Type", category: "Object", src: 11 } });

// RCD.dm:161
rt.def("/obj/item/weapon/construction/rcd/verb/change_airlock_access", function* change_airlock_access(f: Frame) {
	let H: Value = null, A: Value = null, popup: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/carbon/human")) && !f.usr.has_unlimited_silicon_privilege) {
		return (yield* parent_proc(f.usr));
	}
	if ((H = f.usr).getBrainLoss() >= 60) {
		return f.dot;
	}
	let t1: Value = "";
	if (this.use_one_access) {
		t1 += fmt("Restriction Type: <a href='?src=＃;access=one'>At least one access required</a><br>", [this]);
	} else {
		t1 += fmt("Restriction Type: <a href='?src=＃;access=one'>All accesses required</a><br>", [this]);
	}
	t1 += fmt("<a href='?src=＃;access=all'>Remove All</a><br>", [this]);
	let accesses: Value = "";
	accesses += "<div align='center'><b>Access</b></div>";
	accesses += "<table style='width:100%'>";
	accesses += "<tr>";
	let i: Value = 1;
	while (i <= 7) {
		accesses += `<td style='width:14%'><b>${get_region_accesses_name(i)}:</b></td>`;
		i++;
	}
	accesses += "</tr><tr>";
	i = 1;
	while (i <= 7) {
		accesses += "<td style='width:14%' valign='top'>";
		A = null;
		for (A of each(get_region_accesses(i))) {
			if (rt.isIn(f, A, this.conf_access)) {
				accesses += fmt("<a href='?src=＃;access=＀'><font color=\"red\">＀</font></a> ", [this, A, replacetext(get_access_desc(A), " ", "&nbsp")]);
			} else {
				accesses += fmt("<a href='?src=＃;access=＀'>＀</a> ", [this, A, replacetext(get_access_desc(A), " ", "&nbsp")]);
			}
			accesses += "<br>";
		}
		accesses += "</td>";
		i++;
	}
	t1 += `<tt>${(accesses += "</tr></table>")}</tt>`;
	t1 += fmt("<p><a href='?src=＃;close=1'>Close</a></p>\n", [this]);
	(popup = (yield* new_(T("/datum/browser"), f.usr, "airlock_electronics", "Access Control", 900, 500))).set_content(t1);
	popup.set_title_image(f.usr.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	onclose(f.usr, "airlock");
	return f.dot;
}, true, { verb: { name: "Change Airlock Access", category: "Object", src: 11 } });

// RCD.dm:206
rt.def("/obj/item/weapon/construction/rcd/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (f.usr.stat || f.usr.restrained()) {
		return f.dot;
	}
	if (rt.at(href_list, "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=airlock"], false);
		return f.dot;
	}
	if (rt.at(href_list, "access")) {
		this.toggle_access(rt.at(href_list, "access"));
	}
	yield* this.change_airlock_access();
	return f.dot;
}, true);

// RCD.dm:219
rt.def("/obj/item/weapon/construction/rcd/proc/toggle_access", function toggle_access(f: Frame, acc: Value) {
	let req: Value = null;
	if (acc == "all") {
		this.conf_access = null;
	} else if (acc == "one") {
		this.use_one_access = (!this.use_one_access ? 1 : 0);
	} else {
		req = text2num(acc);
		if (this.conf_access === null) {
			this.conf_access = list();
		}
		if (!rt.isIn(f, req, this.conf_access)) {
			this.conf_access += req;
		} else {
			this.conf_access -= req;
			if (rt.len(f, this.conf_access)) return f.dot;
			this.conf_access = null;
		}
	}
	return f.dot;
});

// RCD.dm:241
rt.def("/obj/item/weapon/construction/rcd/verb/change_airlock_setting", function* change_airlock_setting(f: Frame) {
	let airlockcat: Value = null, airlockpaint: Value = null;
	const subject = (airlockcat = (yield* g.op(f, "Prompt", [0], [null, null, "Select whether the airlock is solid or glass.", f.usr, list("Solid", "Glass")])));
	if (subject === "Solid") {
		if (this.advanced_airlock_setting == 1) {
			const subject_2 = (airlockpaint = (yield* g.op(f, "Prompt", [0], [null, null, "Select the paintjob of the airlock.", f.usr, list("Default", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Mining", "Maintenance", "External", "High Security")])));
			if (subject_2 === "Default") {
				this.airlock_type = T("/obj/machinery/door/airlock");
			} else if (subject_2 === "Engineering") {
				this.airlock_type = T("/obj/machinery/door/airlock/engineering");
			} else if (subject_2 === "Atmospherics") {
				this.airlock_type = T("/obj/machinery/door/airlock/atmos");
			} else if (subject_2 === "Security") {
				this.airlock_type = T("/obj/machinery/door/airlock/security");
			} else if (subject_2 === "Command") {
				this.airlock_type = T("/obj/machinery/door/airlock/command");
			} else if (subject_2 === "Medical") {
				this.airlock_type = T("/obj/machinery/door/airlock/medical");
			} else if (subject_2 === "Research") {
				this.airlock_type = T("/obj/machinery/door/airlock/research");
			} else if (subject_2 === "Mining") {
				this.airlock_type = T("/obj/machinery/door/airlock/mining");
			} else if (subject_2 === "Maintenance") {
				this.airlock_type = T("/obj/machinery/door/airlock/maintenance");
			} else if (subject_2 === "External") {
				this.airlock_type = T("/obj/machinery/door/airlock/external");
			} else if (subject_2 === "High Security") {
				this.airlock_type = T("/obj/machinery/door/airlock/highsecurity");
			}
			this.airlock_glass = 0;
		} else {
			this.airlock_type = T("/obj/machinery/door/airlock");
			this.airlock_glass = 0;
		}
	} else if (subject === "Glass") {
		if (this.advanced_airlock_setting == 1) {
			const subject_2 = (airlockpaint = (yield* g.op(f, "Prompt", [0], [null, null, "Select the paintjob of the airlock.", f.usr, list("Default", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Mining")])));
			if (subject_2 === "Default") {
				this.airlock_type = T("/obj/machinery/door/airlock/glass");
			} else if (subject_2 === "Engineering") {
				this.airlock_type = T("/obj/machinery/door/airlock/glass_engineering");
			} else if (subject_2 === "Atmospherics") {
				this.airlock_type = T("/obj/machinery/door/airlock/glass_atmos");
			} else if (subject_2 === "Security") {
				this.airlock_type = T("/obj/machinery/door/airlock/glass_security");
			} else if (subject_2 === "Command") {
				this.airlock_type = T("/obj/machinery/door/airlock/glass_command");
			} else if (subject_2 === "Medical") {
				this.airlock_type = T("/obj/machinery/door/airlock/glass_medical");
			} else if (subject_2 === "Research") {
				this.airlock_type = T("/obj/machinery/door/airlock/glass_research");
			} else if (subject_2 === "Mining") {
				this.airlock_type = T("/obj/machinery/door/airlock/glass_mining");
			}
			this.airlock_glass = 1;
		} else {
			this.airlock_type = T("/obj/machinery/door/airlock/glass");
			this.airlock_glass = 1;
		}
	} else {
		this.airlock_type = T("/obj/machinery/door/airlock");
		this.airlock_glass = 0;
	}
	return f.dot;
}, true, { verb: { name: "Change Airlock Setting", category: "Object", src: 11 } });

// RCD.dm:304
rt.def("/obj/item/weapon/construction/rcd/proc/rcd_create", function* rcd_create(f: Frame, A: Value, user: Value) {
	let rcd_results: Value = null;
	if (!(rcd_results = A.rcd_vals(user, this))) {
		return 0;
	}
	if (!(yield* do_after(user, rt.at(rcd_results, "delay") * this.delay_mod, { target: A }))) return f.dot;
	if (!this.checkResource(rt.at(rcd_results, "cost"), user)) return f.dot;
	if (!(yield* A.rcd_act(user, this, rt.at(rcd_results, "mode")))) return f.dot;
	yield* this.useResource(rt.at(rcd_results, "cost"), user);
	yield* this.activate();
	playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
	return 1;
}, true);

// RCD.dm:316
rt.def("/obj/item/weapon/construction/rcd/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.rcd_list += this;
	return f.dot;
}, true);

// RCD.dm:320
rt.def("/obj/item/weapon/construction/rcd/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.rcd_list -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// RCD.dm:324
rt.def("/obj/item/weapon/construction/rcd/proc/attack_self", function attack_self(f: Frame, user: Value) {
	parent_proc();
	if (this.mode === 1) {
		this.mode = 2;
		to_chat(user, "<span class='notice'>You change RCD's mode to 'Airlock'.</span>");
	} else if (this.mode === 2) {
		this.mode = 3;
		to_chat(user, "<span class='notice'>You change RCD's mode to 'Deconstruct'.</span>");
	} else if (this.mode === 3) {
		this.mode = 4;
		to_chat(user, "<span class='notice'>You change RCD's mode to 'Grilles & Windows'.</span>");
	} else if (this.mode === 4) {
		this.mode = 1;
		to_chat(user, "<span class='notice'>You change RCD's mode to 'Floor & Walls'.</span>");
	}
	return f.dot;
}, false);

// RCD.dm:340
rt.def("/obj/item/weapon/construction/rcd/proc/target_check", function target_check(f: Frame, A: Value, user: Value) {
	if (isturf(A) && A.density && this.mode == RCD_DECONSTRUCT || isturf(A) && !A.density || rt.istype(A, T("/obj/machinery/door/airlock")) && this.mode == RCD_DECONSTRUCT || rt.istype(A, T("/obj/structure/grille")) || rt.istype(A, T("/obj/structure/window")) && this.mode == RCD_DECONSTRUCT || rt.istype(A, T("/obj/structure/girder"))) {
		return 1;
	} else {
		return 0;
	}
});

// RCD.dm:346
rt.def("/obj/item/weapon/construction/rcd/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	if (!this.prox_check(proximity)) {
		return f.dot;
	}
	yield* this.rcd_create(A, user);
	return f.dot;
}, true);

// RCD.dm:351
rt.def("/obj/item/weapon/construction/rcd/proc/detonate_pulse", function* detonate_pulse(f: Frame) {
	this.audible_message(`<span class='danger'><b>${this} begins to vibrate and buzz loudly!</b></span>`, `<span class='danger'><b>${this} begins vibrating violently!</b></span>`);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/construction/rcd/proc/detonate_pulse_explode"))), 50);
	return f.dot;
}, true);

// RCD.dm:358
rt.def("/obj/item/weapon/construction/rcd/proc/detonate_pulse_explode", function* detonate_pulse_explode(f: Frame) {
	yield* explosion(this, 0, 0, 3, 1, { flame_range: 1 });
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(7329, "/obj/item/weapon/construction/rcd/borg", "/obj/item/weapon/construction/rcd", {});

// RCD.dm:363
rt.def("/obj/item/weapon/construction/rcd/borg/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.no_ammo_message = "<span class='warning'>Insufficient charge.</span>";
	this.desc = "A device used to rapidly build walls and floors.";
	this.canRturf = 1;
	return f.dot;
}, true);

// RCD.dm:369
rt.def("/obj/item/weapon/construction/rcd/borg/proc/useResource", function* useResource(f: Frame, amount: Value, user: Value) {
	let borgy: Value = null;
	if (!rt.istype(user, T("/mob/living/silicon/robot"))) {
		return 0;
	}
	if (!(borgy = user).cell) {
		if (user) {
			to_chat(user, this.no_ammo_message);
		}
		return 0;
	}
	f.dot = (yield* borgy.cell.use(amount * 72));
	if (!f.dot && user) {
		to_chat(user, this.no_ammo_message);
	}
	return f.dot;
}, true);

// RCD.dm:382
rt.def("/obj/item/weapon/construction/rcd/borg/proc/checkResource", function checkResource(f: Frame, amount: Value, user: Value) {
	let borgy: Value = null;
	if (!rt.istype(user, T("/mob/living/silicon/robot"))) {
		return 0;
	}
	if (!(borgy = user).cell) {
		if (user) {
			to_chat(user, this.no_ammo_message);
		}
		return 0;
	}
	f.dot = (borgy.cell.charge >= amount * 72 ? 1 : 0);
	if (!f.dot && user) {
		to_chat(user, this.no_ammo_message);
	}
	return f.dot;
});

rt.type(7336, "/obj/item/weapon/rcd_ammo", "/obj/item/weapon", {
	ammoamt: 40,
	name: "compressed matter cartridge",
	desc: "Highly compressed matter for the RCD.",
	icon: rt.rsc("icons/obj/ammo.dmi"),
	icon_state: "rcd",
	item_state: "rcdammo",
	origin_tech: "materials=3",
	materials: null,
});

// RCD.dm:409
rt.def("/obj/item/weapon/rcd_ammo/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 12000, "$glass", 8000]);
	return f.dot;
});

rt.type(7337, "/obj/item/weapon/rcd_ammo/large", "/obj/item/weapon/rcd_ammo", {
	ammoamt: 160,
	origin_tech: "materials=4",
	materials: null,
});

// RCD.dm:414
rt.def("/obj/item/weapon/rcd_ammo/large/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 48000, "$glass", 32000]);
	return f.dot;
});

rt.type(7333, "/obj/item/weapon/construction/rcd/arcd", "/obj/item/weapon/construction/rcd", {
	max_matter: 300,
	matter: 300,
	delay_mod: 0.6,
	ranged: 1,
	name: "advanced rapid-construction-device (ARCD)",
	desc: "A prototype RCD with ranged capability and extended capacity",
	icon_state: "arcd",
	item_state: "rcd",
});

// RCD.dm:438
rt.def("/obj/item/weapon/construction/rcd/arcd/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value) {
	if (!this.range_check(A, user)) {
		return f.dot;
	}
	if (this.target_check(A, user)) {
		yield* user.Beam(A, { icon_state: "rped_upgrade", time: 30 });
	}
	yield* this.rcd_create(A, user);
	return f.dot;
}, true);

rt.type(7335, "/obj/item/weapon/construction/rld", "/obj/item/weapon/construction", {
	mode: 2,
	wallcost: 10,
	floorcost: 15,
	launchcost: 5,
	deconcost: 10,
	walldelay: 10,
	floordelay: 10,
	decondelay: 15,
	color_choice: null,
	matter: 200,
	max_matter: 200,
	name: "rapid-light-device (RLD)",
	desc: "A device used to rapidly provide lighting sources to an area.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "rld-5",
	actions_types: null,
});

// RCD.dm:458
rt.def("/obj/item/weapon/construction/rld/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/pick_color"));
	return f.dot;
});

// RCD.dm:473
rt.def("/obj/item/weapon/construction/rld/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, A: Value) {
	if (rt.istype(A, T("/datum/action/item_action/pick_color"))) {
		this.color_choice = (yield* g.op(f, "Prompt", [256], [null, null, "Choose Color", user, null]));
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// RCD.dm:479
rt.def("/obj/item/weapon/construction/rld/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `rld-${round(this.matter / 35)}`;
	parent_proc();
	return f.dot;
});

// RCD.dm:484
rt.def("/obj/item/weapon/construction/rld/proc/attack_self", function attack_self(f: Frame, user: Value) {
	parent_proc();
	if (this.mode === REMOVE_MODE) {
		this.mode = LIGHT_MODE;
		to_chat(user, "<span class='notice'>You change RLD's mode to 'Permanent Light Construction'.</span>");
	} else if (this.mode === LIGHT_MODE) {
		this.mode = GLOW_MODE;
		to_chat(user, "<span class='notice'>You change RLD's mode to 'Light Launcher'.</span>");
	} else if (this.mode === GLOW_MODE) {
		this.mode = REMOVE_MODE;
		to_chat(user, "<span class='notice'>You change RLD's mode to 'Deconstruct'.</span>");
	}
	return f.dot;
}, false);

// RCD.dm:498
rt.def("/obj/item/weapon/construction/rld/proc/checkdupes", function checkdupes(f: Frame, target: Value) {
	let dupe: Value = null;
	f.dot = list();
	let checking: Value = rt.getStep(f, target, 0);
	for (dupe of each(checking, T("/obj/machinery/light"))) {
		if (rt.istype(dupe, T("/obj/machinery/light"))) {
			(f.dot = rt.modify(f.dot, dupe, rt.bitOr));
		}
	}
	return f.dot;
});

// RCD.dm:506
rt.def("/obj/item/weapon/construction/rld/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value) {
	let W: Value = null, candidates: Value = null, winner: Value = null, winning_dist: Value = null, direction: Value = null, C: Value = null, dupes: Value = null, O: Value = null, x0: Value = null, y0: Value = null, contender: Value = null, light: Value = null, align: Value = null, L: Value = null, F: Value = null, destination: Value = null, FL: Value = null, G: Value = null;
	let $e: any;
	if (!this.range_check(A, user)) {
		return f.dot;
	}
	let start: Value = rt.getStep(f, this, 0);
	if (this.mode === REMOVE_MODE) {
		if (rt.istype(A, T("/obj/machinery/light"))) {
			if (this.checkResource(this.deconcost, user)) {
				to_chat(user, `<span class='notice'>You start deconstructing ${A}...</span>`);
				yield* user.Beam(A, { icon_state: "nzcrentrs_power", time: 15 });
				playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
				if (yield* do_after(user, this.decondelay, { target: A })) {
					if (!(yield* this.useResource(this.deconcost, user))) {
						return 0;
					}
					yield* this.activate();
					yield* qdel(A);
					return 1;
				}
			}
			return 0;
		}
	} else if (this.mode === LIGHT_MODE) {
		if (rt.istype(A, T("/turf/closed/wall"))) {
			W = A;
			if (this.checkResource(this.floorcost, user)) {
				to_chat(user, "<span class='notice'>You start building a wall light...</span>");
				yield* user.Beam(A, { icon_state: "nzcrentrs_power", time: 15 });
				playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
				playsound(this.loc, rt.rsc("sound/effects/light_flicker.ogg"), 50, 0);
				if (yield* do_after(user, this.floordelay, { target: A })) {
					if (!rt.istype(W, T("/turf/closed/wall"))) {
						return 0;
					}
					candidates = list();
					for (direction of each(GLOB.cardinal)) {
						C = rt.getStep(f, W, direction);
						dupes = this.checkdupes(C);
						if (start.CanAtmosPass(C) && !rt.len(f, dupes)) {
							candidates += C;
						}
					}
					if (!rt.len(f, candidates)) {
						to_chat(user, "<span class='warning'>Valid target not found...</span>");
						playsound(this.loc, rt.rsc("sound/misc/compiler-failure.ogg"), 30, 1);
						return 0;
					}
					for (O of each(candidates, T("/turf/open"))) {
						if (rt.istype(O, T("/turf/open"))) {
							x0 = O.x;
							y0 = O.y;
							contender = cheap_hypotenuse(start.x, start.y, x0, y0);
							if (!winner) {
								winner = O;
								winning_dist = contender;
							} else if (contender < winning_dist) {
								winner = O;
								winning_dist = contender;
							}
						}
					}
					yield* this.activate();
					if (!(yield* this.useResource(this.wallcost, user))) {
						return 0;
					}
					light = rt.getStep(f, winner, 0);
					align = rt.getDir(f, winner, A);
					(L = (yield* new_(T("/obj/machinery/light"), light))).dir = align;
					L.color = this.color_choice;
					L.light_color = L.color;
					return 1;
				}
			}
			return 0;
		}
		if (rt.istype(A, T("/turf/open/floor"))) {
			F = A;
			if (this.checkResource(this.floorcost, user)) {
				to_chat(user, "<span class='notice'>You start building a floor light...</span>");
				yield* user.Beam(A, { icon_state: "nzcrentrs_power", time: 15 });
				playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
				playsound(this.loc, rt.rsc("sound/effects/light_flicker.ogg"), 50, 1);
				if (yield* do_after(user, this.floordelay, { target: A })) {
					if (!rt.istype(F, T("/turf/open/floor"))) {
						return 0;
					}
					if (!(yield* this.useResource(this.floorcost, user))) {
						return 0;
					}
					yield* this.activate();
					destination = rt.getStep(f, A, 0);
					(FL = (yield* new_(T("/obj/machinery/light/floor"), destination))).color = this.color_choice;
					FL.light_color = FL.color;
					return 1;
				}
			}
			return 0;
		}
	} else if (this.mode === GLOW_MODE) {
		if (yield* this.useResource(this.launchcost, user)) {
			yield* this.activate();
			to_chat(user, "<span class='notice'>You fire a glowstick!</span>");
			(G = (yield* new_(T("/obj/item/device/flashlight/glowstick"), start))).color = this.color_choice;
			G.light_color = G.color;
			yield* G.throw_at(A, 9, 3, user);
			G.on = 1;
			G.update_brightness();
			return 1;
		}
		return 0;
	}
	return f.dot;
}, true);
