// From code/game/gamemodes/blob/blobs/factory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12142, "/obj/structure/blob/factory", "/obj/structure/blob", {
	spores: null,
	naut: null,
	max_spores: 3,
	spore_delay: 0,
	spore_cooldown: 80,
	health_regen: 1,
	point_return: 25,
	name: "factory blob",
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "blob_factory",
	desc: "A thick spire of tendrils.",
	obj_integrity: 200,
	max_integrity: 200,
});

// /obj/structure/blob/factory/proc/<init>  (code/game/gamemodes/blob/blobs/factory.dm:10)
rt.def("/obj/structure/blob/factory/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spores", rt.list());
	return f.dot;
});

// /obj/structure/blob/factory/proc/scannerreport  (code/game/gamemodes/blob/blobs/factory.dm:19)
rt.def("/obj/structure/blob/factory/proc/scannerreport", function scannerreport(f: Frame) {
	if (truthy(rt.sv(f, "naut"))) {
		return "It is currently sustaining a blobbernaut, making it fragile and unable to produce blob spores.";
	}
	return "Will produce a blob spore every few seconds.";
});

// /obj/structure/blob/factory/proc/Destroy  (code/game/gamemodes/blob/blobs/factory.dm:23)  may sleep
rt.def("/obj/structure/blob/factory/proc/Destroy", function* Destroy(f: Frame) {
	let spore: Value = null;
	let $e: any;
	f.vars = () => [spore, $e];
	spore = null;
	rt.forList(f, 0, rt.sv(f, "spores"), T("/mob/living/simple_animal/hostile/blob/blobspore"));
	while (($e = rt.next(f, 0)) !== undefined) {
		spore = $e;
		if (isEqual(rt.fv(f, "factory", live(spore)), live(f.src))) {
			rt.setFv(f, "factory", live(spore), null);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "naut"))) {
		rt.setFv(f, "factory", rt.sv(f, "naut"), null);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "naut"), "<span class='userdanger'>Your factory was destroyed! You feel yourself dying!</span>"]);
		yield* g.callName(f, rt.sv(f, "naut"), "throw_alert", ["nofactory", T("/obj/screen/alert/nofactory")]);
	}
	rt.setSv(f, "spores", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/blob/factory/proc/Be_Pulsed  (code/game/gamemodes/blob/blobs/factory.dm:34)  may sleep
rt.def("/obj/structure/blob/factory/proc/Be_Pulsed", function* Be_Pulsed(f: Frame) {
	let BS: Value = null;
	f.vars = () => [BS];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "naut"))) {
		return live(f.dot);
	}
	if (rt.ge(rt.len(f, rt.sv(f, "spores")), rt.sv(f, "max_spores"))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "spore_delay"), rt.worldTime(f))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/flick"), null, ["blob_factory_glow", live(f.src)]);
	rt.setSv(f, "spore_delay", add(rt.worldTime(f), rt.sv(f, "spore_cooldown")));
	BS = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/blob/blobspore"), [rt.fv(f, "loc", live(f.src)), live(f.src)]));
	if (!truthy(rt.sv(f, "overmind"))) return f.dot;
	rt.setFv(f, "overmind", live(BS), rt.sv(f, "overmind"));
	yield* g.callName(f, live(BS), "update_icons", []);
	yield* g.callName(f, rt.fv(f, "blob_mobs", rt.sv(f, "overmind")), "Add", [live(BS)]);
	return f.dot;
}, true);
