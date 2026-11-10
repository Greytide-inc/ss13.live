// Based on /tg/station's code/modules/admin/verbs/buildmode.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(11201, "/obj/screen/buildmode", "/obj/screen", {
	bd: null,
	icon: rt.rsc("icons/misc/buildmode.dmi"),
});

// buildmode.dm:17
rt.def("/obj/screen/buildmode/proc/New", function* New(f: Frame, bd: Value) {
	yield* parent_proc();
	this.bd = bd;
	return f.dot;
}, true);

rt.type(11202, "/obj/screen/buildmode/mode", "/obj/screen/buildmode", {
	icon_state: "buildmode1",
	name: "Toggle Mode",
	screen_loc: "NORTH,WEST",
});

// buildmode.dm:26
rt.def("/obj/screen/buildmode/mode/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let pa: Value = null;
	if ((pa = params2list(params)).Find("left")) {
		this.bd.toggle_modes();
	} else if (pa.Find("right")) {
		yield* this.bd.change_settings(f.usr);
	}
	yield* this.update_icon();
	return 1;
}, true);

// buildmode.dm:36
rt.def("/obj/screen/buildmode/mode/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `buildmode${this.bd.mode}`;
	return f.dot;
});

rt.type(11203, "/obj/screen/buildmode/help", "/obj/screen/buildmode", {
	icon_state: "buildhelp",
	screen_loc: "NORTH,WEST+1",
	name: "Buildmode Help",
});

// buildmode.dm:45
rt.def("/obj/screen/buildmode/help/proc/Click", function Click(f: Frame) {
	this.bd.show_help(f.usr);
	return 1;
});

rt.type(11204, "/obj/screen/buildmode/bdir", "/obj/screen/buildmode", {
	icon_state: "build",
	screen_loc: "NORTH,WEST+2",
	name: "Change Dir",
});

// buildmode.dm:55
rt.def("/obj/screen/buildmode/bdir/proc/update_icon", function update_icon(f: Frame) {
	this.setDir(this.bd.build_dir);
	return f.dot;
});

rt.type(11205, "/obj/screen/buildmode/quit", "/obj/screen/buildmode", {
	icon_state: "buildquit",
	screen_loc: "NORTH,WEST+3",
	name: "Quit Buildmode",
});

// buildmode.dm:64
rt.def("/obj/screen/buildmode/quit/proc/Click", function* Click(f: Frame) {
	yield* this.bd.quit();
	return 1;
}, true);

// buildmode.dm:68
rt.def("/obj/screen/buildmode/bdir/proc/Click", function Click(f: Frame) {
	this.bd.change_dir();
	this.update_icon();
	return 1;
});

rt.type(1841, "/datum/buildmode", "/datum", {
	mode: 1,
	holder: null,
	buttons: null,
	build_dir: 2,
	throw_atom: null,
	cornerA: null,
	cornerB: null,
	generator_path: null,
	varholder: "name",
	valueholder: "derp",
	stored: null,
	objholder: rt.typePath("/obj/structure/closet"),
});

// buildmode.dm:75
rt.def("/datum/buildmode/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.buttons = list();
	return f.dot;
});

// buildmode.dm:87
rt.def("/datum/buildmode/proc/New", function* New(f: Frame, c: Value) {
	yield* this.create_buttons();
	this.holder = c;
	this.holder.click_intercept = this;
	this.holder.show_popup_menus = 0;
	this.holder.screen += this.buttons;
	return f.dot;
}, true);

// buildmode.dm:94
rt.def("/datum/buildmode/proc/quit", function* quit(f: Frame) {
	this.holder.screen -= this.buttons;
	this.holder.click_intercept = null;
	this.holder.show_popup_menus = 1;
	yield* qdel(this);
	return f.dot;
}, true);

// buildmode.dm:102
rt.def("/datum/buildmode/proc/Destroy", function* Destroy(f: Frame) {
	let button: Value = null;
	this.stored = null;
	for (button of each(this.buttons)) {
		yield* qdel(button);
	}
	return f.dot;
}, true);

// buildmode.dm:106
rt.def("/datum/buildmode/proc/create_buttons", function* create_buttons(f: Frame) {
	this.buttons += (yield* new_(T("/obj/screen/buildmode/mode"), this));
	this.buttons += (yield* new_(T("/obj/screen/buildmode/help"), this));
	this.buttons += (yield* new_(T("/obj/screen/buildmode/bdir"), this));
	this.buttons += (yield* new_(T("/obj/screen/buildmode/quit"), this));
	return f.dot;
}, true);

// buildmode.dm:112
rt.def("/datum/buildmode/proc/toggle_modes", function toggle_modes(f: Frame) {
	this.mode = this.mode % NUM_BUILDMODES + 1;
	this.Reset();
	return f.dot;
});

// buildmode.dm:117
rt.def("/datum/buildmode/proc/show_help", function show_help(f: Frame, user: Value) {
	let dat: Value = list();
	if (this.mode === BASIC_BUILDMODE) {
		dat += "***********************************************************";
		dat += "Left Mouse Button        = Construct / Upgrade";
		dat += "Right Mouse Button       = Deconstruct / Delete / Downgrade";
		dat += "Left Mouse Button + ctrl = R-Window";
		dat += "Left Mouse Button + alt  = Airlock";
		dat += "";
		dat += "Use the button in the upper left corner to";
		dat += "change the direction of built objects.";
		dat += "***********************************************************";
	} else if (this.mode === ADV_BUILDMODE) {
		dat += "***********************************************************";
		dat += "Right Mouse Button on buildmode button = Set object type";
		dat += "Left Mouse Button on turf/obj          = Place objects";
		dat += "Right Mouse Button                     = Delete objects";
		dat += "";
		dat += "Use the button in the upper left corner to";
		dat += "change the direction of built objects.";
		dat += "***********************************************************";
	} else if (this.mode === VAR_BUILDMODE) {
		dat += "***********************************************************";
		dat += "Right Mouse Button on buildmode button = Select var(type) & value";
		dat += "Left Mouse Button on turf/obj/mob      = Set var(type) & value";
		dat += "Right Mouse Button on turf/obj/mob     = Reset var's value";
		dat += "***********************************************************";
	} else if (this.mode === THROW_BUILDMODE) {
		dat += "***********************************************************";
		dat += "Left Mouse Button on turf/obj/mob      = Select";
		dat += "Right Mouse Button on turf/obj/mob     = Throw";
		dat += "***********************************************************";
	} else if (this.mode === AREA_BUILDMODE) {
		dat += "***********************************************************";
		dat += "Left Mouse Button on turf/obj/mob      = Select corner";
		dat += "Right Mouse Button on buildmode button = Select generator";
		dat += "***********************************************************";
	} else if (this.mode === COPY_BUILDMODE) {
		dat += "***********************************************************";
		dat += "Left Mouse Button on obj/turf/mob   = Spawn a Copy of selected target";
		dat += "Right Mouse Button on obj/mob = Select target to copy";
		dat += "***********************************************************";
	}
	to_chat(user, `<font color='blue'>${dat.Join("\n")}</font>`);
	return f.dot;
});

// buildmode.dm:162
rt.def("/datum/buildmode/proc/change_settings", function* change_settings(f: Frame, user: Value) {
	let target_path: Value = null, locked: Value = null, thetype: Value = null, gen_paths: Value = null, type: Value = null;
	if (this.mode === BASIC_BUILDMODE) {
		return 1;
	} else if (this.mode === 2) {
		this.objholder = text2path((target_path = (yield* g.op(f, "Prompt", [2], ["/obj/structure/closet", "Typepath", "Enter typepath:", user, null]))));
		if (!ispath(this.objholder)) {
			this.objholder = (yield* pick_closest_path(target_path));
			if (!this.objholder) {
				this.objholder = T("/obj/structure/closet");
				yield* alert("That path is not allowed.");
			}
		} else if (ispath(this.objholder, T("/mob")) && !check_rights(32, 0)) {
			this.objholder = T("/obj/structure/closet");
		}
	} else if (this.mode === VAR_BUILDMODE) {
		locked = list("vars", "key", "ckey", "client", "firemut", "ishulk", "telekinesis", "xray", "virus", "viruses", "cuffed", "ka", "last_eaten", "urine");
		this.varholder = (yield* g.op(f, "Prompt", [2], ["name", "Name", "Enter variable name:", user, null]));
		if (rt.isIn(f, this.varholder, (locked && (!check_rights(32, 0) ? 1 : 0)))) {
			return 1;
		}
		if (!(thetype = (yield* g.op(f, "Prompt", [0], [null, "Type", "Select variable type:", user, list("text", "number", "mob-reference", "obj-reference", "turf-reference")])))) {
			return 1;
		}
		if (thetype === "text") {
			this.valueholder = (yield* g.op(f, "Prompt", [2], ["value", "Value", "Enter variable value:", user, null]));
		} else if (thetype === "number") {
			this.valueholder = (yield* g.op(f, "Prompt", [32], [123, "Value", "Enter variable value:", user, null]));
		} else if (thetype === "mob-reference") {
			this.valueholder = (yield* g.op(f, "Prompt", [8], [null, "Value", "Enter variable value:", user, GLOB.mob_list]));
		} else if (thetype === "obj-reference") {
			this.valueholder = (yield* g.op(f, "Prompt", [4], [null, "Value", "Enter variable value:", user, rt.world()]));
		} else if (thetype === "turf-reference") {
			this.valueholder = (yield* g.op(f, "Prompt", [16], [null, "Value", "Enter variable value:", user, rt.world()]));
		}
	} else if (this.mode === AREA_BUILDMODE) {
		gen_paths = typesof(T("/datum/mapGenerator")) - T("/datum/mapGenerator");
		if (!(type = (yield* g.op(f, "Prompt", [1], [null, "Type", "Select Generator Type", user, gen_paths])))) {
			return f.dot;
		}
		this.generator_path = type;
		this.cornerA = null;
		this.cornerB = null;
	}
	return f.dot;
}, true);

// buildmode.dm:206
rt.def("/datum/buildmode/proc/change_dir", function change_dir(f: Frame) {
	if (this.build_dir === 1) {
		this.build_dir = 4;
	} else if (this.build_dir === 4) {
		this.build_dir = 2;
	} else if (this.build_dir === 2) {
		this.build_dir = 8;
	} else if (this.build_dir === 8) {
		this.build_dir = 9;
	} else if (this.build_dir === 9) {
		this.build_dir = 1;
	}
	return 1;
});

// buildmode.dm:221
rt.def("/datum/buildmode/proc/Reset", function Reset(f: Frame) {
	this.cornerA = null;
	this.cornerB = null;
	return f.dot;
});

// buildmode.dm:226
rt.def("/proc/togglebuildmode", function* togglebuildmode(f: Frame, M: Value) {
	let B: Value = null;
	if (!M.client) return f.dot;
	if (rt.istype(M.client.click_intercept, T("/datum/buildmode"))) {
		yield* (B = M.client.click_intercept).quit();
		log_admin(`${key_name(f.usr)} has left build mode.`);
	} else {
		yield* new_(T("/datum/buildmode"), M.client);
		message_admins(`${key_name(f.usr)} has entered build mode.`);
		log_admin(`${key_name(f.usr)} has entered build mode.`);
	}
	return f.dot;
}, true, { verb: { name: "Toggle Build Mode", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// buildmode.dm:238
rt.def("/datum/buildmode/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, user: Value, params: Value, object: Value) {
	let _T: Value = null, WIN: Value = null, A: Value = null, G: Value = null;
	let pa: Value = params2list(params);
	let right_click: Value = pa.Find("right");
	let left_click: Value = pa.Find("left");
	let alt_click: Value = pa.Find("alt");
	let ctrl_click: Value = pa.Find("ctrl");
	f.dot = 1;
	if (this.mode === BASIC_BUILDMODE) {
		if (isturf(object) && left_click && !alt_click && !ctrl_click) {
			_T = object;
			if (rt.istype(object, T("/turf/open/space"))) {
				yield* _T.ChangeTurf(T("/turf/open/floor/plasteel"));
			} else if (rt.istype(object, T("/turf/open/floor")) || rt.istype(object, T("/turf/open/indestructible/creative"))) { // tg_js: Creative's floor is not a /turf/open/floor
				yield* _T.ChangeTurf(T("/turf/closed/wall"));
			} else if (rt.istype(object, T("/turf/closed/wall"))) {
				yield* _T.ChangeTurf(T("/turf/closed/wall/r_wall"));
			}
			log_admin(`Build Mode: ${key_name(user)} built ${_T} at (${_T.x},${_T.y},${_T.z})`);
			return f.dot;
		} else if (right_click) {
			log_admin(`Build Mode: ${key_name(user)} deleted ${object} at (${object.x},${object.y},${object.z})`);
			if (rt.istype(object, T("/turf/closed/wall"))) {
				yield* (_T = object).ChangeTurf(is_creative() ? T("/turf/open/indestructible/creative") : T("/turf/open/floor/plasteel")); // tg_js: Creative keeps its unbreakable floor
			} else if (rt.istype(object, T("/turf/open/floor"))) {
				yield* (_T = object).ChangeTurf(T("/turf/open/space"));
			} else if (rt.istype(object, T("/turf/closed/wall/r_wall"))) {
				yield* (_T = object).ChangeTurf(T("/turf/closed/wall"));
			} else if (rt.istype(object, T("/obj"))) {
				yield* qdel(object);
			}
			return f.dot;
		} else if (isturf(object) && alt_click && left_click) {
			log_admin(`Build Mode: ${key_name(user)} built an airlock at (${object.x},${object.y},${object.z})`);
			yield* new_(T("/obj/machinery/door/airlock"), rt.getStep(f, object, 0));
		} else if (isturf(object) && ctrl_click && left_click) {
			if (this.build_dir === 1) {
				yield* (WIN = (yield* new_(T("/obj/structure/window/reinforced"), rt.getStep(f, object, 0)))).setDir(1);
			} else if (this.build_dir === 2) {
				yield* (WIN = (yield* new_(T("/obj/structure/window/reinforced"), rt.getStep(f, object, 0)))).setDir(2);
			} else if (this.build_dir === 4) {
				yield* (WIN = (yield* new_(T("/obj/structure/window/reinforced"), rt.getStep(f, object, 0)))).setDir(4);
			} else if (this.build_dir === 8) {
				yield* (WIN = (yield* new_(T("/obj/structure/window/reinforced"), rt.getStep(f, object, 0)))).setDir(8);
			} else if (this.build_dir === 9) {
				yield* (WIN = (yield* new_(T("/obj/structure/window/reinforced/fulltile"), rt.getStep(f, object, 0)))).setDir(9);
			}
			log_admin(`Build Mode: ${key_name(user)} built a window at (${object.x},${object.y},${object.z})`);
		}
	} else if (this.mode === ADV_BUILDMODE) {
		if (left_click) {
			if (ispath(this.objholder, T("/turf"))) {
				_T = rt.getStep(f, object, 0);
				log_admin(`Build Mode: ${key_name(user)} modified ${_T} (${_T.x},${_T.y},${_T.z}) to ${this.objholder}`);
				yield* _T.ChangeTurf(this.objholder);
			} else {
				yield* (A = (yield* new_(this.objholder, rt.getStep(f, object, 0)))).setDir(this.build_dir);
				log_admin(`Build Mode: ${key_name(user)} modified ${A}'s (${A.x},${A.y},${A.z}) dir to ${this.build_dir}`);
			}
		} else if (right_click) {
			if (rt.istype(object, T("/obj"))) {
				log_admin(`Build Mode: ${key_name(user)} deleted ${object} at (${object.x},${object.y},${object.z})`);
				yield* qdel(object);
			}
		}
	} else if (this.mode === VAR_BUILDMODE) {
		if (left_click) {
			if (object.vars.Find(this.varholder)) {
				if (yield* object.vv_edit_var(this.varholder, this.valueholder)) {
					log_admin(`Build Mode: ${key_name(user)} modified ${object.name}'s ${this.varholder} to ${this.valueholder}`);
				} else {
					to_chat(user, "<span class='warning'>Varedit rejected</span>");
				}
			} else {
				to_chat(user, `<span class='warning'>${rt.initial(f, object, "name")} does not have a var called '${this.varholder}'</span>`);
			}
		}
		if (right_click) {
			if (object.vars.Find(this.varholder)) {
				if (yield* object.vv_edit_var(this.varholder, rt.initial(f, object.vars, this.varholder))) {
					log_admin(`Build Mode: ${key_name(user)} modified ${object.name}'s ${this.varholder} to ${this.valueholder}`);
				} else {
					to_chat(user, "<span class='warning'>Varedit rejected</span>");
				}
			} else {
				to_chat(user, `<span class='warning'>${rt.initial(f, object, "name")} does not have a var called '${this.varholder}'</span>`);
			}
		}
	} else if (this.mode === THROW_BUILDMODE) {
		if (left_click) {
			if (isturf(object)) {
				return f.dot;
			}
			this.throw_atom = object;
		}
		if (right_click) {
			if (this.throw_atom) {
				yield* this.throw_atom.throw_at(object, 10, 1, user);
				log_admin(`Build Mode: ${key_name(user)} threw ${this.throw_atom} at ${object} (${object.x},${object.y},${object.z})`);
			}
		}
	} else if (this.mode === AREA_BUILDMODE) {
		if (!this.cornerA) {
			this.cornerA = rt.getStep(f, object, 0);
			return f.dot;
		}
		if (this.cornerA && !this.cornerB) {
			this.cornerB = rt.getStep(f, object, 0);
		}
		if (left_click) {
			if (this.cornerA && this.cornerB) {
				if (!this.generator_path) {
					to_chat(user, "<span class='warning'>Select generator type first.</span>");
				}
				(G = (yield* new_(this.generator_path))).defineRegion(this.cornerA, this.cornerB, 1);
				yield* G.generate();
				this.cornerA = null;
				this.cornerB = null;
				return f.dot;
			}
		}
		this.cornerA = null;
		this.cornerB = null;
	} else if (this.mode === COPY_BUILDMODE) {
		if (left_click) {
			_T = rt.getStep(f, object, 0);
			if (this.stored) {
				yield* DuplicateObject(this.stored, { perfectcopy: 1, newloc: _T });
			}
		} else {
			if (!right_click) return f.dot;
			if (!rt.istype(object, T("/atom/movable"))) return f.dot;
			this.stored = object;
		}
	}
	return f.dot;
}, true);
