// Based on /tg/station's code/game/gamemodes/blob/overmind.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5100, "/mob/camera/blob", "/mob/camera", {
	blob_core: null,
	blob_points: 0,
	max_blob_points: 100,
	last_attack: 0,
	blob_reagent_datum: null,
	blob_mobs: null,
	resource_blobs: null,
	free_chem_rerolls: 1,
	nodes_required: 1,
	placed: 0,
	base_point_rate: 2,
	manualplace_min_time: 600,
	autoplace_max_time: 3600,
	pass_flags: 8,
	name: "Blob Overmind",
	real_name: "Blob Overmind",
	desc: "The overmind. It controls the blob.",
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "marker",
	mouse_opacity: 1,
	move_on_shuttle: 1,
	see_in_dark: 8,
	invisibility: 60,
	layer: 5,
	faction: null,
	lighting_alpha: 128,
});

// overmind.dm:20
rt.def("/mob/camera/blob/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.blob_reagent_datum = new_(T("/datum/reagent/blob"));

	this.blob_mobs = list();

	this.resource_blobs = list();

	this.faction = list("blob");
	return f.dot;
});

// overmind.dm:31
rt.def("/mob/camera/blob/proc/Initialize", function* Initialize(f: Frame) {
	let new_name: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 60;
	}
	this.blob_points = f.args[3];
	if (f.args[1]) {
		this.manualplace_min_time = 0;
		this.autoplace_max_time = 0;
		this.placed = 1;
	} else {
		if (f.args[2]) {
			this.manualplace_min_time = rt.worldTime(f) + BLOB_NO_PLACE_TIME;
		} else {
			this.manualplace_min_time += rt.worldTime(f);
		}
		this.autoplace_max_time += rt.worldTime(f);
	}
	GLOB.overminds += this;
	this.name = (new_name = `${rt.initial(f, this, "name")} (${rand(1, 999)})`);
	this.real_name = new_name;
	this.last_attack = rt.worldTime(f);
	let BC: Value = pick(typesof(T("/datum/reagent/blob")) - T("/datum/reagent/blob"));
	this.blob_reagent_datum = (yield* new_(BC));
	this.color = this.blob_reagent_datum.complementary_color;
	if (this.blob_core) {
		yield* this.blob_core.update_icon();
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["mapload", "pre_placed", "mode_made", "starting_points"] });

// overmind.dm:56
rt.def("/mob/camera/blob/proc/Life", function* Life(f: Frame) {
	if (!this.blob_core) {
		if (!this.placed) {
			if (this.manualplace_min_time && rt.worldTime(f) >= this.manualplace_min_time) {
				to_chat(this, "<b><span class='big'><font color=\"#EE4000\">You may now place your blob core.</font></span></b>");
				to_chat(this, `<span class='big'><font color="#EE4000">You will automatically place your blob core in ${round((this.autoplace_max_time - rt.worldTime(f)) / 600, 0.5)} minutes.</font></span>`);
				this.manualplace_min_time = 0;
			}
			if (this.autoplace_max_time && rt.worldTime(f) >= this.autoplace_max_time) {
				yield* this.place_blob_core(this.base_point_rate, 1);
			}
		} else {
			yield* qdel(this);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// overmind.dm:69
rt.def("/mob/camera/blob/proc/Destroy", function* Destroy(f: Frame) {
	let BL: Value = null, B: Value = null, BLO: Value = null, BM: Value = null;
	for (BL of each(GLOB.blobs)) {
		if ((B = BL) && B.overmind == this) {
			B.overmind = null;
			yield* B.update_icon();
		}
	}
	for (BLO of each(this.blob_mobs)) {
		if (BM = BLO) {
			BM.overmind = null;
			yield* BM.update_icons();
		}
	}
	GLOB.overminds -= this;
	return (yield* parent_proc());
}, true);

// overmind.dm:84
rt.def("/mob/camera/blob/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	this.sync_mind();
	to_chat(this, "<span class='notice'>You are the overmind!</span>");
	this.blob_help();
	this.update_health_hud();
	this.add_points(0);
	return f.dot;
}, true);

// overmind.dm:92
rt.def("/mob/camera/blob/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.blob_reagent_datum) return f.dot;
	to_chat(user, `Its chemical is <font color="${this.blob_reagent_datum.color}">${this.blob_reagent_datum.name}</font>.`);
	return f.dot;
}, false);

// overmind.dm:98
rt.def("/mob/camera/blob/proc/update_health_hud", function update_health_hud(f: Frame) {
	let B: Value = null;
	if (!this.blob_core) return f.dot;
	this.hud_used.healths.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#e36600'>${round(this.blob_core.obj_integrity)}</font></div>`;
	for (B of each(this.blob_mobs, T("/mob/living/simple_animal/hostile/blob/blobbernaut"))) {
		if (B.hud_used && B.hud_used.blobpwrdisplay) {
			B.hud_used.blobpwrdisplay.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#82ed00'>${round(this.blob_core.obj_integrity)}</font></div>`;
		}
	}
	return f.dot;
});

// overmind.dm:104
rt.def("/mob/camera/blob/proc/add_points", function add_points(f: Frame, points: Value) {
	this.blob_points = max(0, min(this.blob_points + points, this.max_blob_points));
	this.hud_used.blobpwrdisplay.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#82ed00'>${round(this.blob_points)}</font></div>`;
	return f.dot;
});

// overmind.dm:108
rt.def("/mob/camera/blob/proc/say", function say(f: Frame, message: Value) {
	if (!message) {
		return f.dot;
	}
	if (this.client) {
		if (rt.bitAnd(this.client.prefs.muted, 1)) {
			to_chat(this, "You cannot send IC messages (muted).");
			return f.dot;
		}
		if (this.client.handle_spam_prevention(message, 1)) {
			return f.dot;
		}
	}
	if (this.stat) {
		return f.dot;
	}
	this.blob_talk(message);
	return f.dot;
});

// overmind.dm:124
rt.def("/mob/camera/blob/proc/blob_talk", function blob_talk(f: Frame, message: Value) {
	let M: Value = null, link: Value = null;
	log_say(`${key_name(this)} : ${message}`);
	if (!(message = trim(copytext(sanitize(message), 1, 1024)))) {
		return f.dot;
	}
	let message_a: Value = this.say_quote(message, this.get_spans());
	let rendered: Value = `<span class='big'><font color="#EE4000"><b>[Blob Telepathy] ${this.name}(<font color="${this.blob_reagent_datum.color}">${this.blob_reagent_datum.name}</font>)</b> ${message_a}</font></span>`;
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (rt.istype(M, T("/mob/camera/blob")) || rt.istype(M, T("/mob/living/simple_animal/hostile/blob"))) {
			to_chat(M, rendered);
		}
		if (rt.istype(M, T("/mob/dead/observer"))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, this]);
			to_chat(M, `${link} ${rendered}`);
		}
	}
	return f.dot;
});

// overmind.dm:148
rt.def("/mob/camera/blob/proc/Stat", function* Stat(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	if (this.blob_core) {
		stat(null, `Core Health: ${this.blob_core.obj_integrity}`);
	}
	stat(null, `Power Stored: ${this.blob_points}/${this.max_blob_points}`);
	if (GLOB.SSticker && rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/blob"))) {
		B = GLOB.SSticker.mode;
		stat(null, `Blobs to Win: ${rt.len(f, GLOB.blobs_legit)}/${B.blobwincount}`);
	} else {
		stat(null, `Total Blobs: ${rt.len(f, GLOB.blobs)}`);
	}
	if (this.free_chem_rerolls) {
		stat(null, fmt("You have ＀ Free Chemical Reroll５ Remaining", [this.free_chem_rerolls]));
	}
	if (this.placed) return f.dot;
	if (this.manualplace_min_time) {
		stat(null, `Time Before Manual Placement: ${max(round((this.manualplace_min_time - rt.worldTime(f)) * 0.1, 0.1), 0)}`);
	}
	stat(null, `Time Before Automatic Placement: ${max(round((this.autoplace_max_time - rt.worldTime(f)) * 0.1, 0.1), 0)}`);
	return f.dot;
}, true);

// overmind.dm:167
rt.def("/mob/camera/blob/proc/Move", function Move(f: Frame, NewLoc: Value, Dir: Value) {
	let B: Value = null, A: Value = null;
	Dir ??= 0;
	if (this.placed) {
		if (B = rt.locateIn(f, T("/obj/structure/blob"), range("3x3", NewLoc))) {
			this.loc = NewLoc;
		} else {
			return 0;
		}
	} else {
		A = get_area(NewLoc);
		if (rt.istype(NewLoc, T("/turf/open/space")) || rt.istype(A, T("/area/shuttle"))) {
			return 0;
		}
		this.loc = NewLoc;
		return 1;
	}
	return f.dot;
});
