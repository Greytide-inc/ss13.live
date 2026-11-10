// Based on /tg/station's code/modules/mob/living/silicon/robot/laws.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// laws.dm:5
rt.def("/mob/living/silicon/robot/verb/cmd_show_laws", function* cmd_show_laws(f: Frame) {
	if (f.usr.stat == 2) {
		return f.dot;
	}
	yield* this.show_laws();
	return f.dot;
}, true, { verb: { name: "Show Laws", category: "Robot Commands" } });

// laws.dm:10
rt.def("/mob/living/silicon/robot/proc/show_laws", function* show_laws(f: Frame, everyone: Value) {
	let who: Value = null;
	everyone ??= 0;
	yield* this.laws_sanity_check();
	if (everyone) {
		who = rt.world();
	} else {
		who = this;
	}
	if (this.lawupdate) {
		if (this.connected_ai) {
			if (this.connected_ai.stat || this.connected_ai.control_disabled) {
				to_chat(this, "<b>AI signal lost, unable to sync laws.</b>");
			} else {
				yield* this.lawsync();
				to_chat(this, "<b>Laws synced with AI, be sure to note any changes.</b>");
				if (is_special_character(this)) {
					to_chat(this, "<b>Remember, your AI does NOT share or know about your law 0.</b>");
					if (this.connected_ai.laws.zeroth) {
						to_chat(this, "<b>While you are free to disregard it, your AI has a law 0 of its own.</b>");
					}
				}
			}
		} else {
			to_chat(this, "<b>No AI selected to sync laws with, disabling lawsync protocol.</b>");
			this.lawupdate = 0;
		}
	}
	to_chat(who, "<b>Obey these laws:</b>");
	yield* this.laws.show_laws(who);
	if (this.shell) {
		to_chat(who, "<b>Remember, you are an AI remotely controlling your shell, other AIs can be ignored.</b>");
	} else if (is_special_character(this) && this.connected_ai) {
		to_chat(who, `<b>Remember, ${this.connected_ai.name} is technically your master, but your objective comes first.</b>`);
	} else if (this.connected_ai) {
		to_chat(who, `<b>Remember, ${this.connected_ai.name} is your master, other AIs can be ignored.</b>`);
	} else if (this.emagged) {
		to_chat(who, "<b>Remember, you are not required to listen to the AI.</b>");
	} else {
		to_chat(who, "<b>Remember, you are not bound to any AI, you are not required to listen to them.</b>");
	}
	return f.dot;
}, true);

// laws.dm:48
rt.def("/mob/living/silicon/robot/proc/lawsync", function* lawsync(f: Frame) {
	let temp: Value = null, index: Value = null;
	yield* this.laws_sanity_check();
	let master: Value = this.connected_ai ? this.connected_ai.laws : null;
	if (master) {
		this.laws.ion.len = rt.len(f, master.ion);
		index = 1;
		while (index <= rt.len(f, master.ion)) {
			if (rt.length((temp = rt.index(master.ion, index))) > 0) {
				rt.setAt(this.laws.ion, index, temp);
			}
			index++;
		}
		if (!is_special_character(this)) {
			if (master.zeroth_borg) {
				temp = master.zeroth_borg;
			} else {
				temp = master.zeroth;
			}
			this.laws.zeroth = temp;
		}
		this.laws.inherent.len = rt.len(f, master.inherent);
		index = 1;
		while (index <= rt.len(f, master.inherent)) {
			if (rt.length((temp = rt.index(master.inherent, index))) > 0) {
				rt.setAt(this.laws.inherent, index, temp);
			}
			index++;
		}
		this.laws.supplied.len = rt.len(f, master.supplied);
		index = 1;
		while (index <= rt.len(f, master.supplied)) {
			if (rt.length((temp = rt.index(master.supplied, index))) > 0) {
				rt.setAt(this.laws.supplied, index, temp);
			}
			index++;
		}
	}
	return f.dot;
}, true);
