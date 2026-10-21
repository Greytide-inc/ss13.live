// From code/modules/library/lib_codex_gigas.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7304, "/obj/item/weapon/book/codex_gigas", "/obj/item/weapon/book", {
	inUse: 0,
	currentName: "",
	currentSection: 1,
	throw_speed: 1,
	throw_range: 10,
	name: "１Codex Gigas",
	desc: "A book documenting the nature of devils.",
	icon_state: "demonomicon",
	resistance_flags: 35,
	author: "Forces beyond your comprehension",
	unique: 1,
	title: "the Codex Gigas",
});

// /obj/item/weapon/book/codex_gigas/proc/attack_self  (code/modules/library/lib_codex_gigas.dm:22)  may sleep
rt.def("/obj/item/weapon/book/codex_gigas/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let U: Value = null;
	f.vars = () => [user, U];
	if (truthy((yield* g.call(f, P("/proc/is_blind"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>As you are trying to read, you suddenly feel very stupid.</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "is_literate", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You skim through the book but can't comprehend any of it.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "inUse"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Someone else is reading it.</span>"]);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (U = live(user)), "check_acedia", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>None of this matters, why are you reading this? You put ＀ down.</span>", [rt.sv(f, "title")])]);
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ opens ＀ and begins reading intently.", [live(user), rt.sv(f, "title")])]);
	yield* g.srcCall(f, "ask_name", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/book/codex_gigas/proc/perform_research  (code/modules/library/lib_codex_gigas.dm:40)  may sleep
rt.def("/obj/item/weapon/book/codex_gigas/proc/perform_research", function* perform_research(f: Frame, user: Value, devilName: Value) {
	let speed: Value = null, correctness: Value = null, U: Value = null, usedName: Value = null, devil: Value = null;
	f.vars = () => [user, devilName, speed, correctness, U, usedName, devil];
	if (!truthy(live(devilName))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ closes ＀ without looking anything up.", [live(user), rt.sv(f, "title")])]);
		return live(f.dot);
	}
	rt.setSv(f, "inUse", 1);
	speed = 300;
	correctness = 85;
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((rt.isIn(f, rt.gv(f, "job", (U = live(user))), rt.list("Curator")) ? 1 : 0))) {
			speed = 100;
			correctness = 100;
		}
		(correctness = rt.modify(live(correctness), multiply((yield* g.callName(f, live(U), "getBrainLoss", [])), 0.5), subtract));
		speed = rt.modify(live(speed), multiply((yield* g.callName(f, live(U), "getBrainLoss", [])), 3), add);
	}
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(user), live(speed), 0, live(user)])))) {
		usedName = live(devilName);
		if (!truthy(rt.op(f, "Prob", [], [live(correctness)]))) {
			usedName = rt.modify(live(usedName), "x", add);
		}
		yield* g.srcCall(f, "display_devil", (devil = (yield* g.call(f, P("/proc/devilInfo"), null, [live(usedName)]))), live(user), live(usedName));
	}
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "book"]);
	rt.setSv(f, "inUse", 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }, {  }] });

// /obj/item/weapon/book/codex_gigas/proc/display_devil  (code/modules/library/lib_codex_gigas.dm:64)
rt.def("/obj/item/weapon/book/codex_gigas/proc/display_devil", function display_devil(f: Frame, devil: Value, reader: Value, devilName: Value) {
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any;
	f.vars = () => [$0, $1, $2, $3, $4, $5, $6];
	$0 = live(reader);
	$1 = live(devilName);
	$2 = rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "ban", live(devil)));
	$3 = rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "bane", live(devil)));
	$4 = rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "obligation", live(devil)));
	$5 = rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "banish", live(devil)));
	if (truthy(rt.fv(f, "ascendable", live(devil)))) {
		$6 = "This devil may ascend given enough souls.";
	} else {
		$6 = "";
	}
	$1 = fmt("Information on ＀<br><br><br>＀<br>＀<br>＀<br>＀<br>＀", [$1, $2, $3, $4, $5, $6]);
	if (rt.sv(f, "window_size") !== null) {
		$2 = fmt(";size=＀", [rt.sv(f, "window_size")]);
	} else {
		$2 = "";
	}
	rt.op(f, "Browse", [], [$0, $1, fmt("window=book＀", [$2])], false);
	return f.dot;
});

// /obj/item/weapon/book/codex_gigas/proc/ask_name  (code/modules/library/lib_codex_gigas.dm:67)  may sleep
rt.def("/obj/item/weapon/book/codex_gigas/proc/ask_name", function* ask_name(f: Frame, reader: Value) {
	f.vars = () => [reader];
	yield* g.srcCall(f, "ui_interact", live(reader));
	return f.dot;
}, true);

// /obj/item/weapon/book/codex_gigas/proc/ui_act  (code/modules/library/lib_codex_gigas.dm:70)  may sleep
rt.def("/obj/item/weapon/book/codex_gigas/proc/ui_act", function* ui_act(f: Frame) {
	let oldSection: Value = null;
	f.vars = () => [oldSection];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy(live(f.args[0]))) {
		return 0;
	}
	if (isEqual(live(f.args[0]), "search")) {
		yield* g.callName(f, rt.gl("SStgui"), "close_uis", [live(f.src)]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/book/codex_gigas/proc/perform_research"), live(f.usr), rt.sv(f, "currentName")])), 0]);
		rt.setSv(f, "currentName", "");
		rt.setSv(f, "currentSection", 1);
		return 0;
	} else {
		rt.modSrcVar(f, "currentName", live(f.args[0]), add);
	}
	oldSection = rt.sv(f, "currentSection");
	if (truthy((yield* g.callName(f, rt.gl("devil_pre_title"), "Find", [live(f.args[0])])))) {
		rt.setSv(f, "currentSection", 2);
	} else {
		if (truthy((yield* g.callName(f, rt.gl("devil_title"), "Find", [live(f.args[0])])))) {
			rt.setSv(f, "currentSection", 3);
		} else {
			if (truthy((yield* g.callName(f, rt.gl("devil_syllable"), "Find", [live(f.args[0])])))) {
				if (rt.ge(rt.sv(f, "currentSection"), 3)) {
					rt.setSv(f, "currentSection", 4);
				} else {
					rt.setSv(f, "currentSection", 3);
				}
			} else {
				if (truthy((yield* g.callName(f, rt.gl("devil_suffix"), "Find", [live(f.args[0])])))) {
					rt.setSv(f, "currentSection", 5);
				}
			}
		}
	}
	return (!isEqual(rt.sv(f, "currentSection"), live(oldSection)) ? 1 : 0);
}, true, { args: ["action", "params"] });

// /obj/item/weapon/book/codex_gigas/proc/ui_interact  (code/modules/library/lib_codex_gigas.dm:98)  may sleep
rt.def("/obj/item/weapon/book/codex_gigas/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "codex_gigas", rt.sv(f, "name"), 450, 450, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/item/weapon/book/codex_gigas/proc/ui_data  (code/modules/library/lib_codex_gigas.dm:104)
rt.def("/obj/item/weapon/book/codex_gigas/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "name", rt.sv(f, "currentName"));
	rt.setAt(live(data), "currentSection", rt.sv(f, "currentSection"));
	return live(data);
});
