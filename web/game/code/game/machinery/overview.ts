// Based on /tg/station's code/game/machinery/overview.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// overview.dm:7
rt.def("/obj/machinery/computer/security/verb/station_map", function* station_map(f: Frame) {
	yield* f.usr.set_machine(this);
	if (!this.mapping) {
		return f.dot;
	}
	log_game(`${f.usr}(${f.usr.key}) used station map L${this.z} in ${this.loc.loc}`);
	yield* this.drawmap(f.usr);
	return f.dot;
}, true, { verb: { name: ".map", category: "Object", src: 1, range: 1 } });

// overview.dm:17
rt.def("/obj/machinery/computer/security/proc/drawmap", function* drawmap(f: Frame, user: Value) {
	let wy: Value = null, _T: Value = null, colour: Value = null, sense: Value = null, environment: Value = null, turf_total: Value = null, t1: Value = null, AM: Value = null, A: Value = null, red: Value = null, green: Value = null, blue: Value = null, ix: Value = null, iy: Value = null, rx: Value = null, ry: Value = null, I: Value = null, H: Value = null, I_8: Value = null;
	let $e: any;
	let icx: Value = round(rt.world().maxx / 16) + 1;
	let icy: Value = round(rt.world().maxy / 16) + 1;
	let xoff: Value = round(icx * 16 - rt.world().maxx - 2);
	let yoff: Value = round(icy * 16 - rt.world().maxy - 2);
	let icount: Value = icx * icy;
	let imap: Value = list();
	let i: Value = 0;
	while (i < icount) {
		imap += icon(rt.rsc("icons/misc/imap.dmi"), "blank");
		i++;
	}
	let wx: Value = 1;
	while (wx <= rt.world().maxx) {
		wy = 1;
		while (wy <= rt.world().maxy) {
			_T = rt.locate(wx, wy, this.z);
			colour = null;
			if (!_T) {
				colour = "#000000";
			} else {
				sense = 1;
				const text = `${_T.type}`;
				if (text === "/turf/open/space") {
					colour = "#0a0a0a";
					sense = 0;
				} else if (text === "/turf/open/floor" || text === "/turf/open/floor/engine") {
					environment = _T.return_air();
					turf_total = environment.total_moles();
					if ((t1 = turf_total / 103.983795 * 175) <= 100) {
						colour = rt.op(f, "Rgb", [1, 3], [0, 0, t1 * 2.55]);
					} else {
						colour = rt.op(f, "Rgb", [1, 3], [(t1 = min(100, t1 - 100)) * 2.55, t1 * 2.55, 255]);
					}
				} else if (text === "/turf/closed/wall") {
					colour = "#606060";
				} else if (text === "/turf/closed/wall/r_wall") {
					colour = "#806060";
				} else {
					colour = "#002800";
				}
				if (sense) {
					AM = null;
					for (AM of each(_T.contents, T("/atom"))) {
						if (rt.istype(AM, T("/obj/machinery/door")) && !rt.istype(AM, T("/obj/machinery/door/window"))) {
							if (AM.density) {
								colour = "#0060c0";
							} else {
								colour = "#60c080";
							}
						}
						if (rt.istype(AM, T("/obj/machinery/airalarm"))) {
							colour = "#00ff00";
							if (AM.icon_state == "alarm:1") {
								colour = "#ffff00";
							}
						}
						if (ismob(AM)) {
							if (AM.client) {
								colour = "#ff0000";
							} else {
								colour = "#ff8080";
							}
						}
					}
				}
				if ((A = _T.loc).fire) {
					red = getr(colour);
					green = getg(colour);
					blue = getb(colour);
					green = min(255, green + 40);
					blue = min(255, blue + 40);
					colour = rt.op(f, "Rgb", [1, 3], [red, green, blue]);
				}
			}
			ix = round((wx * 2 + xoff) / 32);
			iy = round((wy * 2 + yoff) / 32);
			rx = (wx * 2 + xoff) % 32 + 1;
			ry = (wy * 2 + yoff) % 32 + 1;
			(I = rt.index(imap, 1 + (ix + icx * iy))).DrawBox(colour, rx, ry, rx, ry);
			wy++;
		}
		wx++;
	}
	yield* user.clearmap();
	user.mapobjs = list();
	i = 0;
	while (i < icount) {
		(H = (yield* new_(T("/obj/screen")))).screen_loc = `${5 + i % icx},${6 + round(i / icx)}`;
		H.name = i == 0 ? "maprefresh" : "map";
		I_8 = rt.index(imap, i + 1);
		H.icon = I_8;
		yield* qdel(I_8);
		H.layer = ABOVE_HUD_LAYER;
		H.plane = ABOVE_HUD_PLANE;
		f.usr.mapobjs += H;
		i++;
	}
	user.client.screen += user.mapobjs;
	yield* this.close(user);
	return f.dot;
}, true);

// overview.dm:319
rt.def("/obj/machinery/computer/security/proc/close", function close(f: Frame, user: Value) {
	let using: Value = null, seccomp: Value = null;
	rt.spawnTail(f, 20, "/obj/machinery/computer/security/proc/close: spawn at game/machinery/overview.dm:319", user, using, seccomp);
	return f.dot;
});

// a spawn(20) body of /obj/machinery/computer/security/proc/close, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/security/proc/close: spawn at game/machinery/overview.dm:319", function* (f: Frame, user: Value, using: Value, seccomp: Value) {
	using = null;
	if (user.mapobjs) {
		seccomp = null;
		for (seccomp of each(oview(1, user), T("/obj/machinery/computer/security"))) {
			if (seccomp == this) {
				using = 1;
				break;
			}
		}
		if (using) {
			yield* this.close(user);
		} else {
			yield* user.clearmap();
		}
	}
	return f.dot;
});

// overview.dm:335
rt.def("/proc/getr", function getr(f: Frame, col: Value) {
	return hex2num(copytext(col, 2, 4));
});

// overview.dm:338
rt.def("/proc/getg", function getg(f: Frame, col: Value) {
	return hex2num(copytext(col, 4, 6));
});

// overview.dm:341
rt.def("/proc/getb", function getb(f: Frame, col: Value) {
	return hex2num(copytext(col, 6));
});

// overview.dm:345
rt.def("/mob/proc/clearmap", function* clearmap(f: Frame) {
	let O: Value = null;
	this.client.screen -= this.mapobjs;
	for (O of each(this.mapobjs, T("/obj/screen"))) {
		yield* qdel(O);
	}
	this.mapobjs = null;
	yield* this.unset_machine();
	return f.dot;
}, true);
