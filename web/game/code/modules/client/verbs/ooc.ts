// Based on /tg/station's code/modules/client/verbs/ooc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


// ooc.dm:6
rt.def("/client/verb/ooc", function* ooc(f: Frame, msg: Value) {
	let C: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	if (GLOB.say_disabled) {
		to_chat(f.usr, "<span class='danger'>Speech is currently admin-disabled.</span>");
		return f.dot;
	}
	if (!this.mob) {
		return f.dot;
	}
	if (IsGuestKey(this.key)) {
		to_chat(this, "Guests may not use OOC.");
		return f.dot;
	}
	msg = copytext(sanitize(msg), 1, 1024);
	let raw_msg: Value = msg;
	if (!msg) {
		return f.dot;
	}
	if (rt.isIn(f, copytext((msg = emoji_parse(msg)), 1, 2), list(".", ";", ":", "#")) || findtext(lowertext(copytext(msg, 1, 5)), "say")) {
		if ((yield* alert(`Your message "${raw_msg}" looks like it was meant for in game communication, say it in OOC?`, "Meant for OOC?", "No", "Yes")) != "Yes") {
			return f.dot;
		}
	}
	if (!rt.bitAnd(this.prefs.chat_toggles, 1)) {
		to_chat(this, "<span class='danger'>You have OOC muted.</span>");
		return f.dot;
	}
	if (!this.holder) {
		if (!GLOB.ooc_allowed) {
			to_chat(this, "<span class='danger'>OOC is globally muted.</span>");
			return f.dot;
		}
		if (!GLOB.dooc_allowed && this.mob.stat == 2) {
			to_chat(f.usr, "<span class='danger'>OOC for dead mobs has been turned off.</span>");
			return f.dot;
		}
		if (rt.bitAnd(this.prefs.muted, 2)) {
			to_chat(this, "<span class='danger'>You cannot use OOC (muted).</span>");
			return f.dot;
		}
		if (this.mob) {
			if (jobban_isbanned(this.mob, "OOC")) {
				to_chat(this, "<span class='danger'>You have been banned from OOC.</span>");
				return f.dot;
			}
		}
		if (GLOB.SSvote && (yield* GLOB.SSvote.newcomer_refused(this, "use OOC"))) { // ss13.live
			return f.dot;
		}
		if (this.handle_spam_prevention(msg, 2)) {
			return f.dot;
		}
		if (findtext(msg, "byond://")) {
			to_chat(this, "<B>Advertising other servers is not allowed.</B>");
			log_admin(`${key_name(this)} has attempted to advertise in OOC: ${msg}`);
			message_admins(`${key_name_admin(this)} has attempted to advertise in OOC: ${msg}`);
			return f.dot;
		}
	}
	log_ooc(`${this.mob.name}/${this.key} : ${raw_msg}`);
	this.mob.log_message(`${this.key}: ${raw_msg}`, "OOC log");
	let keyname: Value = this.key;
	if (this.prefs.unlock_content) {
		if (rt.bitAnd(this.prefs.toggles, 16)) {
			if (this.prefs.ooccolor) {
				$0 = this.prefs.ooccolor;
			} else {
				$0 = GLOB.normal_ooc_colour;
			}
			keyname = `<font color='${$0}'>${bicon(icon(rt.rsc("icons/member_content.dmi"), "blag"))}${keyname}</font>`;
		}
	}
	for (C of each(GLOB.clients, T("/client"))) {
		if (rt.bitAnd(C.prefs.chat_toggles, 1)) {
			if (this.holder) {
				if (!this.holder.fakekey || C.holder) {
					if (check_rights_for(this, 2)) {
						$0 = C;
						if (GLOB.config.allow_admin_ooccolor && this.prefs.ooccolor) {
							$1 = `<font color=${this.prefs.ooccolor}>`;
						} else {
							$1 = "";
						}
						$2 = keyname;
						if (this.holder.fakekey) {
							$3 = `/(${this.holder.fakekey})`;
						} else {
							$3 = "";
						}
						to_chat($0, `<span class='adminooc'>${$1}<span class='prefix'>OOC:</span> <span class='adminbadge'>ADMIN</span> <EM>${$2}${$3}:</EM> <span class='message'>${msg}</span></span></font>`);
					} else {
						$0 = C;
						$1 = keyname;
						if (this.holder.fakekey) {
							$2 = `/(${this.holder.fakekey})`;
						} else {
							$2 = "";
						}
						to_chat($0, `<span class='adminobserverooc'><span class='prefix'>OOC:</span> <EM>${$1}${$2}:</EM> <span class='message'>${msg}</span></span>`);
					}
				} else {
					$0 = C;
					$1 = GLOB.normal_ooc_colour;
					if (this.holder.fakekey) {
						$2 = this.holder.fakekey;
					} else {
						$2 = this.key;
					}
					to_chat($0, `<font color='${$1}'><span class='ooc'><span class='prefix'>OOC:</span> <EM>${$2}:</EM> <span class='message'>${msg}</span></span></font>`);
				}
			} else if (!rt.isIn(f, this.key, C.prefs.ignoring)) {
				to_chat(C, `<font color='${GLOB.normal_ooc_colour}'><span class='ooc'><span class='prefix'>OOC:</span> <EM>${keyname}:</EM> <span class='message'>${msg}</span></span></font>`);
			}
		}
	}
	return f.dot;
}, true, { verb: { name: "OOC", category: "OOC" }, argTypes: [{ type: 2 }] });

// ooc.dm:76
rt.def("/proc/toggle_ooc", function toggle_ooc(f: Frame, toggle: Value) {
	if (toggle !== null) {
		if (toggle != GLOB.ooc_allowed) {
			GLOB.ooc_allowed = toggle;
		} else {
			return f.dot;
		}
	} else {
		GLOB.ooc_allowed = (!GLOB.ooc_allowed ? 1 : 0);
	}
	let $0: any = rt.world();
	to_chat($0, `<B>The OOC channel has been globally ${GLOB.ooc_allowed ? "enabled" : "disabled"}.</B>`);
	return f.dot;
});

// ooc.dm:85
rt.def("/datum/controller/global_vars/proc/InitGlobalnormal_ooc_colour", function InitGlobalnormal_ooc_colour(f: Frame) {
	GLOB.normal_ooc_colour = "#002eb8";
	this.gvars_datum_init_order += "normal_ooc_colour";
	return f.dot;
});

// ooc.dm:91
rt.def("/client/proc/set_ooc", function set_ooc(f: Frame, newColor: Value) {
	GLOB.normal_ooc_colour = sanitize_ooccolor(newColor);
	return f.dot;
}, false, { verb: { name: "Set Player OOC Color", category: "Fun", desc: "Modifies player OOC Color" }, argTypes: [{ type: 256 }] });

// ooc.dm:97
rt.def("/client/proc/reset_ooc", function reset_ooc(f: Frame) {
	GLOB.normal_ooc_colour = "#002eb8";
	return f.dot;
}, false, { verb: { name: "Reset Player OOC Color", category: "Fun", desc: "Returns player OOC Color to default" } });

// ooc.dm:103
rt.def("/client/verb/colorooc", function* colorooc(f: Frame) {
	let new_ooccolor: Value = null;
	if (!this.holder || check_rights_for(this, 2)) {
		if (!this.is_content_unlocked()) {
			return f.dot;
		}
	}
	if (new_ooccolor = (yield* g.op(f, "Prompt", [257], [this.prefs.ooccolor, "OOC color", "Please select your OOC color.", this, null]))) {
		this.prefs.ooccolor = sanitize_ooccolor(new_ooccolor);
		this.prefs.save_preferences();
	}
	return f.dot;
}, true, { verb: { name: "Set Your OOC Color", category: "Preferences" } });

// ooc.dm:119
rt.def("/client/verb/resetcolorooc", function resetcolorooc(f: Frame) {
	if (!(!this.holder || check_rights_for(this, 2))) return f.dot;
	if (!this.is_content_unlocked()) {
		return f.dot;
	}
	this.prefs.ooccolor = rt.initial(f, this.prefs, "ooccolor");
	this.prefs.save_preferences();
	return f.dot;
}, false, { verb: { name: "Reset Your OOC Color", category: "Preferences", desc: "Returns your OOC Color to default" } });

// ooc.dm:133
rt.def("/client/verb/admin_notice", function admin_notice(f: Frame) {
	if (GLOB.admin_notice) {
		to_chat(this, `<span class='boldnotice'>Admin Notice:</span>\n \t ${GLOB.admin_notice}`);
	} else {
		to_chat(this, "<span class='notice'>There are no admin notices at the moment.</span>");
	}
	return f.dot;
}, false, { verb: { name: "Adminnotice", category: "Admin", desc: "Check the admin notice if it has been set" } });

// ooc.dm:140
rt.def("/client/verb/fix_chat", function* fix_chat(f: Frame) {
	let action: Value = null;
	if (!this.chatOutput || !rt.istype(this.chatOutput, T("/datum/chatOutput"))) {
		if ((action = (yield* alert(this, "Invalid Chat Output data found!\nRecreate data?", "Wot?", "Recreate Chat Output data", "Cancel"))) != "Recreate Chat Output data") {
			return f.dot;
		}
		this.chatOutput = (yield* new_(T("/datum/chatOutput"), this));
		yield* this.chatOutput.start();
		if ((action = (yield* alert(this, "Goon chat reloading, wait a bit and tell me if it's fixed", "", "Fixed", "Nope"))) == "Fixed") {
			log_game(`GOONCHAT: ${key_name(this)} Had to fix their goonchat by re-creating the chatOutput datum`);
		} else {
			yield* this.chatOutput.load();
			if ((action = (yield* alert(this, "How about now? (give it a moment (it may also try to load twice))", "", "Yes", "No"))) == "Yes") {
				log_game(`GOONCHAT: ${key_name(this)} Had to fix their goonchat by re-creating the chatOutput datum and forcing a load()`);
			} else {
				if ((action = (yield* alert(this, "Welp, I'm all out of ideas. Try closing byond and reconnecting.\nWe could also disable fancy chat and re-enable oldchat", "", "Thanks anyways", "Switch to old chat"))) == "Switch to old chat") {
					winset(this, "output", "is-visible=true;is-disabled=false");
					winset(this, "browseroutput", "is-visible=false");
				}
				log_game(`GOONCHAT: ${key_name(this)} Failed to fix their goonchat window after recreating the chatOutput and forcing a load()`);
			}
		}
	} else if (this.chatOutput.loaded) {
		const subject = (action = (yield* alert(this, "ChatOutput seems to be loaded\nDo you want me to force a reload, wiping the chat log or just refresh the chat window because it broke/went away?", "Hmmm", "Force Reload", "Refresh", "Cancel")));
		if (subject === "Force Reload") {
			this.chatOutput.loaded = 0;
			yield* this.chatOutput.start();
			if ((action = (yield* alert(this, "Goon chat reloading, wait a bit and tell me if it's fixed", "", "Fixed", "Nope"))) == "Fixed") {
				log_game(`GOONCHAT: ${key_name(this)} Had to fix their goonchat by forcing a start()`);
			} else {
				yield* this.chatOutput.load();
				if ((action = (yield* alert(this, "How about now? (give it a moment (it may also try to load twice))", "", "Yes", "No"))) == "Yes") {
					log_game(`GOONCHAT: ${key_name(this)} Had to fix their goonchat by forcing a load()`);
				} else {
					if ((action = (yield* alert(this, "Welp, I'm all out of ideas. Try closing byond and reconnecting.\nWe could also disable fancy chat and re-enable oldchat", "", "Thanks anyways", "Switch to old chat"))) == "Switch to old chat") {
						winset(this, "output", "is-visible=true;is-disabled=false");
						winset(this, "browseroutput", "is-visible=false");
					}
					log_game(`GOONCHAT: ${key_name(this)} Failed to fix their goonchat window forcing a start() and forcing a load()`);
				}
			}
		} else if (subject === "Refresh") {
			this.chatOutput.showChat();
			if ((action = (yield* alert(this, "Goon chat refreshing, wait a bit and tell me if it's fixed", "", "Fixed", "Nope, force a reload"))) == "Fixed") {
				log_game(`GOONCHAT: ${key_name(this)} Had to fix their goonchat by forcing a show()`);
			} else {
				this.chatOutput.loaded = 0;
				yield* this.chatOutput.load();
				if ((action = (yield* alert(this, "How about now? (give it a moment)", "", "Yes", "No"))) == "Yes") {
					log_game(`GOONCHAT: ${key_name(this)} Had to fix their goonchat by forcing a load()`);
				} else {
					if ((action = (yield* alert(this, "Welp, I'm all out of ideas. Try closing byond and reconnecting.\nWe could also disable fancy chat and re-enable oldchat", "", "Thanks anyways", "Switch to old chat"))) == "Switch to old chat") {
						winset(this, "output", "is-visible=true;is-disabled=false");
						winset(this, "browseroutput", "is-visible=false");
					}
					log_game(`GOONCHAT: ${key_name(this)} Failed to fix their goonchat window forcing a show() and forcing a load()`);
				}
			}
		}
		return f.dot;
	} else {
		yield* this.chatOutput.start();
		if ((action = (yield* alert(this, "Manually loading Chat, wait a bit and tell me if it's fixed", "", "Fixed", "Nope"))) == "Fixed") {
			log_game(`GOONCHAT: ${key_name(this)} Had to fix their goonchat by manually calling start()`);
		} else {
			yield* this.chatOutput.load();
			yield* alert(this, "How about now? (give it a moment (it may also try to load twice))", "", "Yes", "No");
			if (action == "Yes") {
				log_game(`GOONCHAT: ${key_name(this)} Had to fix their goonchat by manually calling start() and forcing a load()`);
			} else {
				if ((action = (yield* alert(this, "Welp, I'm all out of ideas. Try closing byond and reconnecting.\nWe could also disable fancy chat and re-enable oldchat", "", "Thanks anyways", "Switch to old chat"))) == "Switch to old chat") {
					winset(this, "output", list2params(rt.alist(f, ["on-show", "", "is-disabled", "false", "is-visible", "true"])));
					winset(this, "browseroutput", "is-disabled=true;is-visible=false");
				}
				log_game(`GOONCHAT: ${key_name(this)} Failed to fix their goonchat window after manually calling start() and forcing a load()`);
			}
		}
	}
	return f.dot;
}, true, { verb: { name: "Fix chat", category: "OOC" } });

// ooc.dm:226
rt.def("/client/verb/motd", function motd(f: Frame) {
	if (GLOB.join_motd) {
		to_chat(this, `<div class="motd">${GLOB.join_motd}</div>`);
	} else {
		to_chat(this, "<span class='notice'>The Message of the Day has not been set.</span>");
	}
	return f.dot;
}, false, { verb: { name: "MOTD", category: "OOC", desc: "Check the Message of the Day" } });

// ooc.dm:242
rt.def("/client/proc/ignore_key", function ignore_key(f: Frame, client: Value) {
	let C: Value = null;
	let $1: any;
	if (rt.isIn(f, (C = client).key, this.prefs.ignoring)) {
		this.prefs.ignoring -= C.key;
	} else {
		(rt.modField(f, this.prefs, "ignoring", C.key, rt.bitOr));
	}
	let $0: any = this;
	if (rt.isIn(f, C.key, this.prefs.ignoring)) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	to_chat($0, `You are ${$1} ignoring ${C.key} on the OOC channel.`);
	this.prefs.save_preferences();
	return f.dot;
});

// ooc.dm:255
rt.def("/client/verb/select_ignore", function* select_ignore(f: Frame) {
	let selection: Value = null;
	if (!(selection = (yield* g.op(f, "Prompt", [1], [null, null, "Ignore", "Please, select a player!", (yield* sortKey(GLOB.clients))])))) {
		return f.dot;
	}
	if (selection == this) {
		to_chat(this, "You can't ignore yourself.");
		return f.dot;
	}
	this.ignore_key(selection);
	return f.dot;
}, true, { verb: { name: "Ignore", category: "OOC", desc: "Ignore a player's messages on the OOC channel" } });

// /client/verb/stop_all_sounds  (ss13.live, not in tg 2017; modern tg's OOC "Stop Sounds"): stops every sound playing for you now, new ones still play
rt.def("/client/verb/stop_all_sounds", function stop_all_sounds(f: Frame) {
	rt.op(f, "Output", [], [this, sound(null)], false);
	return f.dot;
}, false, { verb: { name: "Stop All Sounds", category: "OOC", desc: "Stop the sounds playing for you now; new ones still play" } });
