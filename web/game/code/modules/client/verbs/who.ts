// Based on /tg/station's code/modules/client/verbs/who.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// who.dm:5
rt.def("/client/verb/who", function* who(f: Frame) {
	let G: Value = null, C: Value = null, entry: Value = null, O: Value = null, C_2: Value = null, entry_3: Value = null, line: Value = null;
	let $e: any;
	let msg: Value = "<b>Current Players:</b>\n";
	let Lines: Value = list();
	if (this.holder) {
		if (check_rights(2, 0) && rt.istype(this.mob, T("/mob/dead/observer"))) {
			if (!(G = this.mob).started_as_observer) {
				log_admin(`${key_name(f.usr)} checked advanced who in-round`);
			}
			for (C of each(GLOB.clients, T("/client"))) {
				entry = `\t${C.key}`;
				if (C.holder && C.holder.fakekey) {
					entry += ` <i>(as ${C.holder.fakekey})</i>`;
				}
				if (rt.istype(C.mob, T("/mob/dead/new_player"))) {
					entry += " - <font color='darkgray'><b>In Lobby</b></font>";
				} else {
					entry += ` - Playing as ${C.mob.real_name}`;
					if (C.mob.stat === 1) {
						entry += " - <font color='darkgray'><b>Unconscious</b></font>";
					} else if (C.mob.stat === 2) {
						if (rt.istype(C.mob, T("/mob/dead/observer"))) {
							if ((O = C.mob).started_as_observer) {
								entry += " - <font color='gray'>Observing</font>";
							} else {
								entry += " - <font color='black'><b>DEAD</b></font>";
							}
						} else {
							entry += " - <font color='black'><b>DEAD</b></font>";
						}
					}
					if (is_special_character(C.mob)) {
						entry += " - <b><font color='red'>Antagonist</font></b>";
					}
				}
				entry += ` ${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [C.mob])}`;
				Lines += (entry += ` (${round(C.avgping, 1)}ms)`);
			}
		} else {
			for (C_2 of each(GLOB.clients, T("/client"))) {
				entry_3 = `\t${C_2.key}`;
				if (C_2.holder && C_2.holder.fakekey) {
					entry_3 += ` <i>(as ${C_2.holder.fakekey})</i>`;
				}
				Lines += (entry_3 += ` (${round(C_2.avgping, 1)}ms)`);
			}
		}
	} else {
		C_2 = null;
		for (C_2 of each(GLOB.clients, T("/client"))) {
			if (C_2.holder && C_2.holder.fakekey) {
				Lines += `${C_2.holder.fakekey} (${round(C_2.avgping, 1)}ms)`;
			} else {
				Lines += `${C_2.key} (${round(C_2.avgping, 1)}ms)`;
			}
		}
	}
	for (line of each((yield* sortList(Lines)))) {
		msg += `${line}\n`;
	}
	msg += `<b>Total Players: ${rt.length(Lines)}</b>`;
	to_chat(this, msg);
	return f.dot;
}, true, { verb: { name: "Who", category: "OOC" } });

// who.dm:63
rt.def("/client/verb/adminwho", function adminwho(f: Frame) {
	let C: Value = null;
	let msg: Value = "<b>Current Admins:</b>\n";
	if (this.holder) {
		for (C of each(GLOB.admins, T("/client"))) {
			msg += `\t${C} is a ${C.holder.rank}`;
			if (C.holder.fakekey) {
				msg += ` <i>(as ${C.holder.fakekey})</i>`;
			}
			if (rt.istype(C.mob, T("/mob/dead/observer"))) {
				msg += " - Observing";
			} else if (rt.istype(C.mob, T("/mob/dead/new_player"))) {
				msg += " - Lobby";
			} else {
				msg += " - Playing";
			}
			if (C.is_afk()) {
				msg += " (AFK)";
			}
			msg += "\n";
		}
	} else {
		C = null;
		for (C of each(GLOB.admins, T("/client"))) {
			if (C.is_afk()) {
				continue;
			}
			if (!C.holder.fakekey) {
				msg += `\t${C} is a ${C.holder.rank}\n`;
			}
		}
	}
	to_chat(this, msg);
	return f.dot;
}, false, { verb: { name: "Adminwho", category: "Admin" } });
