// Based on /tg/station's code/modules/power/singularity/particle_accelerator/particle_emitter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12982, "/obj/structure/particle_accelerator/particle_emitter", "/obj/structure/particle_accelerator", {
	fire_delay: 50,
	last_shot: 0,
	name: "EM Containment Grid",
	desc: "This launchs the Alpha particles, might not want to stand near this end.",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "none",
});

// particle_emitter.dm:28
rt.def("/obj/structure/particle_accelerator/particle_emitter/proc/emit_particle", function* emit_particle(f: Frame, strength: Value) {
	let _T: Value = null, _P: Value = null;
	strength ??= 0;
	if (this.last_shot + this.fire_delay <= rt.worldTime(f)) {
		this.last_shot = rt.worldTime(f);
		_T = rt.getStep(f, this, 0);
		if (strength === 0) {
			_P = (yield* new_(T("/obj/effect/accelerated_particle/weak"), _T));
		} else if (strength === 1) {
			_P = (yield* new_(T("/obj/effect/accelerated_particle"), _T));
		} else if (strength === 2) {
			_P = (yield* new_(T("/obj/effect/accelerated_particle/strong"), _T));
		} else if (strength === 3) {
			_P = (yield* new_(T("/obj/effect/accelerated_particle/powerful"), _T));
		}
		yield* _P.setDir(this.dir);
		return 1;
	}
	return 0;
}, true);
