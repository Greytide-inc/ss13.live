// Based on /tg/station's code/game/machinery/magnet.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(10804, "/obj/machinery/magnetic_module", "/obj/machinery", {
	freq: 1449,
	electricity_level: 1,
	magnetic_field: 1,
	code: 0,
	center: null,
	on: 0,
	pulling: 0,
	center_x: 0,
	center_y: 0,
	max_dist: 20,
	level: 1,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 50,
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "floor_magnet-f",
	name: "electromagnetic generator",
	desc: "A device that uses station power to create points of magnetic energy.",
	layer: 2.5,
});

// magnet.dm:33
rt.def("/obj/machinery/magnetic_module/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	yield* parent_proc();
	yield* this.hide((_T = this.loc).intact);
	this.center = _T;
	rt.spawnTail(f, 10, "/obj/machinery/magnetic_module/proc/New: spawn at game/machinery/magnet.dm:38", _T);
	rt.spawnTail(f, 0, "/obj/machinery/magnetic_module/proc/New: spawn at game/machinery/magnet.dm:42", _T);
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/magnetic_module/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_module/proc/New: spawn at game/machinery/magnet.dm:42", function* (f: Frame, _T: Value) {
	yield* this.magnetic_process();
	return null;
});

// a spawn(10) body of /obj/machinery/magnetic_module/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_module/proc/New: spawn at game/machinery/magnet.dm:38", function* (f: Frame, _T: Value) {
	if (GLOB.SSradio) {
		GLOB.SSradio.add_object(this, this.freq, GLOB.RADIO_MAGNETS);
	}
	return null;
});

// magnet.dm:47
rt.def("/obj/machinery/magnetic_module/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.freq);
	}
	f.dot = (yield* parent_proc());
	this.center = null;
	return f.dot;
}, true);

// magnet.dm:53
rt.def("/obj/machinery/magnetic_module/proc/hide", function hide(f: Frame, intact: Value) {
	this.invisibility = intact ? INVISIBILITY_MAXIMUM : 0;
	this.updateicon();
	return f.dot;
});

// magnet.dm:58
rt.def("/obj/machinery/magnetic_module/proc/updateicon", function updateicon(f: Frame) {
	let state: Value = "floor_magnet";
	let onstate: Value = "";
	if (!this.on) {
		onstate = "0";
	}
	if (this.invisibility) {
		this.icon_state = `${state}${onstate}-f`;
	} else {
		this.icon_state = `${state}${onstate}`;
	}
	return f.dot;
});

// magnet.dm:71
rt.def("/obj/machinery/magnetic_module/proc/receive_signal", function receive_signal(f: Frame, signal: Value) {
	let command: Value = rt.index(signal.data, "command");
	let modifier: Value = rt.index(signal.data, "modifier");
	let signal_code: Value = rt.index(signal.data, "code");
	if (!(command && signal_code == this.code)) return f.dot;
	this.Cmd(command, modifier);
	return f.dot;
});

// magnet.dm:83
rt.def("/obj/machinery/magnetic_module/proc/Cmd", function Cmd(f: Frame, command: Value, modifier: Value) {
	if (!command) return f.dot;
	if (command === "set-electriclevel") {
		if (modifier) {
			this.electricity_level = modifier;
		}
	} else if (command === "set-magneticfield") {
		if (modifier) {
			this.magnetic_field = modifier;
		}
	} else if (command === "add-elec") {
		this.electricity_level++;
		if (this.electricity_level > 12) {
			this.electricity_level = 12;
		}
	} else if (command === "sub-elec") {
		this.electricity_level--;
		if (this.electricity_level <= 0) {
			this.electricity_level = 1;
		}
	} else if (command === "add-mag") {
		this.magnetic_field++;
		if (this.magnetic_field > 4) {
			this.magnetic_field = 4;
		}
	} else if (command === "sub-mag") {
		this.magnetic_field--;
		if (this.magnetic_field <= 0) {
			this.magnetic_field = 1;
		}
	} else if (command === "set-x") {
		if (modifier) {
			this.center_x = modifier;
		}
	} else if (command === "set-y") {
		if (modifier) {
			this.center_y = modifier;
		}
	} else if (command === "N") {
		this.center_y++;
	} else if (command === "S") {
		this.center_y--;
	} else if (command === "E") {
		this.center_x++;
	} else if (command === "W") {
		this.center_x--;
	} else if (command === "C") {
		this.center_x = 0;
		this.center_y = 0;
	} else if (command === "R") {
		this.center_x = rand(-this.max_dist, this.max_dist);
		this.center_y = rand(-this.max_dist, this.max_dist);
	} else if (command === "set-code") {
		if (modifier) {
			this.code = modifier;
		}
	} else if (command === "toggle-power") {
		this.on = (!this.on ? 1 : 0);
		if (!this.on) return f.dot;
		ImmediateInvokeAsync(this, P("/obj/machinery/magnetic_module/proc/magnetic_process"));
	}
	return f.dot;
});

// magnet.dm:142
rt.def("/obj/machinery/magnetic_module/proc/process", function process(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		this.on = 0;
	}
	if (this.electricity_level <= 0) {
		this.electricity_level = 1;
	}
	if (this.magnetic_field <= 0) {
		this.magnetic_field = 1;
	}
	if (rt.op(f, "Abs", [], [this.center_x]) > this.max_dist) {
		this.center_x = this.max_dist;
	}
	if (rt.op(f, "Abs", [], [this.center_y]) > this.max_dist) {
		this.center_y = this.max_dist;
	}
	if (this.magnetic_field > 4) {
		this.magnetic_field = 4;
	}
	if (this.electricity_level > 12) {
		this.electricity_level = 12;
	}
	if (this.on) {
		this.use_power = 2;
		this.active_power_usage = this.electricity_level * 15;
	} else {
		this.use_power = 0;
	}
	this.updateicon();
	return f.dot;
}, false, { waitfor: false });

// magnet.dm:188
rt.def("/obj/machinery/magnetic_module/proc/magnetic_process", function* magnetic_process(f: Frame) {
	let M: Value = null, S: Value = null;
	if (this.pulling) {
		return f.dot;
	}
	while (this.on) {
		this.pulling = 1;
		this.center = rt.locate(this.x + this.center_x, this.y + this.center_y, this.z);
		if (this.center) {
			M = null;
			for (M of each(orange(this.magnetic_field, this.center), T("/obj"))) {
				if (!M.anchored && rt.bitAnd(M.flags, CONDUCT)) {
					yield* step_towards(M, this.center);
				}
			}
			S = null;
			for (S of each(orange(this.magnetic_field, this.center), T("/mob/living/silicon"))) {
				if (rt.istype(S, T("/mob/living/silicon/ai"))) {
					continue;
				}
				yield* step_towards(S, this.center);
			}
		}
		yield* this.use_power(this.electricity_level * 5);
		yield* sleep(13 - this.electricity_level);
	}
	this.pulling = 0;
	return f.dot;
}, true);

rt.type(10805, "/obj/machinery/magnetic_controller", "/obj/machinery", {
	frequency: 1449,
	code: 0,
	magnets: null,
	title: "Magnetic Control Console",
	autolink: 0,
	pathpos: 1,
	path: "w;e;e;w;s;n;n;s",
	speed: 1,
	rpath: null,
	moving: 0,
	looping: 0,
	radio_connection: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 45,
	name: "magnetic control console",
	icon: rt.rsc("icons/obj/airlock_machines.dmi"),
	icon_state: "airlock_control_standby",
	density: 0,
});

// magnet.dm:217
rt.def("/obj/machinery/magnetic_controller/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.magnets = list();

	this.rpath = list();
	return f.dot;
});

// magnet.dm:233
rt.def("/obj/machinery/magnetic_controller/proc/New", function* New(f: Frame) {
	let M: Value = null;
	yield* parent_proc();
	if (this.autolink) {
		for (M of each(GLOB.machines, T("/obj/machinery/magnetic_module"))) {
			if (M.freq == this.frequency && M.code == this.code) {
				this.magnets.Add(M);
			}
		}
	}
	rt.spawnTail(f, 45, "/obj/machinery/magnetic_controller/proc/New: spawn at game/machinery/magnet.dm:241", M);
	if (!this.path) return f.dot;
	this.filter_path();
	return f.dot;
}, true);

// a spawn(45) body of /obj/machinery/magnetic_controller/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_controller/proc/New: spawn at game/machinery/magnet.dm:241", function* (f: Frame, M: Value) {
	if (GLOB.SSradio) {
		this.radio_connection = GLOB.SSradio.add_object(this, this.frequency, GLOB.RADIO_MAGNETS);
	}
	return null;
});

// magnet.dm:251
rt.def("/obj/machinery/magnetic_controller/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	f.dot = (yield* parent_proc());
	this.magnets = null;
	this.rpath = null;
	return f.dot;
}, true);

// magnet.dm:257
rt.def("/obj/machinery/magnetic_controller/proc/process", function process(f: Frame) {
	let M: Value = null;
	if (!(rt.len(f, this.magnets) == 0 && this.autolink)) return f.dot;
	for (M of each(GLOB.machines, T("/obj/machinery/magnetic_module"))) {
		if (M.freq == this.frequency && M.code == this.code) {
			this.magnets.Add(M);
		}
	}
	return f.dot;
}, false, { waitfor: false });

// magnet.dm:264
rt.def("/obj/machinery/magnetic_controller/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// magnet.dm:267
rt.def("/obj/machinery/magnetic_controller/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let i: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = "<B>Magnetic Control Console</B><BR><BR>";
	if (!this.autolink) {
		dat += fmt("\n\t\tFrequency: <a href='?src=＃;operation=setfreq'>＀</a><br>\n\t\tCode: <a href='?src=＃;operation=setfreq'>＀</a><br>\n\t\t<a href='?src=＃;operation=probe'>Probe Generators</a><br>\n\t\t", [this, this.frequency, this, this.code, this]);
	}
	if (rt.len(f, this.magnets) >= 1) {
		dat += "Magnets confirmed: <br>";
		i = 0;
		for (M of each(this.magnets, T("/obj/machinery/magnetic_module"))) {
			i++;
			$0 = i;
			$1 = this;
			if (M.on) {
				$2 = "On";
			} else {
				$2 = "Off";
			}
			dat += fmt("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;< [＀] (<a href='?src=＃;radio-op=togglepower'>＀</a>) | Electricity level: <a href='?src=＃;radio-op=minuselec'>-</a> ＀ <a href='?src=＃;radio-op=pluselec'>+</a>; Magnetic field: <a href='?src=＃;radio-op=minusmag'>-</a> ＀ <a href='?src=＃;radio-op=plusmag'>+</a><br>", [$0, $1, $2, this, M.electricity_level, this, this, M.magnetic_field, this]);
		}
	}
	dat += fmt("<br>Speed: <a href='?src=＃;operation=minusspeed'>-</a> ＀ <a href='?src=＃;operation=plusspeed'>+</a><br>", [this, this.speed, this]);
	dat += fmt("Path: {<a href='?src=＃;operation=setpath'>＀</a>}<br>", [this, this.path]);
	dat += fmt("Moving: <a href='?src=＃;operation=togglemoving'>＀</a>", [this, this.moving ? "Enabled" : "Disabled"]);
	rt.op(f, "Browse", [], [user, dat, "window=magnet;size=400x500"], false);
	onclose(user, "magnet");
	return f.dot;
}, true);

// magnet.dm:295
rt.def("/obj/machinery/magnetic_controller/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let signal: Value = null, newpath: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "radio-op")) {
		(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
		signal.source = this;
		signal.frequency = this.frequency;
		rt.setAt(signal.data, "code", this.code);
		const item = rt.at(href_list, "radio-op");
		if (item === "togglepower") {
			rt.setAt(signal.data, "command", "toggle-power");
		} else if (item === "minuselec") {
			rt.setAt(signal.data, "command", "sub-elec");
		} else if (item === "pluselec") {
			rt.setAt(signal.data, "command", "add-elec");
		} else if (item === "minusmag") {
			rt.setAt(signal.data, "command", "sub-mag");
		} else if (item === "plusmag") {
			rt.setAt(signal.data, "command", "add-mag");
		}
		yield* this.radio_connection.post_signal(this, signal, { filter: GLOB.RADIO_MAGNETS });
		rt.spawnTail(f, 1, "/obj/machinery/magnetic_controller/proc/Topic: spawn at game/machinery/magnet.dm:328", signal, newpath);
	}
	if (rt.at(href_list, "operation")) {
		const item = rt.at(href_list, "operation");
		if (item === "plusspeed") {
			this.speed++;
			if (this.speed > 10) {
				this.speed = 10;
			}
		} else if (item === "minusspeed") {
			this.speed--;
			if (this.speed <= 0) {
				this.speed = 1;
			}
		} else if (item === "setpath") {
			if ((newpath = copytext(sanitize((yield* g.op(f, "Prompt", [3], [this.path, null, "Please define a new path!", f.usr, null]))), 1, 1024)) && newpath != "") {
				this.moving = 0;
				this.path = newpath;
				this.pathpos = 1;
				this.filter_path();
			}
		} else if (item === "togglemoving") {
			this.moving = (!this.moving ? 1 : 0);
			if (this.moving) {
				rt.spawnTail(f, 0, "/obj/machinery/magnetic_controller/proc/Topic: spawn at game/machinery/magnet.dm:352", signal, newpath);
			}
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/magnetic_controller/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_controller/proc/Topic: spawn at game/machinery/magnet.dm:352", function* (f: Frame, signal: Value, newpath: Value) {
	yield* this.MagnetMove();
	return null;
});

// a spawn(1) body of /obj/machinery/magnetic_controller/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_controller/proc/Topic: spawn at game/machinery/magnet.dm:328", function* (f: Frame, signal: Value, newpath: Value) {
	yield* this.updateUsrDialog();
	return null;
});

// magnet.dm:360
rt.def("/obj/machinery/magnetic_controller/proc/MagnetMove", function* MagnetMove(f: Frame) {
	let signal: Value = null, nextmove: Value = null;
	if (this.looping) {
		return f.dot;
	}
	while (this.moving && rt.len(f, this.rpath) >= 1) {
		if (rt.bitAnd(this.stat, 3)) {
			break;
		}
		this.looping = 1;
		(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
		signal.source = this;
		signal.frequency = this.frequency;
		rt.setAt(signal.data, "code", this.code);
		if (this.pathpos > rt.len(f, this.rpath)) {
			this.pathpos = 1;
		}
		if (!rt.isIn(f, (nextmove = uppertext(rt.index(this.rpath, this.pathpos))), list("N", "S", "E", "W", "C", "R"))) {
			yield* qdel(signal);
			break;
		}
		rt.setAt(signal.data, "command", nextmove);
		this.pathpos++;
		rt.spawnTail(f, 0, "/obj/machinery/magnetic_controller/proc/MagnetMove: spawn at game/machinery/magnet.dm:392", signal, nextmove);
		if (this.speed == 10) {
			yield* sleep(1);
		} else {
			yield* sleep(12 - this.speed);
		}
	}
	this.looping = 0;
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/magnetic_controller/proc/MagnetMove, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/magnetic_controller/proc/MagnetMove: spawn at game/machinery/magnet.dm:392", function* (f: Frame, signal: Value, nextmove: Value) {
	yield* this.radio_connection.post_signal(this, signal, { filter: GLOB.RADIO_MAGNETS });
	return null;
});

// magnet.dm:406
rt.def("/obj/machinery/magnetic_controller/proc/filter_path", function filter_path(f: Frame) {
	let nextchar: Value = null;
	this.rpath = list();
	let maximum_character: Value = min(50, rt.length(this.path));
	let i: Value = 1;
	while (i <= maximum_character) {
		if (!rt.isIn(f, (nextchar = copytext(this.path, i, i + 1)), list(";", "&", "*", " "))) {
			this.rpath += copytext(this.path, i, i + 1);
		}
		i++;
	}
	return f.dot;
});
