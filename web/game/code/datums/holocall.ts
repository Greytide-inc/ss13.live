// Based on /tg/station's code/datums/holocall.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5103, "/mob/camera/aiEye/remote/holo", "/mob/camera/aiEye/remote", {});

// holocall.dm:4
rt.def("/mob/camera/aiEye/remote/holo/proc/setLoc", function* setLoc(f: Frame) {
	let H: Value = null;
	f.dot = (yield* parent_proc());
	yield* (H = this.origin).move_hologram(this.eye_user, this.loc);
	return f.dot;
}, true);

rt.type(547, "/datum/holocall", "/datum", {
	user: null,
	calling_holopad: null,
	connected_holopad: null,
	dialed_holopads: null,
	eye: null,
	hologram: null,
	hangup: null,
	call_start_time: null,
});

// holocall.dm:25
rt.def("/datum/holocall/proc/New", function* New(f: Frame, caller: Value, calling_pad: Value, callees: Value) {
	let I: Value = null, H: Value = null;
	this.call_start_time = rt.worldTime(f);
	this.user = caller;
	calling_pad.outgoing_call = this;
	this.calling_holopad = calling_pad;
	this.dialed_holopads = list();
	for (I of each(callees)) {
		if (!(!(H = I) || H.gc_destroyed) && H.is_operational()) {
			this.dialed_holopads += H;
			yield* H.say("Incoming call.");
			if (!H.holo_calls) {
				H.holo_calls = list();
			}
			H.holo_calls += this;
		}
	}
	if (rt.len(f, this.dialed_holopads)) return f.dot;
	yield* calling_pad.say("Connection failure.");
	yield* qdel(this);
	return f.dot;
}, true);

// holocall.dm:46
rt.def("/datum/holocall/proc/Destroy", function* Destroy(f: Frame) {
	let user_good: Value = null, chunk: Value = null, I: Value = null, H: Value = null;
	yield* qdel(this.hangup);
	this.hangup = null;
	if (user_good = (!(!this.user || this.user.gc_destroyed) ? 1 : 0)) {
		yield* this.user.reset_perspective();
		this.user.remote_control = null;
	}
	if (!(!this.eye || this.eye.gc_destroyed)) {
		if (user_good && this.user.client) {
			for (chunk of each(this.eye.visibleCameraChunks, T("/datum/camerachunk"))) {
				yield* chunk.remove(this.eye);
			}
		}
		yield* qdel(this.eye);
	}
	this.eye = null;
	this.user = null;
	if (this.hologram) {
		this.hologram.HC = null;
		this.hologram = null;
	}
	for (I of each(this.dialed_holopads)) {
		if ((H = I).holo_calls) {
			H.holo_calls -= this;
			if (!rt.len(f, H.holo_calls)) {
				H.holo_calls = null;
			}
		}
	}
	this.dialed_holopads.Cut();
	if (this.calling_holopad) {
		this.calling_holopad.outgoing_call = null;
		this.calling_holopad.SetLightsAndPower();
		this.calling_holopad = null;
	}
	if (this.connected_holopad) {
		this.connected_holopad.SetLightsAndPower();
		this.connected_holopad = null;
	}
	return (yield* parent_proc());
}, true);

// holocall.dm:86
rt.def("/datum/holocall/proc/Disconnect", function* Disconnect(f: Frame, H: Value) {
	if (H == this.connected_holopad) {
		yield* this.calling_holopad.say(`${f.usr} disconnected.`);
	} else if (H == this.calling_holopad && this.connected_holopad) {
		yield* this.connected_holopad.say(`${f.usr} disconnected.`);
	}
	yield* this.ConnectionFailure(H, 1);
	return f.dot;
}, true);

// holocall.dm:96
rt.def("/datum/holocall/proc/ConnectionFailure", function* ConnectionFailure(f: Frame, H: Value, graceful: Value) {
	graceful ??= 0;
	if (H == this.connected_holopad || H == this.calling_holopad) {
		if (!graceful && H != this.calling_holopad) {
			yield* this.calling_holopad.say("Connection failure.");
		}
		yield* qdel(this);
		return f.dot;
	}
	if (H.holo_calls) {
		H.holo_calls -= this;
		if (!rt.len(f, H.holo_calls)) {
			H.holo_calls = null;
		}
	}
	this.dialed_holopads -= H;
	if (rt.len(f, this.dialed_holopads)) return f.dot;
	if (graceful) {
		yield* this.calling_holopad.say("Call rejected.");
	}
	yield* qdel(this);
	return f.dot;
}, true);

// holocall.dm:113
rt.def("/datum/holocall/proc/Answer", function* Answer(f: Frame, H: Value) {
	let I: Value = null, HC: Value = null;
	if (H == this.calling_holopad) {
		CRASH("How cute, a holopad tried to answer itself.");
	}
	if (!rt.isIn(f, H, this.dialed_holopads)) {
		return f.dot;
	}
	if (this.connected_holopad) {
		CRASH("Multi-connection holocall");
	}
	for (I of each(this.dialed_holopads)) {
		if (I == H) {
			continue;
		}
		yield* this.Disconnect(I);
	}
	I = null;
	for (I of each(H.holo_calls)) {
		if ((HC = I) != this) {
			yield* HC.Disconnect(H);
		}
	}
	this.connected_holopad = H;
	if (!(yield* this.Check())) {
		return f.dot;
	}
	this.hologram = (yield* H.activate_holo(this.user));
	this.hologram.HC = this;
	this.eye = (yield* new_(T("/mob/camera/aiEye/remote/holo")));
	this.eye.origin = H;
	this.eye.eye_initialized = 1;
	this.eye.eye_user = this.user;
	this.eye.name = `Camera Eye (${this.user.name})`;
	this.user.remote_control = this.eye;
	yield* this.user.reset_perspective(this.eye);
	yield* this.eye.setLoc(H.loc);
	this.hangup = (yield* new_(T("/datum/action/innate/end_holocall"), this.eye, this));
	return f.dot;
}, true);

// holocall.dm:154
rt.def("/datum/holocall/proc/Check", function* Check(f: Frame) {
	let I: Value = null, H: Value = null;
	for (I of each(this.dialed_holopads)) {
		if (!(H = I).is_operational()) {
			yield* this.ConnectionFailure(H);
		}
	}
	if (!this || this.gc_destroyed) {
		return 0;
	}
	f.dot = (((((!(!this.user || this.user.gc_destroyed) ? 1 : 0) && (!this.user.incapacitated() ? 1 : 0)) && (!(!this.calling_holopad || this.calling_holopad.gc_destroyed) ? 1 : 0)) && this.calling_holopad.is_operational()) && (this.user.loc == this.calling_holopad.loc ? 1 : 0));
	if (f.dot) {
		if (!this.connected_holopad) {
			f.dot = (rt.worldTime(f) < this.call_start_time + 200 ? 1 : 0);
			if (!f.dot) {
				yield* this.calling_holopad.say("No answer recieved.");
				this.calling_holopad.temp = "";
			}
		}
	}
	if (f.dot) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(85, "/datum/action/innate/end_holocall", "/datum/action/innate", {
	hcall: null,
	name: "End Holocall",
	button_icon_state: "camera_off",
});

// holocall.dm:181
rt.def("/datum/action/innate/end_holocall/proc/New", function* New(f: Frame, Target: Value, HC: Value) {
	yield* parent_proc();
	this.hcall = HC;
	return f.dot;
}, true);

// holocall.dm:185
rt.def("/datum/action/innate/end_holocall/proc/Activate", function* Activate(f: Frame) {
	yield* this.hcall.Disconnect(this.hcall.calling_holopad);
	return f.dot;
}, true);
