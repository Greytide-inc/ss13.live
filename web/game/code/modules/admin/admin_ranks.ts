// From code/modules/admin/admin_ranks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaladmin_ranks  (code/modules/admin/admin_ranks.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_ranks", function InitGlobaladmin_ranks(f: Frame) {
	rt.setGl("admin_ranks", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "admin_ranks", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladmin_ranks  (code/modules/admin/admin_ranks.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobaladmin_ranks", function InitGlobaladmin_ranks(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "admin_ranks", add);
	return f.dot;
});

rt.type(1838, "/datum/admin_rank", "/datum", {
	name: "NoRank",
	rights: 0,
	adds: null,
	subs: null,
});

// /datum/admin_rank/proc/New  (code/modules/admin/admin_ranks.dm:11)
rt.def("/datum/admin_rank/proc/New", function New(f: Frame, init_name: Value, init_rights: Value, init_adds: Value, init_subs: Value) {
	let $0: any;
	f.vars = () => [init_adds, init_subs, $0];
	rt.setSv(f, "name", live(init_name));
	$0 = rt.sv(f, "name");
	if ($0 === "Removed" || isEqual($0, null) || $0 === "") {
		rt.spawnTail(f, 0, "/datum/admin_rank/proc/New: spawn at modules/admin/admin_ranks.dm:14", init_name, init_rights, init_adds, init_subs);
		rt.throw_(f, rt.new_(f, T("/exception"), ["invalid admin-rank name", "code/modules/admin/admin_ranks.dm", 16]));
		return live(f.dot);
	}
	if (truthy(live(init_rights))) {
		rt.setSv(f, "rights", live(init_rights));
	}
	if (!truthy(live(init_adds))) {
		init_adds = rt.list();
	}
	if (!truthy(live(init_subs))) {
		init_subs = rt.list();
	}
	rt.setSv(f, "adds", live(init_adds));
	rt.setSv(f, "subs", live(init_subs));
	return f.dot;
});

// a spawn(0) body of /datum/admin_rank/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/admin_rank/proc/New: spawn at modules/admin/admin_ranks.dm:14", function* (f: Frame, init_name: Value, init_rights: Value, init_adds: Value, init_subs: Value) {
	f.vars = () => [init_name, init_rights, init_adds, init_subs];
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return null;
});

// /proc/admin_keyword_to_flag  (code/modules/admin/admin_ranks.dm:35)
rt.def("/proc/admin_keyword_to_flag", function admin_keyword_to_flag(f: Frame, word: Value, previous_rights: Value) {
	let flag: Value = null;
	let $0: any;
	f.vars = () => [previous_rights, flag, $0];
	if (live(previous_rights) === null) {
		previous_rights = 0;
	}
	flag = 0;
	$0 = rt.call(f, P("/proc/ckey"), null, [live(word)]);
	if ($0 === "buildmode" || $0 === "build") {
		flag = 1;
	} else if ($0 === "admin") {
		flag = 2;
	} else if ($0 === "ban") {
		flag = 4;
	} else if ($0 === "fun") {
		flag = 8;
	} else if ($0 === "server") {
		flag = 16;
	} else if ($0 === "debug") {
		flag = 32;
	} else if ($0 === "permissions" || $0 === "rights") {
		flag = 128;
	} else if ($0 === "possess") {
		flag = 64;
	} else if ($0 === "stealth") {
		flag = 256;
	} else if ($0 === "poll") {
		flag = 512;
	} else if ($0 === "varedit") {
		flag = 1024;
	} else if ($0 === "everything" || $0 === "host" || $0 === "all") {
		flag = 65535;
	} else if ($0 === "sound" || $0 === "sounds") {
		flag = 2048;
	} else if ($0 === "spawn" || $0 === "create") {
		flag = 4096;
	} else if ($0 === "@" || $0 === "prev") {
		flag = live(previous_rights);
	} else if ($0 === "rejuv" || $0 === "rejuvinate") {
		rt.call(f, P("/proc/stack_trace"), null, ["Legacy keyword rejuvinate used defaulting to R_ADMIN"]);
		flag = 2;
	}
	return live(flag);
});

// /proc/admin_keyword_to_path  (code/modules/admin/admin_ranks.dm:72)
rt.def("/proc/admin_keyword_to_path", function admin_keyword_to_path(f: Frame, word: Value) {
	return rt.call(f, P("/proc/text2path"), null, [rt.call(f, P("/proc/copytext"), null, [live(word), 2, rt.call(f, P("/proc/findtext"), null, [live(word), " ", 2, 0])])]);
});

// /datum/admin_rank/proc/process_keyword  (code/modules/admin/admin_ranks.dm:76)
rt.def("/datum/admin_rank/proc/process_keyword", function process_keyword(f: Frame, word: Value, previous_rights: Value) {
	let flag: Value = null, path: Value = null;
	let $0: any;
	f.vars = () => [previous_rights, flag, path, $0];
	if (live(previous_rights) === null) {
		previous_rights = 0;
	}
	if (truthy((flag = rt.call(f, P("/proc/admin_keyword_to_flag"), null, [live(word), live(previous_rights)])))) {
		$0 = rt.call(f, P("/proc/text2ascii"), null, [live(word), 1]);
		if ($0 === 43) {
			(rt.modSrcVar(f, "rights", live(flag), rt.bitOr));
		} else if ($0 === 45) {
			(rt.modSrcVar(f, "rights", rt.op(f, "BitNot", [], [live(flag)]), rt.bitAnd));
		}
	} else {
		if (!truthy((path = rt.call(f, P("/proc/admin_keyword_to_path"), null, [live(word)])))) return f.dot;
		$0 = rt.call(f, P("/proc/text2ascii"), null, [live(word), 1]);
		if ($0 === 43) {
			if (!truthy(rt.callName(f, rt.sv(f, "subs"), "Remove", [live(path)]))) {
				rt.modSrcVar(f, "adds", live(path), add);
			}
		} else if ($0 === 45) {
			if (truthy(rt.callName(f, rt.sv(f, "adds"), "Remove", [live(path)]))) return f.dot;
			rt.modSrcVar(f, "subs", live(path), add);
		}
	}
	return f.dot;
});

// /datum/admins/proc/check_keyword  (code/modules/admin/admin_ranks.dm:97)
rt.def("/datum/admins/proc/check_keyword", function check_keyword(f: Frame, word: Value) {
	let flag: Value = null, path: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [flag, path, i, $e];
	if (truthy((flag = rt.call(f, P("/proc/admin_keyword_to_flag"), null, [live(word)])))) {
		return (isEqual(rt.bitAnd(rt.fv(f, "rights", rt.sv(f, "rank")), live(flag)), live(flag)) ? 1 : 0);
	}
	path = rt.call(f, P("/proc/admin_keyword_to_path"), null, [live(word)]);
	i = null;
	rt.forList(f, 0, rt.fv(f, "verbs", rt.sv(f, "owner")));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (isEqual(live(i), live(path))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /proc/load_admin_ranks  (code/modules/admin/admin_ranks.dm:109)
rt.def("/proc/load_admin_ranks", function load_admin_ranks(f: Frame) {
	let previous_rights: Value = null, line: Value = null, next: Value = null, R: Value = null, prev: Value = null;
	let $e: any;
	f.vars = () => [previous_rights, line, next, R, prev, $e];
	rt.callName(f, rt.gl("admin_ranks"), "Cut", []);
	previous_rights = 0;
	line = null;
	rt.forList(f, 0, rt.callName(f, rt.world(), "file2list", ["config/admin_ranks.txt"]));
	while (($e = rt.next(f, 0)) !== undefined) {
		line = $e;
		if (!truthy(live(line))) {
			continue;
		}
		if (truthy(rt.call(f, P("/proc/findtextEx"), null, [live(line), "#", 1, 2]))) {
			continue;
		}
		next = rt.call(f, P("/proc/findtext"), null, [live(line), "="]);
		if (!truthy((R = rt.new_(f, T("/datum/admin_rank"), [rt.call(f, P("/proc/ckeyEx"), null, [rt.call(f, P("/proc/copytext"), null, [live(line), 1, live(next)])])])))) {
			continue;
		}
		rt.modGl("admin_ranks", live(R), add);
		prev = rt.call(f, P("/proc/findchar"), null, [live(line), "+-", live(next), 0]);
		while (truthy(live(prev))) {
			next = rt.call(f, P("/proc/findchar"), null, [live(line), "+-", add(live(prev), 1), 0]);
			rt.callName(f, live(R), "process_keyword", [rt.call(f, P("/proc/copytext"), null, [live(line), live(prev), live(next)]), live(previous_rights)]);
			prev = live(next);
		}
		previous_rights = rt.fv(f, "rights", live(R));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/load_admins  (code/modules/admin/admin_ranks.dm:167)  may sleep
rt.def("/proc/load_admins", function* load_admins(f: Frame, target: Value) {
	let C: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [target, C, A, $e];
	if (live(target) === null) {
		target = null;
	}
	if (!truthy(live(target))) {
		yield* g.callName(f, rt.gl("admin_datums"), "Cut", []);
		C = null;
		rt.forList(f, 0, rt.gl("admins"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			yield* g.callName(f, live(C), "remove_admin_verbs", []);
			rt.setFv(f, "holder", live(C), null);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.gl("admins"), "Cut", []);
		yield* g.call(f, P("/proc/load_admin_ranks"), null, []);
		A = null;
		rt.forList(f, 0, (yield* g.callName(f, rt.world(), "GetConfig", ["admin"])));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			yield* g.callName(f, rt.world(), "SetConfig", ["APP/admin", live(A), null]);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);
