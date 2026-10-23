// From code/game/machinery/overview.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/machinery/computer/security/verb/station_map  (code/game/machinery/overview.dm:7)  may sleep
rt.def("/obj/machinery/computer/security/verb/station_map", function* station_map(f: Frame) {
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (!truthy(rt.sv(f, "mapping"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀(＀) used station map L＀ in ＀", [live(f.usr), rt.fv(f, "key", live(f.usr)), rt.sv(f, "z"), rt.gv(f, "loc", rt.fv(f, "loc", live(f.src)))])]);
	yield* g.callName(f, live(f.src), "drawmap", [live(f.usr)]);
	return f.dot;
}, true, { verb: { name: ".map", category: "Object", src: 1, range: 1 } });

// /obj/machinery/computer/security/proc/drawmap  (code/game/machinery/overview.dm:17)  may sleep
rt.def("/obj/machinery/computer/security/proc/drawmap", function* drawmap(f: Frame, user: Value) {
	let icx: Value = null, icy: Value = null, xoff: Value = null, yoff: Value = null, icount: Value = null, imap: Value = null, i: Value = null, wx: Value = null, wy: Value = null, _T: Value = null, colour: Value = null, sense: Value = null, environment: Value = null, turf_total: Value = null, t1: Value = null, AM: Value = null, A: Value = null, red: Value = null, green: Value = null, blue: Value = null, ix: Value = null, iy: Value = null, rx: Value = null, ry: Value = null, I: Value = null, H: Value = null, I_8: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, icx, icy, xoff, yoff, icount, imap, i, wx, wy, _T, colour, sense, environment, turf_total, t1, AM, A, red, green, blue, ix, iy, rx, ry, I, H, I_8, $0, $1, $e];
	icx = add((yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "maxx", rt.world()), 16)])), 1);
	icy = add((yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "maxy", rt.world()), 16)])), 1);
	xoff = (yield* g.call(f, P("/proc/round"), null, [subtract(subtract(multiply(live(icx), 16), rt.fv(f, "maxx", rt.world())), 2)]));
	yoff = (yield* g.call(f, P("/proc/round"), null, [subtract(subtract(multiply(live(icy), 16), rt.fv(f, "maxy", rt.world())), 2)]));
	icount = multiply(live(icx), live(icy));
	imap = rt.list();
	i = null;
	i = 0;
	while (rt.lt(live(i), live(icount))) {
		imap = rt.modify(live(imap), (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/misc/imap.dmi"), "blank"])), add);
		i = rt.inc(live(i), 1);
	}
	wx = null;
	wx = 1;
	while (rt.le(live(wx), rt.fv(f, "maxx", rt.world()))) {
		wy = null;
		wy = 1;
		while (rt.le(live(wy), rt.fv(f, "maxy", rt.world()))) {
			_T = rt.locate(live(wx), live(wy), rt.sv(f, "z"));
			colour = null;
			if (!truthy(live(_T))) {
				colour = "#000000";
			} else {
				sense = 1;
				$0 = fmt("＀", [rt.fv(f, "type", live(_T))]);
				if ($0 === "/turf/open/space") {
					colour = "#0a0a0a";
					sense = 0;
				} else if ($0 === "/turf/open/floor" || $0 === "/turf/open/floor/engine") {
					environment = (yield* g.callName(f, live(_T), "return_air", []));
					turf_total = (yield* g.callName(f, live(environment), "total_moles", []));
					if (rt.le((t1 = multiply(divide(live(turf_total), 103.98379516601562), 175)), 100)) {
						colour = rt.op(f, "Rgb", [1, 3], [0, 0, multiply(live(t1), 2.549999952316284)]);
					} else {
						colour = rt.op(f, "Rgb", [1, 3], [multiply((t1 = (yield* g.call(f, P("/proc/min"), null, [100, subtract(live(t1), 100)]))), 2.549999952316284), multiply(live(t1), 2.549999952316284), 255]);
					}
				} else if ($0 === "/turf/closed/wall") {
					colour = "#606060";
				} else if ($0 === "/turf/closed/wall/r_wall") {
					colour = "#806060";
				} else {
					colour = "#002800";
				}
				if (truthy(live(sense))) {
					AM = null;
					rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/atom"));
					while (($e = rt.next(f, 0)) !== undefined) {
						AM = $e;
						if ((truthy((rt.istype(live(AM), T("/obj/machinery/door")) ? 1 : 0)) && !truthy((rt.istype(live(AM), T("/obj/machinery/door/window")) ? 1 : 0)))) {
							if (truthy(rt.fv(f, "density", live(AM)))) {
								colour = "#0060c0";
							} else {
								colour = "#60c080";
							}
						}
						if (truthy((rt.istype(live(AM), T("/obj/machinery/airalarm")) ? 1 : 0))) {
							colour = "#00ff00";
							if (isEqual(rt.fv(f, "icon_state", live(AM)), "alarm:1")) {
								colour = "#ffff00";
							}
						}
						if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
							if (truthy(rt.fv(f, "client", live(AM)))) {
								colour = "#ff0000";
							} else {
								colour = "#ff8080";
							}
						}
					}
					rt.endFor(f, 0);
				}
				if (truthy(rt.gv(f, "fire", (A = rt.fv(f, "loc", live(_T)))))) {
					red = (yield* g.call(f, P("/proc/getr"), null, [live(colour)]));
					green = (yield* g.call(f, P("/proc/getg"), null, [live(colour)]));
					blue = (yield* g.call(f, P("/proc/getb"), null, [live(colour)]));
					green = (yield* g.call(f, P("/proc/min"), null, [255, add(live(green), 40)]));
					blue = (yield* g.call(f, P("/proc/min"), null, [255, add(live(blue), 40)]));
					colour = rt.op(f, "Rgb", [1, 3], [live(red), live(green), live(blue)]);
				}
			}
			ix = (yield* g.call(f, P("/proc/round"), null, [divide(add(multiply(live(wx), 2), live(xoff)), 32)]));
			iy = (yield* g.call(f, P("/proc/round"), null, [divide(add(multiply(live(wy), 2), live(yoff)), 32)]));
			rx = add(rt.modulus(add(multiply(live(wx), 2), live(xoff)), 32), 1);
			ry = add(rt.modulus(add(multiply(live(wy), 2), live(yoff)), 32), 1);
			yield* g.callName(f, (I = rt.index(live(imap), add(1, add(live(ix), multiply(live(icx), live(iy)))))), "DrawBox", [live(colour), live(rx), live(ry), live(rx), live(ry)]);
			wy = rt.inc(live(wy), 1);
		}
		wx = rt.inc(live(wx), 1);
	}
	yield* g.callName(f, live(user), "clearmap", []);
	rt.setFv(f, "mapobjs", live(user), rt.list());
	i = null;
	i = 0;
	while (rt.lt(live(i), live(icount))) {
		rt.setFv(f, "screen_loc", (H = (yield* g.new_(f, T("/obj/screen"), []))), fmt("＀,＀", [add(5, rt.modulus(live(i), live(icx))), add(6, (yield* g.call(f, P("/proc/round"), null, [divide(live(i), live(icx))])))]));
		$0 = live(H);
		if (isEqual(live(i), 0)) {
			$1 = "maprefresh";
		} else {
			$1 = "map";
		}
		rt.setFv(f, "name", $0, $1);
		I_8 = rt.index(live(imap), add(live(i), 1));
		rt.setFv(f, "icon", live(H), live(I_8));
		yield* g.call(f, P("/proc/qdel"), null, [live(I_8)]);
		rt.setFv(f, "layer", live(H), 20);
		rt.setFv(f, "plane", live(H), 20);
		rt.modField(f, live(f.usr), "mapobjs", live(H), add);
		i = rt.inc(live(i), 1);
	}
	rt.modField(f, rt.fv(f, "client", live(user)), "screen", rt.fv(f, "mapobjs", live(user)), add);
	yield* g.callName(f, live(f.src), "close", [live(user)]);
	return live(f.dot);
}, true);

// /obj/machinery/computer/security/proc/close  (code/game/machinery/overview.dm:319)
rt.def("/obj/machinery/computer/security/proc/close", function close(f: Frame, user: Value) {
	let using: Value = null, seccomp: Value = null;
	f.vars = () => [using, seccomp];
	rt.spawnTail(f, 20, "/obj/machinery/computer/security/proc/close: spawn at game/machinery/overview.dm:319", user, using, seccomp);
	return f.dot;
});

// a spawn(20) body of /obj/machinery/computer/security/proc/close, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/security/proc/close: spawn at game/machinery/overview.dm:319", function* (f: Frame, user: Value, using: Value, seccomp: Value) {
	let $e: any;
	f.vars = () => [user, using, seccomp, $e];
	using = null;
	if (truthy(rt.fv(f, "mapobjs", live(user)))) {
		seccomp = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [1, live(user)])), T("/obj/machinery/computer/security"));
		while (($e = rt.next(f, 0)) !== undefined) {
			seccomp = $e;
			if (isEqual(live(seccomp), live(f.src))) {
				using = 1;
				break;
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(using))) {
			yield* g.srcCall(f, "close", live(user));
		} else {
			yield* g.callName(f, live(user), "clearmap", []);
		}
	}
	return live(f.dot);
});

// /proc/getr  (code/game/machinery/overview.dm:335)
rt.def("/proc/getr", function getr(f: Frame, col: Value) {
	return rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(col), 2, 4])]);
});

// /proc/getg  (code/game/machinery/overview.dm:338)
rt.def("/proc/getg", function getg(f: Frame, col: Value) {
	return rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(col), 4, 6])]);
});

// /proc/getb  (code/game/machinery/overview.dm:341)
rt.def("/proc/getb", function getb(f: Frame, col: Value) {
	return rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(col), 6])]);
});

// /mob/proc/clearmap  (code/game/machinery/overview.dm:345)  may sleep
rt.def("/mob/proc/clearmap", function* clearmap(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	(rt.modField(f, rt.fv(f, "client", live(f.src)), "screen", rt.fv(f, "mapobjs", live(f.src)), subtract));
	O = null;
	rt.forList(f, 0, rt.sv(f, "mapobjs"), T("/obj/screen"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "mapobjs", null);
	yield* g.callName(f, live(f.src), "unset_machine", []);
	return f.dot;
}, true);
