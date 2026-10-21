// From code/game/objects/items/weapons/courtroom.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7150, "/obj/item/weapon/gavelhammer", "/obj/item/weapon", {
	name: "gavel hammer",
	desc: "Order, order! No bombs in my courthouse.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "gavelhammer",
	force: 5,
	throwforce: 6,
	w_class: 2,
	attack_verb: null,
	resistance_flags: 4,
});

// /obj/item/weapon/gavelhammer/proc/suicide_act  (code/game/objects/items/weapons/courtroom.dm:17)
rt.def("/obj/item/weapon/gavelhammer/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ has sentenced ＀self to death with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/gavel.ogg"), 50, 1, -1]);
	return 1;
});

rt.type(7151, "/obj/item/weapon/gavelblock", "/obj/item/weapon", {
	name: "gavel block",
	desc: "Smack it with a gavel hammer when the assistants get rowdy.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "gavelblock",
	force: 2,
	throwforce: 2,
	w_class: 1,
	resistance_flags: 4,
});

// /obj/item/weapon/gavelblock/proc/attackby  (code/game/objects/items/weapons/courtroom.dm:32)  may sleep
rt.def("/obj/item/weapon/gavelblock/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gavelhammer")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/gavel.ogg"), 100, 1]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ strikes ＀ with ＀.</span>", [live(f.args[1]), live(f.src), live(f.args[0])])]);
		yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
