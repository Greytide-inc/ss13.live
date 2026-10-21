// From code/modules/mob/living/silicon/laws.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/proc/laws_sanity_check  (code/modules/mob/living/silicon/laws.dm:5)  may sleep
rt.def("/mob/living/silicon/proc/laws_sanity_check", function* laws_sanity_check(f: Frame) {
	if (truthy(rt.sv(f, "laws"))) return f.dot;
	yield* g.srcCall(f, "make_laws");
	return f.dot;
}, true);

// /mob/living/silicon/proc/post_lawchange  (code/modules/mob/living/silicon/laws.dm:9)  may sleep
rt.def("/mob/living/silicon/proc/post_lawchange", function* post_lawchange(f: Frame, announce: Value) {
	f.vars = () => [announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "throw_alert", "newlaw", T("/obj/screen/alert/newlaw"));
	if (!(truthy(live(announce)) && !isEqual(rt.sv(f, "last_lawchange_announce"), rt.worldTime(f)))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<b>Your laws have been changed.</b>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/silicon/proc/show_laws")])), 0]);
	rt.setSv(f, "last_lawchange_announce", rt.worldTime(f));
	return f.dot;
}, true);

// /mob/living/silicon/proc/set_law_sixsixsix  (code/modules/mob/living/silicon/laws.dm:16)  may sleep
rt.def("/mob/living/silicon/proc/set_law_sixsixsix", function* set_law_sixsixsix(f: Frame, law: Value, announce: Value) {
	f.vars = () => [law, announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "set_law_sixsixsix", [live(law)]);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/set_zeroth_law  (code/modules/mob/living/silicon/laws.dm:21)  may sleep
rt.def("/mob/living/silicon/proc/set_zeroth_law", function* set_zeroth_law(f: Frame, law: Value, law_borg: Value, announce: Value) {
	f.vars = () => [law, law_borg, announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "set_zeroth_law", [live(law), live(law_borg)]);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/add_inherent_law  (code/modules/mob/living/silicon/laws.dm:26)  may sleep
rt.def("/mob/living/silicon/proc/add_inherent_law", function* add_inherent_law(f: Frame, law: Value, announce: Value) {
	f.vars = () => [law, announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "add_inherent_law", [live(law)]);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/clear_inherent_laws  (code/modules/mob/living/silicon/laws.dm:31)  may sleep
rt.def("/mob/living/silicon/proc/clear_inherent_laws", function* clear_inherent_laws(f: Frame, announce: Value) {
	f.vars = () => [announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "clear_inherent_laws", []);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/add_supplied_law  (code/modules/mob/living/silicon/laws.dm:36)  may sleep
rt.def("/mob/living/silicon/proc/add_supplied_law", function* add_supplied_law(f: Frame, number: Value, law: Value, announce: Value) {
	f.vars = () => [number, law, announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "add_supplied_law", [live(number), live(law)]);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/clear_supplied_laws  (code/modules/mob/living/silicon/laws.dm:41)  may sleep
rt.def("/mob/living/silicon/proc/clear_supplied_laws", function* clear_supplied_laws(f: Frame, announce: Value) {
	f.vars = () => [announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "clear_supplied_laws", []);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/add_ion_law  (code/modules/mob/living/silicon/laws.dm:46)  may sleep
rt.def("/mob/living/silicon/proc/add_ion_law", function* add_ion_law(f: Frame, law: Value, announce: Value) {
	f.vars = () => [law, announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "add_ion_law", [live(law)]);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/replace_random_law  (code/modules/mob/living/silicon/laws.dm:51)  may sleep
rt.def("/mob/living/silicon/proc/replace_random_law", function* replace_random_law(f: Frame, law: Value, groups: Value, announce: Value) {
	f.vars = () => [law, groups, announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	f.dot = (yield* g.callName(f, rt.sv(f, "laws"), "replace_random_law", [live(law), live(groups)]));
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/shuffle_laws  (code/modules/mob/living/silicon/laws.dm:56)  may sleep
rt.def("/mob/living/silicon/proc/shuffle_laws", function* shuffle_laws(f: Frame, groups: Value, announce: Value) {
	f.vars = () => [groups, announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "shuffle_laws", [live(groups)]);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/remove_law  (code/modules/mob/living/silicon/laws.dm:61)  may sleep
rt.def("/mob/living/silicon/proc/remove_law", function* remove_law(f: Frame, number: Value, announce: Value) {
	f.vars = () => [number, announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	f.dot = (yield* g.callName(f, rt.sv(f, "laws"), "remove_law", [live(number)]));
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/clear_ion_laws  (code/modules/mob/living/silicon/laws.dm:66)  may sleep
rt.def("/mob/living/silicon/proc/clear_ion_laws", function* clear_ion_laws(f: Frame, announce: Value) {
	f.vars = () => [announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "clear_ion_laws", []);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/make_laws  (code/modules/mob/living/silicon/laws.dm:71)  may sleep
rt.def("/mob/living/silicon/proc/make_laws", function* make_laws(f: Frame) {
	rt.setSv(f, "laws", (yield* g.new_(f, T("/datum/ai_laws"), [])));
	yield* g.callName(f, rt.sv(f, "laws"), "set_laws_config", []);
	yield* g.callName(f, rt.sv(f, "laws"), "associate", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/silicon/proc/clear_zeroth_law  (code/modules/mob/living/silicon/laws.dm:76)  may sleep
rt.def("/mob/living/silicon/proc/clear_zeroth_law", function* clear_zeroth_law(f: Frame, force: Value, announce: Value) {
	f.vars = () => [force, announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "clear_zeroth_law", [live(force)]);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);

// /mob/living/silicon/proc/clear_law_sixsixsix  (code/modules/mob/living/silicon/laws.dm:81)  may sleep
rt.def("/mob/living/silicon/proc/clear_law_sixsixsix", function* clear_law_sixsixsix(f: Frame, force: Value, announce: Value) {
	f.vars = () => [force, announce];
	if (live(announce) === null) {
		announce = 1;
	}
	yield* g.srcCall(f, "laws_sanity_check");
	yield* g.callName(f, rt.sv(f, "laws"), "clear_law_sixsixsix", [live(force)]);
	yield* g.srcCall(f, "post_lawchange", live(announce));
	return f.dot;
}, true);
