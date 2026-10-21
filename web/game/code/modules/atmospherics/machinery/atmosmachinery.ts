// From code/modules/atmospherics/machinery/atmosmachinery.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10442, "/obj/machinery/atmospherics", "/obj/machinery", {
	nodealert: 0,
	can_unwrench: 0,
	initialize_directions: 0,
	pipe_color: null,
	pipe_vision_img: null,
	device_type: 0,
	nodes: null,
	anchored: 1,
	idle_power_usage: 0,
	active_power_usage: 0,
	power_channel: 3,
	on_blueprints: 1,
	layer: 2.35,
	resistance_flags: 2,
	obj_integrity: 200,
	max_integrity: 200,
}, { global: { iconsetids: 747, pipeimages: 748 } });

// /obj/machinery/atmospherics/proc/New  (code/modules/atmospherics/machinery/atmosmachinery.dm:39)  may sleep
rt.def("/obj/machinery/atmospherics/proc/New", function* New(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	rt.setSv(f, "nodes", (yield* g.new_(f, T("/list"), [rt.sv(f, "device_type")])));
	if (!truthy(rt.sv(f, "armor"))) {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 10, "laser", 10, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 100, "acid", 70]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), add);
	}
	yield* g.srcCall(f, "SetInitDirections");
	return f.dot;
}, true, { args: ["loc", "process"] });

// /obj/machinery/atmospherics/proc/Destroy  (code/modules/atmospherics/machinery/atmosmachinery.dm:48)  may sleep
rt.def("/obj/machinery/atmospherics/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	// stress2c: a pump/vent/... expects its neighbours' pipelines to exist when it goes: do the waiting rebuilds first
	if (rt.gl("pipe_rebuild_defer") !== null && !rt.istype(live(f.src), T("/obj/machinery/atmospherics/pipe"))) {
		rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []);
	}
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "nullifyNode", live(I));
	}
	rt.endFor(f, 0);
	(rt.modField(f, rt.gl("SSair"), "atmos_machinery", live(f.src), subtract));
	yield* g.srcCall(f, "dropContents");
	if (truthy(rt.sv(f, "pipe_vision_img"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "pipe_vision_img")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/atmospherics/proc/nullifyNode  (code/modules/atmospherics/machinery/atmosmachinery.dm:61)  may sleep
rt.def("/obj/machinery/atmospherics/proc/nullifyNode", function* nullifyNode(f: Frame, I: Value) {
	let N: Value = null;
	f.vars = () => [I, N];
	if (!truthy(rt.index(rt.sv(f, "nodes"), live(I)))) return f.dot;
	yield* g.callName(f, (N = rt.index(rt.sv(f, "nodes"), live(I))), "disconnect", [live(f.src)]);
	rt.setAt(rt.sv(f, "nodes"), live(I), null);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/proc/getNodeConnects  (code/modules/atmospherics/machinery/atmosmachinery.dm:67)
rt.def("/obj/machinery/atmospherics/proc/getNodeConnects", function getNodeConnects(f: Frame) {
	let node_connects: Value = null, I: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [node_connects, I, D, $e];
	rt.setFv(f, "len", (node_connects = rt.list()), rt.sv(f, "device_type"));
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		D = null;
		rt.forList(f, 1, rt.gl("cardinal"));
		while (($e = rt.next(f, 1)) !== undefined) {
			D = $e;
			if (truthy(rt.bitAnd(live(D), rt.callSrc(f, "GetInitDirections", [])))) {
				if (truthy((rt.isIn(f, live(D), live(node_connects)) ? 1 : 0))) {
					continue;
				}
				rt.setAt(live(node_connects), live(I), live(D));
				break;
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(node_connects);
});

// /obj/machinery/atmospherics/proc/atmosinit  (code/modules/atmospherics/machinery/atmosmachinery.dm:82)  may sleep
rt.def("/obj/machinery/atmospherics/proc/atmosinit", function* atmosinit(f: Frame, node_connects: Value) {
	let I: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [node_connects, I, target, $e];
	if (!truthy(live(node_connects))) {
		node_connects = (yield* g.srcCall(f, "getNodeConnects"));
	}
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		target = null;
		rt.forList(f, 1, rt.getStep(f, live(f.src), rt.index(live(node_connects), live(I))), T("/obj/machinery/atmospherics"));
		while (($e = rt.next(f, 1)) !== undefined) {
			target = $e;
			if (truthy((yield* g.srcCall(f, "can_be_node", live(target), live(I))))) {
				rt.setAt(rt.sv(f, "nodes"), live(I), live(target));
				break;
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/atmospherics/proc/can_be_node  (code/modules/atmospherics/machinery/atmosmachinery.dm:94)
rt.def("/obj/machinery/atmospherics/proc/can_be_node", function can_be_node(f: Frame, target: Value) {
	if (!truthy(rt.bitAnd(rt.fv(f, "initialize_directions", live(target)), rt.getDir(f, live(target), live(f.src))))) return f.dot;
	return 1;
});

// /obj/machinery/atmospherics/proc/disconnect  (code/modules/atmospherics/machinery/atmosmachinery.dm:123)  may sleep
rt.def("/obj/machinery/atmospherics/proc/disconnect", function* disconnect(f: Frame, reference: Value) {
	let _P: Value = null, I: Value = null;
	f.vars = () => [reference, _P, I];
	if (truthy((rt.istype(live(reference), T("/obj/machinery/atmospherics/pipe")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.gv(f, "parent", (_P = live(reference)))]);
	}
	I = (yield* g.callName(f, rt.sv(f, "nodes"), "Find", [live(reference)]));
	rt.setAt(rt.sv(f, "nodes"), live(I), null);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/atmospherics/proc/attackby  (code/modules/atmospherics/machinery/atmosmachinery.dm:134)  may sleep
rt.def("/obj/machinery/atmospherics/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, int_air: Value = null, env_air: Value = null, unsafe_wrenching: Value = null, internal_pressure: Value = null;
	f.vars = () => [_T, int_air, env_air, unsafe_wrenching, internal_pressure];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "can_unwrench", live(f.args[1]))))) {
			_T = rt.getStep(f, live(f.src), 0);
			if (((isEqual(rt.sv(f, "level"), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)])))) && truthy(rt.fv(f, "intact", live(_T))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must remove the plating first!</span>"]);
				return 1;
			}
			int_air = (yield* g.srcCall(f, "return_air"));
			env_air = (yield* g.callName(f, rt.sv(f, "loc"), "return_air", []));
			yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
			unsafe_wrenching = 0;
			internal_pressure = subtract((yield* g.callName(f, live(int_air), "return_pressure", [])), (yield* g.callName(f, live(env_air), "return_pressure", [])));
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin to unfasten ％！...</span>", [live(f.src)])]);
			if (rt.gt(live(internal_pressure), 202.64999389648438)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>As you begin unwrenching ％！ a gush of air blows in your face... maybe you should reconsider?</span>", [live(f.src)])]);
				unsafe_wrenching = 1;
			}
			if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named))) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ unfastens ％！.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You unfasten ％！.</span>", [live(f.src)]), "<span class='italics'>You hear ratchet.</span>"]);
				yield* g.srcCall(f, "investigate_log", fmt("was <span class='warning'>REMOVED</span> by ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)]))]), "atmos");
				if (truthy(live(unsafe_wrenching))) {
					yield* g.srcCall(f, "unsafe_pressure_release", live(f.args[1]), live(internal_pressure));
				}
				yield* g.srcCall(f, "deconstruct", 1);
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/atmospherics/proc/unsafe_pressure_release  (code/modules/atmospherics/machinery/atmosmachinery.dm:172)  may sleep
rt.def("/obj/machinery/atmospherics/proc/unsafe_pressure_release", function* unsafe_pressure_release(f: Frame, user: Value, pressures: Value) {
	let int_air: Value = null, env_air: Value = null, fuck_you_dir: Value = null, target: Value = null, range: Value = null, speed: Value = null;
	f.vars = () => [user, pressures, int_air, env_air, fuck_you_dir, target, range, speed];
	if (live(pressures) === null) {
		pressures = null;
	}
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	if (!truthy(live(pressures))) {
		int_air = (yield* g.srcCall(f, "return_air"));
		env_air = (yield* g.callName(f, rt.sv(f, "loc"), "return_air", []));
		pressures = subtract((yield* g.callName(f, live(int_air), "return_pressure", [])), (yield* g.callName(f, live(env_air), "return_pressure", [])));
	}
	if (!truthy((fuck_you_dir = rt.getDir(f, live(f.src), live(user))))) {
		fuck_you_dir = rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]);
	}
	target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(user), live(fuck_you_dir)]));
	range = divide(live(pressures), 250);
	speed = divide(live(range), 5);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ is sent flying by pressure!</span>", [live(user)]), "<span class='userdanger'>The pressure sends you flying!</span>"]);
	yield* g.callName(f, live(user), "throw_at", [live(target), live(range), live(speed)]);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/proc/deconstruct  (code/modules/atmospherics/machinery/atmosmachinery.dm:190)  may sleep
rt.def("/obj/machinery/atmospherics/proc/deconstruct", function* deconstruct(f: Frame) {
	let stored: Value = null;
	f.vars = () => [stored];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(rt.sv(f, "can_unwrench"))) {
			stored = (yield* g.new_(f, T("/obj/item/pipe"), [null, rt.sv(f, "loc"), "make_from", live(f.src)], rt.Args.Named));
			if (!truthy(live(f.args[0]))) {
				rt.setFv(f, "obj_integrity", live(stored), multiply(rt.fv(f, "max_integrity", live(stored)), 0.5));
			}
			yield* g.srcCall(f, "transfer_fingerprints_to", live(stored));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["disassembled"] });

// /obj/machinery/atmospherics/proc/getpipeimage  (code/modules/atmospherics/machinery/atmosmachinery.dm:201)
rt.def("/obj/machinery/atmospherics/proc/getpipeimage", function getpipeimage(f: Frame, iconset: Value, iconstate: Value, direction: Value, col: Value) {
	let identifier: Value = null, pipe_overlay: Value = null;
	f.vars = () => [col, identifier, pipe_overlay];
	if (live(col) === null) {
		col = "#ffffff";
	}
	if (rt.index(rt.gl("iconsetids"), live(iconset)) === null) {
		rt.setAt(rt.gl("iconsetids"), live(iconset), rt.call(f, P("/proc/num2text"), null, [add(rt.len(f, rt.gl("iconsetids")), 1)]));
	}
	identifier = add(rt.index(rt.gl("iconsetids"), live(iconset)), fmt("_＀_＀_＀", [live(iconstate), live(direction), live(col)]));
	if (truthy((f.dot = rt.index(rt.gl("pipeimages"), live(identifier))))) return f.dot;
	pipe_overlay = null;
	rt.setFv(f, "color", (pipe_overlay = (f.dot = (rt.setAt(rt.gl("pipeimages"), live(identifier), rt.call(f, P("/proc/image"), null, [null, live(iconset), null, live(iconstate), "dir", live(direction)], rt.Args.Named))))), live(col));
	return f.dot;
});

// /obj/machinery/atmospherics/proc/on_construction  (code/modules/atmospherics/machinery/atmosmachinery.dm:214)  may sleep
rt.def("/obj/machinery/atmospherics/proc/on_construction", function* on_construction(f: Frame, pipe_type: Value, obj_color: Value) {
	let _T: Value = null, nodes: Value = null, A: Value = null;
	let $0: any, $e: any;
	f.vars = () => [pipe_type, obj_color, _T, nodes, A, $0, $e];
	if (truthy(rt.sv(f, "can_unwrench"))) {
		yield* g.srcCall(f, "add_atom_colour", live(obj_color), 4);
		rt.setSv(f, "pipe_color", live(obj_color));
	}
	if (truthy(rt.gv(f, "intact", (_T = rt.getStep(f, live(f.src), 0))))) {
		$0 = 2;
	} else {
		$0 = 1;
	}
	rt.setSv(f, "level", $0);
	yield* g.srcCall(f, "atmosinit");
	nodes = (yield* g.srcCall(f, "pipeline_expansion"));
	A = null;
	rt.forList(f, 0, live(nodes), T("/obj/machinery/atmospherics"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "atmosinit", []);
		yield* g.callName(f, live(A), "addMember", [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "build_network");
	return f.dot;
}, true);

// /obj/machinery/atmospherics/proc/singularity_pull  (code/modules/atmospherics/machinery/atmosmachinery.dm:226)  may sleep
rt.def("/obj/machinery/atmospherics/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	yield* g.srcCall(f, "deconstruct", 0);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/proc/findConnecting  (code/modules/atmospherics/machinery/atmosmachinery.dm:232)
rt.def("/obj/machinery/atmospherics/proc/findConnecting", function findConnecting(f: Frame, direction: Value) {
	let target: Value = null;
	let $e: any;
	f.vars = () => [target, $e];
	target = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), live(direction)), T("/obj/machinery/atmospherics"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		if (truthy(rt.bitAnd(rt.fv(f, "initialize_directions", live(target)), rt.getDir(f, live(target), live(f.src))))) {
			return live(target);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/atmospherics/proc/relaymove  (code/modules/atmospherics/machinery/atmosmachinery.dm:240)  may sleep
rt.def("/obj/machinery/atmospherics/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	let target_move: Value = null, pipenetdiff: Value = null;
	f.vars = () => [user, direction, target_move, pipenetdiff];
	if (!truthy(rt.bitAnd(live(direction), rt.sv(f, "initialize_directions")))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, live(user), rt.sv(f, "buckled_mobs")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((target_move = (yield* g.srcCall(f, "findConnecting", live(direction)))))) {
		if (truthy((yield* g.callName(f, live(target_move), "can_crawl_through", [])))) {
			if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(target_move), rt.gl("ventcrawl_machinery")])))) {
				yield* g.callName(f, live(user), "forceMove", [rt.fv(f, "loc", live(target_move))]);
				yield* g.callName(f, live(user), "visible_message", ["<span class='notice'>You hear something squeezing through the ducts...</span>", "<span class='notice'>You climb out the ventilation system."]);
			} else {
				if (truthy(rt.getLen(f, (pipenetdiff = rt.bitXor((yield* g.srcCall(f, "returnPipenets")), (yield* g.callName(f, live(target_move), "returnPipenets", []))))))) {
					yield* g.callName(f, live(user), "update_pipe_vision", [live(target_move)]);
				}
				rt.setFv(f, "loc", live(user), live(target_move));
				rt.setFv(f, "eye", rt.fv(f, "client", live(user)), live(target_move));
				if (rt.gt(subtract(rt.worldTime(f), rt.fv(f, "last_played_vent", live(user))), 30)) {
					rt.setFv(f, "last_played_vent", live(user), rt.worldTime(f));
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/ventcrawl.ogg"), 50, 1, -3]);
				}
			}
		}
	} else {
		if ((truthy(rt.bitAnd(live(direction), rt.sv(f, "initialize_directions"))) || (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.src), rt.gl("ventcrawl_machinery")]))) && truthy((yield* g.srcCall(f, "can_crawl_through")))))) {
			yield* g.callName(f, live(user), "forceMove", [rt.fv(f, "loc", live(f.src))]);
			yield* g.callName(f, live(user), "visible_message", ["<span class='notice'>You hear something squeezing through the ducts...</span>", "<span class='notice'>You climb out the ventilation system."]);
		}
	}
	rt.setFv(f, "canmove", live(user), 0);
	rt.spawnTail(f, 1, "/obj/machinery/atmospherics/proc/relaymove: spawn at modules/atmospherics/machinery/atmosmachinery.dm:266", user, direction, target_move, pipenetdiff);
	return f.dot;
}, true);

// a spawn(1) body of /obj/machinery/atmospherics/proc/relaymove, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/proc/relaymove: spawn at modules/atmospherics/machinery/atmosmachinery.dm:266", function* (f: Frame, user: Value, direction: Value, target_move: Value, pipenetdiff: Value) {
	f.vars = () => [user, direction, target_move, pipenetdiff];
	rt.setFv(f, "canmove", live(user), 1);
	return null;
});

// /obj/machinery/atmospherics/proc/AltClick  (code/modules/atmospherics/machinery/atmosmachinery.dm:271)  may sleep
rt.def("/obj/machinery/atmospherics/proc/AltClick", function* AltClick(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.src), rt.gl("ventcrawl_machinery")])))) {
		yield* g.callName(f, live(f.args[0]), "handle_ventcrawl", [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["L"] });

// /obj/machinery/atmospherics/proc/returnPipenets  (code/modules/atmospherics/machinery/atmosmachinery.dm:281)
rt.def("/obj/machinery/atmospherics/proc/returnPipenets", function returnPipenets(f: Frame) {
	return rt.list();
});

// /obj/machinery/atmospherics/proc/update_remote_sight  (code/modules/atmospherics/machinery/atmosmachinery.dm:284)
rt.def("/obj/machinery/atmospherics/proc/update_remote_sight", function update_remote_sight(f: Frame, user: Value) {
	(rt.modField(f, live(user), "sight", 17, rt.bitOr));
	return f.dot;
});

// /obj/machinery/atmospherics/proc/shuttleRotate  (code/modules/atmospherics/machinery/atmosmachinery.dm:292)  may sleep
rt.def("/obj/machinery/atmospherics/proc/shuttleRotate", function* shuttleRotate(f: Frame) {
	let real_node_connect: Value = null, I: Value = null, supposed_node_connect: Value = null, nodes_copy: Value = null, I_3: Value = null, new_pos: Value = null;
	let $e: any;
	f.vars = () => [real_node_connect, I, supposed_node_connect, nodes_copy, I_3, new_pos, $e];
	real_node_connect = (yield* g.srcCall(f, "getNodeConnects"));
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setAt(live(real_node_connect), live(I), (yield* g.call(f, P("/proc/angle2dir"), null, [add(live(f.args[0]), (yield* g.call(f, P("/proc/dir2angle"), null, [rt.index(live(real_node_connect), live(I))])))])));
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "SetInitDirections");
	supposed_node_connect = (yield* g.srcCall(f, "getNodeConnects"));
	nodes_copy = (yield* g.callName(f, rt.sv(f, "nodes"), "Copy", []));
	I_3 = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I_3 = $e;
		new_pos = (yield* g.callName(f, live(supposed_node_connect), "Find", [rt.index(live(real_node_connect), live(I_3))]));
		rt.setAt(rt.sv(f, "nodes"), live(new_pos), rt.index(live(nodes_copy), live(I_3)));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["rotation"] });

// /obj/machinery/atmospherics/proc/afterShuttleMove  (code/modules/atmospherics/machinery/atmosmachinery.dm:306)  may sleep
rt.def("/obj/machinery/atmospherics/proc/afterShuttleMove", function* afterShuttleMove(f: Frame) {
	let missing_nodes: Value = null, I: Value = null, node: Value = null, connected: Value = null, D: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [missing_nodes, I, node, connected, D, A, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	missing_nodes = 0;
	I = null;
	rt.forRange(f, 0, 1, rt.sv(f, "device_type"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.index(rt.fv(f, "nodes", live(f.src)), live(I)))) {
			node = rt.index(rt.fv(f, "nodes", live(f.src)), live(I));
			connected = 0;
			D = null;
			rt.forList(f, 1, rt.gl("cardinal"));
			while (($e = rt.next(f, 1)) !== undefined) {
				D = $e;
				if (truthy((rt.isIn(f, live(node), rt.getStep(f, live(f.src), live(D))) ? 1 : 0))) {
					connected = 1;
					break;
				}
			}
			rt.endFor(f, 1);
			if (!truthy(live(connected))) {
				yield* g.srcCall(f, "nullifyNode", live(I));
			}
		}
		if (!truthy(rt.index(rt.fv(f, "nodes", live(f.src)), live(I)))) {
			missing_nodes = 1;
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(missing_nodes))) {
		yield* g.srcCall(f, "atmosinit");
		A = null;
		rt.forList(f, 0, (yield* g.srcCall(f, "pipeline_expansion")), T("/obj/machinery/atmospherics"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			yield* g.callName(f, live(A), "atmosinit", []);
			if (truthy((yield* g.callName(f, live(A), "returnPipenet", [])))) {
				yield* g.callName(f, live(A), "addMember", [live(f.src)]);
			}
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "build_network");
	} else {
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true);
