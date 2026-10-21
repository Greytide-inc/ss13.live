// From code/datums/holocall.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5103, "/mob/camera/aiEye/remote/holo", "/mob/camera/aiEye/remote", {});

// /mob/camera/aiEye/remote/holo/proc/setLoc  (code/datums/holocall.dm:4)  may sleep
rt.def("/mob/camera/aiEye/remote/holo/proc/setLoc", function* setLoc(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (H = rt.sv(f, "origin")), "move_hologram", [rt.sv(f, "eye_user"), rt.sv(f, "loc")]);
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

// /datum/holocall/proc/New  (code/datums/holocall.dm:25)  may sleep
rt.def("/datum/holocall/proc/New", function* New(f: Frame, caller: Value, calling_pad: Value, callees: Value) {
	let I: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [caller, calling_pad, callees, I, H, $e];
	rt.setSv(f, "call_start_time", rt.worldTime(f));
	rt.setSv(f, "user", live(caller));
	rt.setFv(f, "outgoing_call", live(calling_pad), live(f.src));
	rt.setSv(f, "calling_holopad", live(calling_pad));
	rt.setSv(f, "dialed_holopads", rt.list());
	I = null;
	rt.forList(f, 0, live(callees));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if ((!(!truthy((H = live(I))) || truthy(rt.fv(f, "gc_destroyed", live(H)))) && truthy((yield* g.callName(f, live(H), "is_operational", []))))) {
			rt.modSrcVar(f, "dialed_holopads", live(H), add);
			yield* g.callName(f, live(H), "say", ["Incoming call."]);
			if (!truthy(rt.fv(f, "holo_calls", live(H)))) {
				rt.setFv(f, "holo_calls", live(H), rt.list());
			}
			rt.modField(f, live(H), "holo_calls", live(f.src), add);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, rt.sv(f, "dialed_holopads")))) return f.dot;
	yield* g.callName(f, live(calling_pad), "say", ["Connection failure."]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

// /datum/holocall/proc/Destroy  (code/datums/holocall.dm:46)  may sleep
rt.def("/datum/holocall/proc/Destroy", function* Destroy(f: Frame) {
	let user_good: Value = null, chunk: Value = null, I: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [user_good, chunk, I, H, $e];
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "hangup")]);
	rt.setSv(f, "hangup", null);
	if (truthy((user_good = (!(!truthy(rt.sv(f, "user")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "user")))) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "user"), "reset_perspective", []);
		rt.setFv(f, "remote_control", rt.sv(f, "user"), null);
	}
	if (!(!truthy(rt.sv(f, "eye")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "eye"))))) {
		if ((truthy(live(user_good)) && truthy(rt.fv(f, "client", rt.sv(f, "user"))))) {
			chunk = null;
			rt.forList(f, 0, rt.fv(f, "visibleCameraChunks", rt.sv(f, "eye")), T("/datum/camerachunk"));
			while (($e = rt.next(f, 0)) !== undefined) {
				chunk = $e;
				yield* g.callName(f, live(chunk), "remove", [rt.sv(f, "eye")]);
			}
			rt.endFor(f, 0);
		}
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "eye")]);
	}
	rt.setSv(f, "eye", null);
	rt.setSv(f, "user", null);
	if (truthy(rt.sv(f, "hologram"))) {
		rt.setFv(f, "HC", rt.sv(f, "hologram"), null);
		rt.setSv(f, "hologram", null);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "dialed_holopads"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.gv(f, "holo_calls", (H = live(I))))) {
			(rt.modField(f, live(H), "holo_calls", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "holo_calls", live(H))))) {
				rt.setFv(f, "holo_calls", live(H), null);
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "dialed_holopads"), "Cut", []);
	if (truthy(rt.sv(f, "calling_holopad"))) {
		rt.setFv(f, "outgoing_call", rt.sv(f, "calling_holopad"), null);
		yield* g.callName(f, rt.sv(f, "calling_holopad"), "SetLightsAndPower", []);
		rt.setSv(f, "calling_holopad", null);
	}
	if (truthy(rt.sv(f, "connected_holopad"))) {
		yield* g.callName(f, rt.sv(f, "connected_holopad"), "SetLightsAndPower", []);
		rt.setSv(f, "connected_holopad", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/holocall/proc/Disconnect  (code/datums/holocall.dm:86)  may sleep
rt.def("/datum/holocall/proc/Disconnect", function* Disconnect(f: Frame, H: Value) {
	f.vars = () => [H];
	if (isEqual(live(H), rt.sv(f, "connected_holopad"))) {
		yield* g.callName(f, rt.sv(f, "calling_holopad"), "say", [fmt("＀ disconnected.", [live(f.usr)])]);
	} else {
		if ((isEqual(live(H), rt.sv(f, "calling_holopad")) && truthy(rt.sv(f, "connected_holopad")))) {
			yield* g.callName(f, rt.sv(f, "connected_holopad"), "say", [fmt("＀ disconnected.", [live(f.usr)])]);
		}
	}
	yield* g.srcCall(f, "ConnectionFailure", live(H), 1);
	return f.dot;
}, true);

// /datum/holocall/proc/ConnectionFailure  (code/datums/holocall.dm:96)  may sleep
rt.def("/datum/holocall/proc/ConnectionFailure", function* ConnectionFailure(f: Frame, H: Value, graceful: Value) {
	f.vars = () => [H, graceful];
	if (live(graceful) === null) {
		graceful = 0;
	}
	if ((isEqual(live(H), rt.sv(f, "connected_holopad")) || isEqual(live(H), rt.sv(f, "calling_holopad")))) {
		if ((!truthy(live(graceful)) && !isEqual(live(H), rt.sv(f, "calling_holopad")))) {
			yield* g.callName(f, rt.sv(f, "calling_holopad"), "say", ["Connection failure."]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "holo_calls", live(H)))) {
		(rt.modField(f, live(H), "holo_calls", live(f.src), subtract));
		if (!truthy(rt.getLen(f, rt.fv(f, "holo_calls", live(H))))) {
			rt.setFv(f, "holo_calls", live(H), null);
		}
	}
	(rt.modSrcVar(f, "dialed_holopads", live(H), subtract));
	if (truthy(rt.len(f, rt.sv(f, "dialed_holopads")))) return f.dot;
	if (truthy(live(graceful))) {
		yield* g.callName(f, rt.sv(f, "calling_holopad"), "say", ["Call rejected."]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /datum/holocall/proc/Answer  (code/datums/holocall.dm:113)  may sleep
rt.def("/datum/holocall/proc/Answer", function* Answer(f: Frame, H: Value) {
	let I: Value = null, HC: Value = null;
	let $e: any;
	f.vars = () => [H, I, HC, $e];
	if (isEqual(live(H), rt.sv(f, "calling_holopad"))) {
		yield* g.call(f, P("/proc/CRASH"), null, ["How cute, a holopad tried to answer itself."]);
	}
	if (!truthy((rt.isIn(f, live(H), rt.sv(f, "dialed_holopads")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "connected_holopad"))) {
		yield* g.call(f, P("/proc/CRASH"), null, ["Multi-connection holocall"]);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "dialed_holopads"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(live(I), live(H))) {
			continue;
		}
		yield* g.srcCall(f, "Disconnect", live(I));
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, rt.fv(f, "holo_calls", live(H)));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!isEqual((HC = live(I)), live(f.src))) {
			yield* g.callName(f, live(HC), "Disconnect", [live(H)]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "connected_holopad", live(H));
	if (!truthy((yield* g.srcCall(f, "Check")))) {
		return live(f.dot);
	}
	rt.setSv(f, "hologram", (yield* g.callName(f, live(H), "activate_holo", [rt.sv(f, "user")])));
	rt.setFv(f, "HC", rt.sv(f, "hologram"), live(f.src));
	rt.setSv(f, "eye", (yield* g.new_(f, T("/mob/camera/aiEye/remote/holo"), [])));
	rt.setFv(f, "origin", rt.sv(f, "eye"), live(H));
	rt.setFv(f, "eye_initialized", rt.sv(f, "eye"), 1);
	rt.setFv(f, "eye_user", rt.sv(f, "eye"), rt.sv(f, "user"));
	rt.setFv(f, "name", rt.sv(f, "eye"), fmt("Camera Eye (＀)", [rt.fv(f, "name", rt.sv(f, "user"))]));
	rt.setFv(f, "remote_control", rt.sv(f, "user"), rt.sv(f, "eye"));
	yield* g.callName(f, rt.sv(f, "user"), "reset_perspective", [rt.sv(f, "eye")]);
	yield* g.callName(f, rt.sv(f, "eye"), "setLoc", [rt.fv(f, "loc", live(H))]);
	rt.setSv(f, "hangup", (yield* g.new_(f, T("/datum/action/innate/end_holocall"), [rt.sv(f, "eye"), live(f.src)])));
	return f.dot;
}, true);

// /datum/holocall/proc/Check  (code/datums/holocall.dm:154)  may sleep
rt.def("/datum/holocall/proc/Check", function* Check(f: Frame) {
	let I: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [I, H, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "dialed_holopads"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy((yield* g.callName(f, (H = live(I)), "is_operational", [])))) {
			yield* g.srcCall(f, "ConnectionFailure", live(H));
		}
	}
	rt.endFor(f, 0);
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return 0;
	}
	f.dot = (((((!(!truthy(rt.sv(f, "user")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "user")))) ? 1 : 0) && (!truthy((yield* g.callName(f, rt.sv(f, "user"), "incapacitated", []))) ? 1 : 0)) && (!(!truthy(rt.sv(f, "calling_holopad")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "calling_holopad")))) ? 1 : 0)) && (yield* g.callName(f, rt.sv(f, "calling_holopad"), "is_operational", []))) && (isEqual(rt.fv(f, "loc", rt.sv(f, "user")), rt.fv(f, "loc", rt.sv(f, "calling_holopad"))) ? 1 : 0));
	if (truthy(live(f.dot))) {
		if (!truthy(rt.sv(f, "connected_holopad"))) {
			f.dot = (rt.lt(rt.worldTime(f), add(rt.sv(f, "call_start_time"), 200)) ? 1 : 0);
			if (!truthy(live(f.dot))) {
				yield* g.callName(f, rt.sv(f, "calling_holopad"), "say", ["No answer recieved."]);
				rt.setFv(f, "temp", rt.sv(f, "calling_holopad"), "");
			}
		}
	}
	if (truthy(live(f.dot))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(85, "/datum/action/innate/end_holocall", "/datum/action/innate", {
	hcall: null,
	name: "End Holocall",
	button_icon_state: "camera_off",
});

// /datum/action/innate/end_holocall/proc/New  (code/datums/holocall.dm:181)  may sleep
rt.def("/datum/action/innate/end_holocall/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "hcall", live(f.args[1]));
	return f.dot;
}, true, { args: ["Target", "HC"] });

// /datum/action/innate/end_holocall/proc/Activate  (code/datums/holocall.dm:185)  may sleep
rt.def("/datum/action/innate/end_holocall/proc/Activate", function* Activate(f: Frame) {
	yield* g.callName(f, rt.sv(f, "hcall"), "Disconnect", [rt.fv(f, "calling_holopad", rt.sv(f, "hcall"))]);
	return f.dot;
}, true);
