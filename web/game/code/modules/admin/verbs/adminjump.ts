// From code/modules/admin/verbs/adminjump.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/jumptoarea  (code/modules/admin/verbs/adminjump.dm:5)  may sleep
rt.def("/client/proc/jumptoarea", function* jumptoarea(f: Frame, A: Value) {
	let turfs: Value = null, Ar: Value = null, _T: Value = null, _T_1: Value = null;
	let $e: any;
	f.vars = () => [A, turfs, Ar, _T, _T_1, $e];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!truthy(live(A))) {
		return live(f.dot);
	}
	turfs = rt.list();
	Ar = null;
	rt.forList(f, 0, rt.fv(f, "related", live(A)), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Ar = $e;
		_T = null;
		rt.forList(f, 1, live(Ar), T("/turf"));
		while (($e = rt.next(f, 1)) !== undefined) {
			_T = $e;
			if (truthy(rt.fv(f, "density", live(_T)))) {
				continue;
			}
			yield* g.callName(f, live(turfs), "Add", [live(_T)]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	if (!truthy((_T_1 = (yield* g.call(f, P("/proc/safepick"), null, [live(turfs)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Nowhere to jump to!"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "forceMove", [live(_T_1)]);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ jumped to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(A)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ jumped to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(A)])]);
	return f.dot;
}, true, { verb: { name: "Jump to Area", category: "Admin", desc: "Area to jump to" }, argTypes: [{ type: 128, path: "/area", source: "?" }] });

// /client/proc/jumptoturf  (code/modules/admin/verbs/adminjump.dm:31)
rt.def("/client/proc/jumptoturf", function jumptoturf(f: Frame, _T: Value) {
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ jumped to ＀,＀,＀ in ＀", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T)), rt.fv(f, "loc", live(_T))])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ jumped to ＀,＀,＀ in ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T)), rt.fv(f, "loc", live(_T))])]);
	rt.setFv(f, "loc", live(f.usr), live(_T));
	return live(f.dot);
}, false, { verb: { name: "Jump to Turf", category: "Admin" }, argTypes: [{ path: "/turf", source: "world" }] });

// /client/proc/jumptomob  (code/modules/admin/verbs/adminjump.dm:45)  may sleep
rt.def("/client/proc/jumptomob", function* jumptomob(f: Frame, M: Value) {
	let A: Value = null, _T: Value = null;
	f.vars = () => [M, A, _T];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ jumped to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ jumped to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)]))])]);
	if (!truthy(rt.fv(f, "mob", live(f.src)))) return f.dot;
	A = rt.fv(f, "mob", live(f.src));
	if ((truthy((_T = rt.getStep(f, live(M), 0))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)]))))) {
		yield* g.callName(f, live(A), "forceMove", [rt.fv(f, "loc", live(M))]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(A), "This mob is not located in the game world."]);
	}
	return f.dot;
}, true, { verb: { name: "Jump to Mob", category: "Admin" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/jumptocoord  (code/modules/admin/verbs/adminjump.dm:64)
rt.def("/client/proc/jumptocoord", function jumptocoord(f: Frame, tx: Value, ty: Value, tz: Value) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy(rt.sv(f, "holder"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "mob", live(f.src)))) {
		rt.setFv(f, "x", (A = rt.fv(f, "mob", live(f.src))), live(tx));
		rt.setFv(f, "y", live(A), live(ty));
		rt.setFv(f, "z", live(A), live(tz));
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ jumped to coordinates ＀, ＀, ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]), live(tx), live(ty), live(tz)])]);
	return f.dot;
}, false, { verb: { name: "Jump to Coordinate", category: "Admin" }, argTypes: [{ type: 32 }, { type: 32 }, { type: 32 }] });

// /client/proc/jumptokey  (code/modules/admin/verbs/adminjump.dm:80)  may sleep
rt.def("/client/proc/jumptokey", function* jumptokey(f: Frame) {
	let keys: Value = null, M: Value = null, selection: Value = null, M_2: Value = null;
	let $e: any;
	f.vars = () => [keys, M, selection, M_2, $e];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	keys = rt.list();
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		keys = rt.modify(live(keys), rt.fv(f, "client", live(M)), add);
	}
	rt.endFor(f, 0);
	if (!truthy((selection = (yield* g.op(f, "Prompt", [1], [null, null, "Admin Jumping", "Please, select a player!", (yield* g.call(f, P("/proc/sortKey"), null, [live(keys)]))]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "No keys found."]);
		return live(f.dot);
	}
	M_2 = rt.fv(f, "mob", live(selection));
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ jumped to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M_2)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ jumped to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M_2)]))])]);
	yield* g.callName(f, live(f.usr), "forceMove", [rt.fv(f, "loc", live(M_2))]);
	return f.dot;
}, true, { verb: { name: "Jump to Key", category: "Admin" } });

// /client/proc/Getmob  (code/modules/admin/verbs/adminjump.dm:103)  may sleep
rt.def("/client/proc/Getmob", function* Getmob(f: Frame, M: Value) {
	let loc: Value = null, msg: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [M, loc, msg, $0, $1, $2];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	loc = rt.getStep(f, live(f.usr), 0);
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ teleported ＀ to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(loc)), rt.fv(f, "y", live(loc)), rt.fv(f, "z", live(loc))])])]);
	$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
	$1 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)]));
	if (truthy(live(loc))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(loc)), rt.fv(f, "y", live(loc)), rt.fv(f, "z", live(loc))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(loc)), rt.fv(f, "y", live(loc)), rt.fv(f, "z", live(loc))])]);
	} else {
		$2 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("＀ teleported ＀ to ＀", [$0, $1, fmt("＀", [$2])]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(M), live(msg)]);
	yield* g.callName(f, live(M), "forceMove", [live(loc)]);
	return f.dot;
}, true, { verb: { name: "Get Mob", category: "Admin", desc: "Mob to teleport" }, argTypes: [{ type: 8, path: "/mob", source: "?" }] });

// /client/proc/Getkey  (code/modules/admin/verbs/adminjump.dm:120)  may sleep
rt.def("/client/proc/Getkey", function* Getkey(f: Frame) {
	let keys: Value = null, M: Value = null, selection: Value = null, M_2: Value = null, msg: Value = null;
	let $e: any;
	f.vars = () => [keys, M, selection, M_2, msg, $e];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	keys = rt.list();
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		keys = rt.modify(live(keys), rt.fv(f, "client", live(M)), add);
	}
	rt.endFor(f, 0);
	if (!truthy((selection = (yield* g.op(f, "Prompt", [1], [null, null, "Admin Jumping", "Please, select a player!", (yield* g.call(f, P("/proc/sortKey"), null, [live(keys)]))]))))) {
		return live(f.dot);
	}
	if (!truthy((M_2 = rt.fv(f, "mob", live(selection))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ teleported ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M_2)]))])]);
	yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("＀ teleported ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M_2)]))]))]);
	yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(M_2), live(msg)]);
	if (!truthy(live(M_2))) return f.dot;
	yield* g.callName(f, live(M_2), "forceMove", [rt.getStep(f, live(f.usr), 0)]);
	rt.setFv(f, "loc", live(f.usr), rt.fv(f, "loc", live(M_2)));
	return f.dot;
}, true, { verb: { name: "Get Key", category: "Admin", desc: "Key to teleport" } });

// /client/proc/sendmob  (code/modules/admin/verbs/adminjump.dm:146)  may sleep
rt.def("/client/proc/sendmob", function* sendmob(f: Frame, M: Value) {
	let A: Value = null, msg: Value = null;
	f.vars = () => [M, A, msg];
	if (!truthy(rt.fv(f, "holder", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Only administrators may use this command."]);
		return live(f.dot);
	}
	if (!(truthy((A = (yield* g.op(f, "Prompt", [0], [null, "Pick an area", "Pick an area.", live(f.usr), rt.bitOr(rt.gl("sortedAreas"), null)])))) && truthy((rt.istype(live(A), T("/area")) ? 1 : 0)))) return f.dot;
	if (truthy((yield* g.callName(f, live(M), "forceMove", [(yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/get_area_turfs"), null, [live(A)]))]))])))) {
		yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ teleported ＀ to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name"), null, [live(M)])), live(A)])]);
		yield* g.call(f, P("/proc/message_admins"), null, [(msg = fmt("＀ teleported ＀ to ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(M)])), live(A)]))]);
		yield* g.call(f, P("/proc/admin_ticket_log"), null, [live(M), live(msg)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Failed to move mob to a valid location."]);
	}
	return f.dot;
}, true, { verb: { name: "Send Mob", category: "Admin" }, argTypes: [{ type: 8, path: "/mob", source: "sortmobs" }] });
