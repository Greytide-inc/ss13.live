// From code/modules/admin/verbs/debug.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/Debug2  (code/modules/admin/verbs/debug.dm:4)
rt.def("/client/proc/Debug2", function Debug2(f: Frame) {
	if (!truthy(rt.call(f, P("/proc/check_rights"), null, [32]))) {
		return live(f.dot);
	}
	if (truthy(rt.gl("Debug2"))) {
		rt.setGl("Debug2", 0);
		rt.call(f, P("/proc/message_admins"), null, [fmt("＀ toggled debugging off.", [rt.call(f, P("/proc/key_name"), null, [live(f.src)])])]);
		rt.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled debugging off.", [rt.call(f, P("/proc/key_name"), null, [live(f.src)])])]);
	} else {
		rt.setGl("Debug2", 1);
		rt.call(f, P("/proc/message_admins"), null, [fmt("＀ toggled debugging on.", [rt.call(f, P("/proc/key_name"), null, [live(f.src)])])]);
		rt.call(f, P("/proc/log_admin"), null, [fmt("＀ toggled debugging on.", [rt.call(f, P("/proc/key_name"), null, [live(f.src)])])]);
	}
	return f.dot;
}, false, { verb: { name: "Debug-Game", category: "Debug" } });

// /client/proc/callproc  (code/modules/admin/verbs/debug.dm:34)  may sleep
rt.def("/client/proc/callproc", function* callproc(f: Frame) {
	let target: Value = null, targetselected: Value = null, returnval: Value = null, value: Value = null, procname: Value = null, testname: Value = null, procpath: Value = null, lst: Value = null, msg: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [target, targetselected, returnval, value, procname, testname, procpath, lst, msg, $0, $1, $2, $3];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
		return live(f.dot);
	}
	target = null;
	targetselected = 0;
	returnval = null;
	$0 = (yield* g.call(f, P("/proc/alert"), null, ["Proc owned by something?", null, "Yes", "No"]));
	if ($0 === "Yes") {
		targetselected = 1;
		if ((!truthy(rt.index((value = (yield* g.callSrc(f, "vv_get_value", ["default_class", "Atom Reference", "classes", rt.list("Atom Reference", "Datum Reference", "Mob Reference", "Client")], rt.Args.Named))), "class")) || !truthy(rt.at(live(value), "value")))) {
			return live(f.dot);
		}
		target = rt.at(live(value), "value");
	} else if ($0 === "No") {
		target = null;
		targetselected = 0;
	}
	if (!truthy((procname = (yield* g.op(f, "Prompt", [3], [null, null, "Path:", "Proc path, eg: /proc/fake_blood", null]))))) {
		return live(f.dot);
	}
	testname = live(procname);
	if (truthy(live(targetselected))) {
		if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(procname), "/proc/"])))) {
			testname = (yield* g.call(f, P("/proc/replacetext"), null, [live(procname), "/proc/", ""]));
		} else {
			if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(procname), "/proc"])))) {
				testname = (yield* g.call(f, P("/proc/replacetext"), null, [live(procname), "/proc", ""]));
			} else {
				if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(procname), "proc/"])))) {
					testname = (yield* g.call(f, P("/proc/replacetext"), null, [live(procname), "proc/", ""]));
				}
			}
		}
		testname = (yield* g.call(f, P("/proc/replacetext"), null, [live(testname), "()", ""]));
	}
	if ((truthy(live(targetselected)) && !truthy((yield* g.call(f, P("/proc/hascall"), null, [live(target), live(testname)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<font color='red'>Error: callproc(): type ＀ has no proc named ＀.</font>", [rt.fv(f, "type", live(target)), live(procname)])]);
		return live(f.dot);
	} else {
		if (!truthy((procpath = (yield* g.call(f, P("/proc/text2path"), null, [live(procname)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<font color='red'>Error: callproc(): proc ＀ does not exist. (Did you forget the /proc/ part?)</font>", [live(procname)])]);
			return live(f.dot);
		}
	}
	if (!truthy((lst = (yield* g.srcCall(f, "get_callproc_args"))))) {
		return live(f.dot);
	}
	if (truthy(live(targetselected))) {
		if (!truthy(live(target))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<font color='red'>Error: callproc(): owner of proc no longer exists.</font>"]);
			return live(f.dot);
		}
		$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]));
		$1 = live(target);
		$2 = live(procname);
		if (truthy(rt.len(f, live(lst)))) {
			$3 = fmt("the arguments ＀", [(yield* g.call(f, P("/proc/list2params"), null, [live(lst)]))]);
		} else {
			$3 = "no arguments";
		}
		yield* g.call(f, P("/proc/log_admin"), null, [(msg = fmt("＀ called ＀'s ＀() with ＀.", [$0, $1, $2, $3]))]);
		yield* g.call(f, P("/proc/message_admins"), null, [live(msg)]);
		yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(target), live(msg)]);
		returnval = (yield* g.call(f, P("/proc/WrapAdminProcCall"), null, [live(target), live(procname), live(lst)]));
	} else {
		$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]));
		$1 = live(procname);
		if (truthy(rt.len(f, live(lst)))) {
			$2 = fmt("the arguments ＀", [(yield* g.call(f, P("/proc/list2params"), null, [live(lst)]))]);
		} else {
			$2 = "no arguments";
		}
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ called ＀() with ＀.", [$0, $1, $2])]);
		$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]));
		$1 = live(procname);
		if (truthy(rt.len(f, live(lst)))) {
			$2 = fmt("the arguments ＀", [(yield* g.call(f, P("/proc/list2params"), null, [live(lst)]))]);
		} else {
			$2 = "no arguments";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ called ＀() with ＀.", [$0, $1, $2])]);
		returnval = (yield* g.call(f, P("/proc/WrapAdminProcCall"), null, ["some_magic_bullshit", live(procname), live(lst)]));
	}
	f.dot = (yield* g.srcCall(f, "get_callproc_returnval", live(returnval), live(procname)));
	if (truthy(live(f.dot))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), live(f.dot)]);
	}
	return f.dot;
}, true, { waitfor: false, verb: { name: "Advanced ProcCall", category: "Debug" } });

// /datum/controller/global_vars/proc/InitGlobalAdminProcCaller  (code/modules/admin/verbs/debug.dm:99)
rt.def("/datum/controller/global_vars/proc/InitGlobalAdminProcCaller", function InitGlobalAdminProcCaller(f: Frame) {
	rt.setGl("AdminProcCaller", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "AdminProcCaller", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalAdminProcCaller  (code/modules/admin/verbs/debug.dm:100)
rt.def("/datum/controller/global_vars/proc/InitGlobalAdminProcCaller", function InitGlobalAdminProcCaller(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "AdminProcCaller", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalAdminProcCallCount  (code/modules/admin/verbs/debug.dm:101)
rt.def("/datum/controller/global_vars/proc/InitGlobalAdminProcCallCount", function InitGlobalAdminProcCallCount(f: Frame) {
	rt.setGl("AdminProcCallCount", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "AdminProcCallCount", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalAdminProcCallCount  (code/modules/admin/verbs/debug.dm:102)
rt.def("/datum/controller/global_vars/proc/InitGlobalAdminProcCallCount", function InitGlobalAdminProcCallCount(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "gvars_datum_protected_varlist", "AdminProcCallCount", add);
	return f.dot;
});

// /proc/WrapAdminProcCall  (code/modules/admin/verbs/debug.dm:105)  may sleep
rt.def("/proc/WrapAdminProcCall", function* WrapAdminProcCall(f: Frame, target: Value, procname: Value, _arguments: Value) {
	let current_caller: Value = null, ckey: Value = null;
	f.vars = () => [target, procname, _arguments, current_caller, ckey];
	current_caller = rt.gl("AdminProcCaller");
	ckey = rt.gv(f, "ckey", rt.fv(f, "client", live(f.usr)));
	if ((truthy(live(current_caller)) && !isEqual(live(current_caller), live(ckey)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='adminnotice'>Another set of admin called procs are still running, your proc will be run after theirs finish.</span>"]);
		while (truthy(rt.gl("AdminProcCaller"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='adminnotice'>Running your proc</span>"]);
	}
	rt.setGl("AdminProcCaller", live(ckey));
	rt.incGl("AdminProcCallCount", 1, false);
	f.dot = (yield* g.callName(f, rt.world(), "WrapAdminProcCall", [live(target), live(procname), live(_arguments)]));
	if (!isEqual(rt.incGl("AdminProcCallCount", -1, false), 0)) return f.dot;
	rt.setGl("AdminProcCaller", null);
	return f.dot;
}, true);

// /world/proc/WrapAdminProcCall  (code/modules/admin/verbs/debug.dm:119)  may sleep
rt.def("/world/proc/WrapAdminProcCall", function* WrapAdminProcCall(f: Frame, target: Value, procname: Value, _arguments: Value) {
	f.vars = () => [target, procname, _arguments];
	if (isEqual(live(target), "some_magic_bullshit")) {
		return (yield* g.callDyn(f, live(procname), undefined, [live(_arguments)], rt.Args.List));
	}
	return (yield* g.callDyn(f, live(target), live(procname), [live(_arguments)], rt.Args.List));
}, true);

// /client/proc/callproc_datum  (code/modules/admin/verbs/debug.dm:136)  may sleep
rt.def("/client/proc/callproc_datum", function* callproc_datum(f: Frame, A: Value) {
	let procname: Value = null, lst: Value = null, msg: Value = null, returnval: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [A, procname, lst, msg, returnval, $0, $1, $2, $3];
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [32])))) {
		return live(f.dot);
	}
	if (!truthy((procname = (yield* g.op(f, "Prompt", [3], [null, null, "Proc:", "Proc name, eg: fake_blood", null]))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/hascall"), null, [live(A), live(procname)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<font color='red'>Error: callproc_datum(): type ＀ has no proc named ＀.</font>", [rt.fv(f, "type", live(A)), live(procname)])]);
		return live(f.dot);
	}
	if (!truthy((lst = (yield* g.srcCall(f, "get_callproc_args"))))) {
		return live(f.dot);
	}
	if ((!truthy(live(A)) || !truthy((yield* g.call(f, P("/proc/IsValidSrc"), null, [live(A)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Error: callproc_datum(): owner of proc no longer exists.</span>"]);
		return live(f.dot);
	}
	$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]));
	$1 = live(A);
	$2 = live(procname);
	if (truthy(rt.len(f, live(lst)))) {
		$3 = fmt("the arguments ＀", [(yield* g.call(f, P("/proc/list2params"), null, [live(lst)]))]);
	} else {
		$3 = "no arguments";
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ called ＀'s ＀() with ＀.", [$0, $1, $2, $3])]);
	$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]));
	$1 = live(A);
	$2 = live(procname);
	if (truthy(rt.len(f, live(lst)))) {
		$3 = fmt("the arguments ＀", [(yield* g.call(f, P("/proc/list2params"), null, [live(lst)]))]);
	} else {
		$3 = "no arguments";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("＀ called ＀'s ＀() with ＀.", [$0, $1, $2, $3]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(A), live(msg)]);
	f.dot = (yield* g.srcCall(f, "get_callproc_returnval", (returnval = (yield* g.call(f, P("/proc/WrapAdminProcCall"), null, [live(A), live(procname), live(lst)]))), live(procname)));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), live(f.dot)]);
	return f.dot;
}, true, { waitfor: false, verb: { name: "Atom ProcCall", category: "Debug" }, argTypes: [{ type: 157, path: "/datum" }] });

// /client/proc/get_callproc_args  (code/modules/admin/verbs/debug.dm:166)  may sleep
rt.def("/client/proc/get_callproc_args", function* get_callproc_args(f: Frame) {
	let argnum: Value = null, named_args: Value = null, named_arg: Value = null, value: Value = null;
	let $t: any;
	f.vars = () => [argnum, named_args, named_arg, value, $t];
	if ((argnum = (yield* g.op(f, "Prompt", [33], [null, 0, "Number:", "Number of arguments", null]))) === null) {
		return live(f.dot);
	}
	f.dot = rt.list();
	named_args = rt.list();
	while (truthy(($t = live(argnum), argnum = rt.inc($t, -1), $t))) {
		named_arg = (yield* g.op(f, "Prompt", [3], [null, null, "Named argument", "Leave blank for positional argument. Positional arguments will be considered as if they were added first.", null]));
		if (!truthy(rt.index((value = (yield* g.callSrc(f, "vv_get_value", ["restricted_classes", rt.list("Restore to Default")], rt.Args.Named))), "class"))) {
			return live(f.dot);
		}
		if (truthy(live(named_arg))) {
			rt.setAt(live(named_args), live(named_arg), rt.at(live(value), "value"));
		} else {
			f.dot = rt.modify(live(f.dot), rt.at(live(value), "value"), add);
		}
	}
	if (!truthy(rt.length(live(named_args)))) return f.dot;
	f.dot = rt.modify(live(f.dot), live(named_args), add);
	return f.dot;
}, true);

// /client/proc/get_callproc_returnval  (code/modules/admin/verbs/debug.dm:185)
rt.def("/client/proc/get_callproc_returnval", function get_callproc_returnval(f: Frame, returnval: Value, procname: Value) {
	let returnedlist: Value = null, assoc_check: Value = null, key: Value = null, elem: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [returnedlist, assoc_check, key, elem, $0, $1, $e];
	f.dot = "";
	if (truthy((rt.istype(live(returnval), T("/list")) ? 1 : 0))) {
		returnedlist = live(returnval);
		f.dot = "<font color='blue'>";
		if (truthy(rt.len(f, live(returnedlist)))) {
			if ((truthy(rt.call(f, P("/proc/istext"), null, [(assoc_check = rt.index(live(returnedlist), 1))])) && rt.index(live(returnedlist), live(assoc_check)) !== null)) {
				f.dot = rt.modify(live(f.dot), fmt("＀ returned an associative list:", [live(procname)]), add);
				key = null;
				rt.forList(f, 0, live(returnedlist));
				while (($e = rt.next(f, 0)) !== undefined) {
					key = $e;
					f.dot = rt.modify(live(f.dot), fmt("\n＀ = ＀", [live(key), rt.index(live(returnedlist), live(key))]), add);
				}
				rt.endFor(f, 0);
			} else {
				f.dot = rt.modify(live(f.dot), fmt("＀ returned a list:", [live(procname)]), add);
				elem = null;
				rt.forList(f, 0, live(returnedlist));
				while (($e = rt.next(f, 0)) !== undefined) {
					elem = $e;
					f.dot = rt.modify(live(f.dot), fmt("\n＀", [live(elem)]), add);
				}
				rt.endFor(f, 0);
			}
		} else {
			f.dot = fmt("＀ returned an empty list", [live(procname)]);
		}
		f.dot = rt.modify(live(f.dot), "</font>", add);
	} else {
		$0 = live(procname);
		if (live(returnval) !== null) {
			$1 = live(returnval);
		} else {
			$1 = "null";
		}
		f.dot = fmt("<font color='blue'>＀ returned: ＀</font>", [$0, $1]);
	}
	return f.dot;
});

// /client/proc/Cell  (code/modules/admin/verbs/debug.dm:211)
rt.def("/client/proc/Cell", function Cell(f: Frame) {
	let _T: Value = null, env: Value = null, env_gases: Value = null, t: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [_T, env, env_gases, t, id, $e];
	if (!truthy(rt.sv(f, "mob"))) {
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [(_T = rt.fv(f, "loc", rt.sv(f, "mob")))]))) {
		return live(f.dot);
	}
	env = rt.callName(f, live(_T), "return_air", []);
	env_gases = rt.fv(f, "gases", live(env));
	t = "";
	id = null;
	rt.forList(f, 0, live(env_gases));
	while (($e = rt.next(f, 0)) !== undefined) {
		id = $e;
		if (truthy((rt.isIn(f, live(id), (rt.gl("hardcoded_gases") || rt.index(rt.index(live(env_gases), live(id)), 1))) ? 1 : 0))) {
			t = rt.modify(live(t), fmt("＀ : ＀\n", [rt.index(rt.index(rt.index(live(env_gases), live(id)), 3), 2), rt.index(rt.index(live(env_gases), live(id)), 1)]), add);
		}
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), live(t)]);
	return f.dot;
}, false, { verb: { name: "Air Status in Location", category: "Debug" } });

// /client/proc/cmd_admin_robotize  (code/modules/admin/verbs/debug.dm:233)  may sleep
rt.def("/client/proc/cmd_admin_robotize", function* cmd_admin_robotize(f: Frame, M: Value) {
	let H: Value = null;
	f.vars = () => [M, H];
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/alert"), null, ["Wait until the game starts"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has robotized ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), rt.fv(f, "key", live(M))])]);
		H = live(M);
		rt.spawnTail(f, 0, "/client/proc/cmd_admin_robotize: spawn at modules/admin/verbs/debug.dm:239", M, H);
	} else {
		yield* g.call(f, P("/proc/alert"), null, ["Invalid mob"]);
	}
	return f.dot;
}, true, { verb: { name: "Make Robot", category: "Fun" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// a spawn(0) body of /client/proc/cmd_admin_robotize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_robotize: spawn at modules/admin/verbs/debug.dm:239", function* (f: Frame, M: Value, H: Value) {
	f.vars = () => [M, H];
	yield* g.callName(f, live(H), "Robotize", []);
	return null;
});

// /client/proc/cmd_admin_blobize  (code/modules/admin/verbs/debug.dm:249)  may sleep
rt.def("/client/proc/cmd_admin_blobize", function* cmd_admin_blobize(f: Frame, M: Value) {
	let H: Value = null, B: Value = null;
	f.vars = () => [M, H, B];
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/alert"), null, ["Wait until the game starts"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has blobized ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), rt.fv(f, "key", live(M))])]);
		H = live(M);
		rt.spawnTail(f, 0, "/client/proc/cmd_admin_blobize: spawn at modules/admin/verbs/debug.dm:255", M, H, B);
	} else {
		yield* g.call(f, P("/proc/alert"), null, ["Invalid mob"]);
	}
	return f.dot;
}, true, { verb: { name: "Make Blob", category: "Fun" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// a spawn(0) body of /client/proc/cmd_admin_blobize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_blobize: spawn at modules/admin/verbs/debug.dm:255", function* (f: Frame, M: Value, H: Value, B: Value) {
	f.vars = () => [M, H, B];
	yield* g.callName(f, (B = (yield* g.callName(f, live(H), "become_overmind", [0]))), "place_blob_core", [rt.fv(f, "base_point_rate", live(B)), -1]);
	return null;
});

// /client/proc/cmd_admin_animalize  (code/modules/admin/verbs/debug.dm:267)  may sleep
rt.def("/client/proc/cmd_admin_animalize", function* cmd_admin_animalize(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/alert"), null, ["Wait until the game starts"]);
		return live(f.dot);
	}
	if (!truthy(live(M))) {
		yield* g.call(f, P("/proc/alert"), null, ["That mob doesn't seem to exist, close the panel and try again."]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(M), T("/mob/dead/new_player")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/alert"), null, ["The mob must not be a new_player."]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has animalized ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), rt.fv(f, "key", live(M))])]);
	rt.spawnTail(f, 0, "/client/proc/cmd_admin_animalize: spawn at modules/admin/verbs/debug.dm:280", M);
	return f.dot;
}, true, { verb: { name: "Make Simple Animal", category: "Fun" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// a spawn(0) body of /client/proc/cmd_admin_animalize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_animalize: spawn at modules/admin/verbs/debug.dm:280", function* (f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "Animalize", []);
	return null;
});

// /client/proc/makepAI  (code/modules/admin/verbs/debug.dm:289)  may sleep
rt.def("/client/proc/makepAI", function* makepAI(f: Frame, _T: Value) {
	let available: Value = null, C: Value = null, choice: Value = null, confirm: Value = null, card: Value = null, pai: Value = null, candidate: Value = null;
	let $e: any;
	f.vars = () => [_T, available, C, choice, confirm, card, pai, candidate, $e];
	available = rt.list();
	C = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy(rt.fv(f, "key", live(C)))) {
			yield* g.callName(f, live(available), "Add", [live(C)]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy((choice = (yield* g.op(f, "Prompt", [0], [null, null, "Spawn pAI", "Choose a player to play the pAI", live(available)]))))) {
		return 0;
	}
	if (!truthy((rt.istype(live(choice), T("/mob/dead/observer")) ? 1 : 0))) {
		if (!isEqual((confirm = (yield* g.op(f, "Prompt", [0], [null, "No", "Spawn pAI Confirmation", fmt("＀ isn't ghosting right now. Are you sure you want to yank him out of them out of their body and place them in this pAI?", [rt.fv(f, "key", live(choice))]), rt.list("Yes", "No")]))), "Yes")) {
			return 0;
		}
	}
	card = (yield* g.new_(f, T("/obj/item/device/paicard"), [live(_T)]));
	rt.setFv(f, "name", (pai = (yield* g.new_(f, T("/mob/living/silicon/pai"), [live(card)]))), (yield* g.op(f, "Prompt", [2], ["Personal AI", "pAI Name", "Enter your pAI name:", live(choice), null])));
	rt.setFv(f, "real_name", live(pai), rt.fv(f, "name", live(pai)));
	rt.setFv(f, "key", live(pai), rt.fv(f, "key", live(choice)));
	yield* g.callName(f, live(card), "setPersonality", [live(pai)]);
	candidate = null;
	rt.forList(f, 0, rt.fv(f, "candidates", rt.gl("SSpai")), T("/datum/paiCandidate"));
	while (($e = rt.next(f, 0)) !== undefined) {
		candidate = $e;
		if (isEqual(rt.fv(f, "key", live(candidate)), rt.fv(f, "key", live(choice)))) {
			yield* g.callName(f, rt.fv(f, "candidates", rt.gl("SSpai")), "Remove", [live(candidate)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "Make pAI", category: "Fun", desc: "Specify a location to spawn a pAI device, then specify a key to play that pAI" }, argTypes: [{ path: "/turf", source: "?" }] });

// /client/proc/cmd_admin_alienize  (code/modules/admin/verbs/debug.dm:315)  may sleep
rt.def("/client/proc/cmd_admin_alienize", function* cmd_admin_alienize(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/alert"), null, ["Wait until the game starts"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has alienized ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), rt.fv(f, "key", live(M))])]);
		rt.spawnTail(f, 0, "/client/proc/cmd_admin_alienize: spawn at modules/admin/verbs/debug.dm:320", M);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ made ＀ into an alien.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)]))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ made ＀ into an alien.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)]))])]);
	} else {
		yield* g.call(f, P("/proc/alert"), null, ["Invalid mob"]);
	}
	return f.dot;
}, true, { verb: { name: "Make Alien", category: "Fun" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// a spawn(0) body of /client/proc/cmd_admin_alienize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_alienize: spawn at modules/admin/verbs/debug.dm:320", function* (f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "Alienize", []);
	return null;
});

// /client/proc/cmd_admin_slimeize  (code/modules/admin/verbs/debug.dm:332)  may sleep
rt.def("/client/proc/cmd_admin_slimeize", function* cmd_admin_slimeize(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/alert"), null, ["Wait until the game starts"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has slimeized ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), rt.fv(f, "key", live(M))])]);
		rt.spawnTail(f, 0, "/client/proc/cmd_admin_slimeize: spawn at modules/admin/verbs/debug.dm:337", M);
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ made ＀ into a slime.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)]))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ made ＀ into a slime.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)]))])]);
	} else {
		yield* g.call(f, P("/proc/alert"), null, ["Invalid mob"]);
	}
	return f.dot;
}, true, { verb: { name: "Make slime", category: "Fun" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// a spawn(0) body of /client/proc/cmd_admin_slimeize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/cmd_admin_slimeize: spawn at modules/admin/verbs/debug.dm:337", function* (f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "slimeize", []);
	return null;
});

// /proc/make_types_fancy  (code/modules/admin/verbs/debug.dm:346)
rt.def("/proc/make_types_fancy", function make_types_fancy(f: Frame, types: Value) {
	let type: Value = null, typename: Value = null, tn: Value = null;
	let $e: any;
	f.vars = () => [types, type, typename, tn, $e];
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(types)]))) {
		types = rt.list(live(types));
	}
	f.dot = rt.list();
	type = null;
	rt.forList(f, 0, live(types));
	while (($e = rt.next(f, 0)) !== undefined) {
		type = $e;
		typename = fmt("＀", [live(type)]);
		tn = null;
		rt.forList(f, 1, rt.gl("TYPES_SHORTCUTS"));
		while (($e = rt.next(f, 1)) !== undefined) {
			tn = $e;
			if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(typename), 1, add(rt.length(fmt("＀/", [live(tn)])), 1)]), fmt("＀/", [live(tn)]))) {
				typename = add(rt.index(rt.gl("TYPES_SHORTCUTS"), live(tn)), rt.call(f, P("/proc/copytext"), null, [live(typename), rt.length(fmt("＀/", [live(tn)]))]));
				break;
			}
		}
		rt.endFor(f, 1);
		rt.setAt(live(f.dot), live(typename), live(type));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/get_fancy_list_of_atom_types  (code/modules/admin/verbs/debug.dm:386)
rt.def("/proc/get_fancy_list_of_atom_types", function get_fancy_list_of_atom_types(f: Frame) {
	if (!truthy(rt.gl("pre_generated_list"))) {
		rt.setGl("pre_generated_list", rt.call(f, P("/proc/make_types_fancy"), null, [rt.call(f, P("/proc/typesof"), null, [T("/atom")])]));
	}
	return rt.gl("pre_generated_list");
});

// /proc/get_fancy_list_of_datum_types  (code/modules/admin/verbs/debug.dm:393)  may sleep
rt.def("/proc/get_fancy_list_of_datum_types", function* get_fancy_list_of_datum_types(f: Frame) {
	if (!truthy(rt.gl("pre_generated_list#2"))) {
		rt.setGl("pre_generated_list#2", (yield* g.call(f, P("/proc/make_types_fancy"), null, [(yield* g.call(f, P("/proc/sortList"), null, [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum")])), (yield* g.call(f, P("/proc/typesof"), null, [T("/atom")])))]))])));
	}
	return rt.gl("pre_generated_list#2");
}, true);

// /proc/filter_fancy_list  (code/modules/admin/verbs/debug.dm:399)
rt.def("/proc/filter_fancy_list", function filter_fancy_list(f: Frame, L: Value, filter: Value) {
	let matches: Value = null, key: Value = null, value: Value = null;
	let $e: any;
	f.vars = () => [matches, key, value, $e];
	matches = rt.new_(f, T("/list"), []);
	key = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		value = rt.index(live(L), live(key));
		if ((truthy(rt.call(f, P("/proc/findtext"), null, [fmt("＀", [live(key)]), live(filter)])) || truthy(rt.call(f, P("/proc/findtext"), null, [fmt("＀", [live(value)]), live(filter)])))) {
			rt.setAt(live(matches), live(key), live(value));
		}
	}
	rt.endFor(f, 0);
	return live(matches);
});

// /client/proc/cmd_debug_del_all  (code/modules/admin/verbs/debug.dm:411)  may sleep
rt.def("/client/proc/cmd_debug_del_all", function* cmd_debug_del_all(f: Frame, object: Value) {
	let matches: Value = null, hsbitem: Value = null, counter: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [object, matches, hsbitem, counter, O, $e];
	matches = (yield* g.call(f, P("/proc/get_fancy_list_of_atom_types"), null, []));
	if ((live(object) !== null && !isEqual(live(object), ""))) {
		matches = (yield* g.call(f, P("/proc/filter_fancy_list"), null, [live(matches), live(object)]));
	}
	if (isEqual(rt.len(f, live(matches)), 0)) {
		return live(f.dot);
	}
	if (!truthy((hsbitem = (yield* g.op(f, "Prompt", [1], [null, "Delete:", "Choose an object to delete.", live(f.usr), live(matches)]))))) return f.dot;
	hsbitem = rt.index(live(matches), live(hsbitem));
	counter = 0;
	O = null;
	rt.forList(f, 0, rt.world(), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy(rt.op(f, "IsType", [], [live(O), live(hsbitem)]))) {
			counter = rt.inc(live(counter), 1);
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has deleted all (＀) instances of ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), live(counter), live(hsbitem)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has deleted all (＀) instances of ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)])), live(counter), live(hsbitem)]), 0]);
	return f.dot;
}, true, { verb: { name: "Del-All", category: "Debug" }, argTypes: [{ type: 2 }] });

// /client/proc/cmd_debug_make_powernets  (code/modules/admin/verbs/debug.dm:434)  may sleep
rt.def("/client/proc/cmd_debug_make_powernets", function* cmd_debug_make_powernets(f: Frame) {
	yield* g.callName(f, rt.gl("SSmachines"), "makepowernets", []);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has remade the powernet. makepowernets() called.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has remade the powernets. makepowernets() called.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]))]), 0]);
	return f.dot;
}, true, { verb: { name: "Make Powernets", category: "Debug" } });

// /client/proc/cmd_admin_grantfullaccess  (code/modules/admin/verbs/debug.dm:443)  may sleep
rt.def("/client/proc/cmd_admin_grantfullaccess", function* cmd_admin_grantfullaccess(f: Frame, M: Value) {
	let H: Value = null, worn: Value = null, id: Value = null;
	f.vars = () => [M, H, worn, id];
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/alert"), null, ["Wait until the game starts"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(M);
		worn = rt.fv(f, "wear_id", live(H));
		id = null;
		if (truthy(live(worn))) {
			id = (yield* g.callName(f, live(worn), "GetID", []));
		}
		if (truthy(live(id))) {
			rt.setFv(f, "icon_state", live(id), "gold");
			rt.setFv(f, "access", live(id), add(add((yield* g.call(f, P("/proc/get_all_accesses"), null, [])), (yield* g.call(f, P("/proc/get_all_centcom_access"), null, []))), (yield* g.call(f, P("/proc/get_all_syndicate_access"), null, []))));
		} else {
			rt.setFv(f, "access", (id = (yield* g.new_(f, T("/obj/item/weapon/card/id/gold"), [rt.fv(f, "loc", live(H))]))), add(add((yield* g.call(f, P("/proc/get_all_accesses"), null, [])), (yield* g.call(f, P("/proc/get_all_centcom_access"), null, []))), (yield* g.call(f, P("/proc/get_all_syndicate_access"), null, []))));
			rt.setFv(f, "registered_name", live(id), rt.fv(f, "real_name", live(H)));
			rt.setFv(f, "assignment", live(id), "Captain");
			yield* g.callName(f, live(id), "update_label", []);
			if (truthy(live(worn))) {
				if (truthy((rt.istype(live(worn), T("/obj/item/device/pda")) ? 1 : 0))) {
					rt.setFv(f, "id", live(worn), live(id));
					rt.setFv(f, "loc", live(id), live(worn));
				} else {
					if (truthy((rt.istype(live(worn), T("/obj/item/weapon/storage/wallet")) ? 1 : 0))) {
						rt.setFv(f, "front_id", live(worn), live(id));
						rt.setFv(f, "loc", live(id), live(worn));
						yield* g.callName(f, live(worn), "update_icon", []);
					}
				}
			} else {
				yield* g.callName(f, live(H), "equip_to_slot", [live(id), 6]);
			}
		}
	} else {
		yield* g.call(f, P("/proc/alert"), null, ["Invalid mob"]);
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ has granted ＀ full access.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), rt.fv(f, "key", live(M))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has granted ＀ full access.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "key", live(M))])]);
	return f.dot;
}, true, { verb: { name: "Grant Full Access", category: "Admin" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/cmd_assume_direct_control  (code/modules/admin/verbs/debug.dm:484)  may sleep
rt.def("/client/proc/cmd_assume_direct_control", function* cmd_assume_direct_control(f: Frame, M: Value) {
	let ghost: Value = null, adminmob: Value = null;
	f.vars = () => [M, ghost, adminmob];
	if (truthy(rt.fv(f, "ckey", live(M)))) {
		if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [fmt("This mob is being controlled by ＀. Are you sure you wish to assume control of it? ＀ will be made a ghost.", [rt.fv(f, "ckey", live(M)), rt.fv(f, "ckey", live(M))]), null, "Yes", "No"])), "Yes")) {
			return live(f.dot);
		} else {
			rt.setFv(f, "ckey", (ghost = (yield* g.new_(f, T("/mob/dead/observer"), [live(M), 1]))), rt.fv(f, "ckey", live(M)));
		}
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ assumed direct control of ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(M)])]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ assumed direct control of ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(M)])]);
	adminmob = rt.fv(f, "mob", live(f.src));
	rt.setFv(f, "ckey", live(M), rt.fv(f, "ckey", live(f.src)));
	if (truthy((rt.istype(live(adminmob), T("/mob/dead/observer")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(adminmob)]);
	}
	return f.dot;
}, true, { verb: { name: "Assume direct control", category: "Admin", desc: "Direct intervention" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/cmd_admin_areatest  (code/modules/admin/verbs/debug.dm:502)
rt.def("/client/proc/cmd_admin_areatest", function cmd_admin_areatest(f: Frame) {
	let areas_all: Value = null, areas_with_APC: Value = null, areas_with_air_alarm: Value = null, areas_with_RC: Value = null, areas_with_light: Value = null, areas_with_LS: Value = null, areas_with_intercom: Value = null, areas_with_camera: Value = null, A: Value = null, APC: Value = null, A_9: Value = null, AA: Value = null, RC: Value = null, L: Value = null, LS: Value = null, I: Value = null, C: Value = null, areas_without_APC: Value = null, areas_without_air_alarm: Value = null, areas_without_RC: Value = null, areas_without_light: Value = null, areas_without_LS: Value = null, areas_without_intercom: Value = null, areas_without_camera: Value = null, areatype: Value = null;
	let $e: any;
	f.vars = () => [areas_all, areas_with_APC, areas_with_air_alarm, areas_with_RC, areas_with_light, areas_with_LS, areas_with_intercom, areas_with_camera, A, APC, A_9, AA, RC, L, LS, I, C, areas_without_APC, areas_without_air_alarm, areas_without_RC, areas_without_light, areas_without_LS, areas_without_intercom, areas_without_camera, areatype, $e];
	areas_all = rt.list();
	areas_with_APC = rt.list();
	areas_with_air_alarm = rt.list();
	areas_with_RC = rt.list();
	areas_with_light = rt.list();
	areas_with_LS = rt.list();
	areas_with_intercom = rt.list();
	areas_with_camera = rt.list();
	A = null;
	rt.forList(f, 0, rt.world(), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!truthy((rt.isIn(f, rt.fv(f, "type", live(A)), live(areas_all)) ? 1 : 0))) {
			rt.callName(f, live(areas_all), "Add", [rt.fv(f, "type", live(A))]);
		}
	}
	rt.endFor(f, 0);
	APC = null;
	rt.forList(f, 0, rt.gl("apcs_list"), T("/obj/machinery/power/apc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		APC = $e;
		if (!truthy((rt.isIn(f, rt.gv(f, "type", (A_9 = rt.call(f, P("/proc/get_area"), null, [live(APC)]))), live(areas_with_APC)) ? 1 : 0))) {
			rt.callName(f, live(areas_with_APC), "Add", [rt.fv(f, "type", live(A_9))]);
		}
	}
	rt.endFor(f, 0);
	AA = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/airalarm"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AA = $e;
		if (!truthy((rt.isIn(f, rt.gv(f, "type", (A_9 = rt.call(f, P("/proc/get_area"), null, [live(AA)]))), live(areas_with_air_alarm)) ? 1 : 0))) {
			rt.callName(f, live(areas_with_air_alarm), "Add", [rt.fv(f, "type", live(A_9))]);
		}
	}
	rt.endFor(f, 0);
	RC = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/requests_console"));
	while (($e = rt.next(f, 0)) !== undefined) {
		RC = $e;
		if (!truthy((rt.isIn(f, rt.gv(f, "type", (A_9 = rt.call(f, P("/proc/get_area"), null, [live(RC)]))), live(areas_with_RC)) ? 1 : 0))) {
			rt.callName(f, live(areas_with_RC), "Add", [rt.fv(f, "type", live(A_9))]);
		}
	}
	rt.endFor(f, 0);
	L = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/light"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (!truthy((rt.isIn(f, rt.gv(f, "type", (A_9 = rt.call(f, P("/proc/get_area"), null, [live(L)]))), live(areas_with_light)) ? 1 : 0))) {
			rt.callName(f, live(areas_with_light), "Add", [rt.fv(f, "type", live(A_9))]);
		}
	}
	rt.endFor(f, 0);
	LS = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/light_switch"));
	while (($e = rt.next(f, 0)) !== undefined) {
		LS = $e;
		if (!truthy((rt.isIn(f, rt.gv(f, "type", (A_9 = rt.call(f, P("/proc/get_area"), null, [live(LS)]))), live(areas_with_LS)) ? 1 : 0))) {
			rt.callName(f, live(areas_with_LS), "Add", [rt.fv(f, "type", live(A_9))]);
		}
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/item/device/radio/intercom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy((rt.isIn(f, rt.gv(f, "type", (A_9 = rt.call(f, P("/proc/get_area"), null, [live(I)]))), live(areas_with_intercom)) ? 1 : 0))) {
			rt.callName(f, live(areas_with_intercom), "Add", [rt.fv(f, "type", live(A_9))]);
		}
	}
	rt.endFor(f, 0);
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (!truthy((rt.isIn(f, rt.gv(f, "type", (A_9 = rt.call(f, P("/proc/get_area"), null, [live(C)]))), live(areas_with_camera)) ? 1 : 0))) {
			rt.callName(f, live(areas_with_camera), "Add", [rt.fv(f, "type", live(A_9))]);
		}
	}
	rt.endFor(f, 0);
	areas_without_APC = subtract(live(areas_all), live(areas_with_APC));
	areas_without_air_alarm = subtract(live(areas_all), live(areas_with_air_alarm));
	areas_without_RC = subtract(live(areas_all), live(areas_with_RC));
	areas_without_light = subtract(live(areas_all), live(areas_with_light));
	areas_without_LS = subtract(live(areas_all), live(areas_with_LS));
	areas_without_intercom = subtract(live(areas_all), live(areas_with_intercom));
	areas_without_camera = subtract(live(areas_all), live(areas_with_camera));
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<b>AREAS WITHOUT AN APC:</b>"]);
	areatype = null;
	rt.forList(f, 0, live(areas_without_APC));
	while (($e = rt.next(f, 0)) !== undefined) {
		areatype = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("* ＀", [live(areatype)])]);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<b>AREAS WITHOUT AN AIR ALARM:</b>"]);
	areatype = null;
	rt.forList(f, 0, live(areas_without_air_alarm));
	while (($e = rt.next(f, 0)) !== undefined) {
		areatype = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("* ＀", [live(areatype)])]);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<b>AREAS WITHOUT A REQUEST CONSOLE:</b>"]);
	areatype = null;
	rt.forList(f, 0, live(areas_without_RC));
	while (($e = rt.next(f, 0)) !== undefined) {
		areatype = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("* ＀", [live(areatype)])]);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<b>AREAS WITHOUT ANY LIGHTS:</b>"]);
	areatype = null;
	rt.forList(f, 0, live(areas_without_light));
	while (($e = rt.next(f, 0)) !== undefined) {
		areatype = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("* ＀", [live(areatype)])]);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<b>AREAS WITHOUT A LIGHT SWITCH:</b>"]);
	areatype = null;
	rt.forList(f, 0, live(areas_without_LS));
	while (($e = rt.next(f, 0)) !== undefined) {
		areatype = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("* ＀", [live(areatype)])]);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<b>AREAS WITHOUT ANY INTERCOMS:</b>"]);
	areatype = null;
	rt.forList(f, 0, live(areas_without_intercom));
	while (($e = rt.next(f, 0)) !== undefined) {
		areatype = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("* ＀", [live(areatype)])]);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<b>AREAS WITHOUT ANY CAMERAS:</b>"]);
	areatype = null;
	rt.forList(f, 0, live(areas_without_camera));
	while (($e = rt.next(f, 0)) !== undefined) {
		areatype = $e;
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("* ＀", [live(areatype)])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { verb: { name: "Test areas", category: "Mapping" } });

// /client/proc/cmd_admin_dress  (code/modules/admin/verbs/debug.dm:589)  may sleep
rt.def("/client/proc/cmd_admin_dress", function* cmd_admin_dress(f: Frame, M: Value) {
	let outfits: Value = null, paths: Value = null, path: Value = null, O: Value = null, dresscode: Value = null, job_paths: Value = null, job_outfits: Value = null, path_5: Value = null, O_6: Value = null, custom: Value = null, custom_names: Value = null, D: Value = null, selected_name: Value = null, I: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, outfits, paths, path, O, dresscode, job_paths, job_outfits, path_5, O_6, custom, custom_names, D, selected_name, I, $0, $e];
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/alert"), null, ["Invalid mob"]);
		return live(f.dot);
	}
	outfits = rt.list("Naked", "Custom", "As Job...");
	paths = subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/outfit")])), T("/datum/outfit")), (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/outfit/job")])));
	path = null;
	rt.forList(f, 0, live(paths));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		if (truthy(rt.initial(f, (O = live(path)), "can_be_admin_equipped"))) {
			rt.setAt(live(outfits), rt.initial(f, live(O), "name"), live(path));
		}
	}
	rt.endFor(f, 0);
	if ((dresscode = (yield* g.op(f, "Prompt", [1], [null, null, "Robust quick dress shop", fmt("Select dress for ＀", [live(M)]), live(outfits)]))) === null) {
		return live(f.dot);
	}
	if (truthy(rt.index(live(outfits), live(dresscode)))) {
		dresscode = rt.index(live(outfits), live(dresscode));
	}
	if (isEqual(live(dresscode), "As Job...")) {
		job_paths = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/outfit/job")])), T("/datum/outfit/job"));
		job_outfits = rt.list();
		path_5 = null;
		rt.forList(f, 0, live(job_paths));
		while (($e = rt.next(f, 0)) !== undefined) {
			path_5 = $e;
			if (truthy(rt.initial(f, (O_6 = live(path_5)), "can_be_admin_equipped"))) {
				rt.setAt(live(job_outfits), rt.initial(f, live(O_6), "name"), live(path_5));
			}
		}
		rt.endFor(f, 0);
		dresscode = (yield* g.op(f, "Prompt", [1], [null, null, "Robust quick dress shop", "Select job equipment", live(job_outfits)]));
		if ((dresscode = rt.index(live(job_outfits), live(dresscode))) === null) {
			return live(f.dot);
		}
	}
	custom = null;
	if (isEqual(live(dresscode), "Custom")) {
		custom_names = rt.list();
		D = null;
		rt.forList(f, 0, rt.gl("custom_outfits"), T("/datum/outfit"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			rt.setAt(live(custom_names), rt.fv(f, "name", live(D)), live(D));
		}
		rt.endFor(f, 0);
		selected_name = (yield* g.op(f, "Prompt", [1], [null, null, "Robust quick dress shop", "Select outfit", live(custom_names)]));
		if ((custom = rt.index(live(custom_names), live(selected_name))) === null) {
			return live(f.dot);
		}
	}
	I = null;
	rt.forList(f, 0, (yield* g.callName(f, live(M), "get_equipped_items", [])), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	$0 = live(dresscode);
	if ($0 === "Naked") {
	} else if ($0 === "Custom") {
		yield* g.callName(f, live(M), "equipOutfit", [live(custom)]);
	} else {
		yield* g.callName(f, live(M), "equipOutfit", [live(dresscode)]);
	}
	yield* g.callName(f, live(M), "regenerate_icons", []);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ changed the equipment of ＀ to ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)])), live(dresscode)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ changed the equipment of ＀ to ＀.</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)])), live(dresscode)])]);
	return f.dot;
}, true, { verb: { name: "Select equipment", category: "Fun" }, argTypes: [{ type: 8, path: "/mob/living/carbon/human", source: "?" }] });

// /client/proc/startSinglo  (code/modules/admin/verbs/debug.dm:657)  may sleep
rt.def("/client/proc/startSinglo", function* startSinglo(f: Frame) {
	let E: Value = null, F: Value = null, G: Value = null, S: Value = null, Rad: Value = null, Plasma: Value = null, SMES: Value = null;
	let $e: any;
	f.vars = () => [E, F, G, S, Rad, Plasma, SMES, $e];
	if (!isEqual((yield* g.call(f, P("/proc/alert"), null, ["Are you sure? This will start up the engine. Should only be used during debug!", null, "Yes", "No"])), "Yes")) {
		return live(f.dot);
	}
	E = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/power/emitter"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		if (truthy(rt.fv(f, "anchored", live(E)))) {
			rt.setFv(f, "active", live(E), 1);
		}
	}
	rt.endFor(f, 0);
	F = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/field/generator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if (isEqual(rt.fv(f, "active", live(F)), 0)) {
			rt.setFv(f, "active", live(F), 1);
			rt.setFv(f, "state", live(F), 2);
			rt.setFv(f, "power", live(F), 250);
			rt.setFv(f, "anchored", live(F), 1);
			rt.setFv(f, "warming_up", live(F), 3);
			yield* g.callName(f, live(F), "start_fields", []);
			yield* g.callName(f, live(F), "update_icon", []);
		}
	}
	rt.endFor(f, 0);
	rt.spawnTail(f, 30, "/client/proc/startSinglo: spawn at modules/admin/verbs/debug.dm:674", E, F, G, S, Rad, Plasma, SMES);
	Rad = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/power/rad_collector"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Rad = $e;
		if (truthy(rt.fv(f, "anchored", live(Rad)))) {
			if (!truthy(rt.fv(f, "loaded_tank", live(Rad)))) {
				yield* g.callName(f, rt.gv(f, "air_contents", (Plasma = (yield* g.new_(f, T("/obj/item/weapon/tank/internals/plasma"), [live(Rad)])))), "assert_gas", ["plasma"]);
				rt.setAt(rt.index(rt.gv(f, "gases", rt.fv(f, "air_contents", live(Plasma))), "plasma"), 1, 70);
				rt.setFv(f, "drainratio", live(Rad), 0);
				rt.setFv(f, "loaded_tank", live(Rad), live(Plasma));
				rt.setFv(f, "loc", live(Plasma), live(Rad));
			}
			if (!truthy(rt.fv(f, "active", live(Rad)))) {
				yield* g.callName(f, live(Rad), "toggle_power", []);
			}
		}
	}
	rt.endFor(f, 0);
	SMES = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/power/smes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SMES = $e;
		if (truthy(rt.fv(f, "anchored", live(SMES)))) {
			rt.setFv(f, "input_attempt", live(SMES), 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "Start Singularity", category: "Debug", desc: "Sets up the singularity and all machines to get power flowing through the station" } });

// a spawn(30) body of /client/proc/startSinglo, a named tail so a world snapshot can hold it while it waits.
rt.tail("/client/proc/startSinglo: spawn at modules/admin/verbs/debug.dm:674", function* (f: Frame, E: Value, F: Value, G: Value, S: Value, Rad: Value, Plasma: Value, SMES: Value) {
	let $e: any;
	f.vars = () => [E, F, G, S, Rad, Plasma, SMES, $e];
	G = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/the_singularitygen"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (truthy(rt.fv(f, "anchored", live(G)))) {
			rt.setFv(f, "energy", (S = (yield* g.new_(f, T("/obj/singularity"), [rt.getStep(f, live(G), 0), 50]))), 1750);
			rt.setFv(f, "current_size", live(S), 7);
			rt.setFv(f, "icon", live(S), rt.rsc("icons/effects/224x224.dmi"));
			rt.setFv(f, "icon_state", live(S), "singularity_s7");
			rt.setFv(f, "pixel_x", live(S), -96);
			rt.setFv(f, "pixel_y", live(S), -96);
			rt.setFv(f, "grav_pull", live(S), 0);
			rt.setFv(f, "dissipate", live(S), 0);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /client/proc/cmd_debug_mob_lists  (code/modules/admin/verbs/debug.dm:714)  may sleep
rt.def("/client/proc/cmd_debug_mob_lists", function* cmd_debug_mob_lists(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.op(f, "Prompt", [0], [null, null, null, "Which list?", rt.list("Players", "Admins", "Mobs", "Living Mobs", "Dead Mobs", "Clients", "Joined Clients")]));
	if ($0 === "Players") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("player_list"), ","]))]);
	} else if ($0 === "Admins") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("admins"), ","]))]);
	} else if ($0 === "Mobs") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("mob_list"), ","]))]);
	} else if ($0 === "Living Mobs") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("living_mob_list"), ","]))]);
	} else if ($0 === "Dead Mobs") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("dead_mob_list"), ","]))]);
	} else if ($0 === "Clients") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("clients"), ","]))]);
	} else if ($0 === "Joined Clients") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), (yield* g.call(f, P("/proc/jointext"), null, [rt.gl("joined_player_list"), ","]))]);
	}
	return f.dot;
}, true, { verb: { name: "Debug Mob Lists", category: "Debug", desc: "For when you just gotta know" } });

// /client/proc/cmd_display_del_log  (code/modules/admin/verbs/debug.dm:735)
rt.def("/client/proc/cmd_display_del_log", function cmd_display_del_log(f: Frame) {
	let dat: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [dat, path, $e];
	dat = "<B>List of things that failed to GC this round</B><BR><BR>";
	path = null;
	rt.forList(f, 0, rt.fv(f, "didntgc", rt.gl("SSgarbage")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		dat = rt.modify(live(dat), fmt("＀ - ＀ times<BR>", [live(path), rt.index(rt.fv(f, "didntgc", rt.gl("SSgarbage")), live(path))]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "<B>List of paths that did not return a qdel hint in Destroy()</B><BR><BR>", add);
	path = null;
	rt.forList(f, 0, rt.fv(f, "noqdelhint", rt.gl("SSgarbage")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		dat = rt.modify(live(dat), fmt("＀<BR>", [live(path)]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "<B>List of paths that slept in Destroy()</B><BR><BR>", add);
	path = null;
	rt.forList(f, 0, rt.fv(f, "sleptDestroy", rt.gl("SSgarbage")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		dat = rt.modify(live(dat), fmt("＀<BR>", [live(path)]), add);
	}
	rt.endFor(f, 0);
	rt.op(f, "Browse", [], [live(f.usr), live(dat), "window=dellog"], false);
	return f.dot;
}, false, { verb: { name: "Display del() Log", category: "Debug", desc: "Displays a list of things that have failed to GC this round" } });

// /client/proc/cmd_display_init_log  (code/modules/admin/verbs/debug.dm:754)
rt.def("/client/proc/cmd_display_init_log", function cmd_display_init_log(f: Frame) {
	rt.op(f, "Browse", [], [live(f.usr), rt.call(f, P("/proc/replacetext"), null, [rt.callName(f, rt.gl("SSatoms"), "InitLog", []), "\n", "<br>"]), "window=initlog"], false);
	return f.dot;
}, false, { verb: { name: "Display Initialzie() Log", category: "Debug", desc: "Displays a list of things that didn't handle Initialize() properly" } });

// /client/proc/debug_huds  (code/modules/admin/verbs/debug.dm:761)  may sleep
rt.def("/client/proc/debug_huds", function* debug_huds(f: Frame, i: Value) {
	f.vars = () => [i];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "debug_variables", rt.index(rt.gl("huds"), live(i)));
	return f.dot;
}, true, { verb: { name: "Debug HUDs", category: "Debug", desc: "Debug the data or antag HUDs" }, argTypes: [{ type: 32 }] });

// /client/proc/jump_to_ruin  (code/modules/admin/verbs/debug.dm:769)  may sleep
rt.def("/client/proc/jump_to_ruin", function* jump_to_ruin(f: Frame) {
	let names: Value = null, i: Value = null, ruin_landmark: Value = null, template: Value = null, count: Value = null, name: Value = null, original_name: Value = null, ruinname: Value = null, landmark: Value = null;
	let $e: any;
	f.vars = () => [names, i, ruin_landmark, template, count, name, original_name, ruinname, landmark, $e];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	names = rt.list();
	i = null;
	rt.forList(f, 0, rt.gl("ruin_landmarks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		ruin_landmark = live(i);
		template = rt.fv(f, "ruin_template", live(ruin_landmark));
		count = 1;
		name = rt.fv(f, "name", live(template));
		original_name = live(name);
		while (truthy((rt.isIn(f, live(name), live(names)) ? 1 : 0))) {
			count = rt.inc(live(count), 1);
			name = fmt("＀ (＀)", [live(original_name), live(count)]);
		}
		rt.setAt(live(names), live(name), live(ruin_landmark));
	}
	rt.endFor(f, 0);
	ruinname = (yield* g.op(f, "Prompt", [1], [null, null, "Jump to Ruin", "Select ruin", live(names)]));
	if (!truthy((rt.istype((landmark = rt.index(live(names), live(ruinname))), T("/obj/effect/landmark/ruin")) ? 1 : 0))) return f.dot;
	template = rt.fv(f, "ruin_template", live(landmark));
	yield* g.callName(f, live(f.usr), "forceMove", [rt.getStep(f, live(landmark), 0)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='name'>＀</span>", [rt.fv(f, "name", live(template))])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='italics'>＀</span>", [rt.fv(f, "description", live(template))])]);
	return f.dot;
}, true, { verb: { name: "Jump to Ruin", category: "Debug", desc: "Displays a list of all placed ruins to teleport to." } });

// /client/proc/clear_dynamic_transit  (code/modules/admin/verbs/debug.dm:801)
rt.def("/client/proc/clear_dynamic_transit", function clear_dynamic_transit(f: Frame) {
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	rt.setFv(f, "clear_transit", rt.gl("SSshuttle"), 1);
	rt.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ cleared dynamic transit space.</span>", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.src)])])]);
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ cleared dynamic transit space.", [rt.call(f, P("/proc/key_name"), null, [live(f.src)])])]);
	return f.dot;
}, false, { verb: { name: "Clear Dynamic Transit", category: "Debug", desc: "Deallocates all transit space, restoring it to round start conditions." } });

// /client/proc/view_runtimes  (code/modules/admin/verbs/debug.dm:827)  may sleep
rt.def("/client/proc/view_runtimes", function* view_runtimes(f: Frame) {
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.gl("error_cache"), "show_to", [live(f.src)]);
	return f.dot;
}, true, { verb: { name: "View Runtimes", category: "Debug", desc: "Open the runtime Viewer" } });

// /client/proc/pump_random_event  (code/modules/admin/verbs/debug.dm:836)
rt.def("/client/proc/pump_random_event", function pump_random_event(f: Frame) {
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	rt.setFv(f, "scheduled", rt.gl("SSevents"), rt.worldTime(f));
	rt.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ pumped a random event.</span>", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.src)])])]);
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ pumped a random event.", [rt.call(f, P("/proc/key_name"), null, [live(f.src)])])]);
	return f.dot;
}, false, { verb: { name: "Pump Random Event", category: "Debug", desc: "Schedules the event subsystem to fire a new random event immediately. Some events may fire without notification." } });
