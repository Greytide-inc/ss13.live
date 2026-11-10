// Based on /tg/station's code/modules/admin/verbs/randomverbs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, truthy, fmt } = rt;


// randomverbs.dm:4
rt.def("/client/proc/cmd_admin_drop_everything", function* cmd_admin_drop_everything(f: Frame, M: Value) {
	let confirm: Value = null, W: Value = null, msg: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if ((confirm = (yield* alert(this, `Make ${M} drop everything?`, "Message", "Yes", "No"))) != "Yes") {
		return f.dot;
	}
	for (W of each(M, T("/obj/item"))) {
		if (!(yield* M.dropItemToGround(W))) {
			yield* qdel(W);
			yield* M.regenerate_icons();
		}
	}
	log_admin(`${key_name(f.usr)} made ${key_name(M)} drop everything!`);
	message_admins((msg = `${key_name_admin(f.usr)} made ${key_name_admin(M)} drop everything!`));
	admin_ticket_log(M, msg);
	return f.dot;
}, true, { verb: { name: "Drop Everything", category: "" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// randomverbs.dm:27
rt.def("/client/proc/cmd_admin_subtle_message", function* cmd_admin_subtle_message(f: Frame, M: Value) {
	let msg: Value = null;
	if (!ismob(M)) {
		return f.dot;
	}
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	message_admins(`${key_name_admin(this)} has started answering ${key_name(M.key, 0, 0)}'s prayer.`);
	if (!(msg = (yield* g.op(f, "Prompt", [2], [null, null, `Subtle PM to ${M.key}`, "Message:", null])))) {
		message_admins(`${key_name_admin(this)} decided not to answer ${key_name(M.key, 0, 0)}'s prayer`);
		return f.dot;
	}
	if (f.usr) {
		if (f.usr.client) {
			if (f.usr.client.holder) {
				to_chat(M, `<i>You hear a voice in your head... <b>${msg}</i></b>`);
			}
		}
	}
	log_admin(`SubtlePM: ${key_name(f.usr)} -> ${key_name(M)} : ${msg}`);
	message_admins((msg = `<span class='adminnotice'><b> SubtleMessage: ${key_name_admin(f.usr)} -> ${key_name_admin(M)} :</b> ${msg}</span>`));
	admin_ticket_log(M, msg);
	return f.dot;
}, true, { verb: { name: "Subtle Message", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// randomverbs.dm:54
rt.def("/client/proc/cmd_admin_world_narrate", function* cmd_admin_world_narrate(f: Frame) {
	let msg: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!(msg = (yield* g.op(f, "Prompt", [2], [null, null, "Enter the text you wish to appear to everyone:", "Message:", null])))) {
		return f.dot;
	}
	to_chat(rt.world(), `${msg}`);
	log_admin(`GlobalNarrate: ${key_name(f.usr)} : ${msg}`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} Sent a global narrate</span>`);
	return f.dot;
}, true, { verb: { name: "Global Narrate", category: "Special Verbs" } });

// randomverbs.dm:71
rt.def("/client/proc/cmd_admin_direct_narrate", function* cmd_admin_direct_narrate(f: Frame, M: Value) {
	let msg: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!M) {
		M = (yield* g.op(f, "Prompt", [1], [null, null, "Active Players", "Direct narrate to whom?", GLOB.player_list]));
	}
	if (!M) {
		return f.dot;
	}
	if (!(msg = (yield* g.op(f, "Prompt", [2], [null, null, "Enter the text you wish to appear to your target:", "Message:", null])))) {
		return f.dot;
	}
	to_chat(M, msg);
	log_admin(`DirectNarrate: ${key_name(f.usr)} to (${M.name}/${M.key}): ${msg}`);
	message_admins((msg = `<span class='adminnotice'><b> DirectNarrate: ${key_name(f.usr)} to (${M.name}/${M.key}):</b> ${msg}<BR></span>`));
	admin_ticket_log(M, msg);
	return f.dot;
}, true, { verb: { name: "Direct Narrate", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob" }] });

// randomverbs.dm:97
rt.def("/client/proc/cmd_admin_local_narrate", function* cmd_admin_local_narrate(f: Frame, A: Value) {
	let range: Value = null, msg: Value = null, M: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!A) {
		return f.dot;
	}
	if (!(range = (yield* g.op(f, "Prompt", [32], [null, 7, "Narrate to mobs within how many tiles:", "Range:", null])))) {
		return f.dot;
	}
	if (!(msg = (yield* g.op(f, "Prompt", [2], [null, null, "Enter the text you wish to appear to everyone within view:", "Message:", null])))) {
		return f.dot;
	}
	for (M of each(view(range, A), T("/mob"))) {
		to_chat(M, msg);
	}
	log_admin(`LocalNarrate: ${key_name(f.usr)} at ${get_area(A)}${`(${A.x},${A.y},${A.z})`}: ${msg}`);
	message_admins(`<span class='adminnotice'><b> LocalNarrate: ${key_name_admin(f.usr)} at ${get_area(A)}${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${A.x};Y=${A.y};Z=${A.z}'>JMP</a>)`}:</b> ${msg}<BR></span>`);
	return f.dot;
}, true, { verb: { name: "Local Narrate", category: "Special Verbs" }, argTypes: [{ path: "/atom" }] });

// randomverbs.dm:118
rt.def("/client/proc/cmd_admin_godmode", function cmd_admin_godmode(f: Frame, M: Value) {
	let msg: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	(rt.modField(f, M, "status_flags", 4096, rt.bitXor));
	let $0: any = f.usr;
	to_chat($0, `<span class='adminnotice'>Toggled ${rt.bitAnd(M.status_flags, 4096) ? "ON" : "OFF"}</span>`);
	log_admin(`${key_name(f.usr)} has toggled ${key_name(M)}'s nodamage to ${rt.bitAnd(M.status_flags, 4096) ? "On" : "Off"}`);
	message_admins((msg = `${key_name_admin(f.usr)} has toggled ${key_name_admin(M)}'s nodamage to ${rt.bitAnd(M.status_flags, 4096) ? "On" : "Off"}`));
	admin_ticket_log(M, msg);
	return f.dot;
}, false, { verb: { name: "Godmode", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// randomverbs.dm:132
rt.def("/proc/cmd_admin_mute", function cmd_admin_mute(f: Frame, whom: Value, mute_type: Value, automute: Value) {
	let muteunmute: Value = null, mute_string: Value = null, C: Value = null, _P: Value = null;
	automute ??= 0;
	if (!whom) {
		return f.dot;
	}
	if (mute_type === 1) {
		mute_string = "IC (say and emote)";
	} else if (mute_type === 2) {
		mute_string = "OOC";
	} else if (mute_type === 4) {
		mute_string = "pray";
	} else if (mute_type === 8) {
		mute_string = "adminhelp, admin PM and ASAY";
	} else if (mute_type === 16) {
		mute_string = "deadchat and DSAY";
	} else if (mute_type === 31) {
		mute_string = "everything";
	} else {
		return f.dot;
	}
	if (rt.istype(whom, T("/client"))) {
		C = whom;
	} else if (istext(whom)) {
		C = rt.index(GLOB.directory, whom);
	} else {
		return f.dot;
	}
	if (C) {
		_P = C.prefs;
	} else {
		_P = rt.index(GLOB.preferences_datums, whom);
	}
	if (!_P) {
		return f.dot;
	}
	if (automute) {
		if (!GLOB.config.automute_on) {
			return f.dot;
		}
	} else if (!check_rights()) {
		return f.dot;
	}
	if (automute) {
		muteunmute = "auto-muted";
		(rt.modField(f, _P, "muted", mute_type, rt.bitOr));
		log_admin(`SPAM AUTOMUTE: ${muteunmute} ${key_name(whom)} from ${mute_string}`);
		message_admins(`SPAM AUTOMUTE: ${muteunmute} ${key_name_admin(whom)} from ${mute_string}.`);
		if (C) {
			to_chat(C, `You have been ${muteunmute} from ${mute_string} by the SPAM AUTOMUTE system. Contact an admin.`);
		}
		return f.dot;
	}
	if (rt.bitAnd(_P.muted, mute_type)) {
		muteunmute = "unmuted";
		(rt.modField(f, _P, "muted", rt.op(f, "BitNot", [], [mute_type]), rt.bitAnd));
	} else {
		muteunmute = "muted";
		(rt.modField(f, _P, "muted", mute_type, rt.bitOr));
	}
	log_admin(`${key_name(f.usr)} has ${muteunmute} ${key_name(whom)} from ${mute_string}`);
	message_admins(`${key_name_admin(f.usr)} has ${muteunmute} ${key_name_admin(whom)} from ${mute_string}.`);
	if (C) {
		to_chat(C, `You have been ${muteunmute} from ${mute_string} by ${key_name(f.usr, { include_name: 0 })}.`);
	}
	return f.dot;
});

// randomverbs.dm:209
rt.def("/proc/create_xeno", function* create_xeno(f: Frame, ckey: Value) {
	let candidates: Value = null, M: Value = null, new_xeno: Value = null, msg: Value = null;
	let $e: any;
	if (!ckey) {
		candidates = list();
		for (M of each(GLOB.player_list, T("/mob"))) {
			if (M.stat != 2) {
				continue;
			}
			if (!rt.isIn(f, "xenomorph", M.client.prefs.be_special)) {
				continue;
			}
			if (M.client.is_afk()) {
				continue;
			}
			if (M.mind && M.mind.current && M.mind.current.stat != 2) {
				continue;
			}
			candidates += M.ckey;
		}
		if (rt.len(f, candidates)) {
			ckey = (yield* g.op(f, "Prompt", [1], [null, null, "Suitable Candidates", "Pick the player you want to respawn as a xeno.", candidates]));
		} else {
			to_chat(f.usr, "<font color='red'>Error: create_xeno(): no suitable candidates.</font>");
		}
	}
	if (!istext(ckey)) {
		return 0;
	}
	let alien_caste: Value = (yield* g.op(f, "Prompt", [1], [null, "Pick a caste", "Please choose which caste to spawn.", f.usr, list("Queen", "Praetorian", "Hunter", "Sentinel", "Drone", "Larva")]));
	let spawn_here: Value = rt.len(f, GLOB.xeno_spawn) ? pick(GLOB.xeno_spawn) : null;
	if (alien_caste === "Queen") {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/royal/queen"), spawn_here));
	} else if (alien_caste === "Praetorian") {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/royal/praetorian"), spawn_here));
	} else if (alien_caste === "Hunter") {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/hunter"), spawn_here));
	} else if (alien_caste === "Sentinel") {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/sentinel"), spawn_here));
	} else if (alien_caste === "Drone") {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/drone"), spawn_here));
	} else if (alien_caste === "Larva") {
		new_xeno = (yield* new_(T("/mob/living/carbon/alien/larva"), spawn_here));
	} else {
		return 0;
	}
	if (!spawn_here) {
		yield* GLOB.SSjob.SendToLateJoin(new_xeno, 0);
	}
	new_xeno.ckey = ckey;
	message_admins((msg = `<span class='notice'>${key_name_admin(f.usr)} has spawned ${ckey} as a filthy xeno ${alien_caste}.</span>`));
	admin_ticket_log(new_xeno, msg);
	return 1;
}, true);

// randomverbs.dm:264
rt.def("/client/proc/respawn_character", function* respawn_character(f: Frame) {
	let input: Value = null, G_found: Value = null, G: Value = null, _T: Value = null, new_xeno: Value = null, msg: Value = null, new_monkey: Value = null, msg_3: Value = null, record_found: Value = null, id: Value = null, A: Value = null, traitordatum: Value = null, synd_spawn: Value = null, ninja_spawn: Value = null, L: Value = null, ninjadatum: Value = null, ninja_spawn_here: Value = null, msg_7: Value = null;
	let $e: any;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!(input = ckey((yield* g.op(f, "Prompt", [2], ["", "Key", "Please specify which key will be respawned.", this, null]))))) {
		return f.dot;
	}
	for (G of each(GLOB.player_list, T("/mob/dead/observer"))) {
		if (G.ckey == input) {
			G_found = G;
			break;
		}
	}
	if (!G_found) {
		to_chat(f.usr, "<font color='red'>There is no active key like that in the game or the person is not currently a ghost.</font>");
		return f.dot;
	}
	if (G_found.mind && !G_found.mind.active) {
		if (G_found.mind.assigned_role == "Alien") {
			if ((yield* alert("This character appears to have been an alien. Would you like to respawn them as such?", null, "Yes", "No")) == "Yes") {
				if (rt.len(f, GLOB.xeno_spawn)) {
					_T = pick(GLOB.xeno_spawn);
				}
				if (G_found.mind.special_role === "Hunter") {
					new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/hunter"), _T));
				} else if (G_found.mind.special_role === "Sentinel") {
					new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/sentinel"), _T));
				} else if (G_found.mind.special_role === "Drone") {
					new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/drone"), _T));
				} else if (G_found.mind.special_role === "Praetorian") {
					new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/royal/praetorian"), _T));
				} else if (G_found.mind.special_role === "Queen") {
					new_xeno = (yield* new_(T("/mob/living/carbon/alien/humanoid/royal/queen"), _T));
				} else {
					yield* create_xeno(G_found.ckey);
					return f.dot;
				}
				if (!_T) {
					yield* GLOB.SSjob.SendToLateJoin(new_xeno, 0);
				}
				yield* G_found.mind.transfer_to(new_xeno);
				new_xeno.key = G_found.key;
				to_chat(new_xeno, "You have been fully respawned. Enjoy the game.");
				message_admins((msg = `<span class='adminnotice'>${key_name_admin(f.usr)} has respawned ${new_xeno.key} as a filthy xeno.</span>`));
				admin_ticket_log(new_xeno, msg);
				return f.dot;
			}
		} else if (findtext(G_found.real_name, "monkey")) {
			if ((yield* alert("This character appears to have been a monkey. Would you like to respawn them as such?", null, "Yes", "No")) == "Yes") {
				new_monkey = (yield* new_(T("/mob/living/carbon/monkey")));
				yield* GLOB.SSjob.SendToLateJoin(new_monkey);
				yield* G_found.mind.transfer_to(new_monkey);
				new_monkey.key = G_found.key;
				to_chat(new_monkey, "You have been fully respawned. Enjoy the game.");
				message_admins((msg_3 = `<span class='adminnotice'>${key_name_admin(f.usr)} has respawned ${new_monkey.key} as a filthy xeno.</span>`));
				admin_ticket_log(new_monkey, msg_3);
				return f.dot;
			}
		}
	}
	let new_character: Value = (yield* new_(T("/mob/living/carbon/human")));
	yield* GLOB.SSjob.SendToLateJoin(new_character);
	if (G_found.mind && !G_found.mind.active) {
		id = md5(`${G_found.real_name}${G_found.mind.assigned_role}`);
		record_found = find_record("id", id, GLOB.data_core.locked);
	}
	if (record_found) {
		new_character.real_name = rt.index(record_found.fields, "name");
		new_character.gender = rt.index(record_found.fields, "sex");
		new_character.age = rt.index(record_found.fields, "age");
		yield* new_character.hardset_dna(rt.index(record_found.fields, "identity"), rt.index(record_found.fields, "enzymes"), rt.index(record_found.fields, "name"), rt.index(record_found.fields, "blood_type"), rt.index(record_found.fields, "species"), rt.index(record_found.fields, "features"));
	} else {
		yield* (A = (yield* new_(T("/datum/preferences")))).copy_to(new_character);
		A.real_name = G_found.real_name;
		yield* new_character.dna.update_dna_identity();
	}
	new_character.name = new_character.real_name;
	if (G_found.mind && !G_found.mind.active) {
		yield* G_found.mind.transfer_to(new_character);
	} else {
		new_character.mind_initialize();
	}
	if (!new_character.mind.assigned_role) {
		new_character.mind.assigned_role = "Assistant";
	}
	new_character.key = G_found.key;
	let admin: Value = key_name_admin(this);
	let player_key: Value = G_found.key;
	if (traitordatum = new_character.mind.has_antag_datum(T("/datum/antagonist/traitor"))) {
		yield* GLOB.SSjob.EquipRank(new_character, new_character.mind.assigned_role, 1);
		yield* traitordatum.equip();
	}
	if (new_character.mind.special_role === "Wizard") {
		new_character.loc = pick(GLOB.wizardstart);
		yield* GLOB.SSticker.mode.equip_wizard(new_character);
	} else if (new_character.mind.special_role === "Syndicate") {
		if (synd_spawn = rt.locateIn(f, "landmark*Syndicate-Spawn", rt.world())) {
			new_character.loc = rt.getStep(f, synd_spawn, 0);
		}
		yield* g.callDyn(f, P("/datum/game_mode/proc/equip_syndicate"), undefined, [new_character]);
	} else if (new_character.mind.special_role === "Space Ninja") {
		ninja_spawn = list();
		for (L of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
			if (L.name == "carpspawn") {
				ninja_spawn += L;
			}
		}
		yield* (ninjadatum = new_character.mind.has_antag_datum(T("/datum/antagonist/ninja"))).equip_space_ninja();
		if (rt.len(f, ninja_spawn)) {
			ninja_spawn_here = pick(ninja_spawn);
			new_character.loc = ninja_spawn_here.loc;
		}
	} else if (new_character.mind.assigned_role === "Cyborg") {
		new_character = (yield* new_character.Robotize());
	} else if (new_character.mind.assigned_role === "AI") {
		new_character = (yield* new_character.AIize());
	} else {
		yield* GLOB.SSjob.EquipRank(new_character, new_character.mind.assigned_role, 1);
	}
	if (!rt.istype(new_character, T("/mob/living/silicon"))) {
		if (!record_found && new_character.mind.assigned_role != new_character.mind.special_role) {
			if ((yield* alert(new_character, "Warning: No data core entry detected. Would you like to announce the arrival of this character by adding them to various databases, such as medical records?", null, "No", "Yes")) == "Yes") {
				yield* GLOB.data_core.manifest_inject(new_character);
			}
			if ((yield* alert(new_character, "Would you like an active AI to announce this character?", null, "No", "Yes")) == "Yes") {
				yield* AnnounceArrival(new_character, new_character.mind.assigned_role);
			}
		}
	}
	message_admins((msg_7 = `<span class='adminnotice'>${admin} has respawned ${player_key} as ${new_character.real_name}.</span>`));
	admin_ticket_log(new_character, msg_7);
	to_chat(new_character, "You have been fully respawned. Enjoy the game.");
	return new_character;
}, true, { verb: { name: "Respawn Character", category: "Special Verbs", desc: "Respawn a person that has been gibbed/dusted/killed. They must be a ghost for this to work and preferably should not have a body to go back into." } });

// randomverbs.dm:434
rt.def("/client/proc/cmd_admin_add_freeform_ai_law", function* cmd_admin_add_freeform_ai_law(f: Frame) {
	let input: Value = null, ion: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!(input = (yield* g.op(f, "Prompt", [3], ["", "What?", "Please enter anything you want the AI to do. Anything. Serious.", f.usr, null])))) {
		return f.dot;
	}
	log_admin(`Admin ${key_name(f.usr)} has added a new AI law - ${input}`);
	message_admins(`Admin ${key_name_admin(f.usr)} has added a new AI law - ${input}`);
	let show_log: Value = (yield* alert(this, "Show ion message?", "Message", "Yes", "No"));
	let announce_ion_laws: Value = show_log == "Yes" ? 1 : -1;
	(ion = (yield* new_(T("/datum/round_event/ion_storm/add_law_only")))).announceEvent = announce_ion_laws;
	ion.ionMessage = input;
	return f.dot;
}, true, { verb: { name: "Add Custom AI law", category: "Fun" } });

// randomverbs.dm:456
rt.def("/client/proc/cmd_admin_rejuvenate", function* cmd_admin_rejuvenate(f: Frame, M: Value) {
	let msg: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!this.mob) {
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living"))) {
		yield* alert("Cannot revive a ghost");
		return f.dot;
	}
	yield* M.revive({ full_heal: 1, admin_revive: 1 });
	log_admin(`${key_name(f.usr)} healed / revived ${key_name(M)}`);
	message_admins((msg = `<span class='danger'>Admin ${key_name_admin(f.usr)} healed / revived ${key_name_admin(M)}!</span>`));
	admin_ticket_log(M, msg);
	return f.dot;
}, true, { verb: { name: "Rejuvenate", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob/living", source: "?" }] });

// randomverbs.dm:475
rt.def("/client/proc/cmd_admin_create_centcom_report", function* cmd_admin_create_centcom_report(f: Frame) {
	let input: Value = null;
	let $1: any;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!(input = (yield* g.op(f, "Prompt", [65], ["", "What?", "Please enter anything you want. Anything. Serious.", f.usr, null])))) {
		return f.dot;
	}
	let confirm: Value = (yield* alert(this, "Do you want to announce the contents of the report to the crew?", "Announce", "Yes", "No", "Cancel"));
	let announce_command_report: Value = 1;
	if (confirm === "Yes") {
		yield* priority_announce(input, null, rt.rsc("sound/ai/commandreport.ogg"));
		announce_command_report = 0;
	} else if (confirm === "Cancel") {
		return f.dot;
	}
	let $0: any = input;
	if (announce_command_report) {
		$1 = "Classified ";
	} else {
		$1 = "";
	}
	yield* print_command_report($0, `${$1}${command_name()} Update`, announce_command_report);
	log_admin(`${key_name(this)} has created a command report: ${input}`);
	message_admins(`${key_name_admin(this)} has created a command report`);
	return f.dot;
}, true, { verb: { name: "Create Command Report", category: "Special Verbs" } });

// randomverbs.dm:500
rt.def("/client/proc/cmd_change_command_name", function* cmd_change_command_name(f: Frame) {
	let input: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!(input = (yield* g.op(f, "Prompt", [3], ["", "What?", "Please input a new name for Central Command.", f.usr, null])))) {
		return f.dot;
	}
	change_command_name(input);
	message_admins(`${key_name_admin(this)} has changed Central Command's name to ${input}`);
	log_admin(`${key_name(this)} has changed the Central Command name to: ${input}`);
	return f.dot;
}, true, { verb: { name: "Change Command Name", category: "Special Verbs" } });

// randomverbs.dm:514
rt.def("/client/proc/cmd_admin_delete", function* cmd_admin_delete(f: Frame, A: Value) {
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	yield* this.admin_delete(A);
	return f.dot;
}, true, { verb: { name: "Delete", category: "Admin" }, argTypes: [{ type: 28, path: "/atom", source: "world" }] });

// randomverbs.dm:521
rt.def("/client/proc/admin_delete", function* admin_delete(f: Frame, D: Value) {
	let _T: Value = null;
	let A: Value = D;
	let coords: Value = rt.istype(A, T("/atom")) ? ` at (${A.x}, ${A.y}, ${A.z})` : "";
	if ((yield* alert(this, `Are you sure you want to delete:\n${D}\nat${coords}?`, "Confirmation", "Yes", "No")) != "Yes") return f.dot;
	log_admin(`${key_name(f.usr)} deleted ${D}${coords}`);
	message_admins(`${key_name_admin(f.usr)} deleted ${D}${coords}`);
	if (isturf(D)) {
		yield* (_T = D).ChangeTurf(_T.baseturf);
	} else {
		yield* qdel(D);
	}
	return f.dot;
}, true);

// randomverbs.dm:537
rt.def("/client/proc/cmd_admin_list_open_jobs", function* cmd_admin_list_open_jobs(f: Frame) {
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	yield* this.holder.manage_free_slots();
	return f.dot;
}, true, { verb: { name: "Manage Job Slots", category: "Admin" } });

// randomverbs.dm:547
rt.def("/client/proc/cmd_admin_explosion", function* cmd_admin_explosion(f: Frame, O: Value) {
	let devastation: Value = null, heavy: Value = null, light: Value = null, flash: Value = null, flames: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if ((devastation = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of total devastation. -1 to none", null]))) === null) {
		return f.dot;
	}
	if ((heavy = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of heavy impact. -1 to none", null]))) === null) {
		return f.dot;
	}
	if ((light = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of light impact. -1 to none", null]))) === null) {
		return f.dot;
	}
	if ((flash = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of flash. -1 to none", null]))) === null) {
		return f.dot;
	}
	if ((flames = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of flames. -1 to none", null]))) === null) {
		return f.dot;
	}
	if (devastation != -1 || heavy != -1 || light != -1 || flash != -1 || flames != -1) {
		if (devastation > 20 || heavy > 20 || light > 20 || flames > 20) {
			if ((yield* alert(this, "Are you sure you want to do this? It will laaag.", "Confirmation", "Yes", "No")) == "No") {
				return f.dot;
			}
		}
		yield* explosion(O, devastation, heavy, light, flash, null, null, flames);
		log_admin(`${key_name(f.usr)} created an explosion (${devastation},${heavy},${light},${flames}) at (${O.x},${O.y},${O.z})`);
		message_admins(`${key_name_admin(f.usr)} created an explosion (${devastation},${heavy},${light},${flames}) at (${O.x},${O.y},${O.z})`);
		return f.dot;
	} else {
		return f.dot;
	}
}, true, { verb: { name: "Explosion", category: "Special Verbs" }, argTypes: [{ type: 28, path: "/atom", source: "world" }] });

// randomverbs.dm:579
rt.def("/client/proc/cmd_admin_emp", function* cmd_admin_emp(f: Frame, O: Value) {
	let heavy: Value = null, light: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if ((heavy = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of heavy pulse.", null]))) === null) {
		return f.dot;
	}
	if ((light = (yield* g.op(f, "Prompt", [33], [null, null, "Input", "Range of light pulse.", null]))) === null) {
		return f.dot;
	}
	if (heavy || light) {
		yield* empulse(O, heavy, light);
		log_admin(`${key_name(f.usr)} created an EM Pulse (${heavy},${light}) at (${O.x},${O.y},${O.z})`);
		message_admins(`${key_name_admin(f.usr)} created an EM Pulse (${heavy},${light}) at (${O.x},${O.y},${O.z})`);
		return f.dot;
	} else {
		return f.dot;
	}
}, true, { verb: { name: "EM Pulse", category: "Special Verbs" }, argTypes: [{ type: 28, path: "/atom", source: "world" }] });

// randomverbs.dm:603
rt.def("/client/proc/cmd_admin_gib", function* cmd_admin_gib(f: Frame, M: Value) {
	let confirm: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if ((confirm = (yield* alert(this, "Drop a brain?", "Confirm", "Yes", "No", "Cancel"))) == "Cancel") {
		return f.dot;
	}
	if (!M) {
		return f.dot;
	}
	log_admin(`${key_name(f.usr)} has gibbed ${key_name(M)}`);
	message_admins(`${key_name_admin(f.usr)} has gibbed ${key_name_admin(M)}`);
	if (rt.istype(M, T("/mob/dead/observer"))) {
		yield* new_(T("/obj/effect/gibspawner/generic"), M.loc, M.viruses);
		return f.dot;
	}
	if (confirm == "Yes") {
		yield* M.gib();
	} else {
		yield* M.gib(1);
	}
	return f.dot;
}, true, { verb: { name: "Gib", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// randomverbs.dm:630
rt.def("/client/proc/cmd_admin_gib_self", function* cmd_admin_gib_self(f: Frame) {
	let confirm: Value = null;
	if ((confirm = (yield* alert(this, "You sure?", "Confirm", "Yes", "No"))) != "Yes") return f.dot;
	log_admin(`${key_name(f.usr)} used gibself.`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} used gibself.</span>`);
	yield* this.mob.gib(1, 1, 1);
	return f.dot;
}, true, { verb: { name: "Gibself", category: "Fun" } });

// randomverbs.dm:641
rt.def("/client/proc/cmd_admin_check_contents", function cmd_admin_check_contents(f: Frame, M: Value) {
	let t: Value = null;
	let L: Value = M.get_contents();
	for (t of each(L)) {
		to_chat(f.usr, `${t}`);
	}
	return f.dot;
}, false, { verb: { name: "Check Contents", category: "Special Verbs" }, argTypes: [{ type: 8, path: "/mob/living", source: "?" }] });

// randomverbs.dm:651
rt.def("/client/proc/toggle_view_range", function* toggle_view_range(f: Frame) {
	if (this.is_default_view()) {
		yield* this.change_view((yield* g.op(f, "Prompt", [0], [null, 7, "FUCK YE", "Select view range:", list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 128)])));
	} else {
		yield* this.change_view(this.default_view());
	}
	log_admin(`${key_name(f.usr)} changed their view range to ${this.view}.`);
	return f.dot;
}, true, { verb: { name: "Change View Range", category: "Special Verbs", desc: "switches between 1x and custom views" } });

// tg_js: Debug > Zoom In / Zoom Out / Reset Zoom. Steps the view's height through ZOOM_STEPS (15 is normal) and keeps
// the default view's shape; the map canvas scales to fit its window, so a bigger view draws smaller tiles. 257 tall
// shows a whole 255x255 station from its middle. A view is a whole, odd number of tiles wide, so its width is the first such
// that covers the default shape (19x15 -> 27x21, not 26.6): the page shows the default shape and cuts the bit over off both sides
// (client-scene.ts boxWidth, the same rule), so the map pane keeps its width while zooming.
const ZOOM_STEPS = [7, 11, 15, 21, 29, 41, 57, 81, 113, 161, 257];
function* zoomView(f: Frame, dir: number, quiet = false) {
	const def = yield* g.srcCall(f, "default_view");
	const ds = rt.call(f, P("/proc/getviewsize"), null, [def]), cs = rt.call(f, P("/proc/getviewsize"), null, [rt.sv(f, "view")]);
	const dw = Number(rt.index(ds, 1)), dh = Number(rt.index(ds, 2)), ch = Number(rt.index(cs, 2));
	let h = dh;
	if (dir > 0 && rt.onServer() && !rt.sv(f, "holder")) { // online, admins only: a zoomed-out view is costly for a server to send
		if (!quiet) rt.call(f, P("/proc/to_chat"), null, [f.usr, "<span class='warning'>Online, zooming out is for admins only.</span>"]);
		return f.dot;
	}
	if (dir > 0) h = ZOOM_STEPS.find(s => s > ch) ?? ZOOM_STEPS[ZOOM_STEPS.length - 1];
	else if (dir < 0) h = [...ZOOM_STEPS].reverse().find(s => s < ch) ?? ZOOM_STEPS[0];
	let w = Math.ceil(h * dw / dh - 1e-9);
	if (w % 2 === 0) w++;
	if (quiet && h === ch) return f.dot;
	yield* g.srcCall(f, "change_view", h === dh ? def : `${w}x${h}`);
	if (!quiet) rt.call(f, P("/proc/to_chat"), null, [f.usr, `<span class='notice'>View: ${w}x${h} tiles${h === dh ? " (normal)" : ""}.</span>`]);
	return f.dot;
}
// Shared by the Debug verbs and the ghost HUD buttons: client.zoom_view(dir, quiet): 1 = out, -1 = in, 0 = reset. Per client.
rt.def("/client/proc/zoom_view", function* zoom_view(f: Frame, dir: Value, quiet: Value) {
	return yield* zoomView(f, Number(dir), truthy(quiet));
}, true, { args: ["dir", "quiet"] });
rt.def("/client/proc/zoom_out", function* zoom_out(f: Frame) {
	return yield* zoomView(f, 1);
}, true, { verb: { name: "Zoom Out", category: "Debug", desc: "Show more tiles, drawn smaller" } });
rt.def("/client/proc/zoom_in", function* zoom_in(f: Frame) {
	return yield* zoomView(f, -1);
}, true, { verb: { name: "Zoom In", category: "Debug", desc: "Show fewer tiles, drawn bigger" } });
rt.def("/client/proc/zoom_reset", function* zoom_reset(f: Frame) {
	return yield* zoomView(f, 0);
}, true, { verb: { name: "Reset Zoom", category: "Debug", desc: "Back to the normal view size" } });

// randomverbs.dm:666
rt.def("/client/proc/admin_call_shuttle", function* admin_call_shuttle(f: Frame) {
	let confirm: Value = null;
	if (GLOB.SSshuttle.emergency && GLOB.SSshuttle.emergency.mode != "idle" && GLOB.SSshuttle.emergency.mode != "recall" && GLOB.SSshuttle.emergency.mode != "call") {
		return f.dot;
	}
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if ((confirm = (yield* alert(this, "You sure?", "Confirm", "Yes", "No"))) != "Yes") {
		return f.dot;
	}
	yield* GLOB.SSshuttle.emergency.request();
	log_admin(`${key_name(f.usr)} admin-called the emergency shuttle.`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} admin-called the emergency shuttle.</span>`);
	return f.dot;
}, true, { verb: { name: "Call Shuttle", category: "Admin" } });

// randomverbs.dm:686
rt.def("/client/proc/admin_cancel_shuttle", function* admin_cancel_shuttle(f: Frame) {
	if (!check_rights(0)) {
		return f.dot;
	}
	if ((yield* alert(this, "You sure?", "Confirm", "Yes", "No")) != "Yes") {
		return f.dot;
	}
	if (GLOB.SSshuttle.emergency && GLOB.SSshuttle.emergency.mode != "idle" && GLOB.SSshuttle.emergency.mode != "recall" && GLOB.SSshuttle.emergency.mode != "call") {
		return f.dot;
	}
	yield* GLOB.SSshuttle.emergency.cancel();
	log_admin(`${key_name(f.usr)} admin-recalled the emergency shuttle.`);
	message_admins(`<span class='adminnotice'>${key_name_admin(f.usr)} admin-recalled the emergency shuttle.</span>`);
	return f.dot;
}, true, { verb: { name: "Cancel Shuttle", category: "Admin" } });

// randomverbs.dm:706
rt.def("/client/proc/everyone_random", function* everyone_random(f: Frame) {
	let notifyplayers: Value = null;
	if (GLOB.SSticker.HasRoundStarted()) {
		to_chat(f.usr, "Nope you can't do this, the game's already started. This only works before rounds!");
		return f.dot;
	}
	if (GLOB.config.force_random_names) {
		GLOB.config.force_random_names = 0;
		message_admins(`Admin ${key_name_admin(f.usr)} has disabled "Everyone is Special" mode.`);
		to_chat(f.usr, "Disabled.");
		return f.dot;
	}
	if ((notifyplayers = (yield* alert(this, "Do you want to notify the players?", "Options", "Yes", "No", "Cancel"))) == "Cancel") {
		return f.dot;
	}
	log_admin(`Admin ${key_name(this)} has forced the players to have random appearances.`);
	message_admins(`Admin ${key_name_admin(f.usr)} has forced the players to have random appearances.`);
	if (notifyplayers == "Yes") {
		to_chat(rt.world(), `<span class='adminnotice'>Admin ${f.usr.key} has forced the players to have completely random identities!</span>`);
	}
	to_chat(f.usr, "<i>Remember: you can always disable the randomness by using the verb again, assuming the round hasn't started yet</i>.");
	GLOB.config.force_random_names = 1;
	return f.dot;
}, true, { verb: { name: "Make Everyone Random", category: "Fun", desc: "Make everyone have a random appearance. You can only use this before rounds!" } });

// randomverbs.dm:737
rt.def("/client/proc/toggle_random_events", function toggle_random_events(f: Frame) {
	if (!GLOB.config.allow_random_events) {
		GLOB.config.allow_random_events = 1;
		to_chat(f.usr, "Random events enabled");
		message_admins(`Admin ${key_name_admin(f.usr)} has enabled random events.`);
	} else {
		GLOB.config.allow_random_events = 0;
		to_chat(f.usr, "Random events disabled");
		message_admins(`Admin ${key_name_admin(f.usr)} has disabled random events.`);
	}
	return f.dot;
}, false, { verb: { name: "Toggle random events on/off", category: "Server", desc: "Toggles random events such as meteors, black holes, blob (but not space dust) on/off" } });

// randomverbs.dm:753
rt.def("/client/proc/admin_change_sec_level", function* admin_change_sec_level(f: Frame) {
	let level: Value = null;
	if (!this.holder) {
		to_chat(this, "Only administrators may use this command.");
		return f.dot;
	}
	if (!(level = (yield* g.op(f, "Prompt", [1], [null, null, "Set Security Level", "Select security level to change to", list("green", "blue", "red", "delta")])))) return f.dot;
	set_security_level(level);
	log_admin(`${key_name(f.usr)} changed the security level to ${level}`);
	message_admins(`${key_name_admin(f.usr)} changed the security level to ${level}`);
	return f.dot;
}, true, { verb: { name: "Set Security Level", category: "Special Verbs", desc: "Changes the security level. Announcement only, i.e. setting to Delta won't activate nuke" } });

// randomverbs.dm:769
rt.def("/client/proc/toggle_nuke", function* toggle_nuke(f: Frame, N: Value) {
	let newtime: Value = null;
	let $1: any, $2: any;
	if (!check_rights(32)) {
		return f.dot;
	}
	if (!N.timing) {
		if (!(newtime = (yield* g.op(f, "Prompt", [32], [`${N.timer_set}`, "Activate Nuke", "Set activation timer.", f.usr, null])))) {
			return f.dot;
		}
		N.timer_set = newtime;
	}
	N.set_safety();
	N.set_active();
	let $0: any = key_name(f.usr);
	if (N.timing) {
		$1 = "activated";
	} else {
		$1 = "deactivated";
	}
	log_admin(`${$0} ${$1} a nuke at (${N.x},${N.y},${N.z}).`);
	$0 = `${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`;
	if (N.timing) {
		$1 = "activated";
	} else {
		$1 = "deactivated";
	}
	if (N) {
		$2 = `${`(${N.x},${N.y},${N.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${N.x};Y=${N.y};Z=${N.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	message_admins(`${$0} ${$1} a nuke at ${`${$2}`}.`);
	return f.dot;
}, true, { hidePopup: true, verb: { name: "Toggle Nuke", category: "Fun" }, argTypes: [{ type: 4, path: "/obj/machinery/nuclearbomb", source: "?" }] });

// randomverbs.dm:784
rt.def("/datum/controller/global_vars/proc/InitGlobalcustom_outfits", function InitGlobalcustom_outfits(f: Frame) {
	GLOB.custom_outfits = list();
	this.gvars_datum_init_order += "custom_outfits";
	return f.dot;
});

// randomverbs.dm:790
rt.def("/client/proc/create_outfits", function create_outfits(f: Frame) {
	if (!check_rights(32)) {
		return f.dot;
	}
	this.holder.create_outfit();
	return f.dot;
}, false, { verb: { name: "Create Custom Outfit", category: "Debug" } });

// randomverbs.dm:796
rt.def("/datum/admins/proc/create_outfit", function create_outfit(f: Frame) {
	let path: Value = null, path_10: Value = null, path_11: Value = null, path_12: Value = null, path_13: Value = null, path_14: Value = null, path_15: Value = null, path_16: Value = null;
	let uniforms: Value = typesof(T("/obj/item/clothing/under"));
	let suits: Value = typesof(T("/obj/item/clothing/suit"));
	let gloves: Value = typesof(T("/obj/item/clothing/gloves"));
	let shoes: Value = typesof(T("/obj/item/clothing/shoes"));
	let headwear: Value = typesof(T("/obj/item/clothing/head"));
	let glasses: Value = typesof(T("/obj/item/clothing/glasses"));
	let masks: Value = typesof(T("/obj/item/clothing/mask"));
	let ids: Value = typesof(T("/obj/item/weapon/card/id"));
	let uniform_select: Value = "<select name=\"outfit_uniform\"><option value=\"\">None</option>";
	for (path of each(uniforms)) {
		uniform_select += `<option value="${path}">${path}</option>`;
	}
	uniform_select += "</select>";
	let suit_select: Value = "<select name=\"outfit_suit\"><option value=\"\">None</option>";
	for (path_10 of each(suits)) {
		suit_select += `<option value="${path_10}">${path_10}</option>`;
	}
	suit_select += "</select>";
	let gloves_select: Value = "<select name=\"outfit_gloves\"><option value=\"\">None</option>";
	for (path_11 of each(gloves)) {
		gloves_select += `<option value="${path_11}">${path_11}</option>`;
	}
	gloves_select += "</select>";
	let shoes_select: Value = "<select name=\"outfit_shoes\"><option value=\"\">None</option>";
	for (path_12 of each(shoes)) {
		shoes_select += `<option value="${path_12}">${path_12}</option>`;
	}
	shoes_select += "</select>";
	let head_select: Value = "<select name=\"outfit_head\"><option value=\"\">None</option>";
	for (path_13 of each(headwear)) {
		head_select += `<option value="${path_13}">${path_13}</option>`;
	}
	head_select += "</select>";
	let glasses_select: Value = "<select name=\"outfit_glasses\"><option value=\"\">None</option>";
	for (path_14 of each(glasses)) {
		glasses_select += `<option value="${path_14}">${path_14}</option>`;
	}
	glasses_select += "</select>";
	let mask_select: Value = "<select name=\"outfit_mask\"><option value=\"\">None</option>";
	for (path_15 of each(masks)) {
		mask_select += `<option value="${path_15}">${path_15}</option>`;
	}
	mask_select += "</select>";
	let id_select: Value = "<select name=\"outfit_id\"><option value=\"\">None</option>";
	for (path_16 of each(ids)) {
		id_select += `<option value="${path_16}">${path_16}</option>`;
	}
	id_select += "</select>";
	let dat: Value = fmt("\n\t<html><head><title>Create Outfit</title></head><body>\n\t<form name=\"outfit\" action=\"byond://?src=＃\" method=\"get\">\n\t<input type=\"hidden\" name=\"src\" value=\"＃\">\n\t<input type=\"hidden\" name=\"create_outfit\" value=\"1\">\n\t<table>\n\t\t<tr>\n\t\t\t<th>Name:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_name\" value=\"Custom Outfit\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Uniform:</th>\n\t\t\t<td>\n\t\t\t   ＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Suit:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Back:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_back\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Belt:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_belt\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Gloves:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Shoes:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Head:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Mask:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Ears:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_ears\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Glasses:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>ID:</th>\n\t\t\t<td>\n\t\t\t\t＀\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Left Pocket:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_l_pocket\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Right Pocket:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_r_pocket\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Suit Store:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_s_store\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Right Hand:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_r_hand\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th>Left Hand:</th>\n\t\t\t<td>\n\t\t\t\t<input type=\"text\" name=\"outfit_l_hand\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t</table>\n\t<br>\n\t<input type=\"submit\" value=\"Save\">\n\t</form></body></html>\n\t", [this, this, uniform_select, suit_select, gloves_select, shoes_select, head_select, mask_select, glasses_select, id_select]);
	rt.op(f, "Browse", [], [f.usr, dat, "window=dressup;size=550x600"], false);
	return f.dot;
});

// randomverbs.dm:965
rt.def("/client/proc/toggle_antag_hud", function toggle_antag_hud(f: Frame) {
	let H: Value = null, G: Value = null, H_2: Value = null;
	let $e: any;
	if (!this.holder) {
		return f.dot;
	}
	let adding_hud: Value = (!this.has_antag_hud() ? 1 : 0);
	for (H of each(GLOB.huds, T("/datum/atom_hud"))) {
		if (rt.istype(H, T("/datum/atom_hud/antag"))) {
			if (adding_hud) {
				H.add_hud_to(f.usr);
			} else {
				H.remove_hud_from(f.usr);
			}
		}
	}
	for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
		H_2 = G.ganghud;
		if (adding_hud) {
			H_2.add_hud_to(f.usr);
		} else {
			H_2.remove_hud_from(f.usr);
		}
	}
	let $0: any = f.usr;
	to_chat($0, `You toggled your admin antag HUD ${adding_hud ? "ON" : "OFF"}.`);
	message_admins(`${key_name_admin(f.usr)} toggled their admin antag HUD ${adding_hud ? "ON" : "OFF"}.`);
	log_admin(`${key_name(f.usr)} toggled their admin antag HUD ${adding_hud ? "ON" : "OFF"}.`);
	return f.dot;
}, false, { verb: { name: "Toggle AntagHUD", category: "Admin", desc: "Toggles the Admin AntagHUD" } });

// randomverbs.dm:983
rt.def("/client/proc/has_antag_hud", function has_antag_hud(f: Frame) {
	let A: Value = null;
	return rt.index((A = rt.index(GLOB.huds, ANTAG_HUD_TRAITOR)).hudusers, this.mob);
});

// randomverbs.dm:991
rt.def("/client/proc/open_shuttle_manipulator", function* open_shuttle_manipulator(f: Frame) {
	let M: Value = null;
	for (M of each(GLOB.machines, T("/obj/machinery/shuttle_manipulator"))) {
		yield* M.ui_interact(f.usr);
	}
	return f.dot;
}, true, { verb: { name: "Shuttle Manipulator", category: "Admin", desc: "Opens the shuttle manipulator UI." } });

// randomverbs.dm:1000
rt.def("/client/proc/mass_zombie_infection", function* mass_zombie_infection(f: Frame) {
	let confirm: Value = null, H: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	if ((confirm = (yield* alert(this, "Please confirm you want to add latent zombie organs in all humans?", "Confirm Zombies", "Yes", "No"))) != "Yes") {
		return f.dot;
	}
	for (H of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
		yield* new_(T("/obj/item/organ/zombie_infection"), H);
	}
	message_admins(`${key_name_admin(f.usr)} added a latent zombie infection to all humans.`);
	log_admin(`${key_name(f.usr)} added a latent zombie infection to all humans.`);
	return f.dot;
}, true, { verb: { name: "Mass Zombie Infection", category: "Fun", desc: "Infects all humans with a latent organ that will zombify them on death." } });

// randomverbs.dm:1018
rt.def("/client/proc/mass_zombie_cure", function* mass_zombie_cure(f: Frame) {
	let confirm: Value = null, I: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	if ((confirm = (yield* alert(this, "Please confirm you want to cure all zombies?", "Confirm Zombie Cure", "Yes", "No"))) != "Yes") {
		return f.dot;
	}
	for (I of each(GLOB.zombie_infection_list, T("/obj/item/organ/zombie_infection"))) {
		yield* qdel(I);
	}
	message_admins(`${key_name_admin(f.usr)} cured all zombies.`);
	log_admin(`${key_name(f.usr)} cured all zombies.`);
	return f.dot;
}, true, { verb: { name: "Mass Zombie Cure", category: "Fun", desc: "Removes the zombie infection from all humans, returning them to normal." } });

// randomverbs.dm:1037
rt.def("/client/proc/polymorph_all", function* polymorph_all(f: Frame) {
	let confirm: Value = null, M: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	if ((confirm = (yield* alert(this, "Please confirm you want polymorph all mobs?", "Confirm Polymorph", "Yes", "No"))) != "Yes") {
		return f.dot;
	}
	let mobs: Value = shuffle((yield* GLOB.living_mob_list.Copy()));
	let who_did_it: Value = key_name_admin(f.usr);
	message_admins(`${key_name_admin(f.usr)} started polymorphed all living mobs.`);
	log_admin(`${key_name(f.usr)} polymorphed all living mobs.`);
	for (M of each(mobs, T("/mob/living"))) {
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
		if (!M) {
			continue;
		}
		M.audible_message("<span class='italics'>...wabbajack...wabbajack...</span>");
		playsound(M.loc, rt.rsc("sound/magic/staff_change.ogg"), 50, 1, -1);
		yield* wabbajack(M);
	}
	message_admins(`Mass polymorph started by ${who_did_it} is complete.`);
	return f.dot;
}, true, { verb: { name: "Polymorph All", category: "Fun", desc: "Applies the effects of the bolt of change to every single mob." } });

// randomverbs.dm:1071
rt.def("/client/proc/show_tip", function* show_tip(f: Frame) {
	let input: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	if (!(input = (yield* g.op(f, "Prompt", [65], ["", "Tip", "Please specify your tip that you want to send to the players.", f.usr, null])))) {
		return f.dot;
	}
	if (!GLOB.SSticker) {
		return f.dot;
	}
	GLOB.SSticker.selected_tip = input;
	if (GLOB.SSticker.tipped) {
		GLOB.SSticker.send_tip_of_the_round();
	}
	message_admins(`${key_name_admin(f.usr)} sent a tip of the round.`);
	log_admin(`${key_name(f.usr)} sent "${input}" as the Tip of the Round.`);
	return f.dot;
}, true, { verb: { name: "Show Tip", category: "Admin", desc: "Sends a tip (that you specify) to all players. After all you're the experienced player here." } });

// randomverbs.dm:1095
rt.def("/proc/mass_purrbation", function* mass_purrbation(f: Frame) {
	let M: Value = null;
	for (M of each(GLOB.mob_list)) {
		if (is_species(M, T("/datum/species/human"))) {
			yield* purrbation_apply(M);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// randomverbs.dm:1101
rt.def("/proc/mass_remove_purrbation", function* mass_remove_purrbation(f: Frame) {
	let M: Value = null;
	for (M of each(GLOB.mob_list)) {
		if (is_species(M, T("/datum/species/human"))) {
			yield* purrbation_remove(M);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// randomverbs.dm:1107
rt.def("/proc/purrbation_toggle", function* purrbation_toggle(f: Frame, H: Value) {
	if (!is_species(H, T("/datum/species/human"))) {
		return f.dot;
	}
	if (rt.index(H.dna.features, "tail_human") == "None" && rt.index(H.dna.features, "ears") == "None") {
		yield* purrbation_apply(H);
		f.dot = 1;
	} else {
		yield* purrbation_remove(H);
		f.dot = 0;
	}
	return f.dot;
}, true);

// randomverbs.dm:1117
rt.def("/proc/purrbation_apply", function* purrbation_apply(f: Frame, H: Value) {
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (!(rt.index(H.dna.features, "tail_human") == "None" && rt.index(H.dna.features, "ears") == "None")) {
		return f.dot;
	}
	to_chat(H, "Something is nya~t right.");
	rt.setAt(H.dna.features, "tail_human", "Cat");
	rt.setAt(H.dna.features, "ears", "Cat");
	yield* H.regenerate_icons();
	playsound(rt.getStep(f, H, 0), rt.rsc("sound/effects/meow1.ogg"), 50, 1, -1);
	return f.dot;
}, true);

// randomverbs.dm:1128
rt.def("/proc/purrbation_remove", function* purrbation_remove(f: Frame, H: Value) {
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (rt.index(H.dna.features, "tail_human") == "None" && rt.index(H.dna.features, "ears") == "None") {
		return f.dot;
	}
	to_chat(H, "You are no longer a cat.");
	rt.setAt(H.dna.features, "tail_human", "None");
	rt.setAt(H.dna.features, "ears", "None");
	yield* H.regenerate_icons();
	return f.dot;
}, true);

// randomverbs.dm:1143
rt.def("/client/proc/modify_goals", function modify_goals(f: Frame) {
	if (!check_rights(2)) {
		return f.dot;
	}
	this.holder.modify_goals();
	return f.dot;
}, false, { verb: { name: "Modify goals", category: "Debug" } });

// randomverbs.dm:1149
rt.def("/datum/admins/proc/modify_goals", function modify_goals(f: Frame) {
	let S: Value = null;
	let dat: Value = "";
	for (S of each(GLOB.SSticker.mode.station_goals, T("/datum/station_goal"))) {
		dat += fmt("＀ - <a href='?src=＃;announce=1'>Announce</a> | <a href='?src=＃;remove=1'>Remove</a><br>", [S.name, S, S]);
	}
	dat += fmt("<br><a href='?src=＃;add_station_goal=1'>Add New Goal</a>", [this]);
	rt.op(f, "Browse", [], [f.usr, dat, "window=goals;size=400x400"], false);
	return f.dot;
});

// randomverbs.dm:1172
rt.def("/client/proc/smite", function* smite(f: Frame, target: Value) {
	let _T: Value = null, msg: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	let punishment_list: Value = list("Lightning bolt", "Brain damage", "Gib", "Bluespace Artillery Device");
	let punishment: Value = (yield* g.op(f, "Prompt", [1], [null, null, "DIVINE SMITING", "Choose a punishment", punishment_list]));
	if (!target || target.gc_destroyed || !punishment) {
		return f.dot;
	}
	if (punishment === "Lightning bolt") {
		yield* (_T = rt.getStep(f, rt.getStep(f, target, 1), 1)).Beam(target, { icon_state: `lightning${rand(1, 12)}`, time: 5 });
		yield* target.adjustFireLoss(75);
		yield* target.electrocution_animation(40);
		to_chat(target, "<span class='userdanger'>The gods have punished you for your sins!</span>");
	} else if (punishment === "Brain damage") {
		yield* target.adjustBrainLoss(75);
	} else if (punishment === "Gib") {
		yield* target.gib(0);
	} else if (punishment === "Bluespace Artillery Device") {
		yield* this.bluespace_artillery(target);
	}
	message_admins((msg = `${key_name_admin(f.usr)} punished ${key_name_admin(target)} with ${punishment}.`));
	admin_ticket_log(target, msg);
	log_admin(`${key_name(f.usr)} punished ${key_name(target)} with ${punishment}.`);
	return f.dot;
}, true, { verb: { name: "Smite", category: "Fun" }, argTypes: [{ type: 8, path: "/mob/living/carbon/human" }] });

// randomverbs.dm:1203
rt.def("/client/proc/trigger_centcom_recall", function* trigger_centcom_recall(f: Frame) {
	if (!this.holder) {
		return f.dot;
	}
	let message: Value = pick(GLOB.admiral_messages);
	if (!(message = (yield* g.op(f, "Prompt", [3], [null, message, "Admiral Message", "Enter message from the on-call admiral to be put in the recall report.", null])))) {
		return f.dot;
	}
	message_admins(`${key_name_admin(f.usr)} triggered a Centcom recall, with the admiral message of: ${message}`);
	log_game(`${key_name(f.usr)} triggered a Centcom recall, with the message of: ${message}`);
	yield* GLOB.SSshuttle.centcom_recall(GLOB.SSshuttle.emergency.timer, message);
	return f.dot;
}, true);
