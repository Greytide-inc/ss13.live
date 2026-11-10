// Based on /tg/station's code/modules/atmospherics/machinery/portable/portable_atmospherics.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10688, "/obj/machinery/portable_atmospherics", "/obj/machinery", {
	air_contents: null,
	connected_port: null,
	holding: null,
	volume: 0,
	maximum_pressure: 9119.25,
	name: "portable_atmospherics",
	icon: rt.rsc("icons/obj/atmos.dmi"),
	use_power: 0,
	obj_integrity: 250,
	max_integrity: 250,
	armor: null,
});

// portable_atmospherics.dm:7
rt.def("/obj/machinery/portable_atmospherics/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 60, "acid", 30]);
	return f.dot;
});

// portable_atmospherics.dm:19
rt.def("/obj/machinery/portable_atmospherics/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.SSair.atmos_machinery += this;
	this.air_contents = (yield* new_(T("/datum/gas_mixture")));
	this.air_contents.volume = this.volume;
	this.air_contents.temperature = T20C;
	return 1;
}, true);

// portable_atmospherics.dm:29
rt.def("/obj/machinery/portable_atmospherics/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSair.atmos_machinery -= this;
	yield* this.disconnect();
	yield* qdel(this.air_contents);
	this.air_contents = null;
	return (yield* parent_proc());
}, true);

// portable_atmospherics.dm:38
rt.def("/obj/machinery/portable_atmospherics/proc/process_atmos", function* process_atmos(f: Frame) {
	if (!this.connected_port) {
		yield* this.air_contents.react();
	} else {
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// portable_atmospherics.dm:48
rt.def("/obj/machinery/portable_atmospherics/proc/connect", function connect(f: Frame, new_port: Value) {
	let connected_port_parent: Value = null;
	if (this.connected_port || !new_port || new_port.connected_device) {
		return 0;
	}
	if (new_port.loc != this.loc) {
		return 0;
	}
	this.connected_port = new_port;
	this.connected_port.connected_device = this;
	(connected_port_parent = rt.index(this.connected_port.parents, 1)).reconcile_air();
	this.anchored = 1;
	return 1;
});

// portable_atmospherics.dm:65
rt.def("/obj/machinery/portable_atmospherics/proc/Move", function* Move(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.disconnect();
	return f.dot;
}, true);

// portable_atmospherics.dm:70
rt.def("/obj/machinery/portable_atmospherics/proc/disconnect", function disconnect(f: Frame) {
	if (!this.connected_port) {
		return 0;
	}
	this.anchored = 0;
	this.connected_port.connected_device = null;
	this.connected_port = null;
	return 1;
});

// portable_atmospherics.dm:81
rt.def("/obj/machinery/portable_atmospherics/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null, possible_port: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/tank"))) {
		if (!rt.bitAnd(this.stat, 1)) {
			_T = W;
			if (this.holding || !(yield* user.drop_item())) {
				return f.dot;
			}
			_T.loc = this;
			this.holding = _T;
			yield* this.update_icon();
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (!rt.bitAnd(this.stat, 1)) {
			if (this.connected_port) {
				yield* this.disconnect();
				playsound(this.loc, W.usesound, 50, 1);
				user.visible_message(`${user} disconnects ${this}.`, `<span class='notice'>You unfasten ${this} from the port.</span>`, "<span class='italics'>You hear a ratchet.</span>");
				yield* this.update_icon();
				return f.dot;
			} else {
				if (!(possible_port = rt.locateIn(f, T("/obj/machinery/atmospherics/components/unary/portables_connector"), this.loc))) {
					to_chat(user, "<span class='notice'>Nothing happens.</span>");
					return f.dot;
				}
				if (!this.connect(possible_port)) {
					to_chat(user, `<span class='notice'>${this.name} failed to connect to the port.</span>`);
					return f.dot;
				}
				playsound(this.loc, W.usesound, 50, 1);
				user.visible_message(`${user} connects ${this}.`, `<span class='notice'>You fasten ${this} to the port.</span>`, "<span class='italics'>You hear a ratchet.</span>");
				yield* this.update_icon();
			}
		}
	} else if (rt.istype(W, T("/obj/item/device/analyzer")) && this.Adjacent(user)) {
		this.atmosanalyzer_scan(this.air_contents, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// portable_atmospherics.dm:120
rt.def("/obj/machinery/portable_atmospherics/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	if (I.force < 10 && !rt.bitAnd(this.stat, 1)) {
		yield* this.take_damage(0);
	} else {
		this.investigate_log(fmt("was smacked with ＇！ by ＀.", [I, key_name(user)]), "atmos");
		yield* this.add_fingerprint(user);
		yield* parent_proc();
	}
	return f.dot;
}, true);
