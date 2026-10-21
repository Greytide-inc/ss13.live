// From code/game/objects/structures/crates_lockers/crates/large.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12268, "/obj/structure/closet/crate/large", "/obj/structure/closet/crate", {
	material_drop: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	delivery_icon: "deliverybox",
	name: "large crate",
	desc: "A hefty wooden crate.",
	icon_state: "largecrate",
	density: 1,
});

// /obj/structure/closet/crate/large/proc/attack_hand  (code/game/objects/structures/crates_lockers/crates/large.dm:10)  may sleep
rt.def("/obj/structure/closet/crate/large/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (truthy(rt.sv(f, "manifest"))) {
		yield* g.srcCall(f, "tear_manifest", live(user));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need a crowbar to pry this open!</span>"]);
	}
	return f.dot;
}, true);

// /obj/structure/closet/crate/large/proc/attackby  (code/game/objects/structures/crates_lockers/crates/large.dm:17)  may sleep
rt.def("/obj/structure/closet/crate/large/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, i: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [_T, i, AM, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		_T = rt.getStep(f, live(f.src), 0);
		if (truthy(rt.sv(f, "manifest"))) {
			yield* g.srcCall(f, "tear_manifest", live(f.args[1]));
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ pries ％！ open.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You pry open ％！.</span>", [live(f.src)]), "<span class='italics'>You hear splitting wood.</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/slashmiss.ogg"), 75, 1]);
		i = null;
		rt.forRange(f, 0, 1, (yield* g.call(f, P("/proc/rand"), null, [2, 5])), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.new_(f, rt.sv(f, "material_drop"), [live(f.src)]);
		}
		rt.endFor(f, 0);
		AM = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			AM = $e;
			yield* g.callName(f, live(AM), "forceMove", [live(_T)]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });
