// Types declared in code/game/objects/effects/decals that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(11737, "/obj/effect/decal/cleanable/generic", "/obj/effect/decal/cleanable", {
	name: "clutter",
	desc: "Someone should clean that up.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "shards",
});
rt.type(11741, "/obj/effect/decal/cleanable/dirt", "/obj/effect/decal/cleanable", {
	name: "dirt",
	desc: "Someone should clean that up.",
	icon_state: "dirt",
	mouse_opacity: 0,
});
rt.type(11742, "/obj/effect/decal/cleanable/flour", "/obj/effect/decal/cleanable", {
	name: "flour",
	desc: "It's still good. Four second rule!",
	icon_state: "flour",
});
rt.type(11744, "/obj/effect/decal/cleanable/cobweb", "/obj/effect/decal/cleanable", {
	name: "cobweb",
	desc: "Somebody should remove that.",
	gender: "neuter",
	layer: 4.25,
	icon_state: "cobweb1",
	resistance_flags: 4,
});
rt.type(11745, "/obj/effect/decal/cleanable/cobweb/cobweb2", "/obj/effect/decal/cleanable/cobweb", {
	icon_state: "cobweb2",
});
rt.type(11746, "/obj/effect/decal/cleanable/molten_object", "/obj/effect/decal/cleanable", {
	mergeable_decal: 0,
	name: "gooey grey mass",
	desc: "It looks like a melted... something.",
	gender: "neuter",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "molten",
});
rt.type(11747, "/obj/effect/decal/cleanable/molten_object/large", "/obj/effect/decal/cleanable/molten_object", {
	name: "big gooey grey mass",
	icon_state: "big_molten",
});
rt.type(11750, "/obj/effect/decal/cleanable/tomato_smudge", "/obj/effect/decal/cleanable", {
	random_icon_states: null,
	name: "tomato smudge",
	desc: "It's red.",
	gender: "neuter",
	icon: rt.rsc("icons/effects/tomatodecal.dmi"),
});
rt.type(11752, "/obj/effect/decal/cleanable/egg_smudge", "/obj/effect/decal/cleanable", {
	random_icon_states: null,
	name: "smashed egg",
	desc: "Seems like this one won't hatch.",
	gender: "neuter",
	icon: rt.rsc("icons/effects/tomatodecal.dmi"),
});
rt.type(11754, "/obj/effect/decal/cleanable/chem_pile", "/obj/effect/decal/cleanable", {
	name: "chemical pile",
	desc: "A pile of chemicals. You can't quite tell what's inside it.",
	gender: "neuter",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "ash",
});
rt.type(11756, "/obj/effect/decal/cleanable/salt", "/obj/effect/decal/cleanable", {
	name: "salt pile",
	desc: "A sizable pile of table salt. Someone must be upset.",
	icon: rt.rsc("icons/effects/tomatodecal.dmi"),
	icon_state: "salt_pile",
	gender: "neuter",
});
rt.type(11757, "/obj/effect/decal/cleanable/glitter", "/obj/effect/decal/cleanable", {
	name: "generic glitter pile",
	desc: "The herpes of arts and crafts.",
	icon: rt.rsc("icons/effects/tile_effects.dmi"),
	gender: "neuter",
});
rt.type(11758, "/obj/effect/decal/cleanable/glitter/pink", "/obj/effect/decal/cleanable/glitter", {
	name: "pink glitter",
	icon_state: "plasma",
});
rt.type(11759, "/obj/effect/decal/cleanable/glitter/white", "/obj/effect/decal/cleanable/glitter", {
	name: "white glitter",
	icon_state: "nitrous_oxide",
});
rt.type(11760, "/obj/effect/decal/cleanable/glitter/blue", "/obj/effect/decal/cleanable/glitter", {
	name: "blue glitter",
	icon_state: "freon",
});
rt.type(11763, "/obj/effect/decal/cleanable/deadcockroach", "/obj/effect/decal/cleanable", {
	random_icon_states: null,
	name: "cockroach guts",
	desc: "One bug squashed. Four more will rise in its place.",
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "xfloor1",
});
rt.type(11764, "/obj/effect/decal/chempuff", "/obj/effect/decal", {
	pass_flags: 5,
	name: "chemicals",
	icon: rt.rsc("icons/obj/chempuff.dmi"),
	layer: 5,
});
rt.type(11765, "/obj/effect/decal/sandeffect", "/obj/effect/decal", {
	name: "sandy tile",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "sandeffect",
	layer: 2.04,
});
rt.type(11766, "/obj/effect/decal/fakelattice", "/obj/effect/decal", {
	name: "lattice",
	desc: "A lightweight support lattice.",
	icon: rt.rsc("icons/obj/smooth_structures/lattice.dmi"),
	icon_state: "lattice",
	density: 1,
});
rt.type(11767, "/obj/effect/decal/remains", "/obj/effect/decal", {
	name: "remains",
	gender: "plural",
	icon: rt.rsc("icons/effects/blood.dmi"),
});
rt.type(11768, "/obj/effect/decal/remains/human", "/obj/effect/decal/remains", {
	desc: "They look like human remains. They have a strange aura about them.",
	icon_state: "remains",
});
rt.type(11769, "/obj/effect/decal/remains/xeno", "/obj/effect/decal/remains", {
	desc: "They look like the remains of something... alien. They have a strange aura about them.",
	icon_state: "remainsxeno",
});
rt.type(11770, "/obj/effect/decal/remains/xeno/larva", "/obj/effect/decal/remains/xeno", {
	icon_state: "remainslarva",
});
rt.type(11771, "/obj/effect/decal/remains/robot", "/obj/effect/decal/remains", {
	desc: "They look like the remains of something mechanical. They have a strange aura about them.",
	icon: rt.rsc("icons/mob/robots.dmi"),
	icon_state: "remainsrobot",
});
rt.type(11903, "/obj/effect/turf_decal/stripes", "/obj/effect/turf_decal", {});
rt.type(11904, "/obj/effect/turf_decal/stripes/line", "/obj/effect/turf_decal/stripes", {
	icon_state: "warningline",
});
rt.type(11905, "/obj/effect/turf_decal/stripes/end", "/obj/effect/turf_decal/stripes", {
	icon_state: "warn_end",
});
rt.type(11906, "/obj/effect/turf_decal/stripes/corner", "/obj/effect/turf_decal/stripes", {
	icon_state: "warninglinecorner",
});
rt.type(11907, "/obj/effect/turf_decal/stripes/asteroid", "/obj/effect/turf_decal/stripes", {});
rt.type(11908, "/obj/effect/turf_decal/stripes/asteroid/line", "/obj/effect/turf_decal/stripes/asteroid", {
	icon_state: "ast_warn",
});
rt.type(11909, "/obj/effect/turf_decal/stripes/asteroid/end", "/obj/effect/turf_decal/stripes/asteroid", {
	icon_state: "ast_warn_end",
});
rt.type(11910, "/obj/effect/turf_decal/stripes/asteroid/corner", "/obj/effect/turf_decal/stripes/asteroid", {
	icon_state: "ast_warn_corner",
});
rt.type(11911, "/obj/effect/turf_decal/delivery", "/obj/effect/turf_decal", {
	icon_state: "delivery",
});
rt.type(11912, "/obj/effect/turf_decal/bot", "/obj/effect/turf_decal", {
	icon_state: "bot",
});
rt.type(11913, "/obj/effect/turf_decal/loading_area", "/obj/effect/turf_decal", {
	icon_state: "loading_area",
});
rt.type(11914, "/obj/effect/turf_decal/sand", "/obj/effect/turf_decal", {
	icon_state: "sandyfloor",
});
rt.type(11915, "/obj/effect/turf_decal/sand/plating", "/obj/effect/turf_decal/sand", {
	icon_state: "sandyplating",
});
rt.type(11916, "/obj/effect/turf_decal/plaque", "/obj/effect/turf_decal", {
	icon_state: "plaque",
});
