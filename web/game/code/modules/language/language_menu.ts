// Based on /tg/station's code/modules/language/language_menu.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(2800, "/datum/language_menu", "/datum", {
	language_holder: null,
});

// language_menu.dm:9
rt.def("/datum/language_menu/proc/Destroy", function* Destroy(f: Frame) {
	this.language_holder = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// language_menu.dm:12
rt.def("/datum/language_menu/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.language_menu_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "language_menu", "Language Menu", 700, 800, master_ui, state))).open();
	return f.dot;
}, true);

// language_menu.dm:18
rt.def("/datum/language_menu/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let AM: Value = null, ld: Value = null, result: Value = null, shadow: Value = null, LD: Value = null, L: Value = null, LD_3: Value = null, L_4: Value = null;
	let data: Value = list();
	if (rt.istype((AM = this.language_holder.get_atom()), T("/mob/living"))) {
		rt.setAt(data, "is_living", 1);
	} else {
		rt.setAt(data, "is_living", 0);
	}
	rt.setAt(data, "languages", list());
	for (ld of each(GLOB.all_languages)) {
		if (!(result = (yield* this.language_holder.has_language(ld)))) {
			continue;
		}
		shadow = (result == "language_shadowed" ? 1 : 0);
		LD = ld;
		rt.setAt((L = list()), "name", rt.initial(f, LD, "name"));
		rt.setAt(L, "desc", rt.initial(f, LD, "desc"));
		rt.setAt(L, "key", rt.initial(f, LD, "key"));
		rt.setAt(L, "is_default", (LD == this.language_holder.selected_default_language ? 1 : 0));
		rt.setAt(L, "shadow", shadow);
		if (AM) {
			rt.setAt(L, "can_speak", (yield* AM.can_speak_in_language(LD)));
		}
		rt.modAt(data, "languages", list(L), add);
	}
	if (check_rights_for(user.client, 2) || rt.istype(AM, T("/mob/dead/observer"))) {
		rt.setAt(data, "admin_mode", 1);
		rt.setAt(data, "omnitongue", this.language_holder.omnitongue);
		rt.setAt(data, "unknown_languages", list());
		ld = null;
		for (ld of each(GLOB.all_languages)) {
			if (yield* this.language_holder.has_language(ld)) {
				continue;
			}
			LD_3 = ld;
			rt.setAt((L_4 = list()), "name", rt.initial(f, LD_3, "name"));
			rt.setAt(L_4, "desc", rt.initial(f, LD_3, "desc"));
			rt.setAt(L_4, "key", rt.initial(f, LD_3, "key"));
			rt.modAt(data, "unknown_languages", list(L_4), add);
		}
	}
	return data;
}, true);

// language_menu.dm:64
rt.def("/datum/language_menu/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let language_datum: Value = null, ld: Value = null, LD: Value = null;
	let $0: any, $1: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let user: Value = f.usr;
	let AM: Value = this.language_holder.get_atom();
	let language_name: Value = rt.at(params, "language_name");
	for (ld of each(GLOB.all_languages)) {
		LD = ld;
		if (language_name == rt.initial(f, LD, "name")) {
			language_datum = LD;
		}
	}
	let is_admin: Value = check_rights_for(user.client, 2);
	if (action === "select_default") {
		if (language_datum && (yield* AM.can_speak_in_language(language_datum))) {
			this.language_holder.selected_default_language = language_datum;
			f.dot = 1;
		}
	} else if (action === "grant_language") {
		if ((is_admin || rt.istype(AM, T("/mob/dead/observer"))) && language_datum) {
			yield* this.language_holder.grant_language(language_datum);
			if (is_admin) {
				message_admins(`${key_name_admin(user)} granted the ${language_name} language to ${key_name_admin(AM)}.`);
				log_admin(`${key_name(user)} granted the language ${language_name} to ${key_name(AM)}.`);
			}
			f.dot = 1;
		}
	} else if (action === "remove_language") {
		if ((is_admin || rt.istype(AM, T("/mob/dead/observer"))) && language_datum) {
			yield* this.language_holder.remove_language(language_datum);
			if (is_admin) {
				message_admins(`${key_name_admin(user)} removed the ${language_name} language to ${key_name_admin(AM)}.`);
				log_admin(`${key_name(user)} removed the language ${language_name} to ${key_name(AM)}.`);
			}
			f.dot = 1;
		}
	} else if (action === "toggle_omnitongue") {
		if (!(is_admin || rt.istype(AM, T("/mob/dead/observer")))) return f.dot;
		this.language_holder.omnitongue = (!this.language_holder.omnitongue ? 1 : 0);
		if (is_admin) {
			$0 = key_name_admin(user);
			if (this.language_holder.omnitongue) {
				$1 = "enabled";
			} else {
				$1 = "disabled";
			}
			message_admins(`${$0} ${$1} the ability to speak all languages (that they know) of ${key_name_admin(AM)}.`);
			$0 = key_name(user);
			if (this.language_holder.omnitongue) {
				$1 = "enabled";
			} else {
				$1 = "disabled";
			}
			log_admin(`${$0} ${$1} the ability to speak all languages (that_they know) of ${key_name(AM)}.`);
		}
		f.dot = 1;
	}
	return f.dot;
}, true);
