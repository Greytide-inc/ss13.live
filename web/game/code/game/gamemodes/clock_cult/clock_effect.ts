// Based on /tg/station's code/game/gamemodes/clock_cult/clock_effect.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11405, "/obj/effect/clockwork", "/obj/effect", {
	clockwork_desc: "A fabled artifact from beyond the stars. Contains concentrated meme essence.",
	anchored: 1,
	name: "meme machine",
	desc: "Still don't know what it is.",
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	icon_state: "ratvars_flame",
	density: 0,
	opacity: 0,
	resistance_flags: 115,
});

// clock_effect.dm:14
rt.def("/obj/effect/clockwork/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	GLOB.all_clockwork_objects += this;
	return f.dot;
});

// clock_effect.dm:18
rt.def("/obj/effect/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.all_clockwork_objects -= this;
	return (yield* parent_proc());
}, true);

// clock_effect.dm:22
rt.def("/obj/effect/clockwork/proc/examine", function examine(f: Frame, user: Value) {
	if ((is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer"))) && this.clockwork_desc) {
		this.desc = this.clockwork_desc;
	}
	parent_proc();
	this.desc = rt.initial(f, this, "desc");
	return f.dot;
}, false);
