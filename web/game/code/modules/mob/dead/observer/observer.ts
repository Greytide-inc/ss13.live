// Based on /tg/station's code/modules/mob/dead/observer/observer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// observer.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_images_default", function InitGlobalghost_images_default(f: Frame) {
	GLOB.ghost_images_default = list();
	this.gvars_datum_init_order += "ghost_images_default";
	return f.dot;
});

// observer.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_images_simple", function InitGlobalghost_images_simple(f: Frame) {
	GLOB.ghost_images_simple = list();
	this.gvars_datum_init_order += "ghost_images_simple";
	return f.dot;
});

// observer.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalobserver_default_invisibility", function InitGlobalobserver_default_invisibility(f: Frame) {
	GLOB.observer_default_invisibility = 60;
	this.gvars_datum_init_order += "observer_default_invisibility";
	return f.dot;
});

rt.type(5096, "/mob/dead/observer", "/mob/dead", {
	can_reenter_corpse: null,
	hud: null,
	bootime: 0,
	started_as_observer: null,
	following: null,
	fun_verbs: 0,
	ghostimage_default: null,
	ghostimage_simple: null,
	ghostvision: 1,
	observetarget: null,
	orbit_eye: null,
	ghost_hud_enabled: 1,
	data_huds_on: 0,
	datahuds: null,
	ghost_orbit: "circle",
	hair_style: null,
	hair_color: null,
	hair_overlay: null,
	facial_hair_style: null,
	facial_hair_color: null,
	facial_hair_overlay: null,
	updatedir: 1,
	lastsetting: null,
	ghost_accs: 100,
	ghost_others: 100,
	deadchat_name: null,
	anchored: 1,
	name: "ghost",
	desc: "It's a g-g-g-g-ghooooost!",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "ghost",
	layer: 6,
	stat: 2,
	density: 0,
	canmove: 0,
	sight: 60,
	see_invisible: 60,
	see_in_dark: 100,
	invisibility: 60,
});

// observer.dm:57
rt.def("/mob/dead/observer/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null, body: Value = null, body_human: Value = null, turfs: Value = null, v: Value = null, AA: Value = null;
	this.set_invisibility(GLOB.observer_default_invisibility);
	this.verbs += P("/mob/dead/observer/proc/dead_tele");
	if (rt.isIn(f, this.icon_state, GLOB.ghost_forms_with_directions_list)) {
		this.ghostimage_default = image(this.icon, this, this.icon_state + "_nodir");
	} else {
		this.ghostimage_default = image(this.icon, this, this.icon_state);
	}
	this.ghostimage_default.override = 1;
	(rt.modGl("ghost_images_default", this.ghostimage_default, rt.bitOr));
	this.ghostimage_simple = image(this.icon, this, "ghost_nodir");
	this.ghostimage_simple.override = 1;
	(rt.modGl("ghost_images_simple", this.ghostimage_simple, rt.bitOr));
	updateallghostimages();
	if (ismob((body = this.loc))) {
		_T = rt.getStep(f, body, 0);
		this.logging = body.logging;
		this.gender = body.gender;
		if (body.mind && body.mind.name) {
			this.name = body.mind.name;
		} else if (body.real_name) {
			this.name = body.real_name;
		} else {
			this.name = random_unique_name(this.gender);
		}
		this.mind = body.mind;
		if (rt.istype(body, T("/mob/living/carbon/human"))) {
			body_human = body;
			if (rt.isIn(f, HAIR, body_human.dna.species.species_traits)) {
				this.hair_style = body_human.hair_style;
				this.hair_color = this.brighten_color(body_human.hair_color);
			}
			if (rt.isIn(f, FACEHAIR, body_human.dna.species.species_traits)) {
				this.facial_hair_style = body_human.facial_hair_style;
				this.facial_hair_color = this.brighten_color(body_human.facial_hair_color);
			}
		}
	}
	yield* this.update_icon();
	if (!_T) {
		if (rt.len(f, (turfs = get_area_turfs(T("/area/shuttle/arrival"))))) {
			_T = pick(turfs);
		} else {
			_T = rt.locate(round(rt.world().maxx / HAIR), round(rt.world().maxy / 2), 2);
		}
	}
	this.loc = _T;
	if (!this.name) {
		this.name = random_unique_name(this.gender);
	}
	this.real_name = this.name;
	if (!this.fun_verbs) {
		this.verbs -= P("/mob/dead/observer/verb/boo");
		this.verbs -= P("/mob/dead/observer/verb/possess");
	}
	rt.op(f, "Animate", [ZLEVEL_STATION, 8], [null, this, "pixel_y", 2, "time", 10, "loop", -1]);
	GLOB.dead_mob_list += this;
	for (v of each(GLOB.active_alternate_appearances)) {
		if (!v) {
			continue;
		}
		(AA = v).onNewMob(this);
	}
	f.dot = (yield* parent_proc());
	yield* this.grant_all_languages();
	return f.dot;
}, true);

// observer.dm:133
rt.def("/mob/dead/observer/proc/narsie_act", function* narsie_act(f: Frame) {
	let old_color: Value = this.color;
	this.color = "#960000";
	rt.op(f, "Animate", [2, 8], [null, this, "color", old_color, "time", 10, "flags", 4]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 10);
	return f.dot;
}, true);

// observer.dm:139
rt.def("/mob/dead/observer/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let old_color: Value = this.color;
	this.color = "#FAE48C";
	rt.op(f, "Animate", [2, 8], [null, this, "color", old_color, "time", 10, "flags", 4]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 10);
	return f.dot;
}, true);

// observer.dm:145
rt.def("/mob/dead/observer/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.ghost_images_default -= this.ghostimage_default;
	yield* qdel(this.ghostimage_default);
	this.ghostimage_default = null;
	GLOB.ghost_images_simple -= this.ghostimage_simple;
	yield* qdel(this.ghostimage_simple);
	this.ghostimage_simple = null;
	updateallghostimages();
	return (yield* parent_proc());
}, true);

// observer.dm:166
rt.def("/mob/dead/observer/proc/update_icon", function* update_icon(f: Frame, new_form: Value) {
	let S: Value = null;
	if (this.client) {
		this.ghost_accs = this.client.prefs.ghost_accs;
		this.ghost_others = this.client.prefs.ghost_others;
	}
	if (this.hair_overlay) {
		this.cut_overlay(this.hair_overlay);
		this.hair_overlay = null;
	}
	if (this.facial_hair_overlay) {
		this.cut_overlay(this.facial_hair_overlay);
		this.facial_hair_overlay = null;
	}
	if (new_form) {
		this.icon_state = new_form;
		if (rt.isIn(f, this.icon_state, GLOB.ghost_forms_with_directions_list)) {
			this.ghostimage_default.icon_state = new_form + "_nodir";
		} else {
			this.ghostimage_default.icon_state = new_form;
		}
	}
	if (rt.isIn(f, ((this.ghost_accs >= 50 ? 1 : 0) && this.icon_state), GLOB.ghost_forms_with_directions_list)) {
		this.updatedir = 1;
	} else {
		this.updatedir = 0;
		yield* this.setDir(2);
	}
	if (!rt.isIn(f, ((this.ghost_accs == 100 ? 1 : 0) && this.icon_state), GLOB.ghost_forms_with_accessories_list)) return f.dot;
	if (this.facial_hair_style) {
		if (S = rt.index(GLOB.facial_hair_styles_list, this.facial_hair_style)) {
			this.facial_hair_overlay = mutable_appearance(S.icon, `${S.icon_state}`, -8);
			if (this.facial_hair_color) {
				this.facial_hair_overlay.color = "#" + this.facial_hair_color;
			}
			this.facial_hair_overlay.alpha = 200;
			this.add_overlay(this.facial_hair_overlay);
		}
	}
	if (!this.hair_style) return f.dot;
	if (!(S = rt.index(GLOB.hair_styles_list, this.hair_style))) return f.dot;
	this.hair_overlay = mutable_appearance(S.icon, `${S.icon_state}`, -8);
	if (this.hair_color) {
		this.hair_overlay.color = "#" + this.hair_color;
	}
	this.hair_overlay.alpha = 200;
	this.add_overlay(this.hair_overlay);
	return f.dot;
}, true);

// observer.dm:220
rt.def("/mob/proc/brighten_color", function brighten_color(f: Frame, input_color: Value) {
	let r_val: Value = null, b_val: Value = null, g_val: Value = null, color_format: Value = null;
	if ((color_format = lentext(input_color)) == 3) {
		r_val = hex2num(copytext(input_color, 1, 2)) * 16;
		g_val = hex2num(copytext(input_color, 2, 3)) * 16;
		b_val = hex2num(copytext(input_color, 3, 0)) * 16;
	} else if (color_format == 6) {
		r_val = hex2num(copytext(input_color, 1, 3));
		g_val = hex2num(copytext(input_color, 3, 5));
		b_val = hex2num(copytext(input_color, 5, 0));
	} else {
		return 0;
	}
	if ((r_val += (255 - r_val) * 0.4) > 255) {
		r_val = 255;
	}
	if ((g_val += (255 - g_val) * 0.4) > 255) {
		g_val = 255;
	}
	if ((b_val += (255 - b_val) * 0.4) > 255) {
		b_val = 255;
	}
	return num2hex(r_val, 2) + num2hex(g_val, 2) + num2hex(b_val, 2);
});

// observer.dm:251
rt.def("/mob/proc/ghostize", function* ghostize(f: Frame, can_reenter_corpse: Value) {
	can_reenter_corpse ??= 1;
	if (!this.key) return f.dot;
	if (cmptext(copytext(this.key, 1, 2), "@")) return f.dot;
	let ghost: Value = (yield* new_(T("/mob/dead/observer"), this));
	GLOB.SStgui.on_transfer(this, ghost);
	ghost.can_reenter_corpse = can_reenter_corpse;
	ghost.key = this.key;
	return ghost;
}, true);

// observer.dm:266
rt.def("/mob/living/verb/ghost", function* ghost(f: Frame) {
	let response: Value = null;
	if (this.stat != 2) {
		yield* this.succumb();
	}
	if (this.stat == 2) {
		yield* this.ghostize(1);
	} else {
		if ((response = (yield* alert(this, "Are you -sure- you want to ghost?\n(You are alive. If you ghost whilst still alive you may not play again this round! You can't change your mind so choose wisely!!)", "Are you sure you want to ghost?", "Ghost", "Stay in body"))) != "Ghost") {
			return f.dot;
		}
		yield* this.ghostize(0);
	}
	return f.dot;
}, true, { verb: { name: "Ghost", category: "OOC", desc: "Relinquish your life and enter the land of the dead." } });

// observer.dm:280
rt.def("/mob/dead/observer/proc/Move", function* Move(f: Frame, NewLoc: Value, direct: Value) {
	if (this.updatedir) {
		yield* this.setDir(direct);
	}
	let oldloc: Value = this.loc;
	if (NewLoc) {
		this.loc = NewLoc;
		yield* this.update_parallax_contents();
	} else {
		this.loc = rt.getStep(f, this, 0);
		if (rt.bitAnd(direct, 1) && this.y < rt.world().maxy) {
			this.y++;
		} else if (rt.bitAnd(direct, 2) && this.y > 1) {
			this.y--;
		}
		if (rt.bitAnd(direct, 4) && this.x < rt.world().maxx) {
			this.x++;
		} else if (rt.bitAnd(direct, 8) && this.x > 1) {
			this.x--;
		}
	}
	yield* this.Moved(oldloc, direct);
	return f.dot;
}, true);

// observer.dm:303
rt.def("/mob/dead/observer/proc/Stat", function* Stat(f: Frame) {
	let G: Value = null, B: Value = null;
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	if (!GLOB.SSticker.HasRoundStarted()) return f.dot;
	for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
		if (G.is_dominating) {
			stat(null, `${G.name} Gang Takeover: ${max(G.domination_time_remaining(), 0)}`);
		}
	}
	if (!rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/blob"))) return f.dot;
	if (!(B = GLOB.SSticker.mode).message_sent) return f.dot;
	stat(null, `Blobs to Blob Win: ${rt.len(f, GLOB.blobs_legit)}/${B.blobwincount}`);
	return f.dot;
}, true);

// observer.dm:317
rt.def("/mob/dead/observer/verb/reenter_corpse", function* reenter_corpse(f: Frame) {
	if (!this.client) {
		return f.dot;
	}
	if (!(this.mind && this.mind.current)) {
		to_chat(this, "<span class='warning'>You have no body.</span>");
		return f.dot;
	}
	if (!this.can_reenter_corpse) {
		to_chat(this, "<span class='warning'>You cannot re-enter your body.</span>");
		return f.dot;
	}
	if (this.mind.current.key && copytext(this.mind.current.key, 1, 2) != "@") {
		to_chat(f.usr, "<span class='warning'>Another consciousness is in your body...It is resisting you.</span>");
		return f.dot;
	}
	yield* this.client.change_view(this.client.default_view());
	GLOB.SStgui.on_transfer(this, this.mind.current);
	this.mind.current.key = this.key;
	return 1;
}, true, { verb: { name: "Re-enter Corpse", category: "Ghost" } });

// observer.dm:335
rt.def("/mob/dead/observer/proc/notify_cloning", function* notify_cloning(f: Frame, message: Value, sound: Value, source: Value, flashwindow: Value) {
	let A: Value = null, old_layer: Value = null, old_plane: Value = null;
	flashwindow ??= 1;
	if (flashwindow) {
		window_flash(this.client);
	}
	if (message) {
		to_chat(this, `<span class='ghostalert'>${message}</span>`);
		if (source) {
			if (A = (yield* this.throw_alert(fmt("＃_notify_cloning", [source]), T("/obj/screen/alert/notify_cloning")))) {
				if (this.client && this.client.prefs && this.client.prefs.UI_style) {
					A.icon = ui_style2icon(this.client.prefs.UI_style);
				}
				A.desc = message;
				old_layer = source.layer;
				old_plane = source.plane;
				source.layer = -1;
				source.plane = -32767;
				A.add_overlay(source);
				source.layer = old_layer;
				source.plane = old_plane;
			}
		}
	}
	to_chat(this, fmt("<span class='ghostalert'><a href=?src=＃;reenter=1>(Click to re-enter)</a></span>", [this]));
	if (!sound) return f.dot;
	rt.op(f, "Output", [], [this, (yield* g.call(f, P("/proc/sound"), null, [sound]))], false);
	return f.dot;
}, true);

// observer.dm:359
rt.def("/mob/dead/observer/proc/dead_tele", function* dead_tele(f: Frame) {
	let V: Value = null, A: Value = null, thearea: Value = null, _T: Value = null;
	if (!rt.istype(f.usr, T("/mob/dead/observer"))) {
		to_chat(f.usr, "Not when you're not dead!");
		return f.dot;
	}
	if (is_creative() && (yield* this.creative_teleport())) return f.dot; // tg_js: Creative: back to the floor
	let filtered: Value = list();
	for (V of each(GLOB.sortedAreas)) {
		if (!(A = V).hidden) {
			filtered += A;
		}
	}
	if (!(thearea = (yield* g.op(f, "Prompt", [1], [null, null, "BOOYEA", "Area to jump to", filtered])))) {
		return f.dot;
	}
	let L: Value = list();
	for (_T of each(get_area_turfs(thearea.type), T("/turf"))) {
		L += _T;
	}
	if (!L || !rt.len(f, L)) {
		to_chat(f.usr, "No area available.");
	}
	f.usr.loc = pick(L);
	yield* this.update_parallax_contents();
	return f.dot;
}, true, { verb: { name: "Teleport", category: "Ghost", desc: "Teleport to a location" } });

// observer.dm:387
rt.def("/mob/dead/observer/verb/follow", function* follow(f: Frame) {
	let target: Value = null;
	let mobs: Value = (yield* getpois({ skip_mindless: 1 }));
	let input: Value = (yield* g.op(f, "Prompt", [1], [null, null, "Haunt", "Please, select a mob!", mobs]));
	yield* this.ManualFollow((target = rt.index(mobs, input)));
	return f.dot;
}, true, { verb: { name: "Orbit", category: "Ghost", desc: "Follow and orbit a mob." } });

// observer.dm:394
rt.def("/mob/dead/observer/proc/ManualFollow", function* ManualFollow(f: Frame, target: Value) {
	let orbitsize: Value = null, rot_seg: Value = null;
	if (!rt.istype(target, T("/atom/movable"))) {
		return f.dot;
	}
	let I: Value = icon(target.icon, target.icon_state, target.dir);
	orbitsize -= (orbitsize = (I.Width() + I.Height()) * 0.5) / rt.world().icon_size * (rt.world().icon_size * 0.25);
	if (this.orbiting && this.orbiting.orbiting != target) {
		to_chat(this, `<span class='notice'>Now orbiting ${target}.</span>`);
	}
	if (this.ghost_orbit === "triangle") {
		rot_seg = 3;
	} else if (this.ghost_orbit === "square") {
		rot_seg = 4;
	} else if (this.ghost_orbit === "pentagon") {
		rot_seg = 5;
	} else if (this.ghost_orbit === "hexagon") {
		rot_seg = 6;
	} else {
		rot_seg = 36;
	}
	// tg_js: ghosts orbit clockwise (tg passed 0 here: anti-clockwise).
	yield* this.orbit(target, orbitsize, 1, 20, rot_seg);
	return f.dot;
}, true);

// observer.dm:422
rt.def("/mob/dead/observer/proc/orbit", function* orbit(f: Frame) {
	yield* this.setDir(2);
	yield* parent_proc();
	// pt-orbit (hand-edited): the camera follows the orbited object itself (like admin possess), so it glides with the object instead of
	// jumping tile to tile each time SSorbit moves the ghost. stop_orbit puts the eye back on the ghost.
	if (this.client && this.orbiting && !this.observetarget) {
		this.orbit_eye = this.orbiting.orbiting;
		this.client.eye = this.orbit_eye;
	}
	return f.dot;
}, true);

// observer.dm:426
rt.def("/mob/dead/observer/proc/stop_orbit", function* stop_orbit(f: Frame) {
	yield* parent_proc();
	if (this.orbit_eye) { // pt-orbit (hand-edited): the camera goes back to the ghost
		if (this.client && this.client.eye == this.orbit_eye) {
			this.client.eye = this;
		}
		this.orbit_eye = null;
	}
	this.pixel_y = 0;
	rt.op(f, "Animate", [2, 8], [null, this, "pixel_y", 2, "time", 10, "loop", -1]);
	return f.dot;
}, true);

// observer.dm:436
rt.def("/mob/dead/observer/verb/jumptomob", function* jumptomob(f: Frame) {
	let target: Value = null, M: Value = null, A: Value = null, _T: Value = null;
	if (!rt.istype(f.usr, T("/mob/dead/observer"))) return f.dot;
	let dest: Value = list();
	dest += (yield* getpois({ mobs_only: 1 }));
	if (!(target = (yield* g.op(f, "Prompt", [1], [null, null, "Jump to Mob", "Please, select a player!", dest])))) {
		return f.dot;
	} else {
		M = rt.index(dest, target);
		A = this;
		if ((_T = rt.getStep(f, M, 0)) && isturf(_T)) {
			A.loc = _T;
			yield* A.update_parallax_contents();
		} else {
			to_chat(A, "This mob is not located in the game world.");
		}
	}
	return f.dot;
}, true, { verb: { name: "Jump to Mob", category: "Ghost", desc: "Teleport to a mob" } });

// observer.dm:463
rt.def("/mob/dead/observer/verb/change_view_range", function* change_view_range(f: Frame) {
	let views: Value = null, i: Value = null, new_view: Value = null;
	let $e: any;
	let max_view: Value = this.client.prefs.unlock_content ? GHOST_MAX_VIEW_RANGE_MEMBER : GHOST_MAX_VIEW_RANGE_DEFAULT;
	if (this.client.is_default_view()) {
		views = list();
		rt.forRange(f, 0, 1, max_view, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			(views = rt.modify(views, i, rt.bitOr));
		}
		rt.endFor(f, 0);
		if (new_view = (yield* g.op(f, "Prompt", [1], [null, 7, "Modify view range", "Choose your new view", views]))) {
			yield* this.client.change_view(max(1, min(new_view, max_view)));
		}
	} else {
		yield* this.client.change_view(this.client.default_view());
	}
	return f.dot;
}, true, { verb: { name: "View Range", category: "Ghost", desc: "Change your view range." } });

// observer.dm:477
rt.def("/mob/dead/observer/verb/add_view_range", function* add_view_range(f: Frame, input: Value) {
	let max_view: Value = this.client.prefs.unlock_content ? GHOST_MAX_VIEW_RANGE_MEMBER : GHOST_MAX_VIEW_RANGE_DEFAULT;
	if (!input) return f.dot;
	yield* this.client.rescale_view(input * 2, 3, max_view * 2 + 1);
	return f.dot;
}, true, { hidden: true, verb: { name: "Add View Range" }, argTypes: [{ type: 32 }] });

// observer.dm:486
rt.def("/mob/dead/observer/verb/boo", function boo(f: Frame) {
	let L: Value = null;
	if (this.bootime > rt.worldTime(f)) {
		return f.dot;
	}
	if (L = rt.locateIn(f, T("/obj/machinery/light"), view(1, this))) {
		L.flicker();
		this.bootime = rt.worldTime(f) + 600;
		return f.dot;
	}
	return f.dot;
}, false, { verb: { name: "Boo!", category: "Ghost", desc: "Scare your crew members because of boredom!" } });

// observer.dm:498
rt.def("/mob/dead/observer/memory", function memory(f: Frame) {
	to_chat(this, "<span class='danger'>You are dead! You have no mind to store memory!</span>");
	return f.dot;
}, false, { hidden: true, verb: { name: "Notes", category: "IC", desc: "View your character's notes memory." } });

// observer.dm:502
rt.def("/mob/dead/observer/add_memory", function add_memory(f: Frame) {
	to_chat(this, "<span class='danger'>You are dead! You have no mind to store memory!</span>");
	return f.dot;
}, false, { hidden: true, verb: { name: "Add Note", category: "IC" } });

// observer.dm:508
rt.def("/mob/dead/observer/verb/toggle_ghostsee", function toggle_ghostsee(f: Frame) {
	this.ghostvision = (!this.ghostvision ? 1 : 0);
	this.update_sight();
	let $0: any = f.usr;
	to_chat($0, `You ${this.ghostvision ? "now" : "no longer"} have ghost vision.`);
	return f.dot;
}, false, { verb: { name: "Toggle Ghost Vision", category: "Ghost", desc: "Toggles your ability to see things only ghosts can see, like other ghosts" } });

// observer.dm:515
rt.def("/mob/dead/observer/verb/toggle_darkness", function toggle_darkness(f: Frame) {
	if (this.lighting_alpha === LIGHTING_PLANE_ALPHA_VISIBLE) {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_MOSTLY_VISIBLE;
	} else if (this.lighting_alpha === LIGHTING_PLANE_ALPHA_MOSTLY_VISIBLE) {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE;
	} else if (this.lighting_alpha === LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE) {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_INVISIBLE;
	} else {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_VISIBLE;
	}
	this.update_sight();
	return f.dot;
}, false, { verb: { name: "Toggle Darkness", category: "Ghost" } });

// observer.dm:529
rt.def("/mob/dead/observer/proc/update_sight", function update_sight(f: Frame) {
	if (this.client) {
		this.ghost_others = this.client.prefs.ghost_others;
	}
	if (!this.ghostvision) {
		this.see_invisible = 25;
	} else {
		this.see_invisible = 60;
	}
	this.updateghostimages();
	parent_proc();
	return f.dot;
});

// observer.dm:541
rt.def("/proc/updateallghostimages", function updateallghostimages(f: Frame) {
	let O: Value = null;
	listclearnulls(GLOB.ghost_images_default);
	listclearnulls(GLOB.ghost_images_simple);
	for (O of each(GLOB.player_list, T("/mob/dead/observer"))) {
		O.updateghostimages();
	}
	return f.dot;
});

// observer.dm:548
rt.def("/mob/dead/observer/proc/updateghostimages", function updateghostimages(f: Frame) {
	if (!this.client) {
		return f.dot;
	}
	if (this.lastsetting) {
		if (this.lastsetting === GHOST_OTHERS_DEFAULT_SPRITE) {
			this.client.images -= GLOB.ghost_images_default;
		} else if (this.lastsetting === GHOST_OTHERS_SIMPLE) {
			this.client.images -= GLOB.ghost_images_simple;
		}
	}
	this.lastsetting = this.client.prefs.ghost_others;
	if (!this.ghostvision) {
		return f.dot;
	}
	if (this.client.prefs.ghost_others == GHOST_OTHERS_THEIR_SETTING) return f.dot;
	if (this.client.prefs.ghost_others === GHOST_OTHERS_DEFAULT_SPRITE) {
		(rt.modField(f, this.client, "images", GLOB.ghost_images_default - this.ghostimage_default, rt.bitOr));
	} else if (this.client.prefs.ghost_others === GHOST_OTHERS_SIMPLE) {
		(rt.modField(f, this.client, "images", GLOB.ghost_images_simple - this.ghostimage_simple, rt.bitOr));
	}
	return f.dot;
});

// observer.dm:572
rt.def("/mob/dead/observer/verb/possess", function* possess(f: Frame) {
	let L: Value = null, target: Value = null;
	let possessible: Value = list();
	for (L of each(GLOB.living_mob_list, T("/mob/living"))) {
		if (!rt.isIn(f, L, GLOB.player_list) && !L.mind) {
			possessible += L;
		}
	}
	if (!(target = (yield* g.op(f, "Prompt", [1], [null, null, "Possess Mob", "Your new life begins today!", possessible])))) {
		return 0;
	}
	if (rt.istype(target, T("/mob/living/simple_animal/hostile/megafauna"))) {
		to_chat(this, "<span class='warning'>This creature is too powerful for you to possess!</span>");
		return 0;
	}
	if (this.can_reenter_corpse && this.mind && this.mind.current) {
		if ((yield* alert(this, `Your soul is still tied to your former life as ${this.mind.current.name}, if you go forward there is no going back to that life. Are you sure you wish to continue?`, "Move On", "Yes", "No")) == "No") {
			return 0;
		}
	}
	if (target.key) {
		to_chat(this, "<span class='warning'>Someone has taken this body while you were choosing!</span>");
		return 0;
	}
	target.key = this.key;
	target.faction = list("neutral");
	return 1;
}, true, { verb: { name: "Possess!", category: "Ghost", desc: "Take over the body of a mindless creature!" } });

// observer.dm:609
rt.def("/mob/dead/observer/pointed", function* pointed(f: Frame, A: Value) {
	if (!(yield* parent_proc())) {
		return 0;
	}
	f.usr.visible_message(`<span class='deadsay'><b>${this}</b> points to ${A}.</span>`);
	return 1;
}, true, { verb: { name: "Point To", category: "Object" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });

// observer.dm:619
rt.def("/mob/dead/observer/verb/view_manifest", function view_manifest(f: Frame) {
	let dat: Value = null;
	dat += "<h4>Crew Manifest</h4>";
	dat += GLOB.data_core.get_manifest();
	rt.op(f, "Browse", [], [this, dat, "window=manifest;size=387x420;can_close=1"], false);
	return f.dot;
}, false, { verb: { name: "View Crew Manifest", category: "Ghost" } });

// observer.dm:626
rt.def("/mob/dead/observer/proc/MouseDrop", function* MouseDrop(f: Frame, over: Value) {
	if (!f.usr || !over) {
		return f.dot;
	}
	if (rt.istype(f.usr, T("/mob/dead/observer")) && f.usr.client.holder && rt.istype(over, T("/mob/living"))) {
		if (yield* f.usr.client.holder.cmd_ghost_drag(this, over)) {
			return f.dot;
		}
	}
	return (yield* parent_proc());
}, true);

// observer.dm:634
rt.def("/mob/dead/observer/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let target: Value = null, tx: Value = null, ty: Value = null, tz: Value = null, target_3: Value = null;
	yield* parent_proc();
	if (f.usr != this) return f.dot;
	if (rt.at(href_list, "follow")) {
		if (rt.istype((target = rt.locateIn(f, rt.at(href_list, "follow"), rt.world())), T("/atom/movable")) && target != this) {
			yield* this.ManualFollow(target);
			return f.dot;
		}
	}
	if (rt.at(href_list, "x") && rt.at(href_list, "y") && rt.at(href_list, "z")) {
		tx = text2num(rt.at(href_list, "x"));
		ty = text2num(rt.at(href_list, "y"));
		tz = text2num(rt.at(href_list, "z"));
		if (rt.istype((target_3 = rt.locate(tx, ty, tz)), T("/turf"))) {
			yield* this.forceMove(target_3);
			return f.dot;
		}
	}
	if (!rt.at(href_list, "reenter")) return f.dot;
	yield* this.reenter_corpse();
	return f.dot;
}, true);

// observer.dm:659
rt.def("/mob/dead/observer/proc/show_data_huds", function show_data_huds(f: Frame) {
	let hudtype: Value = null, H: Value = null;
	for (hudtype of each(this.datahuds)) {
		(H = rt.index(GLOB.huds, hudtype)).add_hud_to(this);
	}
	return f.dot;
});

// observer.dm:664
rt.def("/mob/dead/observer/proc/remove_data_huds", function remove_data_huds(f: Frame) {
	let hudtype: Value = null, H: Value = null;
	for (hudtype of each(this.datahuds)) {
		(H = rt.index(GLOB.huds, hudtype)).remove_hud_from(this);
	}
	return f.dot;
});

// observer.dm:674
rt.def("/mob/dead/observer/verb/toggle_data_huds", function toggle_data_huds(f: Frame) {
	if (this.data_huds_on) {
		this.remove_data_huds();
		to_chat(this, "<span class='notice'>Data HUDs disabled.</span>");
		this.data_huds_on = 0;
	} else {
		this.show_data_huds();
		to_chat(this, "<span class='notice'>Data HUDs enabled.</span>");
		this.data_huds_on = 1;
	}
	return f.dot;
}, false, { verb: { name: "Toggle Sec/Med/Diag HUD", category: "Ghost", desc: "Toggles whether you see medical/security/diagnostic HUDs" } });

// observer.dm:688
rt.def("/mob/dead/observer/verb/restore_ghost_apperance", function* restore_ghost_apperance(f: Frame) {
	yield* this.set_ghost_appearance();
	if (!(this.client && this.client.prefs)) return f.dot;
	this.deadchat_name = this.client.prefs.real_name;
	return f.dot;
}, true, { verb: { name: "Restore Ghost Character", category: "Ghost", desc: "Sets your deadchat name and ghost appearance to your roundstart character." } });

// observer.dm:693
rt.def("/mob/dead/observer/proc/set_ghost_appearance", function* set_ghost_appearance(f: Frame) {
	if (!this.client || !this.client.prefs) {
		return f.dot;
	}
	if (this.client.prefs.be_random_name) {
		this.client.prefs.real_name = random_unique_name(this.gender);
	}
	if (this.client.prefs.be_random_body) {
		yield* this.client.prefs.random_character(this.gender);
	}
	if (rt.isIn(f, HAIR, this.client.prefs.pref_species.species_traits)) {
		this.hair_style = this.client.prefs.hair_style;
		this.hair_color = this.brighten_color(this.client.prefs.hair_color);
	}
	if (rt.isIn(f, FACEHAIR, this.client.prefs.pref_species.species_traits)) {
		this.facial_hair_style = this.client.prefs.facial_hair_style;
		this.facial_hair_color = this.brighten_color(this.client.prefs.facial_hair_color);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// observer.dm:711
rt.def("/mob/dead/observer/proc/canUseTopic", function canUseTopic(f: Frame, AM: Value, be_close: Value) {
	be_close ??= 0;
	if (check_rights(2, 0)) {
		return 1;
	}
	return f.dot;
});

// observer.dm:719
rt.def("/mob/dead/observer/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	f.dot = (yield* parent_proc());
	if (var_name === "icon") {
		this.ghostimage_default.icon = this.icon;
		this.ghostimage_simple.icon = this.icon;
	} else if (var_name === "icon_state") {
		this.ghostimage_default.icon_state = this.icon_state;
		this.ghostimage_simple.icon_state = this.icon_state;
	} else if (var_name === "fun_verbs") {
		if (this.fun_verbs) {
			this.verbs += P("/mob/dead/observer/verb/boo");
			this.verbs += P("/mob/dead/observer/verb/possess");
		} else {
			this.verbs -= P("/mob/dead/observer/verb/boo");
			this.verbs -= P("/mob/dead/observer/verb/possess");
		}
	}
	return f.dot;
}, true);

// observer.dm:737
rt.def("/mob/dead/observer/proc/reset_perspective", function* reset_perspective(f: Frame, A: Value) {
	let target: Value = null;
	if (this.client) {
		if (ismob(this.client.eye) && this.client.eye != this) {
			target = this.client.eye;
			this.observetarget = null;
			if (target.observers) {
				target.observers -= this;
				if (target.observers && !rt.len(f, target.observers)) {
					target.observers = null;
				}
			}
		}
	}
	if (!(yield* parent_proc())) return f.dot;
	if (!this.hud_used) return f.dot;
	this.client.screen = list();
	yield* this.hud_used.show_hud(this.hud_used.hud_version);
	return f.dot;
}, true);

// observer.dm:752
rt.def("/mob/dead/observer/verb/observe", function* observe(f: Frame) {
	let eye_name: Value = null;
	let creatures: Value = (yield* getpois());
	yield* this.reset_perspective(null);
	if (!(eye_name = (yield* g.op(f, "Prompt", [1], [null, null, "Observe", "Please, select a player!", creatures])))) {
		return f.dot;
	}
	let mob_eye: Value = rt.index(creatures, eye_name);
	if (!(this.client && mob_eye && rt.istype(mob_eye, T("/mob")))) return f.dot;
	this.client.eye = mob_eye;
	this.client.screen = list();
	if (!mob_eye.hud_used) return f.dot;
	if (!mob_eye.observers) {
		mob_eye.observers = list();
	}
	(rt.modField(f, mob_eye, "observers", this, rt.bitOr));
	yield* mob_eye.hud_used.show_hud(mob_eye.hud_used.hud_version, this);
	this.observetarget = mob_eye;
	return f.dot;
}, true, { verb: { name: "Observe", category: "OOC" } });

// observer.dm:779
rt.def("/mob/dead/observer/verb/register_pai_candidate", function register_pai_candidate(f: Frame) {
	this.register_pai();
	return f.dot;
}, false, { verb: { name: "pAI Setup", category: "Ghost", desc: "Upload a fragment of your personality to the global pAI databanks" } });

// observer.dm:782
rt.def("/mob/dead/observer/proc/register_pai", function register_pai(f: Frame) {
	if (rt.istype(this, T("/mob/dead/observer"))) {
		if (GLOB.SSpai) {
			GLOB.SSpai.recruitWindow(this);
		}
	} else {
		to_chat(f.usr, "Can't become a pAI candidate while not dead!");
	}
	return f.dot;
});

// observer.dm:789
rt.def("/mob/dead/observer/proc/CtrlShiftClick", function* CtrlShiftClick(f: Frame, user: Value) {
	if (!(rt.istype(user, T("/mob/dead/observer")) && check_rights(4096))) return f.dot;
	yield* this.change_mob_type(T("/mob/living/carbon/human"), null, null, 1);
	return f.dot;
}, true);

// observer.dm:793
rt.def("/mob/dead/observer/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.invisibility) return f.dot;
	to_chat(user, "It seems extremely obvious.");
	return f.dot;
}, false);

// observer.dm:798
rt.def("/mob/dead/observer/proc/set_invisibility", function set_invisibility(f: Frame, value: Value) {
	this.invisibility = value;
	if (!value) {
		this.set_light(1, 2);
	} else {
		this.set_light(0, 0);
	}
	return f.dot;
});

// observer.dm:809
rt.def("/mob/dead/observer/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	f.dot = (yield* parent_proc());
	if (var_name != "invisibility") return f.dot;
	this.set_invisibility(this.invisibility);
	return f.dot;
}, true);

// observer.dm:814
rt.def("/proc/set_observer_default_invisibility", function set_observer_default_invisibility(f: Frame, amount: Value, message: Value) {
	let G: Value = null;
	for (G of each(GLOB.player_list, T("/mob/dead/observer"))) {
		G.set_invisibility(amount);
		if (message) {
			to_chat(G, message);
		}
	}
	GLOB.observer_default_invisibility = amount;
	return f.dot;
});
