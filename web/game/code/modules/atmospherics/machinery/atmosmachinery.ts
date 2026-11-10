// Based on /tg/station's code/modules/atmospherics/machinery/atmosmachinery.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


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

// atmosmachinery.dm:39
rt.def("/obj/machinery/atmospherics/proc/New", function* New(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	this.nodes = (yield* new_(T("/list"), this.device_type));
	if (!this.armor) {
		this.armor = rt.alist(f, ["melee", 25, "bullet", 10, "laser", 10, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 100, "acid", 70]);
	}
	yield* parent_proc();
	if (f.args[1]) {
		GLOB.SSair.atmos_machinery += this;
	}
	this.SetInitDirections();
	return f.dot;
}, true, { args: ["loc", "process"] });

// atmosmachinery.dm:48
rt.def("/obj/machinery/atmospherics/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	let $e: any;
	// stress2c: a pump/vent/... expects its neighbours' pipelines to exist when it goes: do the waiting rebuilds first
	if (GLOB.pipe_rebuild_defer !== null && !rt.istype(this, T("/obj/machinery/atmospherics/pipe"))) {
		rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []);
	}
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* this.nullifyNode(I);
	}
	rt.endFor(f, 0);
	GLOB.SSair.atmos_machinery -= this;
	yield* this.dropContents();
	if (this.pipe_vision_img) {
		yield* qdel(this.pipe_vision_img);
	}
	return (yield* parent_proc());
}, true);

// atmosmachinery.dm:61
rt.def("/obj/machinery/atmospherics/proc/nullifyNode", function* nullifyNode(f: Frame, I: Value) {
	let N: Value = null;
	if (!rt.index(this.nodes, I)) return f.dot;
	yield* (N = rt.index(this.nodes, I)).disconnect(this);
	rt.setAt(this.nodes, I, null);
	return f.dot;
}, true);

// atmosmachinery.dm:67
rt.def("/obj/machinery/atmospherics/proc/getNodeConnects", function getNodeConnects(f: Frame) {
	let node_connects: Value = null, I: Value = null, D: Value = null;
	let $e: any;
	(node_connects = list()).len = this.device_type;
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		D = null;
		for (D of each(GLOB.cardinal)) {
			if (rt.bitAnd(D, this.GetInitDirections())) {
				if (rt.isIn(f, D, node_connects)) {
					continue;
				}
				rt.setAt(node_connects, I, D);
				break;
			}
		}
	}
	rt.endFor(f, 0);
	return node_connects;
});

// atmosmachinery.dm:82
rt.def("/obj/machinery/atmospherics/proc/atmosinit", function* atmosinit(f: Frame, node_connects: Value) {
	let I: Value = null, target: Value = null;
	let $e: any;
	if (!node_connects) {
		node_connects = this.getNodeConnects();
	}
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		target = null;
		for (target of each(rt.getStep(f, this, rt.index(node_connects, I)), T("/obj/machinery/atmospherics"))) {
			if (this.can_be_node(target, I)) {
				rt.setAt(this.nodes, I, target);
				break;
			}
		}
	}
	rt.endFor(f, 0);
	yield* this.update_icon();
	return f.dot;
}, true);

// atmosmachinery.dm:94
rt.def("/obj/machinery/atmospherics/proc/can_be_node", function can_be_node(f: Frame, target: Value) {
	if (!rt.bitAnd(target.initialize_directions, rt.getDir(f, target, this))) return f.dot;
	return 1;
});

// atmosmachinery.dm:123
rt.def("/obj/machinery/atmospherics/proc/disconnect", function* disconnect(f: Frame, reference: Value) {
	let _P: Value = null;
	if (rt.istype(reference, T("/obj/machinery/atmospherics/pipe"))) {
		yield* qdel((_P = reference).parent);
	}
	let I: Value = this.nodes.Find(reference);
	rt.setAt(this.nodes, I, null);
	yield* this.update_icon();
	return f.dot;
}, true);

// atmosmachinery.dm:134
rt.def("/obj/machinery/atmospherics/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null, int_air: Value = null, env_air: Value = null, unsafe_wrenching: Value = null, internal_pressure: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.can_unwrench(user)) {
			_T = rt.getStep(f, this, 0);
			if (this.level == 1 && isturf(_T) && _T.intact) {
				to_chat(user, "<span class='warning'>You must remove the plating first!</span>");
				return 1;
			}
			int_air = this.return_air();
			env_air = this.loc.return_air();
			yield* this.add_fingerprint(user);
			unsafe_wrenching = 0;
			internal_pressure = int_air.return_pressure() - env_air.return_pressure();
			playsound(this.loc, W.usesound, 50, 1);
			to_chat(user, fmt("<span class='notice'>You begin to unfasten ％！...</span>", [this]));
			if (internal_pressure > 202.65) {
				to_chat(user, fmt("<span class='warning'>As you begin unwrenching ％！ a gush of air blows in your face... maybe you should reconsider?</span>", [this]));
				unsafe_wrenching = 1;
			}
			if ((yield* do_after(user, 20 * W.toolspeed, { target: this })) && !(!this || this.gc_destroyed)) {
				user.visible_message(fmt("＀ unfastens ％！.", [user, this]), fmt("<span class='notice'>You unfasten ％！.</span>", [this]), "<span class='italics'>You hear ratchet.</span>");
				this.investigate_log(`was <span class='warning'>REMOVED</span> by ${key_name(f.usr)}`, "atmos");
				if (unsafe_wrenching) {
					yield* this.unsafe_pressure_release(user, internal_pressure);
				}
				yield* this.deconstruct(1);
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// atmosmachinery.dm:172
rt.def("/obj/machinery/atmospherics/proc/unsafe_pressure_release", function* unsafe_pressure_release(f: Frame, user: Value, pressures: Value) {
	let int_air: Value = null, env_air: Value = null, fuck_you_dir: Value = null;
	if (!user) {
		return f.dot;
	}
	if (!pressures) {
		int_air = this.return_air();
		env_air = this.loc.return_air();
		pressures = int_air.return_pressure() - env_air.return_pressure();
	}
	if (!(fuck_you_dir = rt.getDir(f, this, user))) {
		fuck_you_dir = pick(GLOB.cardinal);
	}
	let target: Value = get_edge_target_turf(user, fuck_you_dir);
	let range: Value = pressures / 250;
	let speed: Value = range / 5;
	user.visible_message(`<span class='danger'>${user} is sent flying by pressure!</span>`, "<span class='userdanger'>The pressure sends you flying!</span>");
	yield* user.throw_at(target, range, speed);
	return f.dot;
}, true);

// atmosmachinery.dm:190
rt.def("/obj/machinery/atmospherics/proc/deconstruct", function* deconstruct(f: Frame) {
	let stored: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.can_unwrench) {
			stored = (yield* new_(T("/obj/item/pipe"), this.loc, { make_from: this }));
			if (!f.args[0]) {
				stored.obj_integrity = stored.max_integrity * 0.5;
			}
			this.transfer_fingerprints_to(stored);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["disassembled"] });

// atmosmachinery.dm:201
rt.def("/obj/machinery/atmospherics/proc/getpipeimage", function getpipeimage(f: Frame, iconset: Value, iconstate: Value, direction: Value, col: Value) {
	let pipe_overlay: Value = null;
	col ??= "#ffffff";
	if (rt.index(GLOB.iconsetids, iconset) === null) {
		rt.setAt(GLOB.iconsetids, iconset, num2text(rt.len(f, GLOB.iconsetids) + 1));
	}
	let identifier: Value = rt.index(GLOB.iconsetids, iconset) + `_${iconstate}_${direction}_${col}`;
	if (f.dot = rt.index(GLOB.pipeimages, identifier)) return f.dot;
	(pipe_overlay = (f.dot = (rt.setAt(GLOB.pipeimages, identifier, image(iconset, iconstate, { dir: direction }))))).color = col;
	return f.dot;
});

// atmosmachinery.dm:214
rt.def("/obj/machinery/atmospherics/proc/on_construction", function* on_construction(f: Frame, pipe_type: Value, obj_color: Value) {
	let _T: Value = null, A: Value = null;
	let $e: any;
	if (this.can_unwrench) {
		this.add_atom_colour(obj_color, FIXED_COLOUR_PRIORITY);
		this.pipe_color = obj_color;
	}
	this.level = (_T = rt.getStep(f, this, 0)).intact ? 2 : 1;
	yield* this.atmosinit();
	let nodes: Value = this.pipeline_expansion();
	for (A of each(nodes, T("/obj/machinery/atmospherics"))) {
		yield* A.atmosinit();
		yield* A.addMember(this);
	}
	this.build_network();
	return f.dot;
}, true);

// atmosmachinery.dm:226
rt.def("/obj/machinery/atmospherics/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	yield* this.deconstruct(0);
	return f.dot;
}, true);

// atmosmachinery.dm:232
rt.def("/obj/machinery/atmospherics/proc/findConnecting", function findConnecting(f: Frame, direction: Value) {
	let target: Value = null;
	for (target of each(rt.getStep(f, this, direction), T("/obj/machinery/atmospherics"))) {
		if (rt.bitAnd(target.initialize_directions, rt.getDir(f, target, this))) {
			return target;
		}
	}
	return f.dot;
});

// atmosmachinery.dm:240
rt.def("/obj/machinery/atmospherics/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	let target_move: Value = null, pipenetdiff: Value = null;
	if (!rt.bitAnd(direction, this.initialize_directions)) {
		return f.dot;
	}
	if (rt.isIn(f, user, this.buckled_mobs)) {
		return f.dot;
	}
	if (target_move = this.findConnecting(direction)) {
		if (target_move.can_crawl_through()) {
			if (is_type_in_typecache(target_move, GLOB.ventcrawl_machinery)) {
				yield* user.forceMove(target_move.loc);
				user.visible_message("<span class='notice'>You hear something squeezing through the ducts...</span>", "<span class='notice'>You climb out the ventilation system.");
			} else {
				if (rt.len(f, (pipenetdiff = rt.bitXor(this.returnPipenets(), target_move.returnPipenets())))) {
					user.update_pipe_vision(target_move);
				}
				user.loc = target_move;
				user.client.eye = target_move;
				if (rt.worldTime(f) - user.last_played_vent > 30) {
					user.last_played_vent = rt.worldTime(f);
					playsound(this, rt.rsc("sound/machines/ventcrawl.ogg"), 50, 1, -3);
				}
			}
		}
	} else if (rt.bitAnd(direction, this.initialize_directions) || is_type_in_typecache(this, GLOB.ventcrawl_machinery) && this.can_crawl_through()) {
		yield* user.forceMove(this.loc);
		user.visible_message("<span class='notice'>You hear something squeezing through the ducts...</span>", "<span class='notice'>You climb out the ventilation system.");
	}
	user.canmove = 0;
	rt.spawnTail(f, 1, "/obj/machinery/atmospherics/proc/relaymove: spawn at modules/atmospherics/machinery/atmosmachinery.dm:266", user, direction, target_move, pipenetdiff);
	return f.dot;
}, true);

// a spawn(1) body of /obj/machinery/atmospherics/proc/relaymove, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/atmospherics/proc/relaymove: spawn at modules/atmospherics/machinery/atmosmachinery.dm:266", function* (f: Frame, user: Value, direction: Value, target_move: Value, pipenetdiff: Value) {
	user.canmove = 1;
	return null;
});

// atmosmachinery.dm:271
rt.def("/obj/machinery/atmospherics/proc/AltClick", function* AltClick(f: Frame, L: Value) {
	if (is_type_in_list(this, GLOB.ventcrawl_machinery)) {
		yield* L.handle_ventcrawl(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// atmosmachinery.dm:281
rt.def("/obj/machinery/atmospherics/proc/returnPipenets", function returnPipenets(f: Frame) {
	return list();
});

// atmosmachinery.dm:284
rt.def("/obj/machinery/atmospherics/proc/update_remote_sight", function update_remote_sight(f: Frame, user: Value) {
	(rt.modField(f, user, "sight", 17, rt.bitOr));
	return f.dot;
});

// atmosmachinery.dm:292
rt.def("/obj/machinery/atmospherics/proc/shuttleRotate", function* shuttleRotate(f: Frame, rotation: Value) {
	let I: Value = null, I_3: Value = null, new_pos: Value = null;
	let $e: any;
	let real_node_connect: Value = this.getNodeConnects();
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setAt(real_node_connect, I, angle2dir(rotation + dir2angle(rt.index(real_node_connect, I))));
	}
	rt.endFor(f, 0);
	yield* parent_proc();
	this.SetInitDirections();
	let supposed_node_connect: Value = this.getNodeConnects();
	let nodes_copy: Value = (yield* this.nodes.Copy());
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I_3 = $e;
		new_pos = supposed_node_connect.Find(rt.index(real_node_connect, I_3));
		rt.setAt(this.nodes, new_pos, rt.index(nodes_copy, I_3));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// atmosmachinery.dm:306
rt.def("/obj/machinery/atmospherics/proc/afterShuttleMove", function* afterShuttleMove(f: Frame) {
	let I: Value = null, node: Value = null, connected: Value = null, D: Value = null, A: Value = null;
	let $e: any;
	yield* parent_proc();
	let missing_nodes: Value = 0;
	rt.forRange(f, 0, 1, this.device_type, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (rt.index(this.nodes, I)) {
			node = rt.index(this.nodes, I);
			connected = 0;
			D = null;
			for (D of each(GLOB.cardinal)) {
				if (rt.isIn(f, node, rt.getStep(f, this, D))) {
					connected = 1;
					break;
				}
			}
			if (!connected) {
				yield* this.nullifyNode(I);
			}
		}
		if (!rt.index(this.nodes, I)) {
			missing_nodes = 1;
		}
	}
	rt.endFor(f, 0);
	if (missing_nodes) {
		yield* this.atmosinit();
		for (A of each(this.pipeline_expansion(), T("/obj/machinery/atmospherics"))) {
			yield* A.atmosinit();
			if (A.returnPipenet()) {
				yield* A.addMember(this);
			}
		}
		this.build_network();
	} else {
		yield* this.update_icon();
	}
	return f.dot;
}, true);
