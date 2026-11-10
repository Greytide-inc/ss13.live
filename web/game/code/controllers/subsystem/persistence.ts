// Based on /tg/station's code/controllers/subsystem/persistence.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(35, "/datum/controller/subsystem/persistence", "/datum/controller/subsystem", {
	secret_satchels: null,
	satchel_blacklist: null,
	new_secret_satchels: null,
	old_secret_satchels: "",
	chisel_messages: null,
	saved_messages: null,
	trophy_sav: null,
	saved_trophies: null,
	name: "Persistence",
	init_order: -100,
	flags: 2,
});

// persistence.dm:1
rt.def("/datum/controller/subsystem/persistence/proc/New", function* New(f: Frame) {
	if (GLOB.SSpersistence != this) {
		if (rt.istype(GLOB.SSpersistence, T("/datum/controller/subsystem/persistence"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSpersistence);
		}
		GLOB.SSpersistence = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// persistence.dm:6
rt.def("/datum/controller/subsystem/persistence/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.satchel_blacklist = list();

	this.new_secret_satchels = list();

	this.chisel_messages = list();

	this.saved_messages = list();

	this.saved_trophies = list();
	return f.dot;
});

// persistence.dm:17
rt.def("/datum/controller/subsystem/persistence/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.LoadSatchels();
	yield* this.LoadChiselMessages();
	yield* this.LoadTrophies();
	yield* parent_proc();
	return f.dot;
}, true);

// persistence.dm:24
rt.def("/datum/controller/subsystem/persistence/proc/LoadSatchels", function* LoadSatchels(f: Frame) {
	let _T: Value = null;
	this.secret_satchels = (yield* new_(T("/savefile"), "data/npc_saves/SecretSatchels.sav"));
	this.satchel_blacklist = typecacheof(list(T("/obj/item/stack/tile/plasteel"), T("/obj/item/weapon/crowbar")));
	this.old_secret_satchels = rt.input(f, rt.R.index, null, [this.secret_satchels, GLOB.SSmapping.config.map_name]);
	let expanded_old_satchels: Value = list();
	let placed_satchels: Value = 0;
	if (this.old_secret_satchels !== null) {
		if (yield* this.PlaceSecretSatchel((expanded_old_satchels = splittext(this.old_secret_satchels, "#")))) {
			placed_satchels++;
		}
	} else {
		expanded_old_satchels.len = 0;
	}
	let free_satchels: Value = list();
	for (_T of each(shuffle(block(rt.locate(TRANSITIONEDGE, TRANSITIONEDGE, ZLEVEL_STATION), rt.locate(rt.world().maxx - TRANSITIONEDGE, rt.world().maxy - TRANSITIONEDGE, ZLEVEL_STATION))), T("/turf"))) {
		if (rt.istype(_T, T("/turf/open/floor")) && !rt.istype(_T, T("/turf/open/floor/plating"))) {
			if (!isemptylist((free_satchels += (yield* new_(T("/obj/item/weapon/storage/backpack/satchel/flat/secret"), _T)))) && rt.len(f, free_satchels) + placed_satchels >= (50 - rt.len(f, expanded_old_satchels)) * 0.1) {
				break;
			}
		}
	}
	return f.dot;
}, true);

// persistence.dm:48
rt.def("/datum/controller/subsystem/persistence/proc/PlaceSecretSatchel", function* PlaceSecretSatchel(f: Frame, expanded_old_satchels: Value) {
	let satchel_string: Value = null, chosen_satchel: Value = null, path: Value = null, F: Value = null;
	if (rt.len(f, expanded_old_satchels) >= 20) {
		satchel_string = pick_n_take(expanded_old_satchels);
	}
	this.old_secret_satchels = jointext(expanded_old_satchels, "#");
	rt.op(f, "OutputReference", [rt.R.index], [this.secret_satchels, GLOB.SSmapping.config.map_name, this.old_secret_satchels], false);
	if (!(chosen_satchel = splittext(satchel_string, "|")) || isemptylist(chosen_satchel) || rt.len(f, chosen_satchel) != 3) {
		return 0;
	}
	if (!(path = text2path(rt.index(chosen_satchel, 3)))) {
		return 0;
	}
	(F = (yield* new_(T("/obj/item/weapon/storage/backpack/satchel/flat")))).x = text2num(rt.index(chosen_satchel, 1));
	F.y = text2num(rt.index(chosen_satchel, 2));
	F.z = ZLEVEL_STATION;
	if (rt.istype(F.loc, T("/turf/open/floor")) && !rt.istype(F.loc, T("/turf/open/floor/plating"))) {
		yield* F.hide(1);
	}
	yield* new_(path, F);
	return 1;
}, true);

// persistence.dm:77
rt.def("/datum/controller/subsystem/persistence/proc/LoadChiselMessages", function* LoadChiselMessages(f: Frame) {
	let item: Value = null, xvar: Value = null, yvar: Value = null, zvar: Value = null, _T: Value = null, M: Value = null;
	let chisel_messages_sav: Value = (yield* new_(T("/savefile"), "data/npc_saves/ChiselMessages.sav"));
	let saved_json: Value = rt.input(f, rt.R.index, null, [chisel_messages_sav, GLOB.SSmapping.config.map_name]);
	if (!saved_json) {
		return f.dot;
	}
	let saved_messages: Value = json_decode(saved_json);
	for (item of each(saved_messages)) {
		if (!rt.istype(item, T("/list"))) {
			continue;
		}
		xvar = rt.at(item, "x");
		yvar = rt.at(item, "y");
		zvar = rt.at(item, "z");
		if (!xvar || !yvar || !zvar) {
			continue;
		}
		if (!isturf((_T = rt.locate(xvar, yvar, zvar)))) {
			continue;
		}
		if (rt.locateIn(f, T("/obj/structure/chisel_message"), _T)) {
			continue;
		}
		if (!(!(M = (yield* new_(T("/obj/structure/chisel_message"), _T))) || M.gc_destroyed)) {
			yield* M.unpack(item);
		}
	}
	log_world(`Loaded ${rt.len(f, saved_messages)} engraved messages on map ${GLOB.SSmapping.config.map_name}`);
	return f.dot;
}, true);

// persistence.dm:112
rt.def("/datum/controller/subsystem/persistence/proc/LoadTrophies", function* LoadTrophies(f: Frame) {
	let decoded_json: Value = null;
	this.trophy_sav = (yield* new_(T("/savefile"), "data/npc_saves/TrophyItems.sav"));
	let saved_json: Value = rt.input(f, rt.R.srcVar("trophy_sav"), null, []);
	if (!saved_json) {
		return f.dot;
	}
	if (!rt.istype((decoded_json = json_decode(saved_json)), T("/list"))) {
		return f.dot;
	}
	this.saved_trophies = decoded_json;
	yield* this.SetUpTrophies((yield* this.saved_trophies.Copy()));
	return f.dot;
}, true);

// persistence.dm:129
rt.def("/datum/controller/subsystem/persistence/proc/SetUpTrophies", function* SetUpTrophies(f: Frame, trophy_items: Value) {
	let A: Value = null, _T: Value = null, trophy_data: Value = null, chosen_trophy: Value = null, path: Value = null;
	for (A of each(GLOB.trophy_cases)) {
		(_T = A).added_roundstart = 1;
		if (!rt.istype((trophy_data = pick_n_take(trophy_items)), T("/list"))) {
			continue;
		}
		if (!(chosen_trophy = trophy_data) || isemptylist(chosen_trophy)) {
			continue;
		}
		if (!(path = text2path(rt.at(chosen_trophy, "path")))) {
			continue;
		}
		_T.showpiece = (yield* new_(T("/obj/item/showpiece_dummy"), _T, path));
		_T.trophy_message = rt.at(chosen_trophy, "message");
		_T.placer_key = rt.at(chosen_trophy, "placer_key");
		yield* _T.update_icon();
	}
	return f.dot;
}, true);

// persistence.dm:154
rt.def("/datum/controller/subsystem/persistence/proc/CollectData", function CollectData(f: Frame) {
	this.CollectChiselMessages();
	this.CollectSecretSatchels();
	this.CollectTrophies();
	return f.dot;
});

// persistence.dm:159
rt.def("/datum/controller/subsystem/persistence/proc/CollectSecretSatchels", function CollectSecretSatchels(f: Frame) {
	let A: Value = null, F: Value = null, savable_obj: Value = null, O: Value = null;
	for (A of each(this.new_secret_satchels)) {
		if (!(F = A) || F.gc_destroyed || F.z != ZLEVEL_STATION || F.invisibility != INVISIBILITY_MAXIMUM) {
			continue;
		}
		savable_obj = list();
		O = null;
		for (O of each(F, T("/obj"))) {
			if (is_type_in_typecache(O, this.satchel_blacklist) || O.admin_spawned) {
				continue;
			}
			if (O.persistence_replacement) {
				savable_obj += O.persistence_replacement;
			} else {
				savable_obj += O.type;
			}
		}
		if (isemptylist(savable_obj)) {
			continue;
		}
		this.old_secret_satchels += `${F.x}|${F.y}|${pick(savable_obj)}#`;
	}
	rt.op(f, "OutputReference", [rt.R.index], [this.secret_satchels, GLOB.SSmapping.config.map_name, this.old_secret_satchels], false);
	return f.dot;
});

// persistence.dm:177
rt.def("/datum/controller/subsystem/persistence/proc/CollectChiselMessages", function CollectChiselMessages(f: Frame) {
	let M: Value = null;
	let chisel_messages_sav: Value = new_(T("/savefile"), "data/npc_saves/ChiselMessages.sav");
	for (M of each(this.chisel_messages, T("/obj/structure/chisel_message"))) {
		this.saved_messages += list(M.pack());
	}
	log_world(`Saved ${rt.len(f, this.saved_messages)} engraved messages on map ${GLOB.SSmapping.config.map_name}`);
	rt.op(f, "OutputReference", [rt.R.index], [chisel_messages_sav, GLOB.SSmapping.config.map_name, json_encode(this.saved_messages)], false);
	return f.dot;
});

// persistence.dm:187
rt.def("/datum/controller/subsystem/persistence/proc/SaveChiselMessage", function SaveChiselMessage(f: Frame, M: Value) {
	this.saved_messages += list(M.pack());
	return f.dot;
});

// persistence.dm:191
rt.def("/datum/controller/subsystem/persistence/proc/CollectTrophies", function CollectTrophies(f: Frame) {
	rt.op(f, "OutputReference", [rt.R.srcVar("trophy_sav")], [json_encode(this.saved_trophies)], false);
	return f.dot;
});

// persistence.dm:194
rt.def("/datum/controller/subsystem/persistence/proc/SaveTrophy", function SaveTrophy(f: Frame, _T: Value) {
	let data: Value = null;
	if (!(!_T.added_roundstart && _T.showpiece)) return f.dot;
	rt.setAt((data = list()), "path", _T.showpiece.type);
	rt.setAt(data, "message", _T.trophy_message);
	rt.setAt(data, "placer_key", _T.placer_key);
	this.saved_trophies += list(data);
	return f.dot;
});
