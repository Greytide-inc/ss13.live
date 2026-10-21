// From code/modules/language/language_menu.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2800, "/datum/language_menu", "/datum", {
	language_holder: null,
});

// /datum/language_menu/proc/Destroy  (code/modules/language/language_menu.dm:9)  may sleep
rt.def("/datum/language_menu/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "language_holder", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/language_menu/proc/ui_interact  (code/modules/language/language_menu.dm:12)  may sleep
rt.def("/datum/language_menu/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("language_menu_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "language_menu", "Language Menu", 700, 800, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /datum/language_menu/proc/ui_data  (code/modules/language/language_menu.dm:18)  may sleep
rt.def("/datum/language_menu/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, AM: Value = null, ld: Value = null, result: Value = null, shadow: Value = null, LD: Value = null, L: Value = null, LD_3: Value = null, L_4: Value = null;
	let $e: any;
	f.vars = () => [user, data, AM, ld, result, shadow, LD, L, LD_3, L_4, $e];
	data = rt.list();
	if (truthy((rt.istype((AM = (yield* g.callName(f, rt.sv(f, "language_holder"), "get_atom", []))), T("/mob/living")) ? 1 : 0))) {
		rt.setAt(live(data), "is_living", 1);
	} else {
		rt.setAt(live(data), "is_living", 0);
	}
	rt.setAt(live(data), "languages", rt.list());
	ld = null;
	rt.forList(f, 0, rt.gl("all_languages"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ld = $e;
		if (!truthy((result = (yield* g.callName(f, rt.sv(f, "language_holder"), "has_language", [live(ld)]))))) {
			continue;
		}
		shadow = (isEqual(live(result), "language_shadowed") ? 1 : 0);
		LD = live(ld);
		rt.setAt((L = rt.list()), "name", rt.initial(f, live(LD), "name"));
		rt.setAt(live(L), "desc", rt.initial(f, live(LD), "desc"));
		rt.setAt(live(L), "key", rt.initial(f, live(LD), "key"));
		rt.setAt(live(L), "is_default", (isEqual(live(LD), rt.fv(f, "selected_default_language", rt.sv(f, "language_holder"))) ? 1 : 0));
		rt.setAt(live(L), "shadow", live(shadow));
		if (truthy(live(AM))) {
			rt.setAt(live(L), "can_speak", (yield* g.callName(f, live(AM), "can_speak_in_language", [live(LD)])));
		}
		rt.modAt(live(data), "languages", rt.list(live(L)), add);
	}
	rt.endFor(f, 0);
	if ((truthy((yield* g.call(f, P("/proc/check_rights_for"), null, [rt.fv(f, "client", live(user)), 2]))) || truthy((rt.istype(live(AM), T("/mob/dead/observer")) ? 1 : 0)))) {
		rt.setAt(live(data), "admin_mode", 1);
		rt.setAt(live(data), "omnitongue", rt.fv(f, "omnitongue", rt.sv(f, "language_holder")));
		rt.setAt(live(data), "unknown_languages", rt.list());
		ld = null;
		rt.forList(f, 0, rt.gl("all_languages"));
		while (($e = rt.next(f, 0)) !== undefined) {
			ld = $e;
			if (truthy((yield* g.callName(f, rt.sv(f, "language_holder"), "has_language", [live(ld)])))) {
				continue;
			}
			LD_3 = live(ld);
			rt.setAt((L_4 = rt.list()), "name", rt.initial(f, live(LD_3), "name"));
			rt.setAt(live(L_4), "desc", rt.initial(f, live(LD_3), "desc"));
			rt.setAt(live(L_4), "key", rt.initial(f, live(LD_3), "key"));
			rt.modAt(live(data), "unknown_languages", rt.list(live(L_4)), add);
		}
		rt.endFor(f, 0);
	}
	return live(data);
}, true);

// /datum/language_menu/proc/ui_act  (code/modules/language/language_menu.dm:64)  may sleep
rt.def("/datum/language_menu/proc/ui_act", function* ui_act(f: Frame) {
	let user: Value = null, AM: Value = null, language_name: Value = null, language_datum: Value = null, ld: Value = null, LD: Value = null, is_admin: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, AM, language_name, language_datum, ld, LD, is_admin, $0, $1, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	user = live(f.usr);
	AM = (yield* g.callName(f, rt.sv(f, "language_holder"), "get_atom", []));
	language_name = rt.at(live(f.args[1]), "language_name");
	language_datum = null;
	ld = null;
	rt.forList(f, 0, rt.gl("all_languages"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ld = $e;
		LD = live(ld);
		if (isEqual(live(language_name), rt.initial(f, live(LD), "name"))) {
			language_datum = live(LD);
		}
	}
	rt.endFor(f, 0);
	is_admin = (yield* g.call(f, P("/proc/check_rights_for"), null, [rt.fv(f, "client", live(user)), 2]));
	$0 = live(f.args[0]);
	if ($0 === "select_default") {
		if ((truthy(live(language_datum)) && truthy((yield* g.callName(f, live(AM), "can_speak_in_language", [live(language_datum)]))))) {
			rt.setFv(f, "selected_default_language", rt.sv(f, "language_holder"), live(language_datum));
			f.dot = 1;
		}
	} else if ($0 === "grant_language") {
		if (((truthy(live(is_admin)) || truthy((rt.istype(live(AM), T("/mob/dead/observer")) ? 1 : 0))) && truthy(live(language_datum)))) {
			yield* g.callName(f, rt.sv(f, "language_holder"), "grant_language", [live(language_datum)]);
			if (truthy(live(is_admin))) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ granted the ＀ language to ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), live(language_name), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(AM)]))])]);
				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ granted the language ＀ to ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(language_name), (yield* g.call(f, P("/proc/key_name"), null, [live(AM)]))])]);
			}
			f.dot = 1;
		}
	} else if ($0 === "remove_language") {
		if (((truthy(live(is_admin)) || truthy((rt.istype(live(AM), T("/mob/dead/observer")) ? 1 : 0))) && truthy(live(language_datum)))) {
			yield* g.callName(f, rt.sv(f, "language_holder"), "remove_language", [live(language_datum)]);
			if (truthy(live(is_admin))) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ removed the ＀ language to ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)])), live(language_name), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(AM)]))])]);
				yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ removed the language ＀ to ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), live(language_name), (yield* g.call(f, P("/proc/key_name"), null, [live(AM)]))])]);
			}
			f.dot = 1;
		}
	} else if ($0 === "toggle_omnitongue") {
		if (!(truthy(live(is_admin)) || truthy((rt.istype(live(AM), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
		rt.setFv(f, "omnitongue", rt.sv(f, "language_holder"), (!truthy(rt.fv(f, "omnitongue", rt.sv(f, "language_holder"))) ? 1 : 0));
		if (truthy(live(is_admin))) {
			$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(user)]));
			if (truthy(rt.fv(f, "omnitongue", rt.sv(f, "language_holder")))) {
				$1 = "enabled";
			} else {
				$1 = "disabled";
			}
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ ＀ the ability to speak all languages (that they know) of ＀.", [$0, $1, (yield* g.call(f, P("/proc/key_name_admin"), null, [live(AM)]))])]);
			$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(user)]));
			if (truthy(rt.fv(f, "omnitongue", rt.sv(f, "language_holder")))) {
				$1 = "enabled";
			} else {
				$1 = "disabled";
			}
			yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ ＀ the ability to speak all languages (that_they know) of ＀.", [$0, $1, (yield* g.call(f, P("/proc/key_name"), null, [live(AM)]))])]);
		}
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });
