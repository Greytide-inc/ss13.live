// From code/modules/language/language_holder.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2788, "/datum/language_holder", "/datum", {
	languages: null,
	shadow_languages: null,
	only_speaks_language: null,
	selected_default_language: null,
	language_menu: null,
	omnitongue: 0,
	owner: null,
});

// /datum/language_holder/proc/<init>  (code/modules/language/language_holder.dm:2)
rt.def("/datum/language_holder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "languages", rt.list(T("/datum/language/common")));
	$0 = $0;
	rt.setSv(f, "shadow_languages", rt.list());
	return f.dot;
});

// /datum/language_holder/proc/New  (code/modules/language/language_holder.dm:14)
rt.def("/datum/language_holder/proc/New", function New(f: Frame, owner: Value) {
	rt.setFv(f, "owner", live(f.src), live(owner));
	rt.setSv(f, "languages", rt.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "languages")]));
	rt.setSv(f, "shadow_languages", rt.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "shadow_languages")]));
	return f.dot;
});

// /datum/language_holder/proc/Destroy  (code/modules/language/language_holder.dm:19)  may sleep
rt.def("/datum/language_holder/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "owner", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "language_menu")]);
	rt.setSv(f, "language_menu", null);
	yield* g.callName(f, rt.sv(f, "languages"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "shadow_languages"), "Cut", []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/language_holder/proc/copy  (code/modules/language/language_holder.dm:25)
rt.def("/datum/language_holder/proc/copy", function copy(f: Frame, newowner: Value) {
	let copy: Value = null;
	f.vars = () => [copy];
	rt.setFv(f, "languages", (copy = rt.new_(f, T("/datum/language_holder"), [live(newowner)])), rt.callName(f, rt.fv(f, "languages", live(f.src)), "Copy", []));
	rt.setFv(f, "only_speaks_language", live(copy), rt.fv(f, "only_speaks_language", live(f.src)));
	rt.setFv(f, "selected_default_language", live(copy), rt.fv(f, "selected_default_language", live(f.src)));
	rt.setFv(f, "omnitongue", live(copy), rt.fv(f, "omnitongue", live(f.src)));
	return live(copy);
});

// /datum/language_holder/proc/grant_all_languages  (code/modules/language/language_holder.dm:38)
rt.def("/datum/language_holder/proc/grant_all_languages", function grant_all_languages(f: Frame, omnitongue: Value) {
	let la: Value = null;
	let $e: any;
	f.vars = () => [omnitongue, la, $e];
	if (live(omnitongue) === null) {
		omnitongue = 0;
	}
	la = null;
	rt.forList(f, 0, rt.gl("all_languages"));
	while (($e = rt.next(f, 0)) !== undefined) {
		la = $e;
		rt.callSrc(f, "grant_language", [live(la)]);
	}
	rt.endFor(f, 0);
	if (!truthy(live(omnitongue))) return f.dot;
	rt.setFv(f, "omnitongue", live(f.src), 1);
	return f.dot;
});

// /datum/language_holder/proc/get_random_understood_language  (code/modules/language/language_holder.dm:45)
rt.def("/datum/language_holder/proc/get_random_understood_language", function get_random_understood_language(f: Frame) {
	let possible: Value = null, dt: Value = null;
	let $e: any;
	f.vars = () => [possible, dt, $e];
	possible = rt.list();
	dt = null;
	rt.forList(f, 0, rt.sv(f, "languages"));
	while (($e = rt.next(f, 0)) !== undefined) {
		dt = $e;
		possible = rt.modify(live(possible), live(dt), add);
	}
	rt.endFor(f, 0);
	f.dot = rt.call(f, P("/proc/safepick"), null, [live(possible)]);
	return f.dot;
});

// /datum/language_holder/proc/remove_language  (code/modules/language/language_holder.dm:51)
rt.def("/datum/language_holder/proc/remove_language", function remove_language(f: Frame, dt: Value) {
	(rt.modSrcVar(f, "languages", live(dt), subtract));
	return f.dot;
});

// /datum/language_holder/proc/remove_all_languages  (code/modules/language/language_holder.dm:54)
rt.def("/datum/language_holder/proc/remove_all_languages", function remove_all_languages(f: Frame) {
	rt.callName(f, rt.sv(f, "languages"), "Cut", []);
	return f.dot;
});

// /datum/language_holder/proc/has_language  (code/modules/language/language_holder.dm:57)  may sleep
rt.def("/datum/language_holder/proc/has_language", function* has_language(f: Frame, dt: Value) {
	let AM: Value = null, L: Value = null;
	f.vars = () => [dt, AM, L];
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(dt), rt.sv(f, "languages")])))) {
		return "language_known";
	}
	AM = (yield* g.srcCall(f, "get_atom"));
	if (!isEqual((L = (yield* g.callName(f, live(AM), "get_language_holder", ["shadow", 0], rt.Args.Named))), live(f.src))) {
		if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(dt), rt.fv(f, "shadow_languages", live(L))])))) {
			return "language_shadowed";
		}
	}
	return 0;
}, true);

// /datum/language_holder/proc/copy_known_languages_from  (code/modules/language/language_holder.dm:69)  may sleep
rt.def("/datum/language_holder/proc/copy_known_languages_from", function* copy_known_languages_from(f: Frame, thing: Value, replace: Value) {
	let other: Value = null, AM: Value = null, M: Value = null, l: Value = null;
	let $e: any;
	f.vars = () => [thing, replace, other, AM, M, l, $e];
	if (live(replace) === null) {
		replace = 0;
	}
	other = null;
	if (truthy((rt.istype(live(thing), T("/datum/language_holder")) ? 1 : 0))) {
		other = live(thing);
	} else {
		if (truthy((rt.istype(live(thing), T("/atom/movable")) ? 1 : 0))) {
			other = (yield* g.callName(f, (AM = live(thing)), "get_language_holder", []));
		} else {
			if (truthy((rt.istype(live(thing), T("/datum/mind")) ? 1 : 0))) {
				other = (yield* g.callName(f, (M = live(thing)), "get_language_holder", []));
			}
		}
	}
	if (truthy(live(replace))) {
		yield* g.callName(f, live(f.src), "remove_all_languages", []);
	}
	l = null;
	rt.forList(f, 0, rt.fv(f, "languages", live(other)));
	while (($e = rt.next(f, 0)) !== undefined) {
		l = $e;
		yield* g.callName(f, live(f.src), "grant_language", [live(l)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/language_holder/proc/open_language_menu  (code/modules/language/language_holder.dm:86)  may sleep
rt.def("/datum/language_holder/proc/open_language_menu", function* open_language_menu(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "language_menu"))) {
		rt.setSv(f, "language_menu", (yield* g.new_(f, T("/datum/language_menu"), [live(f.src)])));
	}
	yield* g.callName(f, rt.sv(f, "language_menu"), "ui_interact", [live(user)]);
	return f.dot;
}, true);

// /datum/language_holder/proc/get_atom  (code/modules/language/language_holder.dm:91)
rt.def("/datum/language_holder/proc/get_atom", function get_atom(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(rt.sv(f, "owner"), T("/atom/movable")) ? 1 : 0))) {
		f.dot = rt.sv(f, "owner");
	} else {
		if (!truthy((rt.istype(rt.sv(f, "owner"), T("/datum/mind")) ? 1 : 0))) return f.dot;
		if (!truthy(rt.gv(f, "current", (M = rt.sv(f, "owner"))))) return f.dot;
		f.dot = rt.fv(f, "current", live(M));
	}
	return f.dot;
});

rt.type(2789, "/datum/language_holder/alien", "/datum/language_holder", {
	languages: null,
});

// /datum/language_holder/alien/proc/<init>  (code/modules/language/language_holder.dm:99)
rt.def("/datum/language_holder/alien/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "languages", rt.list(T("/datum/language/xenocommon")));
	return f.dot;
});

rt.type(2790, "/datum/language_holder/monkey", "/datum/language_holder", {
	languages: null,
});

// /datum/language_holder/monkey/proc/<init>  (code/modules/language/language_holder.dm:102)
rt.def("/datum/language_holder/monkey/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "languages", rt.list(T("/datum/language/monkey")));
	return f.dot;
});

rt.type(2791, "/datum/language_holder/swarmer", "/datum/language_holder", {
	languages: null,
});

// /datum/language_holder/swarmer/proc/<init>  (code/modules/language/language_holder.dm:105)
rt.def("/datum/language_holder/swarmer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "languages", rt.list(T("/datum/language/swarmer")));
	return f.dot;
});

rt.type(2792, "/datum/language_holder/clockmob", "/datum/language_holder", {
	languages: null,
	only_speaks_language: rt.typePath("/datum/language/ratvar"),
});

// /datum/language_holder/clockmob/proc/<init>  (code/modules/language/language_holder.dm:108)
rt.def("/datum/language_holder/clockmob/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "languages", rt.list(T("/datum/language/common"), T("/datum/language/ratvar")));
	return f.dot;
});

rt.type(2793, "/datum/language_holder/construct", "/datum/language_holder", {
	languages: null,
});

// /datum/language_holder/construct/proc/<init>  (code/modules/language/language_holder.dm:112)
rt.def("/datum/language_holder/construct/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "languages", rt.list(T("/datum/language/common"), T("/datum/language/narsie")));
	return f.dot;
});

rt.type(2794, "/datum/language_holder/drone", "/datum/language_holder", {
	languages: null,
	only_speaks_language: rt.typePath("/datum/language/drone"),
});

// /datum/language_holder/drone/proc/<init>  (code/modules/language/language_holder.dm:115)
rt.def("/datum/language_holder/drone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "languages", rt.list(T("/datum/language/common"), T("/datum/language/drone"), T("/datum/language/machine")));
	return f.dot;
});

rt.type(2796, "/datum/language_holder/slime", "/datum/language_holder", {
	languages: null,
});

// /datum/language_holder/slime/proc/<init>  (code/modules/language/language_holder.dm:122)
rt.def("/datum/language_holder/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "languages", rt.list(T("/datum/language/common"), T("/datum/language/slime")));
	return f.dot;
});

rt.type(2797, "/datum/language_holder/lightbringer", "/datum/language_holder", {
	languages: null,
});

// /datum/language_holder/lightbringer/proc/<init>  (code/modules/language/language_holder.dm:126)
rt.def("/datum/language_holder/lightbringer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "languages", rt.list(T("/datum/language/slime")));
	return f.dot;
});

rt.type(2798, "/datum/language_holder/synthetic", "/datum/language_holder", {
	languages: null,
	shadow_languages: null,
});

// /datum/language_holder/synthetic/proc/<init>  (code/modules/language/language_holder.dm:129)
rt.def("/datum/language_holder/synthetic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "languages", rt.list(T("/datum/language/common")));
	$0 = $0;
	rt.setSv(f, "shadow_languages", rt.list(T("/datum/language/common"), T("/datum/language/machine"), T("/datum/language/draconic")));
	return f.dot;
});

rt.type(2799, "/datum/language_holder/universal", "/datum/language_holder", {});

// /datum/language_holder/universal/proc/New  (code/modules/language/language_holder.dm:133)
rt.def("/datum/language_holder/universal/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "grant_all_languages", ["omnitongue", 1], rt.Args.Named);
	return f.dot;
});
