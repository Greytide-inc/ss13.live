// Based on /tg/station's code/datums/mind.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add, subtract, fmt } = rt;


rt.type(587, "/datum/mind", "/datum", {
	key: null,
	name: null,
	current: null,
	active: 0,
	memory: null,
	assigned_role: null,
	special_role: null,
	restricted_roles: null,
	assigned_job: null,
	objectives: null,
	spell_list: null,
	faction: null,
	changeling: null,
	linglink: null,
	martial_art: null,
	miming: 0,
	antag_datums: null,
	antag_hud_icon_state: null,
	antag_hud: null,
	gang_datum: null,
	damnation_type: 0,
	soulOwner: null,
	hasSoul: 1,
	isholy: 0,
	enslaved_to: null,
	language_holder: null,
}, { global: { default_martial_art: 636 } });

// mind.dm:42
rt.def("/datum/mind/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.restricted_roles = list();

	this.objectives = list();

	this.spell_list = list();
	return f.dot;
});

// mind.dm:70
rt.def("/datum/mind/proc/New", function New(f: Frame, key: Value) {
	f.src.key = key;
	this.soulOwner = f.src;
	this.martial_art = GLOB.default_martial_art;
	return f.dot;
});

// mind.dm:74
rt.def("/datum/mind/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null, antag_datum: Value = null;
	GLOB.SSticker.minds -= f.src;
	if (rt.istype(this.antag_datums, T("/list"))) {
		for (i of each(this.antag_datums)) {
			if ((antag_datum = i).delete_on_death) {
				yield* qdel(i);
			}
		}
		this.antag_datums = null;
	}
	return (yield* parent_proc());
}, true);

// mind.dm:84
rt.def("/datum/mind/proc/get_language_holder", function* get_language_holder(f: Frame) {
	let L: Value = null;
	if (!this.language_holder) {
		this.language_holder = (yield* (L = (yield* this.current.get_language_holder({ shadow: 0 }))).copy(f.src));
	}
	return this.language_holder;
}, true);

// mind.dm:92
rt.def("/datum/mind/proc/transfer_to", function* transfer_to(f: Frame, new_character: Value, force_key_move: Value) {
	let mob_holder: Value = null, a: Value = null, A: Value = null, C: Value = null;
	force_key_move ??= 0;
	if (this.current) {
		this.current.mind = null;
		GLOB.SStgui.on_transfer(this.current, new_character);
	}
	if (!this.language_holder) {
		this.language_holder = (yield* (mob_holder = (yield* new_character.get_language_holder({ shadow: 0 }))).copy(f.src));
	}
	if (this.key) {
		if (new_character.key != this.key) {
			yield* new_character.ghostize(1);
		}
	} else {
		this.key = new_character.key;
	}
	if (new_character.mind) {
		new_character.mind.current = null;
	}
	let hud_to_transfer: Value = this.antag_hud;
	let old_current: Value = this.current;
	this.current = new_character;
	new_character.mind = f.src;
	for (a of each(this.antag_datums)) {
		yield* (A = a).on_body_transfer(old_current, this.current);
	}
	if (rt.istype(new_character, T("/mob/living/carbon"))) {
		(C = new_character).last_mind = f.src;
	}
	yield* this.transfer_antag_huds(hud_to_transfer);
	yield* this.transfer_actions(new_character);
	if (!(this.active || force_key_move)) return f.dot;
	new_character.key = this.key;
	return f.dot;
}, true);

// mind.dm:125
rt.def("/datum/mind/proc/store_memory", function store_memory(f: Frame, new_text: Value) {
	// tg_js, tg 0fa87b7bbd (2019): the notes keep the last ~100 messages' worth, older text drops off.
	if (rt.length(this.memory) + rt.length(new_text) > 102400) {
		this.memory = copytext(this.memory, -102400);
	}
	rt.modSrcVar(f, "memory", `${new_text}<BR>`, add);
	return f.dot;
});

// mind.dm:128
rt.def("/datum/mind/proc/wipe_memory", function wipe_memory(f: Frame) {
	this.memory = null;
	return f.dot;
});

// mind.dm:132
rt.def("/datum/mind/proc/add_antag_datum", function* add_antag_datum(f: Frame, datum_type: Value) {
	let A: Value = null;
	if (!datum_type) {
		return f.dot;
	}
	if (!(yield* (A = (yield* new_(datum_type, f.src))).can_be_owned(f.src))) {
		yield* qdel(A);
		return f.dot;
	}
	if (!this.antag_datums) {
		this.antag_datums = list();
	}
	rt.modSrcVar(f, "antag_datums", A, add);
	yield* A.on_gain();
	return A;
}, true);

// mind.dm:143
rt.def("/datum/mind/proc/remove_antag_datum", function* remove_antag_datum(f: Frame, datum_type: Value) {
	let A: Value = null;
	if (!datum_type) {
		return f.dot;
	}
	if (!(A = (yield* this.has_antag_datum(datum_type)))) return f.dot;
	yield* A.on_removal();
	return 1;
}, true);

// mind.dm:157
rt.def("/datum/mind/proc/has_antag_datum", function has_antag_datum(f: Frame, datum_type: Value, check_subtypes: Value) {
	let a: Value = null, A: Value = null;
	check_subtypes ??= 1;
	if (!datum_type) {
		return f.dot;
	}
	f.dot = 0;
	for (a of each(this.antag_datums)) {
		A = a;
		if (check_subtypes && rt.op(f, "IsType", [], [A, datum_type])) {
			return A;
		} else if (A.type == datum_type) {
			return A;
		}
	}
	return f.dot;
});

// mind.dm:173
rt.def("/datum/mind/proc/remove_objectives", function* remove_objectives(f: Frame) {
	let O: Value = null;
	if (!rt.len(f, this.objectives)) return f.dot;
	for (O of each(this.objectives, T("/datum/objective"))) {
		(rt.modSrcVar(f, "objectives", O, subtract));
		yield* qdel(O);
	}
	return f.dot;
}, true);

// mind.dm:179
rt.def("/datum/mind/proc/remove_changeling", function* remove_changeling(f: Frame) {
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.changelings)) {
		GLOB.SSticker.mode.changelings -= f.src;
		yield* this.current.remove_changeling_powers();
		if (this.changeling) {
			yield* qdel(this.changeling);
			this.changeling = null;
		}
	}
	this.special_role = null;
	yield* this.remove_antag_equip();
	GLOB.SSticker.mode.update_changeling_icons_removed(f.src);
	return f.dot;
}, true);

// mind.dm:190
rt.def("/datum/mind/proc/remove_traitor", function* remove_traitor(f: Frame) {
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.traitors)) {
		yield* f.src.remove_antag_datum(T("/datum/antagonist/traitor"));
	}
	GLOB.SSticker.mode.update_traitor_icons_removed(f.src);
	return f.dot;
}, true);

// mind.dm:195
rt.def("/datum/mind/proc/remove_nukeop", function* remove_nukeop(f: Frame) {
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.syndicates)) {
		GLOB.SSticker.mode.syndicates -= f.src;
		GLOB.SSticker.mode.update_synd_icons_removed(f.src);
	}
	this.special_role = null;
	yield* this.remove_objectives();
	yield* this.remove_antag_equip();
	return f.dot;
}, true);

// mind.dm:203
rt.def("/datum/mind/proc/remove_wizard", function* remove_wizard(f: Frame) {
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.wizards)) {
		GLOB.SSticker.mode.wizards -= f.src;
		yield* this.current.spellremove(this.current);
	}
	this.special_role = null;
	yield* this.remove_antag_equip();
	return f.dot;
}, true);

// mind.dm:210
rt.def("/datum/mind/proc/remove_cultist", function* remove_cultist(f: Frame) {
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.cult)) {
		yield* GLOB.SSticker.mode.remove_cultist(f.src, 0, 0);
	}
	this.special_role = null;
	yield* this.remove_objectives();
	yield* this.remove_antag_equip();
	return f.dot;
}, true);

// mind.dm:217
rt.def("/datum/mind/proc/remove_rev", function* remove_rev(f: Frame) {
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.revolutionaries)) {
		GLOB.SSticker.mode.revolutionaries -= f.src;
		GLOB.SSticker.mode.update_rev_icons_removed(f.src);
	}
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.head_revolutionaries)) {
		GLOB.SSticker.mode.head_revolutionaries -= f.src;
		GLOB.SSticker.mode.update_rev_icons_removed(f.src);
	}
	this.special_role = null;
	yield* this.remove_objectives();
	yield* this.remove_antag_equip();
	return f.dot;
}, true);

// mind.dm:229
rt.def("/datum/mind/proc/remove_gang", function* remove_gang(f: Frame) {
	yield* GLOB.SSticker.mode.remove_gangster(f.src, 0, 1, 1);
	yield* this.remove_objectives();
	return f.dot;
}, true);

// mind.dm:233
rt.def("/datum/mind/proc/remove_antag_equip", function remove_antag_equip(f: Frame) {
	let I: Value = null, _P: Value = null, R: Value = null;
	let Mob_Contents: Value = this.current.get_contents();
	for (I of each(Mob_Contents, T("/obj/item"))) {
		if (rt.istype(I, T("/obj/item/device/pda"))) {
			(_P = I).lock_code = "";
		} else if (rt.istype(I, T("/obj/item/device/radio"))) {
			(R = I).traitor_frequency = 0;
		}
	}
	return f.dot;
});

// mind.dm:244
rt.def("/datum/mind/proc/remove_all_antag", function* remove_all_antag(f: Frame) {
	yield* this.remove_changeling();
	yield* this.remove_traitor();
	yield* this.remove_nukeop();
	yield* this.remove_wizard();
	yield* this.remove_cultist();
	yield* this.remove_rev();
	yield* this.remove_gang();
	GLOB.SSticker.mode.update_changeling_icons_removed(f.src);
	GLOB.SSticker.mode.update_traitor_icons_removed(f.src);
	GLOB.SSticker.mode.update_wiz_icons_removed(f.src);
	GLOB.SSticker.mode.update_cult_icons_removed(f.src);
	GLOB.SSticker.mode.update_rev_icons_removed(f.src);
	if (!this.gang_datum) return f.dot;
	this.gang_datum.remove_gang_hud(f.src);
	return f.dot;
}, true);

// mind.dm:260
rt.def("/datum/mind/proc/equip_traitor", function* equip_traitor(f: Frame, employer: Value, silent: Value) {
	let traitor_mob: Value = null, uplink_loc: Value = null, U: Value = null;
	employer ??= "The Syndicate";
	silent ??= 0;
	if (!this.current) {
		return f.dot;
	}
	if (!rt.istype((traitor_mob = this.current), T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	f.dot = 1;
	let all_contents: Value = traitor_mob.GetAllContents();
	let PDA: Value = rt.locateIn(f, T("/obj/item/device/pda"), all_contents);
	let R: Value = rt.locateIn(f, T("/obj/item/device/radio"), all_contents);
	let _P: Value = rt.locateIn(f, T("/obj/item/weapon/pen"), all_contents);
	if (traitor_mob.client && traitor_mob.client.prefs) {
		if (traitor_mob.client.prefs.uplink_spawn_loc === "PDA") {
			if (!(uplink_loc = PDA)) {
				uplink_loc = R;
			}
			if (!uplink_loc) {
				uplink_loc = _P;
			}
		} else if (traitor_mob.client.prefs.uplink_spawn_loc === "Radio") {
			if (!(uplink_loc = R)) {
				uplink_loc = PDA;
			}
			if (!uplink_loc) {
				uplink_loc = _P;
			}
		} else if (traitor_mob.client.prefs.uplink_spawn_loc === "Pen") {
			if (!(uplink_loc = _P)) {
				uplink_loc = PDA;
			}
			if (!uplink_loc) {
				uplink_loc = R;
			}
		}
	}
	if (!uplink_loc) {
		if (!silent) {
			to_chat(traitor_mob, `Unfortunately, ${employer} wasn't able to get you an Uplink.`);
		}
		f.dot = 0;
	} else {
		(U = (yield* new_(T("/obj/item/device/uplink"), uplink_loc))).owner = `${traitor_mob.key}`;
		uplink_loc.hidden_uplink = U;
		if (uplink_loc == R) {
			R.traitor_frequency = sanitize_frequency(rand(1441, MAX_FREQ));
			if (!silent) {
				to_chat(traitor_mob, `${employer} has cunningly disguised a Syndicate Uplink as your ${R.name}. Simply dial the frequency ${format_frequency(R.traitor_frequency)} to unlock its hidden features.`);
			}
			traitor_mob.mind.store_memory(`<B>Radio Frequency:</B> ${format_frequency(R.traitor_frequency)} (${R.name}).`);
		} else if (uplink_loc == PDA) {
			PDA.lock_code = `${rand(100, 999)} ${pick("Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu")}`;
			if (!silent) {
				to_chat(traitor_mob, `${employer} has cunningly disguised a Syndicate Uplink as your ${PDA.name}. Simply enter the code "${PDA.lock_code}" into the ringtone select to unlock its hidden features.`);
			}
			traitor_mob.mind.store_memory(`<B>Uplink Passcode:</B> ${PDA.lock_code} (${PDA.name}).`);
		} else {
			if (uplink_loc != _P) return f.dot;
			_P.traitor_unlock_degrees = rand(1, 360);
			if (!silent) {
				to_chat(traitor_mob, `${employer} has cunningly disguised a Syndicate Uplink as your ${_P.name}. Simply twist the top of the pen ${_P.traitor_unlock_degrees} from its starting position to unlock its hidden features.`);
			}
			traitor_mob.mind.store_memory(`<B>Uplink Degrees:</B> ${_P.traitor_unlock_degrees} (${_P.name}).`);
		}
	}
	return f.dot;
}, true);

// mind.dm:324
rt.def("/datum/mind/proc/enslave_mind_to_creator", function* enslave_mind_to_creator(f: Frame, creator: Value) {
	if (iscultist(creator)) {
		yield* GLOB.SSticker.mode.add_cultist(f.src);
	} else if (is_gangster(creator)) {
		yield* GLOB.SSticker.mode.add_gangster(f.src, creator.mind.gang_datum, 1);
	} else if (is_revolutionary_in_general(creator)) {
		yield* GLOB.SSticker.mode.add_revolutionary(f.src);
	} else if (is_servant_of_ratvar(creator)) {
		yield* add_servant_of_ratvar(this.current);
	} else if (is_nuclear_operative(creator)) {
		yield* this.make_Nuke(null, null, 0, 0);
	}
	this.enslaved_to = creator;
	(rt.modField(f, this.current, "faction", creator.faction, rt.bitOr));
	(rt.modField(f, creator, "faction", this.current.faction, rt.bitOr));
	if (!creator.mind.special_role) return f.dot;
	message_admins(`${`${key_name_admin(this.current)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [this.current])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this.current])}`} has been created by ${`${key_name_admin(creator)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [creator])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [creator])}`}, an antagonist.`);
	to_chat(this.current, `<span class='userdanger'>Despite your creators current allegiances, your true master remains ${creator.real_name}. If their loyalities change, so do yours. This will never change unless your creator's body is destroyed.</span>`);
	return f.dot;
}, true);

// mind.dm:349
rt.def("/datum/mind/proc/show_memory", function show_memory(f: Frame, recipient: Value, window: Value) {
	let obj_count: Value = null, objective: Value = null;
	let $e: any, $t: any;
	window ??= 1;
	if (!recipient) {
		recipient = this.current;
	}
	let output: Value = `<B>${this.current.real_name}'s Memories:</B><br>`;
	output += this.memory;
	if (rt.len(f, this.objectives)) {
		output += "<B>Objectives:</B>";
		obj_count = 1;
		for (objective of each(this.objectives, T("/datum/objective"))) {
			output += `<br><B>Objective #${($t = obj_count, obj_count = rt.inc($t, 1), $t)}</B>: ${objective.explanation_text}`;
		}
	}
	if (window) {
		rt.op(f, "Browse", [], [recipient, output, "window=memory"], false);
	} else {
		if (!(rt.len(f, this.objectives) || this.memory)) return f.dot;
		to_chat(recipient, `<i>${output}</i>`);
	}
	return f.dot;
});

// mind.dm:366
rt.def("/datum/mind/proc/edit_memory", function* edit_memory(f: Frame) {
	let L: Value = null, flash: Value = null, G: Value = null, L_4: Value = null, gangtool: Value = null, code: Value = null, bombue: Value = null, found: Value = null, D: Value = null, devilinfo: Value = null, ninjainfo: Value = null, robot: Value = null, ai: Value = null, n_e_robots: Value = null, R: Value = null, i: Value = null, U: Value = null, obj_count: Value = null, objective: Value = null;
	let $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $e: any;
	if (!GLOB.SSticker.HasRoundStarted()) {
		yield* alert("Not before round-start!", "Alert");
		return f.dot;
	}
	let $0: any = this.name;
	if (this.current && this.current.real_name != this.name) {
		$1 = ` (as ${this.current.real_name})`;
	} else {
		$1 = "";
	}
	let out: Value = `<B>${$0}</B>${$1}<br>`;
	out += `Mind currently owned by key: ${this.key} ${this.active ? "(synced)" : "(not synced)"}<br>`;
	out += fmt("Assigned role: ＀. <a href='?src=＃;role_edit=1'>Edit</a><br>", [this.assigned_role, f.src]);
	out += `Faction and special role: <b><font color='red'>${this.special_role}</font></b><br>`;
	let sections: Value = list("revolution", "gang", "cult", "wizard", "changeling", "nuclear", "traitor", "monkey", "clockcult", "devil", "ninja");
	let text: Value = "";
	if (rt.istype(this.current, T("/mob/living/carbon/human"))) {
		text = "revolution";
		if (GLOB.SSticker.mode.config_tag == "revolution") {
			text = uppertext(text);
		}
		text = `<i><b>${text}</b></i>: `;
		if (rt.isIn(f, this.assigned_role, GLOB.command_positions)) {
			text += "<b>HEAD</b>|loyal|employee|headrev|rev";
		} else if (rt.isIn(f, f.src, GLOB.SSticker.mode.head_revolutionaries)) {
			text += fmt("head|loyal|<a href='?src=＃;revolution=clear'>employee</a>|<b>HEADREV</b>|<a href='?src=＃;revolution=rev'>rev</a>", [f.src, f.src]);
			text += fmt("<br>Flash: <a href='?src=＃;revolution=flash'>give</a>", [f.src]);
			L = this.current.get_contents();
			if (flash = rt.locateIn(f, T("/obj/item/device/assembly/flash"), L)) {
				if (!flash.crit_fail) {
					text += fmt("|<a href='?src=＃;revolution=takeflash'>take</a>.", [f.src]);
				} else {
					text += fmt("|<a href='?src=＃;revolution=takeflash'>take</a>|<a href='?src=＃;revolution=repairflash'>repair</a>.", [f.src, f.src]);
				}
			} else {
				text += ".";
			}
			text += fmt(" <a href='?src=＃;revolution=reequip'>Reequip</a> (gives traitor uplink).", [f.src]);
			if (rt.len(f, this.objectives) == 0) {
				text += fmt("<br>Objectives are empty! <a href='?src=＃;revolution=autoobjectives'>Set to kill all heads</a>.", [f.src]);
			}
		} else if (this.current.isloyal()) {
			text += fmt("head|<b>LOYAL</b>|employee|<a href='?src=＃;revolution=headrev'>headrev</a>|rev", [f.src]);
		} else if (rt.isIn(f, f.src, GLOB.SSticker.mode.revolutionaries)) {
			text += fmt("head|loyal|<a href='?src=＃;revolution=clear'>employee</a>|<a href='?src=＃;revolution=headrev'>headrev</a>|<b>REV</b>", [f.src, f.src]);
		} else {
			text += fmt("head|loyal|<b>EMPLOYEE</b>|<a href='?src=＃;revolution=headrev'>headrev</a>|<a href='?src=＃;revolution=rev'>rev</a>", [f.src, f.src]);
		}
		if (this.current && this.current.client && rt.isIn(f, "revolutionary", this.current.client.prefs.be_special)) {
			text += "|Enabled in Prefs";
		} else {
			text += "|Disabled in Prefs";
		}
		rt.setAt(sections, "revolution", text);
		text = "gang";
		if (GLOB.SSticker.mode.config_tag == "gang") {
			text = uppertext(text);
		}
		text = `<i><b>${text}</b></i>: `;
		text += `${this.current.isloyal() ? "<B>LOYAL</B>" : "loyal"}|`;
		if (rt.isIn(f, f.src, GLOB.SSticker.mode.get_all_gangsters())) {
			text += fmt("<a href='?src=＃;gang=clear'>none</a>", [f.src]);
		} else {
			text += "<B>NONE</B>";
		}
		if (this.current && this.current.client && rt.isIn(f, "gangster", this.current.client.prefs.be_special)) {
			text += "|Enabled in Prefs<BR>";
		} else {
			text += "|Disabled in Prefs<BR>";
		}
		for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
			text += `<i>${G.name}</i>: `;
			if (rt.isIn(f, f.src, G.gangsters)) {
				text += "<B>GANGSTER</B>";
			} else {
				text += fmt("<a href='?src=＃;gangster=＃'>gangster</a>", [f.src, G]);
			}
			text += "|";
			if (rt.isIn(f, f.src, G.bosses)) {
				text += "<B>GANG LEADER</B>";
				text += fmt("|Equipment: <a href='?src=＃;gang=equip'>give</a>", [f.src]);
				L_4 = this.current.get_contents();
				if (gangtool = rt.locateIn(f, T("/obj/item/device/gangtool"), L_4)) {
					text += fmt("|<a href='?src=＃;gang=takeequip'>take</a>", [f.src]);
				}
			} else {
				text += fmt("<a href='?src=＃;gangboss=＃'>gang leader</a>", [f.src, G]);
			}
			text += "<BR>";
		}
		if (rt.len(f, GLOB.gang_colors_pool)) {
			text += fmt("<a href='?src=＃;gang=new'>Create New Gang</a>", [f.src]);
		}
		rt.setAt(sections, "gang", text);
		text = "Abductor";
		if (GLOB.SSticker.mode.config_tag == "abductor") {
			text = uppertext(text);
		}
		text = `<i><b>${text}</b></i>: `;
		if (rt.isIn(f, f.src, GLOB.SSticker.mode.abductors)) {
			text += fmt("<b>Abductor</b>|<a href='?src=＃;abductor=clear'>human</a>", [f.src]);
			text += fmt("|<a href='?src=＃;common=undress'>undress</a>|<a href='?src=＃;abductor=equip'>equip</a>", [f.src, f.src]);
		} else {
			text += fmt("<a href='?src=＃;abductor=abductor'>Abductor</a>|<b>human</b>", [f.src]);
		}
		if (this.current && this.current.client && rt.isIn(f, "abductor", this.current.client.prefs.be_special)) {
			text += "|Enabled in Prefs";
		} else {
			text += "|Disabled in Prefs";
		}
		rt.setAt(sections, "abductor", text);
		text = "nuclear";
		if (GLOB.SSticker.mode.config_tag == "nuclear") {
			text = uppertext(text);
		}
		text = `<i><b>${text}</b></i>: `;
		if (rt.isIn(f, f.src, GLOB.SSticker.mode.syndicates)) {
			text += fmt("<b>OPERATIVE</b>|<a href='?src=＃;nuclear=clear'>nanotrasen</a>", [f.src]);
			text += fmt("<br><a href='?src=＃;nuclear=lair'>To shuttle</a>, <a href='?src=＃;common=undress'>undress</a>, <a href='?src=＃;nuclear=dressup'>dress up</a>.", [f.src, f.src, f.src]);
			for (bombue of each(GLOB.machines, T("/obj/machinery/nuclearbomb"))) {
				if (rt.length(bombue.r_code) <= 5 && bombue.r_code != "LOLNO" && bombue.r_code != "ADMIN") {
					code = bombue.r_code;
					break;
				}
			}
			if (code) {
				text += fmt(" Code is ＀. <a href='?src=＃;nuclear=tellcode'>tell the code.</a>", [code, f.src]);
			}
		} else {
			text += fmt("<a href='?src=＃;nuclear=nuclear'>operative</a>|<b>NANOTRASEN</b>", [f.src]);
		}
		if (this.current && this.current.client && rt.isIn(f, "operative", this.current.client.prefs.be_special)) {
			text += "|Enabled in Prefs";
		} else {
			text += "|Disabled in Prefs";
		}
		rt.setAt(sections, "nuclear", text);
		text = "wizard";
		if (GLOB.SSticker.mode.config_tag == "wizard") {
			text = uppertext(text);
		}
		text = `<i><b>${text}</b></i>: `;
		if (rt.isIn(f, f.src, GLOB.SSticker.mode.wizards) || rt.isIn(f, f.src, GLOB.SSticker.mode.apprentices)) {
			text += fmt("<b>YES</b>|<a href='?src=＃;wizard=clear'>no</a>", [f.src]);
			text += fmt("<br><a href='?src=＃;wizard=lair'>To lair</a>, <a href='?src=＃;common=undress'>undress</a>, <a href='?src=＃;wizard=dressup'>dress up</a>, <a href='?src=＃;wizard=name'>let choose name</a>.", [f.src, f.src, f.src, f.src]);
			if (rt.len(f, this.objectives) == 0) {
				text += fmt("<br>Objectives are empty! <a href='?src=＃;wizard=autoobjectives'>Randomize!</a>", [f.src]);
			}
		} else {
			text += fmt("<a href='?src=＃;wizard=wizard'>yes</a>|<b>NO</b>", [f.src]);
		}
		if (this.current && this.current.client && rt.isIn(f, "wizard", this.current.client.prefs.be_special)) {
			text += "|Enabled in Prefs";
		} else {
			text += "|Disabled in Prefs";
		}
		rt.setAt(sections, "wizard", text);
	}
	text = "cult";
	if (GLOB.SSticker.mode.config_tag == "cult") {
		text = uppertext(text);
	}
	text = `<i><b>${text}</b></i>: `;
	if (iscultist(this.current)) {
		text += fmt("loyal|<a href='?src=＃;cult=clear'>employee</a>|<b>CULTIST</b>", [f.src]);
		text += fmt("<br>Give <a href='?src=＃;cult=tome'>tome</a>|<a href='?src=＃;cult=amulet'>amulet</a>.", [f.src, f.src]);
	} else if (this.current.isloyal()) {
		text += fmt("<b>LOYAL</b>|employee|<a href='?src=＃;cult=cultist'>cultist</a>", [f.src]);
	} else if (is_convertable_to_cult(this.current)) {
		text += fmt("loyal|<b>EMPLOYEE</b>|<a href='?src=＃;cult=cultist'>cultist</a>", [f.src]);
	} else {
		text += "loyal|<b>EMPLOYEE</b>|<i>cannot serve Nar-Sie</i>";
	}
	if (this.current && this.current.client && rt.isIn(f, "cultist", this.current.client.prefs.be_special)) {
		text += "|Enabled in Prefs";
	} else {
		text += "|Disabled in Prefs";
	}
	rt.setAt(sections, "cult", text);
	text = "clockwork cult";
	if (GLOB.SSticker.mode.config_tag == "clockwork cult") {
		text = uppertext(text);
	}
	text = `<i><b>${text}</b></i>: `;
	if (is_servant_of_ratvar(this.current)) {
		text += fmt("loyal|<a href='?src=＃;clockcult=clear'>employee</a>|<b>SERVANT</b>", [f.src]);
		text += fmt("<br><a href='?src=＃;clockcult=slab'>Give slab</a>", [f.src]);
	} else if (this.current.isloyal()) {
		text += fmt("<b>LOYAL</b>|employee|<a href='?src=＃;clockcult=servant'>servant</a>", [f.src]);
	} else if (is_eligible_servant(this.current)) {
		text += fmt("loyal|<b>EMPLOYEE</b>|<a href='?src=＃;clockcult=servant'>servant</a>", [f.src]);
	} else {
		text += "loyal|<b>EMPLOYEE</b>|<i>cannot serve Ratvar</i>";
	}
	if (this.current && this.current.client && rt.isIn(f, "servant of Ratvar", this.current.client.prefs.be_special)) {
		text += "|Enabled in Prefs";
	} else {
		text += "|Disabled in Prefs";
	}
	rt.setAt(sections, "clockcult", text);
	text = "traitor";
	if (GLOB.SSticker.mode.config_tag == "traitor" || GLOB.SSticker.mode.config_tag == "traitorchan") {
		text = uppertext(text);
	}
	text = `<i><b>${text}</b></i>: `;
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.traitors)) {
		text += fmt("<b>TRAITOR</b>|<a href='?src=＃;traitor=clear'>loyal</a>", [f.src]);
		if (rt.len(f, this.objectives) == 0) {
			text += fmt("<br>Objectives are empty! <a href='?src=＃;traitor=autoobjectives'>Randomize</a>!", [f.src]);
		}
	} else {
		text += fmt("<a href='?src=＃;traitor=traitor'>traitor</a>|<b>LOYAL</b>", [f.src]);
	}
	if (this.current && this.current.client && rt.isIn(f, "traitor", this.current.client.prefs.be_special)) {
		text += "|Enabled in Prefs";
	} else {
		text += "|Disabled in Prefs";
	}
	rt.setAt(sections, "traitor", text);
	if (rt.istype(this.current, T("/mob/living/carbon/human")) || rt.istype(this.current, T("/mob/living/carbon/monkey"))) {
		text = "changeling";
		if (GLOB.SSticker.mode.config_tag == "changeling" || GLOB.SSticker.mode.config_tag == "traitorchan") {
			text = uppertext(text);
		}
		text = `<i><b>${text}</b></i>: `;
		if (rt.isIn(f, f.src, GLOB.SSticker.mode.changelings) && this.special_role) {
			text += fmt("<b>YES</b>|<a href='?src=＃;changeling=clear'>no</a>", [f.src]);
			if (rt.len(f, this.objectives) == 0) {
				text += fmt("<br>Objectives are empty! <a href='?src=＃;changeling=autoobjectives'>Randomize!</a>", [f.src]);
			}
			if (this.changeling && rt.len(f, this.changeling.stored_profiles) && this.current.real_name != this.changeling.first_prof.name) {
				text += fmt("<br><a href='?src=＃;changeling=initialdna'>Transform to initial appearance.</a>", [f.src]);
			}
		} else if (rt.isIn(f, f.src, GLOB.SSticker.mode.changelings)) {
			text += fmt("<b>YES (but not an antag)</b>|<a href='?src=＃;changeling=clear'>no</a>", [f.src]);
			if (rt.len(f, this.objectives) == 0) {
				text += fmt("<br>Objectives are empty! <a href='?src=＃;changeling=autoobjectives'>Randomize!</a>", [f.src]);
			}
			if (this.changeling && rt.len(f, this.changeling.stored_profiles) && this.current.real_name != this.changeling.first_prof.name) {
				text += fmt("<br><a href='?src=＃;changeling=initialdna'>Transform to initial appearance.</a>", [f.src]);
			}
		} else {
			text += fmt("<a href='?src=＃;changeling=changeling'>yes</a>|<b>NO</b>", [f.src]);
		}
		if (this.current && this.current.client && rt.isIn(f, "changeling", this.current.client.prefs.be_special)) {
			text += "|Enabled in Prefs";
		} else {
			text += "|Disabled in Prefs";
		}
		rt.setAt(sections, "changeling", text);
		text = "monkey";
		if (GLOB.SSticker.mode.config_tag == "monkey") {
			text = uppertext(text);
		}
		text = `<i><b>${text}</b></i>: `;
		if (rt.istype(this.current, T("/mob/living/carbon/human"))) {
			text += fmt("<a href='?src=＃;monkey=healthy'>healthy</a>|<a href='?src=＃;monkey=infected'>infected</a>|<b>HUMAN</b>|other", [f.src, f.src]);
		} else if (rt.istype(this.current, T("/mob/living/carbon/monkey"))) {
			found = 0;
			for (D of each(this.current.viruses, T("/datum/disease"))) {
				if (rt.istype(D, T("/datum/disease/transformation/jungle_fever"))) {
					found = 1;
				}
			}
			if (found) {
				text += fmt("<a href='?src=＃;monkey=healthy'>healthy</a>|<b>INFECTED</b>|<a href='?src=＃;monkey=human'>human</a>|other", [f.src, f.src]);
			} else {
				text += fmt("<b>HEALTHY</b>|<a href='?src=＃;monkey=infected'>infected</a>|<a href='?src=＃;monkey=human'>human</a>|other", [f.src, f.src]);
			}
		} else {
			text += "healthy|infected|human|<b>OTHER</b>";
		}
		if (this.current && this.current.client && rt.isIn(f, "monkey", this.current.client.prefs.be_special)) {
			text += "|Enabled in Prefs";
		} else {
			text += "|Disabled in Prefs";
		}
		rt.setAt(sections, "monkey", text);
	}
	text = "devil";
	if (GLOB.SSticker.mode.config_tag == "devil") {
		text = uppertext(text);
	}
	text = `<i><b>${text}</b></i>: `;
	if (devilinfo = (yield* this.has_antag_datum(T("/datum/antagonist/devil")))) {
		if (!devilinfo.ascendable) {
			text += fmt("<b>DEVIL</b>|<a href='?src=＃;devil=ascendable_devil'>Ascendable Devil</a>|sintouched|<a href='?src=＃;devil=clear'>human</a>", [f.src, f.src]);
		} else {
			text += fmt("<a href='?src=＃;devil=devil'>DEVIL</a>|<b>ASCENDABLE DEVIL</b>|sintouched|<a href='?src=＃;devil=clear'>human</a>", [f.src, f.src]);
		}
	} else if (rt.isIn(f, f.src, GLOB.SSticker.mode.sintouched)) {
		text += fmt("devil|Ascendable Devil|<b>SINTOUCHED</b>|<a href='?src=＃;devil=clear'>human</a>", [f.src]);
	} else {
		text += fmt("<a href='?src=＃;devil=devil'>devil</a>|<a href='?src=＃;devil=ascendable_devil'>Ascendable Devil</a>|<a href='?src=＃;devil=sintouched'>sintouched</a>|<b>HUMAN</b>", [f.src, f.src, f.src]);
	}
	if (this.current && this.current.client && rt.isIn(f, "devil", this.current.client.prefs.be_special)) {
		text += "|Enabled in Prefs";
	} else {
		text += "|Disabled in Prefs";
	}
	rt.setAt(sections, "devil", text);
	text = "ninja";
	if (GLOB.SSticker.mode.config_tag == "ninja") {
		text = uppertext(text);
	}
	text = `<i><b>${text}</b></i>: `;
	if (ninjainfo = (yield* this.has_antag_datum(T("/datum/antagonist/ninja")))) {
		if (ninjainfo.helping_station) {
			text += fmt("<a href='?src=＃;ninja=clear'>employee</a> | syndicate | <b>NANOTRASEN</b> | <b><a href='?src=＃;ninja=equip'>EQUIP</a></b>", [f.src, f.src]);
		} else {
			text += fmt("<a href='?src=＃;ninja=clear'>employee</a> | <b>SYNDICATE</b> | nanotrasen | <b><a href='?src=＃;ninja=equip'>EQUIP</a></b>", [f.src, f.src]);
		}
	} else {
		text += fmt("<b>EMPLOYEE</b> | <a href='?src=＃;ninja=syndicate'>syndicate</a> | <a href='?src=＃;ninja=nanotrasen'>nanotrasen</a> | <a href='?src=＃;ninja=random'>random allegiance</a>", [f.src, f.src, f.src]);
	}
	if (this.current && this.current.client && rt.isIn(f, "space ninja", this.current.client.prefs.be_special)) {
		text += " | Enabled in Prefs";
	} else {
		text += " | Disabled in Prefs";
	}
	rt.setAt(sections, "ninja", text);
	if (rt.istype(this.current, T("/mob/living/silicon"))) {
		text = "silicon";
		if (rt.istype((robot = this.current), T("/mob/living/silicon/robot")) && robot.emagged) {
			text += fmt("<br>Cyborg: Is emagged! <a href='?src=＃;silicon=unemag'>Unemag!</a><br>0th law: ＀", [f.src, robot.laws.zeroth]);
		}
		if (rt.istype((ai = this.current), T("/mob/living/silicon/ai")) && rt.len(f, ai.connected_robots)) {
			n_e_robots = 0;
			for (R of each(ai.connected_robots, T("/mob/living/silicon/robot"))) {
				if (R.emagged) {
					n_e_robots++;
				}
			}
			text += fmt("<br>＀ of ＀ slaved cyborgs are emagged. <a href='?src=＃;silicon=unemagcyborgs'>Unemag</a>", [n_e_robots, rt.len(f, ai.connected_robots), f.src]);
		}
	}
	if (GLOB.SSticker.mode.config_tag == "traitorchan") {
		if (rt.at(sections, "traitor")) {
			out += rt.at(sections, "traitor") + "<br>";
		}
		if (rt.at(sections, "changeling")) {
			out += rt.at(sections, "changeling") + "<br><br>";
		}
		sections -= "traitor";
		sections -= "changeling";
	} else {
		if (rt.index(sections, GLOB.SSticker.mode.config_tag)) {
			out += rt.index(sections, GLOB.SSticker.mode.config_tag) + "<br><br>";
		}
		sections -= GLOB.SSticker.mode.config_tag;
	}
	for (i of each(sections)) {
		if (rt.index(sections, i)) {
			out += rt.index(sections, i) + "<br>";
		}
	}
	if ((rt.isIn(f, f.src, GLOB.SSticker.mode.head_revolutionaries) || rt.isIn(f, f.src, GLOB.SSticker.mode.traitors) || rt.isIn(f, f.src, GLOB.SSticker.mode.syndicates)) && rt.istype(this.current, T("/mob/living/carbon/human"))) {
		text = fmt("Uplink: <a href='?src=＃;common=uplink'>give</a>", [f.src]);
		if (U = (yield* this.find_syndicate_uplink())) {
			text += fmt("|<a href='?src=＃;common=takeuplink'>take</a>", [f.src]);
			if (check_rights(8, 0)) {
				text += fmt(", <a href='?src=＃;common=crystals'>＀</a> TC", [f.src, U.telecrystals]);
			} else {
				text += `, ${U.telecrystals} TC`;
			}
		}
		out += (text += ".");
	}
	out += "<br><br>";
	out += "<b>Memory:</b><br>";
	out += this.memory;
	out += fmt("<br><a href='?src=＃;memory_edit=1'>Edit memory</a><br>", [f.src]);
	out += "Objectives:<br>";
	if (rt.len(f, this.objectives) == 0) {
		out += "EMPTY<br>";
	} else {
		obj_count = 1;
		for (objective of each(this.objectives, T("/datum/objective"))) {
			$0 = obj_count;
			$1 = objective.explanation_text;
			$2 = f.src;
			$3 = objective;
			$4 = f.src;
			$5 = objective;
			$6 = f.src;
			$7 = objective;
			if (objective.completed) {
				$8 = "green";
			} else {
				$8 = "red";
			}
			out += fmt("<B>＀</B>: ＀ <a href='?src=＃;obj_edit=＃'>Edit</a> <a href='?src=＃;obj_delete=＃'>Delete</a> <a href='?src=＃;obj_completed=＃'><font color=＀>Toggle Completion</font></a><br>", [$0, $1, $2, $3, $4, $5, $6, $7, $8]);
			obj_count++;
		}
	}
	out += fmt("<a href='?src=＃;obj_add=1'>Add objective</a><br><br>", [f.src]);
	out += fmt("<a href='?src=＃;obj_announce=1'>Announce objectives</a><br><br>", [f.src]);
	rt.op(f, "Browse", [], [f.usr, out, `window=edit_memory${f.src};size=500x600`], false);
	return f.dot;
}, true);

// mind.dm:757
rt.def("/datum/mind/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let new_role: Value = null, new_memo: Value = null, objective: Value = null, objective_pos: Value = null, def_value: Value = null, temp_obj_type: Value = null, new_obj_type: Value = null, new_objective: Value = null, possible_targets: Value = null, possible_target: Value = null, def_target: Value = null, objective_list: Value = null, new_target: Value = null, objective_path: Value = null, new_target_6: Value = null, steal: Value = null, def_num: Value = null, target_number: Value = null, expl: Value = null, valid_head: Value = null, O: Value = null, rev_obj: Value = null, L: Value = null, flash: Value = null, pen: Value = null, gangtool: Value = null, SC: Value = null, names: Value = null, gangname: Value = null, newgang: Value = null, G: Value = null, C: Value = null, H: Value = null, code: Value = null, bombue: Value = null, traitordatum: Value = null, devilinfo: Value = null, H_1: Value = null, ninjainfo: Value = null, gear: Value = null, M: Value = null, D: Value = null, R: Value = null, ai: Value = null, R_1: Value = null, W: Value = null, U: Value = null, crystals: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	if (!check_rights(2)) {
		return f.dot;
	}
	if (rt.at(href_list, "role_edit")) {
		if (!(new_role = (yield* g.op(f, "Prompt", [1], [null, rt.sv(f, "assigned_role"), "Assigned role", "Select new role", get_all_jobs()])))) {
			return f.dot;
		}
		rt.setSv(f, "assigned_role", new_role);
	} else if (rt.at(href_list, "memory_edit")) {
		if ((new_memo = copytext(sanitize((yield* g.op(f, "Prompt", [65], [null, rt.sv(f, "memory"), "Memory", "Write new memory", null]))), 1, 1024)) === null) {
			return f.dot;
		}
		rt.setSv(f, "memory", new_memo);
	} else if (rt.at(href_list, "obj_edit") || rt.at(href_list, "obj_add")) {
		if (rt.at(href_list, "obj_edit")) {
			if (!(objective = rt.locateIn(f, rt.at(href_list, "obj_edit"), rt.world()))) {
				return f.dot;
			}
			objective_pos = rt.sv(f, "objectives").Find(objective);
			if (!(def_value = copytext((temp_obj_type = `${objective.type}`), 19))) {
				def_value = "custom";
			}
		}
		if (!(new_obj_type = (yield* g.op(f, "Prompt", [1], [null, def_value, "Objective type", "Select objective type:", list("assassinate", "maroon", "debrain", "protect", "destroy", "prevent", "hijack", "escape", "survive", "martyr", "steal", "download", "nuclear", "capture", "absorb", "custom")])))) {
			return f.dot;
		}
		if (new_obj_type === "assassinate" || new_obj_type === "protect" || new_obj_type === "debrain" || new_obj_type === "maroon") {
			possible_targets = list("Free objective");
			for (possible_target of each(GLOB.SSticker.minds, T("/datum/mind"))) {
				if (possible_target != f.src && rt.istype(possible_target.current, T("/mob/living/carbon/human"))) {
					possible_targets += possible_target.current;
				}
			}
			objective_list = list(T("/datum/objective/assassinate"), T("/datum/objective/protect"), T("/datum/objective/debrain"), T("/datum/objective/maroon"));
			if (objective && rt.isIn(f, objective.type, objective_list) && objective.target) {
				def_target = objective.target.current;
			}
			if (!(new_target = (yield* g.op(f, "Prompt", [1], [null, def_target, "Objective target", "Select target:", possible_targets])))) {
				return f.dot;
			}
			objective_path = text2path(`/datum/objective/${new_obj_type}`);
			if (new_target == "Free objective") {
				(new_objective = (yield* new_(objective_path))).owner = f.src;
				new_objective.target = null;
				new_objective.explanation_text = "Free objective";
			} else {
				(new_objective = (yield* new_(objective_path))).owner = f.src;
				new_objective.target = new_target.mind;
				new_objective.update_explanation_text();
			}
		} else if (new_obj_type === "destroy") {
			if (rt.len(f, (possible_targets = active_ais(1)))) {
				new_target_6 = (yield* g.op(f, "Prompt", [1], [null, null, "Objective target", "Select target:", possible_targets]));
				(new_objective = (yield* new_(T("/datum/objective/destroy")))).target = new_target_6.mind;
				new_objective.owner = f.src;
				new_objective.update_explanation_text();
			} else {
				to_chat(f.usr, "No active AIs with minds");
			}
		} else if (new_obj_type === "prevent") {
			(new_objective = (yield* new_(T("/datum/objective/block")))).owner = f.src;
		} else if (new_obj_type === "hijack") {
			(new_objective = (yield* new_(T("/datum/objective/hijack")))).owner = f.src;
		} else if (new_obj_type === "escape") {
			(new_objective = (yield* new_(T("/datum/objective/escape")))).owner = f.src;
		} else if (new_obj_type === "survive") {
			(new_objective = (yield* new_(T("/datum/objective/survive")))).owner = f.src;
		} else if (new_obj_type === "martyr") {
			(new_objective = (yield* new_(T("/datum/objective/martyr")))).owner = f.src;
		} else if (new_obj_type === "nuclear") {
			(new_objective = (yield* new_(T("/datum/objective/nuclear")))).owner = f.src;
		} else if (new_obj_type === "steal") {
			if (!rt.istype(objective, T("/datum/objective/steal"))) {
				(new_objective = (yield* new_(T("/datum/objective/steal")))).owner = f.src;
			} else {
				new_objective = objective;
			}
			if (!(yield* (steal = new_objective).select_target())) {
				return f.dot;
			}
		} else if (new_obj_type === "download" || new_obj_type === "capture" || new_obj_type === "absorb") {
			if (objective && objective.type == text2path(`/datum/objective/${new_obj_type}`)) {
				def_num = objective.target_amount;
			}
			if ((target_number = (yield* g.op(f, "Prompt", [33], [null, def_num, "Objective", "Input target number:", null]))) === null) {
				return f.dot;
			}
			if (new_obj_type === "download") {
				(new_objective = (yield* new_(T("/datum/objective/download")))).explanation_text = `Download ${target_number} research levels.`;
			} else if (new_obj_type === "capture") {
				(new_objective = (yield* new_(T("/datum/objective/capture")))).explanation_text = `Capture ${target_number} lifeforms with an energy net. Live, rare specimens are worth more.`;
			} else if (new_obj_type === "absorb") {
				(new_objective = (yield* new_(T("/datum/objective/absorb")))).explanation_text = `Absorb ${target_number} compatible genomes.`;
			}
			new_objective.owner = f.src;
			new_objective.target_amount = target_number;
		} else if (new_obj_type === "custom") {
			$0 = f.usr;
			$1 = "Custom objective:";
			$2 = "Objective";
			if (objective) {
				$3 = objective.explanation_text;
			} else {
				$3 = "";
			}
			if (!(expl = (yield* stripped_input($0, $1, $2, $3)))) {
				return f.dot;
			}
			(new_objective = (yield* new_(T("/datum/objective")))).owner = f.src;
			new_objective.explanation_text = expl;
		}
		if (!new_objective) {
			return f.dot;
		}
		if (objective) {
			(rt.modSrcVar(f, "objectives", objective, subtract));
			yield* rt.sv(f, "objectives").Insert(objective_pos, new_objective);
			message_admins(`${key_name_admin(f.usr)} edited ${rt.sv(f, "current")}'s objective to ${new_objective.explanation_text}`);
			log_admin(`${key_name(f.usr)} edited ${rt.sv(f, "current")}'s objective to ${new_objective.explanation_text}`);
		} else {
			rt.modSrcVar(f, "objectives", new_objective, add);
			message_admins(`${key_name_admin(f.usr)} added a new objective for ${rt.sv(f, "current")}: ${new_objective.explanation_text}`);
			log_admin(`${key_name(f.usr)} added a new objective for ${rt.sv(f, "current")}: ${new_objective.explanation_text}`);
		}
	} else if (rt.at(href_list, "obj_delete")) {
		if (!rt.istype((objective = rt.locateIn(f, rt.at(href_list, "obj_delete"), rt.world())), T("/datum/objective"))) {
			return f.dot;
		}
		(rt.modSrcVar(f, "objectives", objective, subtract));
		message_admins(`${key_name_admin(f.usr)} removed an objective for ${rt.sv(f, "current")}: ${objective.explanation_text}`);
		log_admin(`${key_name(f.usr)} removed an objective for ${rt.sv(f, "current")}: ${objective.explanation_text}`);
	} else if (rt.at(href_list, "obj_completed")) {
		if (!rt.istype((objective = rt.locateIn(f, rt.at(href_list, "obj_completed"), rt.world())), T("/datum/objective"))) {
			return f.dot;
		}
		objective.completed = (!objective.completed ? 1 : 0);
		log_admin(`${key_name(f.usr)} toggled the win state for ${rt.sv(f, "current")}'s objective: ${objective.explanation_text}`);
	} else if (rt.at(href_list, "revolution")) {
		const item = rt.at(href_list, "revolution");
		if (item === "clear") {
			yield* g.srcCall(f, "remove_rev");
			to_chat(rt.sv(f, "current"), "<span class='userdanger'>You have been brainwashed! You are no longer a revolutionary!</span>");
			message_admins(`${key_name_admin(f.usr)} has de-rev'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has de-rev'ed ${rt.sv(f, "current")}.`);
		} else if (item === "rev") {
			if (rt.isIn(f, f.src, GLOB.SSticker.mode.head_revolutionaries)) {
				GLOB.SSticker.mode.head_revolutionaries -= f.src;
				GLOB.SSticker.mode.update_rev_icons_removed(f.src);
				to_chat(rt.sv(f, "current"), "<span class='userdanger'>Revolution has been disappointed of your leader traits! You are a regular revolutionary now!</span>");
			} else if (!rt.isIn(f, f.src, GLOB.SSticker.mode.revolutionaries)) {
				to_chat(rt.sv(f, "current"), "<span class='danger'><FONT size = 3> You are now a revolutionary! Help your cause. Do not harm your fellow freedom fighters. You can identify your comrades by the red \"R\" icons, and your leaders by the blue \"R\" icons. Help them kill the heads to win the revolution!</FONT></span>");
			} else {
				return f.dot;
			}
			GLOB.SSticker.mode.revolutionaries += f.src;
			GLOB.SSticker.mode.update_rev_icons_added(f.src);
			rt.setSv(f, "special_role", "Revolutionary");
			message_admins(`${key_name_admin(f.usr)} has rev'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has rev'ed ${rt.sv(f, "current")}.`);
		} else if (item === "headrev") {
			if (rt.isIn(f, f.src, GLOB.SSticker.mode.revolutionaries)) {
				GLOB.SSticker.mode.revolutionaries -= f.src;
				GLOB.SSticker.mode.update_rev_icons_removed(f.src);
				to_chat(rt.sv(f, "current"), "<span class='userdanger'>You have proved your devotion to revoltion! Yea are a head revolutionary now!</span>");
			} else if (!rt.isIn(f, f.src, GLOB.SSticker.mode.head_revolutionaries)) {
				to_chat(rt.sv(f, "current"), "<span class='userdanger'>You are a member of the revolutionaries' leadership now!</span>");
			} else {
				return f.dot;
			}
			if (rt.len(f, GLOB.SSticker.mode.head_revolutionaries) > 0) {
				if (valid_head = rt.locateIn(f, T("/datum/mind"), GLOB.SSticker.mode.head_revolutionaries)) {
					for (O of each(valid_head.objectives, T("/datum/objective/mutiny"))) {
						(rev_obj = (yield* new_(T("/datum/objective/mutiny")))).owner = f.src;
						rev_obj.target = O.target;
						rev_obj.explanation_text = `Assassinate ${O.target.name}, the ${O.target.assigned_role}.`;
						rt.modSrcVar(f, "objectives", rev_obj, add);
					}
					GLOB.SSticker.mode.greet_revolutionary(f.src, 0);
				}
			}
			GLOB.SSticker.mode.head_revolutionaries += f.src;
			GLOB.SSticker.mode.update_rev_icons_added(f.src);
			rt.setSv(f, "special_role", "Head Revolutionary");
			message_admins(`${key_name_admin(f.usr)} has head-rev'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has head-rev'ed ${rt.sv(f, "current")}.`);
		} else if (item === "autoobjectives") {
			GLOB.SSticker.mode.forge_revolutionary_objectives(f.src);
			GLOB.SSticker.mode.greet_revolutionary(f.src, 0);
			to_chat(f.usr, `<span class='notice'>The objectives for revolution have been generated and shown to ${rt.sv(f, "key")}</span>`);
		} else if (item === "flash") {
			if (!(yield* GLOB.SSticker.mode.equip_revolutionary(rt.sv(f, "current")))) {
				to_chat(f.usr, "<span class='danger'>Spawning flash failed!</span>");
			}
		} else if (item === "takeflash") {
			L = rt.sv(f, "current").get_contents();
			if (!(flash = rt.locateIn(f, T("/obj/item/device/assembly/flash"), L))) {
				to_chat(f.usr, "<span class='danger'>Deleting flash failed!</span>");
			}
			yield* qdel(flash);
		} else if (item === "repairflash") {
			L = rt.sv(f, "current").get_contents();
			if (!(flash = rt.locateIn(f, T("/obj/item/device/assembly/flash"), L))) {
				to_chat(f.usr, "<span class='danger'>Repairing flash failed!</span>");
			} else {
				flash.crit_fail = 0;
				yield* flash.update_icon();
			}
		}
	} else if (rt.at(href_list, "gang")) {
		const item = rt.at(href_list, "gang");
		if (item === "clear") {
			yield* g.srcCall(f, "remove_gang");
			message_admins(`${key_name_admin(f.usr)} has de-gang'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has de-gang'ed ${rt.sv(f, "current")}.`);
		} else if (item === "equip") {
			const subject = (yield* GLOB.SSticker.mode.equip_gang(rt.sv(f, "current"), rt.sv(f, "gang_datum")));
			if (subject === 1) {
				to_chat(f.usr, "<span class='warning'>Unable to equip territory spraycan!</span>");
			} else if (subject === 2) {
				to_chat(f.usr, "<span class='warning'>Unable to equip recruitment pen and spraycan!</span>");
			} else if (subject === 3) {
				to_chat(f.usr, "<span class='warning'>Unable to equip gangtool, pen, and spraycan!</span>");
			}
		} else if (item === "takeequip") {
			L = rt.sv(f, "current").get_contents();
			for (pen of each(L, T("/obj/item/weapon/pen/gang"))) {
				yield* qdel(pen);
			}
			for (gangtool of each(L, T("/obj/item/device/gangtool"))) {
				yield* qdel(gangtool);
			}
			for (SC of each(L, T("/obj/item/toy/crayon/spraycan/gang"))) {
				yield* qdel(SC);
			}
		} else if (item === "new") {
			if (rt.len(f, GLOB.gang_colors_pool)) {
				names = list("Random") + GLOB.gang_name_pool;
				if ((gangname = (yield* g.op(f, "Prompt", [1], [null, null, "Select Name", "Pick a gang name.", names]))) && rt.len(f, GLOB.gang_colors_pool)) {
					if (!rt.isIn(f, gangname, GLOB.gang_name_pool)) {
						gangname = null;
					}
					newgang = (yield* new_(T("/datum/gang"), null, gangname));
					GLOB.SSticker.mode.gangs += newgang;
					message_admins(`${key_name_admin(f.usr)} has created the ${newgang.name} Gang.`);
					log_admin(`${key_name(f.usr)} has created the ${newgang.name} Gang.`);
				}
			}
		}
	} else if (rt.at(href_list, "gangboss")) {
		if (!(G = rt.locateIn(f, rt.at(href_list, "gangboss"), GLOB.SSticker.mode.gangs)) || rt.isIn(f, f.src, G.bosses)) {
			return f.dot;
		}
		yield* GLOB.SSticker.mode.remove_gangster(f.src, 0, 2, 1);
		rt.setAt(G.bosses, f.src, GANGSTER_BOSS_STARTING_INFLUENCE);
		rt.setSv(f, "gang_datum", G);
		rt.setSv(f, "special_role", `${G.name} Gang Boss`);
		G.add_gang_hud(f.src);
		to_chat(rt.sv(f, "current"), `<FONT size=3 color=red><B>You are a ${G.name} Gang Boss!</B></FONT>`);
		message_admins(`${key_name_admin(f.usr)} has added ${rt.sv(f, "current")} to the ${G.name} Gang leadership.`);
		log_admin(`${key_name(f.usr)} has added ${rt.sv(f, "current")} to the ${G.name} Gang leadership.`);
		GLOB.SSticker.mode.forge_gang_objectives(f.src);
		GLOB.SSticker.mode.greet_gang(f.src, 0);
	} else if (rt.at(href_list, "gangster")) {
		if (!(G = rt.locateIn(f, rt.at(href_list, "gangster"), GLOB.SSticker.mode.gangs)) || rt.isIn(f, f.src, G.gangsters)) {
			return f.dot;
		}
		yield* GLOB.SSticker.mode.remove_gangster(f.src, 0, 2, 1);
		yield* GLOB.SSticker.mode.add_gangster(f.src, G, 0);
		message_admins(`${key_name_admin(f.usr)} has added ${rt.sv(f, "current")} to the ${G.name} Gang (A).`);
		log_admin(`${key_name(f.usr)} has added ${rt.sv(f, "current")} to the ${G.name} Gang (A).`);
	} else if (rt.at(href_list, "cult")) {
		const item = rt.at(href_list, "cult");
		if (item === "clear") {
			yield* g.srcCall(f, "remove_cultist");
			message_admins(`${key_name_admin(f.usr)} has de-cult'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has de-cult'ed ${rt.sv(f, "current")}.`);
		} else if (item === "cultist") {
			if (!rt.isIn(f, f.src, GLOB.SSticker.mode.cult)) {
				yield* GLOB.SSticker.mode.add_cultist(f.src, 0);
				message_admins(`${key_name_admin(f.usr)} has cult'ed ${rt.sv(f, "current")}.`);
				log_admin(`${key_name(f.usr)} has cult'ed ${rt.sv(f, "current")}.`);
			}
		} else if (item === "tome") {
			if (!(yield* GLOB.SSticker.mode.equip_cultist(rt.sv(f, "current"), 1))) {
				to_chat(f.usr, "<span class='danger'>Spawning tome failed!</span>");
			}
		} else if (item === "amulet") {
			if (!(yield* GLOB.SSticker.mode.equip_cultist(rt.sv(f, "current")))) {
				to_chat(f.usr, "<span class='danger'>Spawning amulet failed!</span>");
			}
		}
	} else if (rt.at(href_list, "clockcult")) {
		const item = rt.at(href_list, "clockcult");
		if (item === "clear") {
			yield* remove_servant_of_ratvar(rt.sv(f, "current"), 1);
			message_admins(`${key_name_admin(f.usr)} has removed clockwork servant status from ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has removed clockwork servant status from ${rt.sv(f, "current")}.`);
		} else if (item === "servant") {
			if (!is_servant_of_ratvar(rt.sv(f, "current"))) {
				yield* add_servant_of_ratvar(rt.sv(f, "current"), 1);
				message_admins(`${key_name_admin(f.usr)} has made ${rt.sv(f, "current")} into a servant of Ratvar.`);
				log_admin(`${key_name(f.usr)} has made ${rt.sv(f, "current")} into a servant of Ratvar.`);
			}
		} else if (item === "slab") {
			if (!(yield* GLOB.SSticker.mode.equip_servant(rt.sv(f, "current")))) {
				to_chat(f.usr, `<span class='warning'>Failed to outfit ${rt.sv(f, "current")} with a slab!</span>`);
			} else {
				to_chat(f.usr, `<span class='notice'>Successfully gave ${rt.sv(f, "current")} a clockwork slab!</span>`);
			}
		}
	} else if (rt.at(href_list, "wizard")) {
		const item = rt.at(href_list, "wizard");
		if (item === "clear") {
			yield* g.srcCall(f, "remove_wizard");
			to_chat(rt.sv(f, "current"), "<span class='userdanger'>You have been brainwashed! You are no longer a wizard!</span>");
			log_admin(`${key_name(f.usr)} has de-wizard'ed ${rt.sv(f, "current")}.`);
			GLOB.SSticker.mode.update_wiz_icons_removed(f.src);
		} else if (item === "wizard") {
			if (!rt.isIn(f, f.src, GLOB.SSticker.mode.wizards)) {
				GLOB.SSticker.mode.wizards += f.src;
				rt.setSv(f, "special_role", "Wizard");
				to_chat(rt.sv(f, "current"), "<span class='boldannounce'>You are the Space Wizard!</span>");
				message_admins(`${key_name_admin(f.usr)} has wizard'ed ${rt.sv(f, "current")}.`);
				log_admin(`${key_name(f.usr)} has wizard'ed ${rt.sv(f, "current")}.`);
				GLOB.SSticker.mode.update_wiz_icons_added(f.src);
			}
		} else if (item === "lair") {
			rt.sv(f, "current").loc = pick(GLOB.wizardstart);
		} else if (item === "dressup") {
			yield* GLOB.SSticker.mode.equip_wizard(rt.sv(f, "current"));
		} else if (item === "name") {
			GLOB.SSticker.mode.name_wizard(rt.sv(f, "current"));
		} else if (item === "autoobjectives") {
			yield* GLOB.SSticker.mode.forge_wizard_objectives(f.src);
			to_chat(f.usr, `<span class='notice'>The objectives for wizard ${rt.sv(f, "key")} have been generated. You can edit them and anounce manually.</span>`);
		}
	} else if (rt.at(href_list, "changeling")) {
		const item = rt.at(href_list, "changeling");
		if (item === "clear") {
			yield* g.srcCall(f, "remove_changeling");
			to_chat(rt.sv(f, "current"), "<span class='userdanger'>You grow weak and lose your powers! You are no longer a changeling and are stuck in your current form!</span>");
			message_admins(`${key_name_admin(f.usr)} has de-changeling'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has de-changeling'ed ${rt.sv(f, "current")}.`);
		} else if (item === "changeling") {
			if (!rt.isIn(f, f.src, GLOB.SSticker.mode.changelings)) {
				GLOB.SSticker.mode.changelings += f.src;
				yield* rt.sv(f, "current").make_changeling();
				rt.setSv(f, "special_role", "Changeling");
				to_chat(rt.sv(f, "current"), `<span class='boldannounce'>Your powers are awoken. A flash of memory returns to us...we are ${rt.sv(f, "changeling").changelingID}, a changeling!</span>`);
				message_admins(`${key_name_admin(f.usr)} has changeling'ed ${rt.sv(f, "current")}.`);
				log_admin(`${key_name(f.usr)} has changeling'ed ${rt.sv(f, "current")}.`);
				GLOB.SSticker.mode.update_changeling_icons_added(f.src);
			}
		} else if (item === "autoobjectives") {
			yield* GLOB.SSticker.mode.forge_changeling_objectives(f.src);
			to_chat(f.usr, `<span class='notice'>The objectives for changeling ${rt.sv(f, "key")} have been generated. You can edit them and anounce manually.</span>`);
		} else if (item === "initialdna") {
			if (!rt.sv(f, "changeling") || !rt.len(f, rt.sv(f, "changeling").stored_profiles) || !rt.istype(rt.sv(f, "current"), T("/mob/living/carbon"))) {
				to_chat(f.usr, "<span class='danger'>Resetting DNA failed!</span>");
			} else {
				C = rt.sv(f, "current");
				yield* rt.sv(f, "changeling").first_prof.dna.transfer_identity(C, { transfer_SE: 1 });
				C.real_name = rt.sv(f, "changeling").first_prof.name;
				yield* C.updateappearance({ mutcolor_update: 1 });
				yield* C.domutcheck();
			}
		}
	} else if (rt.at(href_list, "nuclear")) {
		const item = rt.at(href_list, "nuclear");
		if (item === "clear") {
			yield* g.srcCall(f, "remove_nukeop");
			to_chat(rt.sv(f, "current"), "<span class='userdanger'>You have been brainwashed! You are no longer a syndicate operative!</span>");
			message_admins(`${key_name_admin(f.usr)} has de-nuke op'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has de-nuke op'ed ${rt.sv(f, "current")}.`);
		} else if (item === "nuclear") {
			if (!rt.isIn(f, f.src, GLOB.SSticker.mode.syndicates)) {
				GLOB.SSticker.mode.syndicates += f.src;
				GLOB.SSticker.mode.update_synd_icons_added(f.src);
				if (rt.len(f, GLOB.SSticker.mode.syndicates) == 1) {
					yield* GLOB.SSticker.mode.prepare_syndicate_leader(f.src);
				} else {
					rt.sv(f, "current").real_name = `${syndicate_name()} Operative #${rt.len(f, GLOB.SSticker.mode.syndicates) - 1}`;
				}
				rt.setSv(f, "special_role", "Syndicate");
				rt.setSv(f, "assigned_role", "Syndicate");
				to_chat(rt.sv(f, "current"), `<span class='notice'>You are a ${syndicate_name()} agent!</span>`);
				GLOB.SSticker.mode.forge_syndicate_objectives(f.src);
				GLOB.SSticker.mode.greet_syndicate(f.src);
				message_admins(`${key_name_admin(f.usr)} has nuke op'ed ${rt.sv(f, "current")}.`);
				log_admin(`${key_name(f.usr)} has nuke op'ed ${rt.sv(f, "current")}.`);
			}
		} else if (item === "lair") {
			rt.sv(f, "current").loc = rt.getStep(f, rt.locateIn(f, "landmark*Syndicate-Spawn", rt.world()), 0);
		} else if (item === "dressup") {
			yield* qdel((H = rt.sv(f, "current")).belt);
			yield* qdel(H.back);
			yield* qdel(H.ears);
			yield* qdel(H.gloves);
			yield* qdel(H.head);
			yield* qdel(H.shoes);
			yield* qdel(H.wear_id);
			yield* qdel(H.wear_suit);
			yield* qdel(H.w_uniform);
			if (!(yield* GLOB.SSticker.mode.equip_syndicate(rt.sv(f, "current")))) {
				to_chat(f.usr, "<span class='danger'>Equipping a syndicate failed!</span>");
			}
		} else if (item === "tellcode") {
			for (bombue of each(GLOB.machines, T("/obj/machinery/nuclearbomb"))) {
				if (rt.length(bombue.r_code) <= 5 && bombue.r_code != "LOLNO" && bombue.r_code != "ADMIN") {
					code = bombue.r_code;
					break;
				}
			}
			if (code) {
				yield* g.srcCall(f, "store_memory", `<B>Syndicate Nuclear Bomb Code</B>: ${code}`, 0, 0);
				to_chat(rt.sv(f, "current"), `The nuclear authorization code is: <B>${code}</B>`);
			} else {
				to_chat(f.usr, "<span class='danger'>No valid nuke found!</span>");
			}
		}
	} else if (rt.at(href_list, "traitor")) {
		const item = rt.at(href_list, "traitor");
		if (item === "clear") {
			to_chat(rt.sv(f, "current"), "<span class='userdanger'>You have been brainwashed!</span>");
			yield* g.srcCall(f, "remove_traitor");
			message_admins(`${key_name_admin(f.usr)} has de-traitor'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has de-traitor'ed ${rt.sv(f, "current")}.`);
			GLOB.SSticker.mode.update_traitor_icons_removed(f.src);
		} else if (item === "traitor") {
			if (!rt.isIn(f, f.src, GLOB.SSticker.mode.traitors)) {
				message_admins(`${key_name_admin(f.usr)} has traitor'ed ${rt.sv(f, "current")}.`);
				log_admin(`${key_name(f.usr)} has traitor'ed ${rt.sv(f, "current")}.`);
				yield* g.srcCall(f, "make_Traitor");
			}
		} else if (item === "autoobjectives") {
			if (!(traitordatum = (yield* g.srcCall(f, "has_antag_datum", T("/datum/antagonist/traitor"))))) {
				message_admins(`${key_name_admin(f.usr)} has traitor'ed ${rt.sv(f, "current")} as part of autoobjectives.`);
				log_admin(`${key_name(f.usr)} has traitor'ed ${rt.sv(f, "current")} as part of autoobjectives.`);
				yield* g.srcCall(f, "make_Traitor");
			} else {
				log_admin(`${key_name(f.usr)} has forged objectives for ${rt.sv(f, "current")} as part of autoobjectives.`);
				yield* traitordatum.forge_traitor_objectives();
				to_chat(f.usr, `<span class='notice'>The objectives for traitor ${rt.sv(f, "key")} have been generated. You can edit them and anounce manually.</span>`);
			}
		}
	} else if (rt.at(href_list, "devil")) {
		devilinfo = (yield* g.srcCall(f, "has_antag_datum", T("/datum/antagonist/devil")));
		const item = rt.at(href_list, "devil");
		if (item === "clear") {
			if (rt.isIn(f, f.src, GLOB.SSticker.mode.devils)) {
				yield* remove_devil(rt.sv(f, "current"));
				message_admins(`${key_name_admin(f.usr)} has de-devil'ed ${rt.sv(f, "current")}.`);
				log_admin(`${key_name(f.usr)} has de-devil'ed ${rt.sv(f, "current")}.`);
			}
			if (rt.isIn(f, f.src, GLOB.SSticker.mode.sintouched)) {
				GLOB.SSticker.mode.sintouched -= f.src;
				message_admins(`${key_name_admin(f.usr)} has de-sintouch'ed ${rt.sv(f, "current")}.`);
				log_admin(`${key_name(f.usr)} has de-sintouch'ed ${rt.sv(f, "current")}.`);
			}
		} else if (item === "devil") {
			if (devilinfo) {
				devilinfo.ascendable = 0;
				message_admins(`${key_name_admin(f.usr)} has made ${rt.sv(f, "current")} unable to ascend as a devil.`);
				log_admin(`${key_name_admin(f.usr)} has made ${rt.sv(f, "current")} unable to ascend as a devil.`);
				return f.dot;
			}
			if (!rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) && !rt.istype(rt.sv(f, "current"), T("/mob/living/silicon/robot"))) {
				to_chat(f.usr, "<span class='warning'>This only works on humans and cyborgs!</span>");
				return f.dot;
			}
			yield* add_devil(rt.sv(f, "current"), 0);
			message_admins(`${key_name_admin(f.usr)} has devil'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has devil'ed ${rt.sv(f, "current")}.`);
		} else if (item === "ascendable_devil") {
			if (devilinfo) {
				devilinfo.ascendable = 1;
				message_admins(`${key_name_admin(f.usr)} has made ${rt.sv(f, "current")} able to ascend as a devil.`);
				log_admin(`${key_name_admin(f.usr)} has made ${rt.sv(f, "current")} able to ascend as a devil.`);
				return f.dot;
			}
			if (!rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human")) && !rt.istype(rt.sv(f, "current"), T("/mob/living/silicon/robot"))) {
				to_chat(f.usr, "<span class='warning'>This only works on humans and cyborgs!</span>");
				return f.dot;
			}
			yield* add_devil(rt.sv(f, "current"), 1);
			message_admins(`${key_name_admin(f.usr)} has devil'ed ${rt.sv(f, "current")}.  The devil has been marked as ascendable.`);
			log_admin(`${key_name(f.usr)} has devil'ed ${rt.sv(f, "current")}. The devil has been marked as ascendable.`);
		} else if (item === "sintouched") {
			if (rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human"))) {
				(H_1 = rt.sv(f, "current")).influenceSin();
				message_admins(`${key_name_admin(f.usr)} has sintouch'ed ${rt.sv(f, "current")}.`);
			} else {
				to_chat(f.usr, "<span class='warning'>This only works on humans!</span>");
				return f.dot;
			}
		}
	} else if (rt.at(href_list, "ninja")) {
		ninjainfo = (yield* g.srcCall(f, "has_antag_datum", T("/datum/antagonist/ninja")));
		const item = rt.at(href_list, "ninja");
		if (item === "clear") {
			yield* remove_ninja(rt.sv(f, "current"));
			message_admins(`${key_name_admin(f.usr)} has de-ninja'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has de-ninja'ed ${rt.sv(f, "current")}.`);
		} else if (item === "equip") {
			yield* ninjainfo.equip_space_ninja();
			return f.dot;
		} else if (item === "nanotrasen") {
			yield* add_ninja(rt.sv(f, "current"), T("/datum/antagonist/ninja/friendly"));
			message_admins(`${key_name_admin(f.usr)} has friendly ninja'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has friendly ninja'ed ${rt.sv(f, "current")}.`);
		} else if (item === "syndicate") {
			yield* add_ninja(rt.sv(f, "current"), T("/datum/antagonist/ninja"));
			message_admins(`${key_name_admin(f.usr)} has syndie ninja'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has syndie ninja'ed ${rt.sv(f, "current")}.`);
		} else if (item === "random") {
			yield* add_ninja(rt.sv(f, "current"));
			message_admins(`${key_name_admin(f.usr)} has random ninja'ed ${rt.sv(f, "current")}.`);
			log_admin(`${key_name(f.usr)} has random ninja'ed ${rt.sv(f, "current")}.`);
		}
	} else if (rt.at(href_list, "abductor")) {
		const item = rt.at(href_list, "abductor");
		if (item === "clear") {
			to_chat(f.usr, "Not implemented yet. Sorry!");
		} else if (item === "abductor") {
			if (!rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human"))) {
				to_chat(f.usr, "<span class='warning'>This only works on humans!</span>");
				return f.dot;
			}
			yield* g.srcCall(f, "make_Abductor");
			log_admin(`${key_name(f.usr)} turned ${rt.sv(f, "current")} into abductor.`);
			GLOB.SSticker.mode.update_abductor_icons_added(f.src);
		} else if (item === "equip") {
			if (!rt.istype(rt.sv(f, "current"), T("/mob/living/carbon/human"))) {
				to_chat(f.usr, "<span class='warning'>This only works on humans!</span>");
				return f.dot;
			}
			H = rt.sv(f, "current");
			if (gear = (yield* alert("Agent or Scientist Gear", "Gear", "Agent", "Scientist"))) {
				if (gear == "Agent") {
					yield* H.equipOutfit(T("/datum/outfit/abductor/agent"));
				} else {
					yield* H.equipOutfit(T("/datum/outfit/abductor/scientist"));
				}
			}
		}
	} else if (rt.at(href_list, "monkey")) {
		if ((L = rt.sv(f, "current")).notransform) {
			return f.dot;
		}
		const item = rt.at(href_list, "monkey");
		if (item === "healthy") {
			if (check_rights(2)) {
				H_1 = rt.sv(f, "current");
				M = rt.sv(f, "current");
				if (rt.istype(H_1, T("/mob/living/carbon/human"))) {
					log_admin(`${key_name(f.usr)} attempting to monkeyize ${key_name(rt.sv(f, "current"))}`);
					message_admins(`<span class='notice'>${key_name_admin(f.usr)} attempting to monkeyize ${key_name_admin(rt.sv(f, "current"))}</span>`);
					f.src = null;
					f.src = (M = (yield* H_1.monkeyize())).mind;
				} else if (rt.istype(M, T("/mob/living/carbon/monkey")) && rt.length(M.viruses)) {
					for (D of each(M.viruses, T("/datum/disease"))) {
						yield* D.cure(0);
					}
				}
			}
		} else if (item === "infected") {
			if (check_rights(2, 0)) {
				H_1 = rt.sv(f, "current");
				M = rt.sv(f, "current");
				if (rt.istype(H_1, T("/mob/living/carbon/human"))) {
					log_admin(`${key_name(f.usr)} attempting to monkeyize and infect ${key_name(rt.sv(f, "current"))}`);
					message_admins(`<span class='notice'>${key_name_admin(f.usr)} attempting to monkeyize and infect ${key_name_admin(rt.sv(f, "current"))}</span>`);
					f.src = null;
					f.src = (M = (yield* H_1.monkeyize())).mind;
					yield* rt.sv(f, "current").ForceContractDisease((yield* new_(T("/datum/disease/transformation/jungle_fever"))));
				} else if (rt.istype(M, T("/mob/living/carbon/monkey"))) {
					yield* rt.sv(f, "current").ForceContractDisease((yield* new_(T("/datum/disease/transformation/jungle_fever"))));
				}
			}
		} else if (item === "human") {
			if (check_rights(TR_KEEPVIRUS, 0)) {
				H_1 = rt.sv(f, "current");
				if (rt.istype((M = rt.sv(f, "current")), T("/mob/living/carbon/monkey"))) {
					D = null;
					for (D of each(M.viruses, T("/datum/disease"))) {
						if (rt.istype(D, T("/datum/disease/transformation/jungle_fever"))) {
							yield* D.cure(0);
							yield* sleep(0);
						}
					}
					log_admin(`${key_name(f.usr)} attempting to humanize ${key_name(rt.sv(f, "current"))}`);
					message_admins(`<span class='notice'>${key_name_admin(f.usr)} attempting to humanize ${key_name_admin(rt.sv(f, "current"))}</span>`);
					if (H_1 = (yield* M.humanize(343))) {
						f.src = H_1.mind;
					}
				}
			}
		}
	} else if (rt.at(href_list, "silicon")) {
		const item = rt.at(href_list, "silicon");
		if (item === "unemag") {
			if (rt.istype((R = rt.sv(f, "current")), T("/mob/living/silicon/robot"))) {
				yield* R.SetEmagged(0);
				message_admins(`${key_name_admin(f.usr)} has unemag'ed ${R}.`);
				log_admin(`${key_name(f.usr)} has unemag'ed ${R}.`);
			}
		} else if (item === "unemagcyborgs") {
			if (rt.istype(rt.sv(f, "current"), T("/mob/living/silicon/ai"))) {
				ai = rt.sv(f, "current");
				for (R_1 of each(ai.connected_robots, T("/mob/living/silicon/robot"))) {
					yield* R_1.SetEmagged(0);
				}
				message_admins(`${key_name_admin(f.usr)} has unemag'ed ${ai}'s Cyborgs.`);
				log_admin(`${key_name(f.usr)} has unemag'ed ${ai}'s Cyborgs.`);
			}
		}
	} else if (rt.at(href_list, "common")) {
		const item = rt.at(href_list, "common");
		if (item === "undress") {
			for (W of each(rt.sv(f, "current"), T("/obj/item"))) {
				yield* rt.sv(f, "current").dropItemToGround(W, 1);
			}
		} else if (item === "takeuplink") {
			yield* g.srcCall(f, "take_uplink");
			rt.setSv(f, "memory", null);
			log_admin(`${key_name(f.usr)} removed ${rt.sv(f, "current")}'s uplink.`);
		} else if (item === "crystals") {
			if (check_rights(8, 0)) {
				if (U = (yield* g.srcCall(f, "find_syndicate_uplink"))) {
					if ((crystals = (yield* g.op(f, "Prompt", [33], [null, U.telecrystals, "Syndicate uplink", `Amount of telecrystals for ${rt.sv(f, "key")}`, null]))) !== null) {
						U.telecrystals = crystals;
						message_admins(`${key_name_admin(f.usr)} changed ${rt.sv(f, "current")}'s telecrystal count to ${crystals}.`);
						log_admin(`${key_name(f.usr)} changed ${rt.sv(f, "current")}'s telecrystal count to ${crystals}.`);
					}
				}
			}
		} else if (item === "uplink") {
			if (!(yield* g.srcCall(f, "equip_traitor"))) {
				to_chat(f.usr, "<span class='danger'>Equipping a syndicate failed!</span>");
				log_admin(`${key_name(f.usr)} tried and failed to give ${rt.sv(f, "current")} an uplink.`);
			} else {
				log_admin(`${key_name(f.usr)} gave ${rt.sv(f, "current")} an uplink.`);
			}
		}
	} else if (rt.at(href_list, "obj_announce")) {
		yield* g.srcCall(f, "announce_objectives");
	}
	yield* g.srcCall(f, "edit_memory");
	return f.dot;
}, true);

// mind.dm:1424
rt.def("/datum/mind/proc/announce_objectives", function announce_objectives(f: Frame) {
	let objective: Value = null, O: Value = null;
	let obj_count: Value = 1;
	to_chat(this.current, "<span class='notice'>Your current objectives:</span>");
	for (objective of each(this.objectives)) {
		O = objective;
		to_chat(this.current, `<B>Objective #${obj_count}</B>: ${O.explanation_text}`);
		obj_count++;
	}
	return f.dot;
});

// mind.dm:1431
rt.def("/datum/mind/proc/find_syndicate_uplink", function find_syndicate_uplink(f: Frame) {
	let I: Value = null;
	let L: Value = this.current.GetAllContents();
	for (I of each(L, T("/obj/item"))) {
		if (I.hidden_uplink) {
			return I.hidden_uplink;
		}
	}
	return null;
});

// mind.dm:1438
rt.def("/datum/mind/proc/take_uplink", function* take_uplink(f: Frame) {
	let H: Value = null;
	if (!(H = (yield* this.find_syndicate_uplink()))) return f.dot;
	yield* qdel(H);
	return f.dot;
}, true);

// mind.dm:1443
rt.def("/datum/mind/proc/make_Traitor", function* make_Traitor(f: Frame) {
	let traitordatum: Value = null;
	if (yield* this.has_antag_datum(T("/datum/antagonist/traitor"))) return f.dot;
	return (traitordatum = (yield* this.add_antag_datum(T("/datum/antagonist/traitor"))));
}, true);

// mind.dm:1449
rt.def("/datum/mind/proc/make_Nuke", function* make_Nuke(f: Frame, spawnloc: Value, nuke_code: Value, leader: Value, telecrystals: Value) {
	let H: Value = null, nuke: Value = null;
	leader ??= 0;
	telecrystals ??= 1;
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.syndicates)) return f.dot;
	GLOB.SSticker.mode.syndicates += f.src;
	GLOB.SSticker.mode.update_synd_icons_added(f.src);
	this.special_role = "Syndicate";
	GLOB.SSticker.mode.forge_syndicate_objectives(f.src);
	GLOB.SSticker.mode.greet_syndicate(f.src);
	(rt.modField(f, this.current, "faction", "syndicate", rt.bitOr));
	if (spawnloc) {
		this.current.loc = spawnloc;
	}
	if (rt.istype(this.current, T("/mob/living/carbon/human"))) {
		yield* qdel((H = this.current).belt);
		yield* qdel(H.back);
		yield* qdel(H.ears);
		yield* qdel(H.gloves);
		yield* qdel(H.head);
		yield* qdel(H.shoes);
		yield* qdel(H.wear_id);
		yield* qdel(H.wear_suit);
		yield* qdel(H.w_uniform);
		yield* GLOB.SSticker.mode.equip_syndicate(this.current, telecrystals);
	}
	if (nuke_code) {
		yield* this.store_memory(`<B>Syndicate Nuclear Bomb Code</B>: ${nuke_code}`, 0, 0);
		to_chat(this.current, `The nuclear authorization code is: <B>${nuke_code}</B>`);
	} else if (nuke = rt.locateIn(f, "syndienuke", GLOB.nuke_list)) {
		yield* this.store_memory(`<B>Syndicate Nuclear Bomb Code</B>: ${nuke.r_code}`, 0, 0);
		to_chat(this.current, "The nuclear authorization code is: <B>nuke.r_code</B>");
	} else {
		to_chat(this.current, "You were not provided with a nuclear code. Trying asking your team leader or contacting syndicate command.</B>");
	}
	if (leader) {
		yield* GLOB.SSticker.mode.prepare_syndicate_leader(f.src, nuke_code);
	} else {
		this.current.real_name = `${syndicate_name()} Operative #${rt.len(f, GLOB.SSticker.mode.syndicates) - 1}`;
	}
	return f.dot;
}, true);

// mind.dm:1491
rt.def("/datum/mind/proc/make_Changling", function* make_Changling(f: Frame) {
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.changelings)) return f.dot;
	GLOB.SSticker.mode.changelings += f.src;
	yield* this.current.make_changeling();
	this.special_role = "Changeling";
	yield* GLOB.SSticker.mode.forge_changeling_objectives(f.src);
	yield* GLOB.SSticker.mode.greet_changeling(f.src);
	GLOB.SSticker.mode.update_changeling_icons_added(f.src);
	return f.dot;
}, true);

// mind.dm:1500
rt.def("/datum/mind/proc/make_Wizard", function* make_Wizard(f: Frame) {
	if (rt.isIn(f, f.src, GLOB.SSticker.mode.wizards)) return f.dot;
	GLOB.SSticker.mode.wizards += f.src;
	this.special_role = "Wizard";
	this.assigned_role = "Wizard";
	if (!rt.len(f, GLOB.wizardstart)) {
		yield* GLOB.SSjob.SendToLateJoin(this.current);
		to_chat(this.current, "HOT INSERTION, GO GO GO");
	} else {
		this.current.loc = pick(GLOB.wizardstart);
	}
	yield* GLOB.SSticker.mode.equip_wizard(this.current);
	GLOB.SSticker.mode.name_wizard(this.current);
	yield* GLOB.SSticker.mode.forge_wizard_objectives(f.src);
	GLOB.SSticker.mode.greet_wizard(f.src);
	return f.dot;
}, true);

// mind.dm:1517
rt.def("/datum/mind/proc/make_Cultist", function* make_Cultist(f: Frame) {
	let C: Value = null;
	if (!rt.isIn(f, f.src, GLOB.SSticker.mode.cult)) {
		yield* GLOB.SSticker.mode.add_cultist(f.src, 0);
		this.special_role = "Cultist";
		to_chat(this.current, "<font color=\"purple\"><b><i>You catch a glimpse of the Realm of Nar-Sie, The Geometer of Blood. You now see how flimsy your world is, you see that it should be open to the knowledge of Nar-Sie.</b></i></font>");
		to_chat(this.current, "<font color=\"purple\"><b><i>Assist your new bretheren in their dark dealings. Their goal is yours, and yours is theirs. You serve the Dark One above all else. Bring It back.</b></i></font>");
		C.cult_memorization(f.src);
	}
	let H: Value = this.current;
	if (yield* GLOB.SSticker.mode.equip_cultist(this.current)) return f.dot;
	to_chat(H, "Spawning an amulet from your Master failed.");
	return f.dot;
}, true);

// mind.dm:1529
rt.def("/datum/mind/proc/make_Rev", function* make_Rev(f: Frame) {
	let valid_head: Value = null, O: Value = null, rev_obj: Value = null, flash: Value = null;
	if (rt.len(f, GLOB.SSticker.mode.head_revolutionaries) > 0) {
		if (valid_head = rt.locateIn(f, T("/datum/mind"), GLOB.SSticker.mode.head_revolutionaries)) {
			for (O of each(valid_head.objectives, T("/datum/objective/mutiny"))) {
				(rev_obj = (yield* new_(T("/datum/objective/mutiny")))).owner = f.src;
				rev_obj.target = O.target;
				rev_obj.explanation_text = `Assassinate ${O.target.current.real_name}, the ${O.target.assigned_role}.`;
				rt.modSrcVar(f, "objectives", rev_obj, add);
			}
			GLOB.SSticker.mode.greet_revolutionary(f.src, 0);
		}
	}
	GLOB.SSticker.mode.head_revolutionaries += f.src;
	GLOB.SSticker.mode.update_rev_icons_added(f.src);
	this.special_role = "Head Revolutionary";
	GLOB.SSticker.mode.forge_revolutionary_objectives(f.src);
	GLOB.SSticker.mode.greet_revolutionary(f.src, 0);
	let L: Value = this.current.get_contents();
	yield* qdel((flash = rt.locateIn(f, T("/obj/item/device/assembly/flash"), L)));
	yield* this.take_uplink();
	let fail: Value = 0;
	(fail = rt.modify(fail, (!(yield* GLOB.SSticker.mode.equip_revolutionary(this.current)) ? 1 : 0), rt.bitOr));
	return f.dot;
}, true);

// mind.dm:1556
rt.def("/datum/mind/proc/make_Gang", function* make_Gang(f: Frame, G: Value) {
	this.special_role = `${G.name} Gang Boss`;
	G.bosses += f.src;
	this.gang_datum = G;
	G.add_gang_hud(f.src);
	GLOB.SSticker.mode.forge_gang_objectives(f.src);
	GLOB.SSticker.mode.greet_gang(f.src);
	yield* GLOB.SSticker.mode.equip_gang(this.current, G);
	return f.dot;
}, true);

// mind.dm:1565
rt.def("/datum/mind/proc/make_Abductor", function* make_Abductor(f: Frame) {
	let O: Value = null, H: Value = null, A: Value = null, L: Value = null;
	let $e: any;
	let role: Value = (yield* alert("Abductor Role ?", "Role", "Agent", "Scientist"));
	let team: Value = (yield* g.op(f, "Prompt", [0], [null, null, "Team ?", "Abductor Team ?", list(1, 2, 3, 4)]));
	let teleport: Value = (yield* alert("Teleport to ship ?", "Teleport", "Yes", "No"));
	if (!role || !team || !teleport) {
		return f.dot;
	}
	if (!rt.istype(this.current, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	(rt.modField(f, GLOB.SSticker.mode, "abductors", f.src, rt.bitOr));
	(O = (yield* new_(T("/datum/objective/experiment")))).owner = f.src;
	rt.modSrcVar(f, "objectives", O, add);
	yield* (H = this.current).set_species(T("/datum/species/abductor"));
	let S: Value = H.dna.species;
	if (role == "Scientist") {
		S.scientist = 1;
	}
	S.team = team;
	let agent_landmarks: Value = (yield* new_(T("/list")));
	let scientist_landmarks: Value = (yield* new_(T("/list")));
	agent_landmarks.len = 4;
	scientist_landmarks.len = 4;
	for (A of each(GLOB.landmarks_list, T("/obj/effect/landmark/abductor"))) {
		if (rt.istype(A, T("/obj/effect/landmark/abductor/agent"))) {
			rt.setAt(agent_landmarks, text2num(A.team), A);
		} else if (rt.istype(A, T("/obj/effect/landmark/abductor/scientist"))) {
			rt.setAt(scientist_landmarks, text2num(A.team), A);
		}
	}
	if (teleport != "Yes") return f.dot;
	if (role === "Agent") {
		L = rt.index(agent_landmarks, team);
	} else if (role === "Scientist") {
		L = rt.index(scientist_landmarks, team);
	}
	yield* H.forceMove(L.loc);
	return f.dot;
}, true);

// mind.dm:1610
rt.def("/datum/mind/proc/AddSpell", function* AddSpell(f: Frame, S: Value) {
	rt.modSrcVar(f, "spell_list", S, add);
	yield* S.action.Grant(this.current);
	return f.dot;
}, true);

// mind.dm:1614
rt.def("/datum/mind/proc/owns_soul", function owns_soul(f: Frame) {
	return (this.soulOwner == f.src ? 1 : 0);
});

// mind.dm:1618
rt.def("/datum/mind/proc/RemoveSpell", function* RemoveSpell(f: Frame, spell: Value) {
	let X: Value = null, S: Value = null;
	if (!spell) {
		return f.dot;
	}
	for (X of each(this.spell_list)) {
		if (rt.op(f, "IsType", [], [(S = X), spell])) {
			(rt.modSrcVar(f, "spell_list", S, subtract));
			yield* qdel(S);
		}
	}
	return f.dot;
}, true);

// mind.dm:1627
rt.def("/datum/mind/proc/transfer_actions", function* transfer_actions(f: Frame, new_character: Value) {
	let A: Value = null;
	if (this.current && this.current.actions) {
		for (A of each(this.current.actions, T("/datum/action"))) {
			yield* A.Grant(new_character);
		}
	}
	yield* this.transfer_mindbound_actions(new_character);
	return f.dot;
}, true);

// mind.dm:1633
rt.def("/datum/mind/proc/transfer_mindbound_actions", function* transfer_mindbound_actions(f: Frame, new_character: Value) {
	let X: Value = null, S: Value = null;
	for (X of each(this.spell_list)) {
		yield* (S = X).action.Grant(new_character);
	}
	return f.dot;
}, true);

// mind.dm:1638
rt.def("/datum/mind/proc/disrupt_spells", function* disrupt_spells(f: Frame, delay: Value, exceptions: Value) {
	let X: Value = null, S: Value = null, type: Value = null;
	exceptions ??= (yield* this.New());
	for (X of each(this.spell_list)) {
		S = X;
		type = null;
		for (type of each(exceptions)) {
			if (rt.op(f, "IsType", [], [S, type])) {
				continue;
			}
		}
		S.charge_counter = delay;
		yield* S.updateButtonIcon();
		yield* ImmediateInvokeAsync(S, P("/obj/effect/proc_holder/spell/proc/start_recharge"));
	}
	return f.dot;
}, true);

// mind.dm:1648
rt.def("/datum/mind/proc/get_ghost", function get_ghost(f: Frame, even_if_they_cant_reenter: Value) {
	let G: Value = null;
	for (G of each(GLOB.dead_mob_list, T("/mob/dead/observer"))) {
		if (G.mind == f.src) {
			if (G.can_reenter_corpse || even_if_they_cant_reenter) {
				return G;
			}
			break;
		}
	}
	return f.dot;
});

// mind.dm:1655
rt.def("/datum/mind/proc/grab_ghost", function* grab_ghost(f: Frame, force: Value) {
	let G: Value = null;
	f.dot = (G = (yield* this.get_ghost({ even_if_they_cant_reenter: force })));
	if (!G) return f.dot;
	yield* G.reenter_corpse();
	return f.dot;
}, true);

// mind.dm:1661
rt.def("/mob/proc/sync_mind", function sync_mind(f: Frame) {
	this.mind_initialize();
	this.mind.active = 1;
	return f.dot;
});

// mind.dm:1673
rt.def("/mob/proc/mind_initialize", function mind_initialize(f: Frame) {
	if (this.mind) {
		this.mind.key = this.key;
	} else {
		this.mind = new_(T("/datum/mind"), this.key);
		if (GLOB.SSticker) {
			GLOB.SSticker.minds += this.mind;
		} else {
			stack_trace("mind_initialize(): No SSticker ready");
		}
	}
	if (!this.mind.name) {
		this.mind.name = this.real_name;
	}
	this.mind.current = f.src;
	return f.dot;
});

// mind.dm:1686
rt.def("/mob/living/carbon/proc/mind_initialize", function mind_initialize(f: Frame) {
	parent_proc();
	this.last_mind = rt.sv(f, "mind");
	return f.dot;
});

// mind.dm:1691
rt.def("/mob/living/carbon/human/proc/mind_initialize", function mind_initialize(f: Frame) {
	parent_proc();
	if (this.mind.assigned_role) return f.dot;
	this.mind.assigned_role = "Assistant";
	return f.dot;
});

// mind.dm:1697
rt.def("/mob/living/carbon/alien/proc/mind_initialize", function mind_initialize(f: Frame) {
	parent_proc();
	this.mind.special_role = "Alien";
	return f.dot;
});

// mind.dm:1702
rt.def("/mob/living/silicon/ai/proc/mind_initialize", function mind_initialize(f: Frame) {
	parent_proc();
	this.mind.assigned_role = "AI";
	return f.dot;
});

// mind.dm:1707
rt.def("/mob/living/silicon/robot/proc/mind_initialize", function mind_initialize(f: Frame) {
	parent_proc();
	this.mind.assigned_role = "Cyborg";
	return f.dot;
});

// mind.dm:1712
rt.def("/mob/living/silicon/pai/proc/mind_initialize", function mind_initialize(f: Frame) {
	parent_proc();
	this.mind.assigned_role = "pAI";
	this.mind.special_role = "";
	return f.dot;
});
