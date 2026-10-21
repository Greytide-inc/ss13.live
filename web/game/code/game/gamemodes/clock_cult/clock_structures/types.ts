// Types declared in code/game/gamemodes/clock_cult/clock_structures that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(12159, "/obj/structure/destructible/clockwork/shell/cogscarab", "/obj/structure/destructible/clockwork/shell", {
	clockwork_desc: "A dormant receptable that, when powered with a soul vessel, will become a weak construct with an inbuilt fabricator.",
	mobtype: rt.typePath("/mob/living/simple_animal/drone/cogscarab"),
	spawn_message: "'s eyes blink open, glowing bright red.",
	name: "cogscarab shell",
	desc: "A small brass shell with a cube-shaped receptable in its center. It gives off an aura of obsessive perfectionism.",
	icon_state: "clockdrone_shell",
});
rt.type(12160, "/obj/structure/destructible/clockwork/shell/fragment", "/obj/structure/destructible/clockwork/shell", {
	clockwork_desc: "A dormant receptable that, when powered with a soul vessel, will become a powerful construct.",
	mobtype: rt.typePath("/mob/living/simple_animal/hostile/clockwork/fragment"),
	spawn_message: " whirs and rises from the ground on a flickering jet of reddish fire.",
	name: "fragment shell",
	desc: "A massive brass shell with a small cube-shaped receptable in its center. It gives off an aura of contained power.",
	icon_state: "anime_fragment",
});
rt.type(12166, "/obj/structure/destructible/clockwork/wall_gear/displaced", "/obj/structure/destructible/clockwork/wall_gear", {
	anchored: 0,
});
