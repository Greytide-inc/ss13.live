// Based on /tg/station's code/modules/mob/living/simple_animal/bot/floorbot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(5037, "/mob/living/simple_animal/bot/floorbot", "/mob/living/simple_animal/bot", {
	process_type: null,
	targetdirection: null,
	replacetiles: 0,
	placetiles: 0,
	specialtiles: 0,
	maxtiles: 100,
	tiletype: null,
	fixfloors: 0,
	autotile: 0,
	max_targets: 50,
	target: null,
	oldloc: null,
	anchored: 0,
	radio_channel: "Engineering",
	bot_type: 4,
	model: "Floorbot",
	window_id: "autofloor",
	window_name: "Automatic Station Floor Repairer v1.1",
	name: "１Floorbot",
	desc: "A little floor repairing robot, he looks so excited!",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "floorbot0",
	density: 0,
	health: 25,
	maxHealth: 25,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_eng"),
	bot_core: rt.typePath("/obj/machinery/bot_core/floorbot"),
});

// floorbot.dm:42
rt.def("/mob/living/simple_animal/bot/floorbot/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	let J: Value = (yield* new_(T("/datum/job/engineer")));
	this.access_card.access += J.get_access();
	this.prev_access = this.access_card.access;
	return f.dot;
}, true);

// floorbot.dm:52
rt.def("/mob/living/simple_animal/bot/floorbot/proc/turn_on", function turn_on(f: Frame) {
	f.dot = parent_proc();
	this.update_icon();
	return f.dot;
});

// floorbot.dm:56
rt.def("/mob/living/simple_animal/bot/floorbot/proc/turn_off", function turn_off(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// floorbot.dm:60
rt.def("/mob/living/simple_animal/bot/floorbot/proc/bot_reset", function bot_reset(f: Frame) {
	parent_proc();
	this.target = null;
	this.oldloc = null;
	this.ignore_list = list();
	this.anchored = 0;
	this.update_icon();
	return f.dot;
});

// floorbot.dm:68
rt.def("/mob/living/simple_animal/bot/floorbot/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	this.text_hack = `You corrupt ${this.name}'s construction protocols.`;
	this.text_dehack = `You detect errors in ${this.name} and reset his programming.`;
	this.text_dehack_fail = `${this.name} is not responding to reset commands!`;
	return f.dot;
});

// floorbot.dm:74
rt.def("/mob/living/simple_animal/bot/floorbot/proc/get_controls", function get_controls(f: Frame, user: Value) {
	let dat: Value = null, bmode: Value = null;
	let $1: any;
	dat += this.hack(user);
	dat += this.showpai(user);
	dat += "<TT><B>Floor Repairer Controls v1.1</B></TT><BR><BR>";
	let $0: any = this;
	if (this.on) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	dat += fmt("Status: <A href='?src=＃;power=1'>＀</A><BR>", [$0, $1]);
	dat += `Maintenance panel panel is ${this.open ? "opened" : "closed"}<BR>`;
	dat += "Special tiles: ";
	if (this.specialtiles) {
		dat += fmt("<A href='?src=＃;operation=eject'>Loaded [＀/＀]</a><BR>", [this, this.specialtiles, this.maxtiles]);
	} else {
		dat += "None Loaded<BR>";
	}
	dat += `Behaviour controls are ${this.locked ? "locked" : "unlocked"}<BR>`;
	if (!this.locked || rt.istype(user, T("/mob/living/silicon")) || IsAdminGhost(user)) {
		$0 = this;
		if (this.autotile) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Add tiles to new hull plating: <A href='?src=＃;operation=autotile'>＀</A><BR>", [$0, $1]);
		$0 = this;
		if (this.placetiles) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Place floor tiles: <A href='?src=＃;operation=place'>＀</A><BR>", [$0, $1]);
		$0 = this;
		if (this.replacetiles) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Replace existing floor tiles with custom tiles: <A href='?src=＃;operation=replace'>＀</A><BR>", [$0, $1]);
		$0 = this;
		if (this.fixfloors) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Repair damaged tiles and platings: <A href='?src=＃;operation=fix'>＀</A><BR>", [$0, $1]);
		$0 = this;
		if (this.anchored) {
			$1 = "Engaged";
		} else {
			$1 = "Disengaged";
		}
		dat += fmt("Traction Magnets: <A href='?src=＃;operation=anchor'>＀</A><BR>", [$0, $1]);
		dat += fmt("Patrol Station: <A href='?src=＃;operation=patrol'>＀</A><BR>", [this, this.auto_patrol ? "Yes" : "No"]);
		if (this.targetdirection) {
			bmode = dir2text(this.targetdirection);
		} else {
			bmode = "disabled";
		}
		dat += fmt("Line Mode : <A href='?src=＃;operation=linemode'>＀</A><BR>", [this, bmode]);
	}
	return dat;
});

// floorbot.dm:103
rt.def("/mob/living/simple_animal/bot/floorbot/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let usedtile: Value = null, tiles: Value = null, loaded: Value = null;
	if (rt.istype(W, T("/obj/item/stack/tile/plasteel"))) {
		to_chat(user, "<span class='notice'>The floorbot can produce normal tiles itself.</span>");
		return f.dot;
	}
	if (this.specialtiles && rt.istype(W, T("/obj/item/stack/tile"))) {
		if ((usedtile = W).type != this.tiletype) {
			to_chat(user, "<span class='warning'>Different custom tiles are already inside the floorbot.</span>");
			return f.dot;
		}
	}
	if (rt.istype(W, T("/obj/item/stack/tile"))) {
		if (this.specialtiles >= this.maxtiles) {
			return f.dot;
		}
		tiles = W;
		this.tiletype = W.type;
		loaded = min(this.maxtiles - this.specialtiles, tiles.amount);
		yield* tiles.use(loaded);
		this.specialtiles += loaded;
		if (loaded > 0) {
			to_chat(user, `<span class='notice'>You load ${loaded} tiles into the floorbot. It now contains ${this.specialtiles} tiles.</span>`);
		} else {
			to_chat(user, `<span class='warning'>You need at least one floor tile to put into ${this}!</span>`);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// floorbot.dm:127
rt.def("/mob/living/simple_animal/bot/floorbot/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.emagged != 2) return f.dot;
	if (!user) return f.dot;
	to_chat(user, `<span class='danger'>${this} buzzes and beeps.</span>`);
	return f.dot;
}, true);

// floorbot.dm:133
rt.def("/mob/living/simple_animal/bot/floorbot/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let setdir: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	const item = rt.at(href_list, "operation");
	if (item === "replace") {
		this.replacetiles = (!this.replacetiles ? 1 : 0);
	} else if (item === "place") {
		this.placetiles = (!this.placetiles ? 1 : 0);
	} else if (item === "fix") {
		this.fixfloors = (!this.fixfloors ? 1 : 0);
	} else if (item === "autotile") {
		this.autotile = (!this.autotile ? 1 : 0);
	} else if (item === "anchor") {
		this.anchored = (!this.anchored ? 1 : 0);
	} else if (item === "eject") {
		if (this.specialtiles && this.tiletype !== null) {
			yield* this.empty_tiles();
		}
	} else if (item === "linemode") {
		const subject = (setdir = (yield* g.op(f, "Prompt", [1], [null, null, null, "Select construction direction:", list("north", "east", "south", "west", "disable")])));
		if (subject === "north") {
			this.targetdirection = 1;
		} else if (subject === "south") {
			this.targetdirection = 2;
		} else if (subject === "east") {
			this.targetdirection = 4;
		} else if (subject === "west") {
			this.targetdirection = 8;
		} else if (subject === "disable") {
			this.targetdirection = null;
		}
	}
	yield* this.update_controls();
	return f.dot;
}, true);

// floorbot.dm:167
rt.def("/mob/living/simple_animal/bot/floorbot/proc/empty_tiles", function* empty_tiles(f: Frame) {
	let Tsec: Value = rt.getStep(f, this, 0);
	while (this.specialtiles > rt.initial(f, this.tiletype, "max_amount")) {
		yield* new_(this.tiletype, Tsec, rt.initial(f, this.tiletype, "max_amount"));
		this.specialtiles -= rt.initial(f, this.tiletype, "max_amount");
	}
	yield* new_(this.tiletype, Tsec, this.specialtiles);
	this.specialtiles = 0;
	this.tiletype = null;
	return f.dot;
}, true);

// floorbot.dm:177
rt.def("/mob/living/simple_animal/bot/floorbot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let _T: Value = null, TL: Value = null, F: Value = null;
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (this.mode == BOT_REPAIRING) {
		return f.dot;
	}
	if (prob(5)) {
		this.audible_message(`${this} makes an excited booping beeping sound!`);
	}
	if (!this.target && this.emagged < 2) {
		if (this.targetdirection !== null) {
			if (rt.istype((_T = rt.getStep(f, this, this.targetdirection)), T("/turf/open/space"))) {
				this.target = _T;
				this.process_type = LINE_SPACE_MODE;
			}
			if (rt.istype(_T, T("/turf/open/floor"))) {
				this.target = _T;
			}
		}
		if (!this.target) {
			this.process_type = HULL_BREACH;
			this.target = (yield* this.scan(T("/turf/open/space")));
		}
		if (!this.target && this.placetiles) {
			this.process_type = PLACE_TILE;
			this.target = (yield* this.scan(T("/turf/open/floor")));
		}
		if (!this.target && this.fixfloors) {
			this.process_type = FIX_TILE;
			this.target = (yield* this.scan(T("/turf/open/floor")));
		}
		if (!this.target && this.replacetiles && this.specialtiles > 0) {
			this.process_type = REPLACE_TILE;
			this.target = (yield* this.scan(T("/turf/open/floor")));
		}
	}
	if (!this.target && this.emagged == 2) {
		this.process_type = TILE_EMAG;
		this.target = (yield* this.scan(T("/turf/open/floor")));
	}
	if (!this.target) {
		if (this.auto_patrol) {
			if (this.mode == BOT_IDLE || this.mode == BOT_START_PATROL) {
				yield* this.start_patrol();
			}
			if (this.mode == BOT_PATROL) {
				yield* this.bot_patrol();
			}
		}
	}
	if (this.target) {
		if (rt.len(f, this.path) == 0) {
			if (!isturf(this.target)) {
				TL = rt.getStep(f, this.target, 0);
				this.path = (yield* get_path_to(this, TL, P("/turf/proc/Distance_cardinal"), 0, 30, { id: this.access_card, simulated_only: 0 }));
			} else {
				this.path = (yield* get_path_to(this, this.target, P("/turf/proc/Distance_cardinal"), 0, 30, { id: this.access_card, simulated_only: 0 }));
			}
			if (!this.bot_move(this.target)) {
				this.add_to_ignore(this.target);
				this.target = null;
				this.mode = BOT_IDLE;
				return f.dot;
			}
		} else if (!this.bot_move(this.target)) {
			this.target = null;
			this.mode = BOT_IDLE;
			return f.dot;
		}
		if (this.loc == this.target || this.loc == this.target.loc) {
			if (this.check_bot(this.target)) {
				this.shuffle = 1;
				if (prob(50)) {
					this.target = null;
					this.path = list();
					return f.dot;
				}
			}
			if (isturf(this.target) && this.emagged < 2) {
				yield* this.repair(this.target);
			} else if (this.emagged == 2 && rt.istype(this.target, T("/turf/open/floor"))) {
				F = this.target;
				this.anchored = 1;
				this.mode = BOT_REPAIRING;
				yield* F.ReplaceWithLattice();
				this.audible_message(`<span class='danger'>${this} makes an excited booping sound.</span>`);
				rt.spawnTail(f, 5, "/mob/living/simple_animal/bot/floorbot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/bot/floorbot.dm:259", _T, TL, F);
			}
			this.path = list();
			return f.dot;
		}
	}
	this.oldloc = this.loc;
	return f.dot;
}, true, { waitfor: false });

// a spawn(5) body of /mob/living/simple_animal/bot/floorbot/proc/handle_automated_action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/floorbot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/bot/floorbot.dm:259", function* (f: Frame, _T: Value, TL: Value, F: Value) {
	this.anchored = 0;
	this.mode = 0;
	this.target = null;
	return null;
});

// floorbot.dm:269
rt.def("/mob/living/simple_animal/bot/floorbot/proc/is_hull_breach", function is_hull_breach(f: Frame, t: Value) {
	let t_area: Value = null;
	if ((t_area = get_area(t)) && (t_area.name == "Space" || findtext(t_area.name, "huttle"))) {
		return 0;
	} else {
		return 1;
	}
});

// floorbot.dm:279
rt.def("/mob/living/simple_animal/bot/floorbot/proc/process_scan", function process_scan(f: Frame, scan_target: Value) {
	let result: Value = null, F: Value = null;
	if (this.process_type === HULL_BREACH) {
		if (this.is_hull_breach(scan_target)) {
			result = scan_target;
			this.anchored = 1;
		}
	} else if (this.process_type === LINE_SPACE_MODE) {
		if (rt.getDir(f, this, scan_target) == this.targetdirection) {
			result = scan_target;
			this.anchored = 1;
		}
	} else if (this.process_type === PLACE_TILE) {
		if (rt.istype((F = scan_target), T("/turf/open/floor/plating"))) {
			result = F;
		}
	} else if (this.process_type === REPLACE_TILE) {
		if (rt.istype((F = scan_target), T("/turf/open/floor")) && !rt.istype(F, T("/turf/open/floor/plating"))) {
			result = F;
		}
	} else if (this.process_type === FIX_TILE) {
		if (rt.istype((F = scan_target), T("/turf/open/floor")) && (F.broken || F.burnt)) {
			result = F;
		}
	} else if (this.process_type === TILE_EMAG) {
		if (!rt.istype((F = scan_target), T("/turf/open/floor/plating"))) {
			result = F;
		}
	} else {
		result = scan_target;
	}
	return result;
});

// floorbot.dm:310
rt.def("/mob/living/simple_animal/bot/floorbot/proc/repair", function* repair(f: Frame, target_turf: Value) {
	let F: Value = null;
	let $0: any;
	if (rt.istype(target_turf, T("/turf/open/space"))) {
		if (!this.is_hull_breach(target_turf) && !this.targetdirection) {
			this.target = null;
			return f.dot;
		}
	} else if (!rt.istype(target_turf, T("/turf/open/floor"))) {
		return f.dot;
	}
	if (rt.istype(target_turf, T("/turf/open/space"))) {
		this.anchored = 1;
		this.icon_state = "floorbot-c";
		if (this.targetdirection) {
			$0 = `${this} begins installing a bridge plating.`;
		} else {
			$0 = `${this} begins to repair the hole.`;
		}
		this.visible_message(`<span class='notice'>${$0} </span>`);
		this.mode = BOT_REPAIRING;
		yield* sleep(50);
		if (this.mode == BOT_REPAIRING && this.loc == target_turf) {
			if (this.autotile) {
				yield* target_turf.ChangeTurf(T("/turf/open/floor/plasteel"));
			} else {
				yield* target_turf.ChangeTurf(T("/turf/open/floor/plating"));
			}
		}
	} else {
		if ((F = target_turf).type != rt.initial(f, this.tiletype, "turf_type") && (F.broken || F.burnt || rt.istype(F, T("/turf/open/floor/plating"))) || F.type == (rt.initial(f, this.tiletype, "turf_type") && (F.broken || F.burnt))) {
			this.anchored = 1;
			this.icon_state = "floorbot-c";
			this.mode = BOT_REPAIRING;
			this.visible_message(`<span class='notice'>${this} begins repairing the floor.</span>`);
			yield* sleep(50);
			if (this.mode == BOT_REPAIRING && F && this.loc == F) {
				F.broken = 0;
				F.burnt = 0;
				yield* F.ChangeTurf(T("/turf/open/floor/plasteel"));
			}
		}
		if (this.replacetiles && F.type != rt.initial(f, this.tiletype, "turf_type") && this.specialtiles && !rt.istype(F, T("/turf/open/floor/plating"))) {
			this.anchored = 1;
			this.icon_state = "floorbot-c";
			this.mode = BOT_REPAIRING;
			this.visible_message(`<span class='notice'>${this} begins replacing the floor tiles.</span>`);
			yield* sleep(50);
			if (this.mode == BOT_REPAIRING && F && this.loc == F) {
				F.broken = 0;
				F.burnt = 0;
				yield* F.ChangeTurf(rt.initial(f, this.tiletype, "turf_type"));
				this.specialtiles -= 1;
				if (this.specialtiles == 0) {
					yield* this.speak("Requesting refill of custom floortiles to continue replacing.");
				}
			}
		}
	}
	this.mode = BOT_IDLE;
	yield* this.update_icon();
	this.anchored = 0;
	this.target = null;
	return f.dot;
}, true);

// floorbot.dm:362
rt.def("/mob/living/simple_animal/bot/floorbot/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `floorbot${this.on}`;
	return f.dot;
});

// floorbot.dm:367
rt.def("/mob/living/simple_animal/bot/floorbot/proc/explode", function* explode(f: Frame) {
	let N: Value = null, _T: Value = null;
	this.on = 0;
	this.visible_message(`<span class='boldannounce'>${this} blows apart!</span>`);
	let Tsec: Value = rt.getStep(f, this, 0);
	(N = (yield* new_(T("/obj/item/weapon/storage/toolbox/mechanical"), Tsec))).contents = list();
	yield* new_(T("/obj/item/device/assembly/prox_sensor"), Tsec);
	if (this.specialtiles && this.tiletype !== null) {
		yield* this.empty_tiles();
	}
	if (prob(50)) {
		yield* new_(T("/obj/item/bodypart/l_arm/robot"), Tsec);
	}
	(_T = (yield* new_(T("/obj/item/stack/tile/plasteel"), Tsec))).amount = 1;
	yield* do_sparks(3, 1, this);
	yield* parent_proc();
	return f.dot;
}, true);

// floorbot.dm:391
rt.def("/mob/living/simple_animal/bot/floorbot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	if (isturf(A)) {
		yield* this.repair(A);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
