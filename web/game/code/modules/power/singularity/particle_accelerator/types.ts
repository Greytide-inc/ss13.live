// Types declared in code/modules/power/singularity/particle_accelerator that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(12091, "/obj/effect/accelerated_particle/weak", "/obj/effect/accelerated_particle", {
	movement_range: 8,
	energy: 5,
});
rt.type(12092, "/obj/effect/accelerated_particle/strong", "/obj/effect/accelerated_particle", {
	movement_range: 15,
	energy: 15,
});
rt.type(12093, "/obj/effect/accelerated_particle/powerful", "/obj/effect/accelerated_particle", {
	movement_range: 20,
	energy: 50,
});
rt.type(12979, "/obj/structure/particle_accelerator/end_cap", "/obj/structure/particle_accelerator", {
	reference: "end_cap",
	name: "Alpha Particle Generation Array",
	desc: "This is where Alpha particles are generated from [REDACTED]",
	icon_state: "end_cap",
});
rt.type(12980, "/obj/structure/particle_accelerator/power_box", "/obj/structure/particle_accelerator", {
	reference: "power_box",
	name: "Particle Focusing EM Lens",
	desc: "This uses electromagnetic waves to focus the Alpha-Particles.",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "power_box",
});
rt.type(12981, "/obj/structure/particle_accelerator/fuel_chamber", "/obj/structure/particle_accelerator", {
	reference: "fuel_chamber",
	name: "EM Acceleration Chamber",
	desc: "This is where the Alpha particles are accelerated to <b><i>radical speeds</i></b>.",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "fuel_chamber",
});
rt.type(12983, "/obj/structure/particle_accelerator/particle_emitter/center", "/obj/structure/particle_accelerator/particle_emitter", {
	reference: "emitter_center",
	icon_state: "emitter_center",
});
rt.type(12984, "/obj/structure/particle_accelerator/particle_emitter/left", "/obj/structure/particle_accelerator/particle_emitter", {
	reference: "emitter_left",
	icon_state: "emitter_left",
});
rt.type(12985, "/obj/structure/particle_accelerator/particle_emitter/right", "/obj/structure/particle_accelerator/particle_emitter", {
	reference: "emitter_right",
	icon_state: "emitter_right",
});
