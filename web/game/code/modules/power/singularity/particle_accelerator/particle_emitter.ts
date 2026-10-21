// From code/modules/power/singularity/particle_accelerator/particle_emitter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12982, "/obj/structure/particle_accelerator/particle_emitter", "/obj/structure/particle_accelerator", {
	fire_delay: 50,
	last_shot: 0,
	name: "EM Containment Grid",
	desc: "This launchs the Alpha particles, might not want to stand near this end.",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "none",
});

// /obj/structure/particle_accelerator/particle_emitter/proc/set_delay  (code/modules/power/singularity/particle_accelerator/particle_emitter.dm:22)
rt.def("/obj/structure/particle_accelerator/particle_emitter/proc/set_delay", function set_delay(f: Frame, delay: Value) {
	if (rt.ge(live(delay), 0)) {
		rt.setSv(f, "fire_delay", live(delay));
		return 1;
	}
	return 0;
});

// /obj/structure/particle_accelerator/particle_emitter/proc/emit_particle  (code/modules/power/singularity/particle_accelerator/particle_emitter.dm:28)  may sleep
rt.def("/obj/structure/particle_accelerator/particle_emitter/proc/emit_particle", function* emit_particle(f: Frame, strength: Value) {
	let _T: Value = null, _P: Value = null;
	let $0: any;
	f.vars = () => [strength, _T, _P, $0];
	if (live(strength) === null) {
		strength = 0;
	}
	if (rt.le(add(rt.sv(f, "last_shot"), rt.sv(f, "fire_delay")), rt.worldTime(f))) {
		rt.setSv(f, "last_shot", rt.worldTime(f));
		_T = rt.getStep(f, live(f.src), 0);
		_P = null;
		$0 = live(strength);
		if ($0 === 0) {
			_P = (yield* g.new_(f, T("/obj/effect/accelerated_particle/weak"), [live(_T)]));
		} else if ($0 === 1) {
			_P = (yield* g.new_(f, T("/obj/effect/accelerated_particle"), [live(_T)]));
		} else if ($0 === 2) {
			_P = (yield* g.new_(f, T("/obj/effect/accelerated_particle/strong"), [live(_T)]));
		} else if ($0 === 3) {
			_P = (yield* g.new_(f, T("/obj/effect/accelerated_particle/powerful"), [live(_T)]));
		}
		yield* g.callName(f, live(_P), "setDir", [rt.sv(f, "dir")]);
		return 1;
	}
	return 0;
}, true);
