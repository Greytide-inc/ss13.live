// From code/modules/mob/living/simple_animal/friendly/pet.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5049, "/mob/living/simple_animal/pet", "/mob/living/simple_animal", {
	pcollar: null,
	collar: "",
	pettag: "",
	icon: rt.rsc("icons/mob/pets.dmi"),
	mob_size: 1,
	blood_volume: 560,
});

// /mob/living/simple_animal/pet/proc/attackby  (code/modules/mob/living/simple_animal/friendly/pet.dm:10)  may sleep
rt.def("/mob/living/simple_animal/pet/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, i: Value = null;
	f.vars = () => [_P, i];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/neck/petcollar")) ? 1 : 0)) && !truthy(rt.sv(f, "pcollar")))) {
		rt.setSv(f, "pcollar", (_P = live(f.args[0])));
		rt.setSv(f, "collar", fmt("＀collar", [rt.sv(f, "icon_state")]));
		rt.setSv(f, "pettag", fmt("＀tag", [rt.sv(f, "icon_state")]));
		yield* g.srcCall(f, "regenerate_icons");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put the ＀ around ＀'s neck.</span>", [live(_P), live(f.src)])]);
		if (truthy(rt.fv(f, "tagname", live(_P)))) {
			rt.setSv(f, "real_name", fmt("ÿ\u0015＀", [rt.fv(f, "tagname", live(_P))]));
			rt.setSv(f, "name", rt.sv(f, "real_name"));
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(_P)]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/newspaper")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "stat"))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ baps ＀ on the nose with the rolled up ＀.", [live(f.args[1]), rt.sv(f, "name"), live(f.args[0])])]);
			rt.spawnTail(f, 0, "/mob/living/simple_animal/pet/proc/attackby: spawn at modules/mob/living/simple_animal/friendly/pet.dm:25", _P, i);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// a spawn(0) body of /mob/living/simple_animal/pet/proc/attackby, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/pet/proc/attackby: spawn at modules/mob/living/simple_animal/friendly/pet.dm:25", function* (f: Frame, _P: Value, i: Value) {
	let $e: any;
	f.vars = () => [_P, i, $e];
	i = null;
	rt.forList(f, 0, rt.list(1, 2, 4, 8, 4, 2, 1, 2));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.srcCall(f, "setDir", live(i));
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	return null;
});

// /mob/living/simple_animal/pet/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/pet.dm:33)  may sleep
rt.def("/mob/living/simple_animal/pet/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "pcollar"))) return f.dot;
	rt.setSv(f, "pcollar", (yield* g.new_(f, T("/obj/item/clothing/neck/petcollar"), [live(f.src)])));
	yield* g.srcCall(f, "regenerate_icons");
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/proc/revive  (code/modules/mob/living/simple_animal/friendly/pet.dm:39)  may sleep
rt.def("/mob/living/simple_animal/pet/proc/revive", function* revive(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "regenerate_icons");
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// /mob/living/simple_animal/pet/proc/death  (code/modules/mob/living/simple_animal/friendly/pet.dm:44)  may sleep
rt.def("/mob/living/simple_animal/pet/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	yield* g.callSuper(f, [live(gibbed)]);
	yield* g.srcCall(f, "regenerate_icons");
	return f.dot;
}, true);

// /mob/living/simple_animal/pet/proc/regenerate_icons  (code/modules/mob/living/simple_animal/friendly/pet.dm:48)
rt.def("/mob/living/simple_animal/pet/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "collar"))) {
		rt.callSrc(f, "add_overlay", [rt.sv(f, "collar")]);
	}
	if (!truthy(rt.sv(f, "pettag"))) return f.dot;
	rt.callSrc(f, "add_overlay", [rt.sv(f, "pettag")]);
	return f.dot;
});
