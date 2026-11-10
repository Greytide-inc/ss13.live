// Based on /tg/station's code/game/gamemodes/clock_cult/clock_item.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8927, "/obj/item/clockwork", "/obj/item", {
	clockwork_desc: "A fabled artifact from beyond the stars. Contains concentrated meme essence.",
	name: "meme blaster",
	desc: "What the fuck is this? It looks kinda like a frog.",
	resistance_flags: 34,
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "rare_pepe",
	w_class: 2,
});

// clock_item.dm:12
rt.def("/obj/item/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.ratvar_act();
	GLOB.all_clockwork_objects += this;
	return f.dot;
}, true);

// clock_item.dm:17
rt.def("/obj/item/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.all_clockwork_objects -= this;
	return (yield* parent_proc());
}, true);

// clock_item.dm:21
rt.def("/obj/item/clockwork/proc/examine", function examine(f: Frame, user: Value) {
	if ((is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer"))) && this.clockwork_desc) {
		this.desc = this.clockwork_desc;
	}
	parent_proc();
	this.desc = rt.initial(f, this, "desc");
	return f.dot;
}, false);
