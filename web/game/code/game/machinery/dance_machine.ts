// Based on /tg/station's code/game/machinery/dance_machine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(10786, "/obj/machinery/disco", "/obj/machinery", {
	active: 0,
	rangers: null,
	charge: 35,
	stop: 0,
	spotlights: null,
	sparkles: null,
	selection: null,
	anchored: 0,
	verb_say: "states",
	name: "radiant dance machine mark IV",
	desc: "The first three prototypes were discontinued after mass casualty incidents.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "disco0",
	density: 1,
	req_access: null,
}, { global: { songs: 756 } });

// dance_machine.dm:13
rt.def("/obj/machinery/disco/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.rangers = list();

	this.spotlights = list();

	this.sparkles = list();

	this.req_access = list(10);
	return f.dot;
});

rt.type(1491, "/datum/track", "/datum", {
	song_name: "generic",
	song_path: null,
	song_length: 0,
	song_beat: 0,
	GBP_required: 0,
});

// dance_machine.dm:34
rt.def("/datum/track/proc/New", function New(f: Frame, name: Value, path: Value, length: Value, beat: Value) {
	this.song_name = name;
	this.song_path = path;
	this.song_length = length;
	this.song_beat = beat;
	return f.dot;
});

// dance_machine.dm:40
rt.def("/obj/machinery/disco/proc/add_track", function add_track(f: Frame, file: Value, name: Value, length: Value, beat: Value) {
	let S: Value = null, _T: Value = null;
	if (!rt.istype((S = file), T("/sound"))) {
		return f.dot;
	}
	if (!name) {
		name = `${file}`;
	}
	if (!beat) {
		beat = 5;
	}
	if (!length) {
		length = 2400;
	}
	GLOB.songs += (_T = new_(T("/datum/track"), name, file, length, beat));
	return f.dot;
});

// dance_machine.dm:53
rt.def("/obj/machinery/disco/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.selection = rt.index(GLOB.songs, 1);
	return f.dot;
}, true);

// dance_machine.dm:58
rt.def("/obj/machinery/disco/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.dance_over();
	return (yield* parent_proc());
}, true);

// dance_machine.dm:62
rt.def("/obj/machinery/disco/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (!this.active) {
		if (rt.istype(O, T("/obj/item/weapon/wrench"))) {
			if (!this.anchored && !this.isinspace()) {
				to_chat(user, `<span class='notice'>You secure the ${this} to the floor.</span>`);
				this.anchored = 1;
			} else if (this.anchored) {
				to_chat(user, `<span class='notice'>You unsecure and disconnect the ${this}.</span>`);
				this.anchored = 0;
			}
			playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// dance_machine.dm:76
rt.def("/obj/machinery/disco/proc/update_icon", function update_icon(f: Frame) {
	if (this.active) {
		this.icon_state = "disco1";
	} else {
		this.icon_state = "disco0";
	}
	parent_proc();
	return f.dot;
});

// dance_machine.dm:83
rt.def("/obj/machinery/disco/proc/interact", function* interact(f: Frame, user: Value) {
	let popup: Value = null;
	if (!this.anchored) {
		to_chat(user, "<span class='warning'>This device must be anchored by a wrench!</span>");
		return f.dot;
	}
	if (!(yield* this.allowed(user))) {
		to_chat(user, "<span class='warning'>Error: Access Denied - Message: Only the engineering department can be trusted with this kind of power.</span>");
		user.playsound_local(this, rt.rsc("sound/misc/compiler-failure.ogg"), 25, 1);
		return f.dot;
	}
	if (!this.Adjacent(user) && !rt.istype(user, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = list();
	dat += "<div class='statusDisplay' style='text-align:center'>";
	let $0: any = this;
	dat += fmt("<b><A href='?src=＃;action=toggle'>＀<b></A><br>", [$0, !this.active ? "BREAK IT DOWN" : "SHUT IT DOWN"]);
	dat += "</div><br>";
	dat += fmt("<A href='?src=＃;action=select'> Select Track</A><br>", [this]);
	dat += `Track Selected: ${this.selection.song_name}<br>`;
	dat += `Track Length: ${this.selection.song_length / 10} seconds<br><br>`;
	dat += "<br>DJ's Soundboard:<b><br>";
	dat += "<div class='statusDisplay'><div style='text-align:center'>";
	dat += fmt("<A href='?src=＃;action=horn'>Air Horn</A>  ", [this]);
	dat += fmt("<A href='?src=＃;action=alert'>Station Alert</A>  ", [this]);
	dat += fmt("<A href='?src=＃;action=siren'>Warning Siren</A>  ", [this]);
	dat += fmt("<A href='?src=＃;action=honk'>Honk</A><br>", [this]);
	dat += fmt("<A href='?src=＃;action=pump'>Shotgun Pump</A>", [this]);
	dat += fmt("<A href='?src=＃;action=pop'>Gunshot</A>", [this]);
	dat += fmt("<A href='?src=＃;action=saber'>Esword</A>", [this]);
	dat += fmt("<A href='?src=＃;action=harm'>Harm Alarm</A>", [this]);
	(popup = (yield* new_(T("/datum/browser"), user, "vending", "Radiance Dance Machine - Mark IV", 400, 350))).set_content(dat.Join());
	yield* popup.open();
	return f.dot;
}, true);

// dance_machine.dm:116
rt.def("/obj/machinery/disco/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let available: Value = null, S: Value = null, selected: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	const item = rt.at(href_list, "action");
	if (item === "toggle") {
		if (!this || this.gc_destroyed) {
			return f.dot;
		}
		if (!this.active) {
			if (this.stop > rt.worldTime(f)) {
				to_chat(f.usr, `<span class='warning'>Error: The device is still resetting from the last activation, it will be ready again in ${round((this.stop - rt.worldTime(f)) / 10)} seconds.</span>`);
				playsound(this, rt.rsc("sound/misc/compiler-failure.ogg"), 50, 1);
				return f.dot;
			}
			this.active = 1;
			yield* this.update_icon();
			yield* this.dance_setup();
			if (!this.isprocessing) {
				this.isprocessing = 1;
				GLOB.SSobj.processing += this;
			}
			yield* this.lights_spin();
			yield* this.updateUsrDialog();
		} else if (this.active) {
			this.stop = 0;
			yield* this.updateUsrDialog();
		}
	} else if (item === "select") {
		if (this.active) {
			to_chat(f.usr, "<span class='warning'>Error: You cannot change the song until the current one is over.</span>");
			return f.dot;
		}
		available = list();
		for (S of each(GLOB.songs, T("/datum/track"))) {
			rt.setAt(available, S.song_name, S);
		}
		selected = (yield* g.op(f, "Prompt", [1], [null, "Track:", "Choose your song", f.usr, available]));
		if (!this || this.gc_destroyed || !selected || !rt.istype(rt.index(available, selected), T("/datum/track"))) {
			return f.dot;
		}
		this.selection = rt.index(available, selected);
		yield* this.updateUsrDialog();
	} else if (item === "horn") {
		this.deejay(rt.rsc("sound/items/airhorn2.ogg"));
	} else if (item === "alert") {
		this.deejay(rt.rsc("sound/misc/notice1.ogg"));
	} else if (item === "siren") {
		this.deejay(rt.rsc("sound/machines/engine_alert1.ogg"));
	} else if (item === "honk") {
		this.deejay(rt.rsc("sound/items/bikehorn.ogg"));
	} else if (item === "pump") {
		this.deejay(rt.rsc("sound/weapons/shotgunpump.ogg"));
	} else if (item === "pop") {
		this.deejay(rt.rsc("sound/weapons/gunshot3.ogg"));
	} else if (item === "saber") {
		this.deejay(rt.rsc("sound/weapons/saberon.ogg"));
	} else if (item === "harm") {
		this.deejay(rt.rsc("sound/ai/harmalarm.ogg"));
	}
	return f.dot;
}, true);

// dance_machine.dm:168
rt.def("/obj/machinery/disco/proc/deejay", function deejay(f: Frame, S: Value) {
	if (!this || this.gc_destroyed || !this.active || this.charge < 5) {
		to_chat(f.usr, "<span class='warning'>The device is not able to play more DJ sounds at this time.</span>");
		return f.dot;
	}
	this.charge -= 5;
	playsound(this, S, 300, 1);
	return f.dot;
});

// dance_machine.dm:175
rt.def("/obj/machinery/disco/proc/dance_setup", function* dance_setup(f: Frame) {
	let t: Value = null, L: Value = null;
	this.stop = rt.worldTime(f) + this.selection.song_length;
	let cen: Value = rt.getStep(f, this, 0);
	GLOB.dview_mob.loc = rt.getStep(f, this, 0);
	GLOB.dview_mob.see_invisible = 20;
	for (t of each(view(3, GLOB.dview_mob), T("/turf"))) {
		if (t.x == cen.x && t.y > cen.y) {
			(L = (yield* new_(T("/obj/item/device/flashlight/spotlight"), t))).light_color = "red";
			L.light_power = 30 - get_dist(this, L) * 8;
			L.range = 1 + get_dist(this, L);
			this.spotlights += L;
			continue;
		}
		if (t.x == cen.x && t.y < cen.y) {
			(L = (yield* new_(T("/obj/item/device/flashlight/spotlight"), t))).light_color = "purple";
			L.light_power = 30 - get_dist(this, L) * 8;
			L.range = 1 + get_dist(this, L);
			this.spotlights += L;
			continue;
		}
		if (t.x > cen.x && t.y == cen.y) {
			(L = (yield* new_(T("/obj/item/device/flashlight/spotlight"), t))).light_color = "#ffff00";
			L.light_power = 30 - get_dist(this, L) * 8;
			L.range = 1 + get_dist(this, L);
			this.spotlights += L;
			continue;
		}
		if (t.x < cen.x && t.y == cen.y) {
			(L = (yield* new_(T("/obj/item/device/flashlight/spotlight"), t))).light_color = "green";
			L.light_power = 30 - get_dist(this, L) * 8;
			L.range = 1 + get_dist(this, L);
			this.spotlights += L;
			continue;
		}
		if (t.x + 1 == cen.x && t.y + 1 == cen.y || t.x + 2 == cen.x && t.y + 2 == cen.y) {
			(L = (yield* new_(T("/obj/item/device/flashlight/spotlight"), t))).light_color = "sw";
			L.light_power = 30 - get_dist(this, L) * 8;
			L.range = 1.4 + get_dist(this, L);
			this.spotlights += L;
			continue;
		}
		if (t.x - 1 == cen.x && t.y - 1 == cen.y || t.x - 2 == cen.x && t.y - 2 == cen.y) {
			(L = (yield* new_(T("/obj/item/device/flashlight/spotlight"), t))).light_color = "ne";
			L.light_power = 30 - get_dist(this, L) * 8;
			L.range = 1.4 + get_dist(this, L);
			this.spotlights += L;
			continue;
		}
		if (t.x - 1 == cen.x && t.y + 1 == cen.y || t.x - 2 == cen.x && t.y + 2 == cen.y) {
			(L = (yield* new_(T("/obj/item/device/flashlight/spotlight"), t))).light_color = "se";
			L.light_power = 30 - get_dist(this, L) * 8;
			L.range = 1.4 + get_dist(this, L);
			this.spotlights += L;
			continue;
		}
		if (t.x + 1 == cen.x && t.y - 1 == cen.y || t.x + 2 == cen.x && t.y - 2 == cen.y) {
			(L = (yield* new_(T("/obj/item/device/flashlight/spotlight"), t))).light_color = "nw";
			L.light_power = 30 - get_dist(this, L) * 8;
			L.range = 1.4 + get_dist(this, L);
			this.spotlights += L;
			continue;
		}
	}
	GLOB.dview_mob.loc = null;
	return f.dot;
}, true);

// dance_machine.dm:238
rt.def("/obj/machinery/disco/proc/hierofunk", function* hierofunk(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* spawn_atom_to_turf(T("/obj/effect/temp_visual/hierophant/telegraph/edge"), this, 1, 0);
		yield* sleep(5);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// dance_machine.dm:243
rt.def("/obj/machinery/disco/proc/lights_spin", function* lights_spin(f: Frame) {
	let i: Value = null, S: Value = null, reveal: Value = null, glow: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 25, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!this || this.gc_destroyed || !this.active) {
			return f.dot;
		}
		(S = (yield* new_(T("/obj/effect/overlay/sparkles"), this))).alpha = 0;
		this.sparkles += S;
		if (rt.inRange(i, 1, 8)) {
			yield* S.orbit(this, 30, 1, 60, 36, 1, 0);
		} else if (rt.inRange(i, 9, 16)) {
			yield* S.orbit(this, 62, 1, 60, 36, 1, 0);
		} else if (rt.inRange(i, 17, 24)) {
			yield* S.orbit(this, 95, 1, 60, 36, 1, 0);
		} else if (i === 25) {
			S.pixel_y = 7;
			yield* S.forceMove(rt.getStep(f, this, 0));
		}
		yield* sleep(7);
	}
	rt.endFor(f, 0);
	if (this.selection.song_name == "Engineering's Ultimate High-Energy Hustle") {
		yield* sleep(280);
	}
	for (reveal of each(this.sparkles, T("/obj"))) {
		reveal.alpha = 255;
	}
	while (this.active) {
		glow = null;
		for (glow of each(this.spotlights, T("/obj/item/device/flashlight/spotlight"))) {
			if (!this || this.gc_destroyed || !this.active || !glow || glow.gc_destroyed) {
				return f.dot;
			}
			if (glow.light_color == "red") {
				glow.light_color = "nw";
				glow.light_power = glow.light_power * 1.48;
				glow.light_range = 0;
				yield* glow.update_light();
				continue;
			}
			if (glow.light_color == "nw") {
				glow.light_color = "green";
				glow.light_range = glow.range * 1.1;
				glow.light_power = glow.light_power * 2;
				yield* glow.update_light();
				continue;
			}
			if (glow.light_color == "green") {
				glow.light_color = "sw";
				glow.light_power = glow.light_power * 0.5;
				glow.light_range = 0;
				yield* glow.update_light();
				continue;
			}
			if (glow.light_color == "sw") {
				glow.light_color = "purple";
				glow.light_power = glow.light_power * 2.27;
				glow.light_range = glow.range * 1.15;
				yield* glow.update_light();
				continue;
			}
			if (glow.light_color == "purple") {
				glow.light_color = "se";
				glow.light_power = glow.light_power * 0.44;
				glow.light_range = 0;
				yield* glow.update_light();
				continue;
			}
			if (glow.light_color == "se") {
				glow.light_color = "#ffff00";
				glow.light_range = glow.range * 0.9;
				yield* glow.update_light();
				continue;
			}
			if (glow.light_color == "#ffff00") {
				glow.light_color = "ne";
				glow.light_range = 0;
				yield* glow.update_light();
				continue;
			}
			if (glow.light_color == "ne") {
				glow.light_color = "red";
				glow.light_power = glow.light_power * 0.68;
				glow.light_range = glow.range * 0.85;
				yield* glow.update_light();
				continue;
			}
		}
		if (prob(2)) {
			yield* ImmediateInvokeAsync(this, P("/obj/machinery/disco/proc/hierofunk"));
		}
		yield* sleep(this.selection.song_beat);
	}
	return f.dot;
}, true);

// dance_machine.dm:321
rt.def("/obj/machinery/disco/proc/dance", function* dance(f: Frame, M: Value) {
	const die = rand(0, 9);
	if (rt.inRange(die, 0, 1)) {
		yield* this.dance2(M);
	} else if (rt.inRange(die, 2, 3)) {
		yield* this.dance3(M);
	} else if (rt.inRange(die, 4, 6)) {
		yield* this.dance4(M);
	} else if (rt.inRange(die, 7, 9)) {
		yield* this.dance5(M);
	}
	return f.dot;
}, true, { waitfor: false });

// dance_machine.dm:332
rt.def("/obj/machinery/disco/proc/dance2", function* dance2(f: Frame, M: Value) {
	let d: Value = null;
	let i: Value = 1;
	while (i < 10) {
		d = null;
		for (d of each(list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2))) {
			yield* M.setDir(d);
			if (i == 8) {
				yield* M.emote("flip");
			}
			yield* sleep(1);
		}
		yield* sleep(20);
		i++;
	}
	return f.dot;
}, true);

// dance_machine.dm:341
rt.def("/obj/machinery/disco/proc/dance3", function* dance3(f: Frame, M: Value) {
	let i: Value = null;
	let $e: any;
	let initial_matrix: Value = matrix(M.transform);
	rt.forRange(f, 0, 1, 75, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!M) {
			return f.dot;
		}
		if (rt.inRange(i, 1, 15)) {
			(initial_matrix = matrix(M.transform)).Translate(0, 1);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		} else if (rt.inRange(i, 16, 30)) {
			(initial_matrix = matrix(M.transform)).Translate(1, -1);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		} else if (rt.inRange(i, 31, 45)) {
			(initial_matrix = matrix(M.transform)).Translate(-1, -1);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		} else if (rt.inRange(i, 46, 60)) {
			(initial_matrix = matrix(M.transform)).Translate(-1, 1);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		} else if (rt.inRange(i, 61, 75)) {
			(initial_matrix = matrix(M.transform)).Translate(1, 0);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		}
		yield* M.setDir(turn(M.dir, 90));
		if (M.dir === 1) {
			(initial_matrix = matrix(M.transform)).Translate(0, 3);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		} else if (M.dir === 2) {
			(initial_matrix = matrix(M.transform)).Translate(0, -3);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		} else if (M.dir === 4) {
			(initial_matrix = matrix(M.transform)).Translate(3, 0);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		} else if (M.dir === 8) {
			(initial_matrix = matrix(M.transform)).Translate(-3, 0);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		}
		yield* sleep(1);
	}
	rt.endFor(f, 0);
	M.lying_fix();
	return f.dot;
}, true);

// dance_machine.dm:389
rt.def("/obj/machinery/disco/proc/dance4", function* dance4(f: Frame, M: Value) {
	let i: Value = null;
	let $e: any;
	let speed: Value = rand(1, 3);
	let time: Value = 30;
	while (time) {
		yield* sleep(speed);
		i = null;
		rt.forRange(f, 0, 1, speed, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* M.setDir(pick(GLOB.cardinal));
			yield* M.lay_down(1);
			time--;
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true, { waitfor: false });

// dance_machine.dm:400
rt.def("/obj/machinery/disco/proc/dance5", function* dance5(f: Frame, M: Value) {
	let i: Value = null;
	let $e: any;
	rt.op(f, "Animate", [2, 8], [null, M, "transform", matrix(180, 5), "time", 1, "loop", 0]);
	let initial_matrix: Value = matrix(M.transform);
	rt.forRange(f, 0, 1, 60, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!M) {
			return f.dot;
		}
		if (i < 31) {
			(initial_matrix = matrix(M.transform)).Translate(0, 1);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		}
		if (i > 30) {
			(initial_matrix = matrix(M.transform)).Translate(0, -1);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		}
		yield* M.setDir(turn(M.dir, 90));
		if (M.dir === 1) {
			(initial_matrix = matrix(M.transform)).Translate(0, 3);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		} else if (M.dir === 2) {
			(initial_matrix = matrix(M.transform)).Translate(0, -3);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		} else if (M.dir === 4) {
			(initial_matrix = matrix(M.transform)).Translate(3, 0);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		} else if (M.dir === 8) {
			(initial_matrix = matrix(M.transform)).Translate(-3, 0);
			rt.op(f, "Animate", [2, 8], [null, M, "transform", initial_matrix, "time", 1, "loop", 0]);
		}
		yield* sleep(1);
	}
	rt.endFor(f, 0);
	M.lying_fix();
	return f.dot;
}, true);

// dance_machine.dm:437
rt.def("/mob/living/proc/lying_fix", function lying_fix(f: Frame) {
	rt.op(f, "Animate", [2, 8], [null, this, "transform", null, "time", 1, "loop", 0]);
	this.lying_prev = 0;
	return f.dot;
});

// dance_machine.dm:441
rt.def("/obj/machinery/disco/proc/dance_over", function* dance_over(f: Frame) {
	let SL: Value = null, SP: Value = null, L: Value = null;
	for (SL of each(this.spotlights, T("/obj/item/device/flashlight/spotlight"))) {
		yield* qdel(SL);
	}
	this.spotlights.Cut();
	for (SP of each(this.sparkles, T("/obj/effect/overlay/sparkles"))) {
		yield* qdel(SP);
	}
	this.sparkles.Cut();
	for (L of each(this.rangers, T("/mob/living"))) {
		if (!L || !L.client) {
			continue;
		}
		L.stop_sound_channel(1021);
	}
	this.rangers = list();
	return f.dot;
}, true);

// dance_machine.dm:456
rt.def("/obj/machinery/disco/proc/process", function* process(f: Frame) {
	let M: Value = null, L: Value = null;
	if (this.charge < 35) {
		this.charge += 1;
	}
	if (rt.worldTime(f) < this.stop && this.active) {
		for (M of each(range(10, this), T("/mob"))) {
			if (!rt.isIn(f, M, this.rangers)) {
				rt.setAt(this.rangers, M, 1);
				yield* M.playsound_local(rt.getStep(f, M, 0), this.selection.song_path, 100, { channel: 1021 });
			}
			if (prob(5 + (yield* this.allowed(M)) * 4) && M.canmove) {
				yield* this.dance(M);
			}
		}
		for (L of each(this.rangers, T("/mob"))) {
			if (get_dist(this, L) > 10) {
				this.rangers -= L;
				if (!L || !L.client) {
					continue;
				}
				L.stop_sound_channel(1021);
			}
		}
	} else {
		if (!this.active) return f.dot;
		this.active = 0;
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		yield* this.dance_over();
		playsound(this, rt.rsc("sound/machines/terminal_off.ogg"), 50, 1);
		this.icon_state = "disco0";
		this.stop = rt.worldTime(f) + 100;
	}
	return f.dot;
}, true, { waitfor: false });
