// From code/modules/holodeck/computer_funcs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/machinery/computer/holodeck/proc/attack_hand  (code/modules/holodeck/computer_funcs.dm:2)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, A: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, A, popup, $e];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "<h3>Current Loaded Programs</h3>";
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;loadarea=＀'>Power Off</a><br>", [live(f.src), rt.fv(f, "type", rt.sv(f, "offline_program"))]), add);
	A = null;
	rt.forList(f, 0, rt.sv(f, "program_cache"), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;loadarea=＀'>＀</a><br>", [live(f.src), rt.fv(f, "type", live(A)), rt.fv(f, "name", live(A))]), add);
	}
	rt.endFor(f, 0);
	if ((truthy(rt.sv(f, "emagged")) && truthy(rt.len(f, rt.sv(f, "emag_programs"))))) {
		dat = rt.modify(live(dat), "<span class='warning'>SUPERVISOR ACCESS - SAFETY PROTOCOLS DISABLED - CAUTION: EMITTER ANOMALY</span><br>", add);
		A = null;
		rt.forList(f, 0, rt.sv(f, "emag_programs"), T("/area"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;loadarea=＀'>＀</a><br>", [live(f.src), rt.fv(f, "type", live(A)), rt.fv(f, "name", live(A))]), add);
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "computer", rt.sv(f, "name"), 400, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/computer/holodeck/proc/attack_ai  (code/modules/holodeck/computer_funcs.dm:20)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	let dat: Value = null, A: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, A, popup, $e];
	dat = "<h3>Current Loaded Programs</h3>";
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;loadarea=＀'>Power Off</a><br>", [live(f.src), rt.fv(f, "type", rt.sv(f, "offline_program"))]), add);
	A = null;
	rt.forList(f, 0, rt.sv(f, "program_cache"), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;loadarea=＀'>＀</a><br>", [live(f.src), rt.fv(f, "type", live(A)), rt.fv(f, "name", live(A))]), add);
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, rt.sv(f, "emag_programs")))) {
		dat = rt.modify(live(dat), "<br>", add);
		if (truthy(rt.sv(f, "emagged"))) {
			dat = rt.modify(live(dat), fmt("Safety protocol: <span class='bad'>Offline</span> <a href='?＃;safety=1'>Engage</a><br>", [live(f.src)]), add);
			A = null;
			rt.forList(f, 0, rt.sv(f, "emag_programs"), T("/area"));
			while (($e = rt.next(f, 0)) !== undefined) {
				A = $e;
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;loadarea=＀'>＀</a><br>", [live(f.src), rt.fv(f, "type", live(A)), rt.fv(f, "name", live(A))]), add);
			}
			rt.endFor(f, 0);
		} else {
			dat = rt.modify(live(dat), fmt("Safety protocol: <span class='good'>Online</span> <a href='?＃;safety=0'>Disengage</a><br>", [live(f.src)]), add);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "computer", rt.sv(f, "name"), 400, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/holodeck/proc/load_program  (code/modules/holodeck/computer_funcs.dm:43)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/load_program", function* load_program(f: Frame, A: Value, force: Value, delay: Value) {
	let HE: Value = null, item: Value = null, M: Value = null, S: Value = null, added: Value = null, HE_1: Value = null, x: Value = null, M_1: Value = null, S_1: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [A, force, delay, HE, item, M, S, added, HE_1, x, M_1, S_1, $0, $1, $2, $e];
	if (live(force) === null) {
		force = 0;
	}
	if (live(delay) === null) {
		delay = 0;
	}
	if (truthy(rt.sv(f, "stat"))) {
		A = rt.sv(f, "offline_program");
		force = 1;
		delay = 0;
	}
	if (isEqual(rt.sv(f, "program"), live(A))) {
		return live(f.dot);
	}
	$0 = rt.worldTime(f);
	$1 = add(rt.sv(f, "last_change"), 25);
	if (truthy(rt.sv(f, "damaged"))) {
		$2 = 500;
	} else {
		$2 = 0;
	}
	if ((rt.lt($0, add($1, $2)) && !truthy(live(force)))) {
		if (truthy(live(delay))) {
			yield* g.call(f, P("/proc/sleep"), null, [25]);
		} else {
			if (rt.lt(rt.worldTime(f), add(rt.sv(f, "last_change"), 15))) {
				return live(f.dot);
			}
			if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.usr), live(f.src)])), 3)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>ERROR. Recalibrating projection apparatus.</span>"]);
				return live(f.dot);
			}
		}
	}
	rt.setSv(f, "last_change", rt.worldTime(f));
	rt.setSv(f, "active", (!isEqual(live(A), rt.sv(f, "offline_program")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		$0 = 2;
	} else {
		$0 = 1;
	}
	rt.setSv(f, "use_power", $0);
	HE = null;
	rt.forList(f, 0, rt.sv(f, "effects"), T("/obj/effect/holodeck_effect"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HE = $e;
		yield* g.callName(f, live(HE), "deactivate", [live(f.src)]);
	}
	rt.endFor(f, 0);
	item = null;
	rt.forList(f, 0, rt.sv(f, "spawned"));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		yield* g.callSrc(f, "derez", [null, live(item), "forced", live(force)], rt.Args.Named);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "program", live(A));
	rt.setSv(f, "spawned", (yield* g.callName(f, live(A), "copy_contents_to", [null, rt.sv(f, "linked"), null, 1, "nerf_weapons", (!truthy(rt.sv(f, "emagged")) ? 1 : 0)], rt.Args.Named)));
	M = null;
	rt.forList(f, 0, rt.sv(f, "spawned"), T("/obj/machinery"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		(rt.modField(f, live(M), "flags", 128, rt.bitOr));
	}
	rt.endFor(f, 0);
	S = null;
	rt.forList(f, 0, rt.sv(f, "spawned"), T("/obj/structure"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		(rt.modField(f, live(S), "flags", 128, rt.bitOr));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "effects", rt.list());
	rt.spawnTail(f, 30, "/obj/machinery/computer/holodeck/proc/load_program: spawn at modules/holodeck/computer_funcs.dm:79", A, force, delay, HE, item, M, S, added, HE_1, x, M_1, S_1);
	return f.dot;
}, true);

// a spawn(30) body of /obj/machinery/computer/holodeck/proc/load_program, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/holodeck/proc/load_program: spawn at modules/holodeck/computer_funcs.dm:79", function* (f: Frame, A: Value, force: Value, delay: Value, HE: Value, item: Value, M: Value, S: Value, added: Value, HE_1: Value, x: Value, M_1: Value, S_1: Value) {
	let $e: any;
	f.vars = () => [A, force, delay, HE, item, M, S, added, HE_1, x, M_1, S_1, $e];
	added = rt.list();
	HE_1 = null;
	rt.forList(f, 0, rt.sv(f, "spawned"), T("/obj/effect/holodeck_effect"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HE_1 = $e;
		rt.modSrcVar(f, "effects", live(HE_1), add);
		(rt.modSrcVar(f, "spawned", live(HE_1), subtract));
		if ((truthy((rt.istype((x = (yield* g.callName(f, live(HE_1), "activate", [live(f.src)]))), T("/atom")) ? 1 : 0)) || truthy((rt.istype(live(x), T("/list")) ? 1 : 0)))) {
			rt.modSrcVar(f, "spawned", live(x), add);
			added = rt.modify(live(added), live(x), add);
		}
	}
	rt.endFor(f, 0);
	M_1 = null;
	rt.forList(f, 0, live(added), T("/obj/machinery"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M_1 = $e;
		(rt.modField(f, live(M_1), "flags", 128, rt.bitOr));
	}
	rt.endFor(f, 0);
	S_1 = null;
	rt.forList(f, 0, live(added), T("/obj/structure"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S_1 = $e;
		(rt.modField(f, live(S_1), "flags", 128, rt.bitOr));
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/machinery/computer/holodeck/proc/derez  (code/modules/holodeck/computer_funcs.dm:95)  may sleep
rt.def("/obj/machinery/computer/holodeck/proc/derez", function* derez(f: Frame, obj: Value, silent: Value, forced: Value) {
	let _T: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [obj, silent, forced, _T, AM, $e];
	if (live(silent) === null) {
		silent = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	if ((((truthy(live(obj)) && truthy(rt.fv(f, "emagged", live(f.src)))) && !truthy(rt.fv(f, "stat", live(f.src)))) && !truthy(live(forced)))) {
		if (((truthy((yield* g.call(f, P("/proc/ismob"), null, [live(obj)]))) || truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(obj))])))) && truthy(rt.op(f, "Prob", [], [50])))) {
			rt.spawnTail(f, 50, "/obj/machinery/computer/holodeck/proc/derez: spawn at modules/holodeck/computer_funcs.dm:97", obj, silent, forced, _T, AM);
			return live(f.dot);
		}
	}
	yield* g.callName(f, rt.sv(f, "spawned"), "Remove", [live(obj)]);
	if (!truthy(live(obj))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(obj), 0);
	AM = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(obj)), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		rt.setFv(f, "loc", live(AM), live(_T));
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
			silent = 0;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(silent))) {
		yield* g.srcCall(f, "visible_message", fmt("The ＀ fades away!", [rt.fv(f, "name", live(obj))]));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(obj)]);
	return f.dot;
}, true);

// a spawn(50) body of /obj/machinery/computer/holodeck/proc/derez, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/holodeck/proc/derez: spawn at modules/holodeck/computer_funcs.dm:97", function* (f: Frame, obj: Value, silent: Value, forced: Value, _T: Value, AM: Value) {
	f.vars = () => [obj, silent, forced, _T, AM];
	yield* g.callSelf(f, [live(obj), live(silent)]);
	return null;
});
